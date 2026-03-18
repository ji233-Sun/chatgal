/**
 * 共鸣判定算法 - AI Agent 评价 + 启发式 fallback
 */

import { prisma } from "./prisma";
import { chatWithAgent } from "./secondme";
import { getValidAccessToken } from "./auth";

export interface ResonanceResult {
  score: number;
  triggered: boolean;
  metrics?: {
    method: "agent" | "heuristic";
    rawScore?: number;
  };
}

const RESONANCE_THRESHOLD = 0.55;

// AI 评审系统提示词
const EVALUATOR_SYSTEM_PROMPT = `你是一位对话质量评审员。你将阅读两位陌生旅客在列车上的对话，评估他们之间是否产生了真正的思想共鸣。

评估标准（1-10分）：
1=敷衍客套  3=普通闲聊  5=有一定交流  7=深度共鸣  10=灵魂共振

评判要点：
- 双方是否在真正倾听和回应，还是各说各话？
- 讨论是否有深度，还是停留在表面？
- 是否产生了思想或情感上的连接？

严格输出 JSON：{"score": 数字}`;

/**
 * 使用 UserA 的 Agent 评估对话共鸣
 */
async function evaluateWithAgent(
  sessionId: string,
  messages: { content: string; agentSide: string }[],
): Promise<number> {
  // 获取 session 的 userAId
  const session = await prisma.observationSession.findUnique({
    where: { id: sessionId },
    select: { userAId: true },
  });
  if (!session) throw new Error("Session not found");

  const token = await getValidAccessToken(session.userAId);

  // 格式化对话历史
  const conversationText = messages
    .map((m) => `旅客${m.agentSide}: ${m.content}`)
    .join("\n");

  // 调用 Agent（独立 session，不传 sessionId）
  const response = await chatWithAgent(
    token,
    conversationText,
    undefined,
    EVALUATOR_SYSTEM_PROMPT,
  );

  // 解析 JSON 分数
  const match = response.content.match(/\{\s*"score"\s*:\s*(\d+(?:\.\d+)?)\s*\}/);
  if (!match) {
    throw new Error(`Failed to parse agent score from: ${response.content}`);
  }

  const rawScore = parseFloat(match[1]);
  // 归一化 1-10 → 0-1
  return Math.max(0, Math.min(1, rawScore / 10));
}

/**
 * 启发式 fallback - 简化版关键词评分
 */
function heuristicScore(
  messages: { content: string; agentSide: string }[],
): number {
  const messagesA = messages.filter((m) => m.agentSide === "A").map((m) => m.content);
  const messagesB = messages.filter((m) => m.agentSide === "B").map((m) => m.content);

  // 词汇重叠
  const extract = (texts: string[]) => {
    const words = new Set<string>();
    texts.join(" ")
      .split(/[\s,，。.!！?？;；：:、\n""''（）()【】\[\]]+/)
      .filter((w) => w.length >= 2)
      .forEach((w) => words.add(w.toLowerCase()));
    return words;
  };
  const wordsA = extract(messagesA);
  const wordsB = extract(messagesB);
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  const overlapScore = wordsA.size && wordsB.size
    ? Math.min(overlap / Math.min(wordsA.size, wordsB.size), 1)
    : 0;

  // 平均长度
  const avgLen = messages.reduce((s, m) => s + m.content.length, 0) / messages.length;
  const lengthScore = Math.min(avgLen / 80, 1);

  // 简单加权（故意保守，让 fallback 也不那么容易触发）
  return overlapScore * 0.4 + lengthScore * 0.3 + 0.1;
}

/**
 * 综合评估对话共鸣
 */
export async function evaluateResonance(
  sessionId: string,
): Promise<ResonanceResult> {
  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { timestamp: "asc" },
  });

  const zero: ResonanceResult = { score: 0, triggered: false };
  if (messages.length < 10) return zero;

  let score: number;
  let method: "agent" | "heuristic";

  try {
    score = await evaluateWithAgent(sessionId, messages);
    method = "agent";
    console.log(`[Resonance] AI agent score for ${sessionId}: ${score.toFixed(3)}`);
  } catch (err) {
    console.warn(`[Resonance] Agent evaluation failed, falling back to heuristic:`, err);
    score = heuristicScore(messages);
    method = "heuristic";
    console.log(`[Resonance] Heuristic score for ${sessionId}: ${score.toFixed(3)}`);
  }

  // 更新数据库
  await prisma.observationSession.update({
    where: { id: sessionId },
    data: { resonanceScore: score },
  });

  const triggered = score >= RESONANCE_THRESHOLD;

  if (triggered) {
    await prisma.observationSession.update({
      where: { id: sessionId },
      data: { state: "REVEALED" },
    });

    const session = await prisma.observationSession.findUnique({
      where: { id: sessionId },
    });
    if (session) {
      await prisma.realityPass.upsert({
        where: { sessionId },
        create: {
          sessionId,
          userAId: session.userAId,
          userBId: session.userBId,
          resonanceScore: score,
          resonanceHighlights: await generateHighlights(sessionId),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
        update: {
          resonanceScore: score,
        },
      });
    }
  }

  return { score, triggered, metrics: { method } };
}

/**
 * 生成对话精华摘要
 */
async function generateHighlights(sessionId: string): Promise<string> {
  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { timestamp: "asc" },
  });

  // 选出最长的 3 组对话对作为精华
  const pairs: { a: string; b: string; score: number }[] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].agentSide !== messages[i + 1].agentSide) {
      pairs.push({
        a: messages[i].content,
        b: messages[i + 1].content,
        score: messages[i].content.length + messages[i + 1].content.length,
      });
    }
  }
  pairs.sort((a, b) => b.score - a.score);

  // 提取高频关键词
  const allText = messages.map((m) => m.content).join(" ");
  const tokens = allText
    .split(/[\s,，。.!！?？;；：:、\n""''（）()【】\[\]]+/)
    .filter((w) => w.length >= 2);
  const freq = new Map<string, number>();
  for (const w of tokens) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return JSON.stringify({
    highlights: pairs.slice(0, 3),
    keywords,
    totalTurns: messages.length,
  });
}

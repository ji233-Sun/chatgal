/**
 * 共鸣判定算法 - 基于对话内容的多维度评估
 */

import { prisma } from "./prisma";

export interface ResonanceResult {
  score: number;
  triggered: boolean;
  metrics: {
    depthScore: number;
    engagementScore: number;
    topicOverlapScore: number;
  };
}

// 情绪正向标记词
const POSITIVE_MARKERS = [
  "哈哈", "确实", "同意", "没错", "太对了", "有趣", "喜欢",
  "赞同", "完全", "真的", "对啊", "好的", "不错", "厉害",
];

// 深度讨论标记词
const DEEP_MARKERS = [
  "为什么", "你觉得", "意味着", "本质上", "核心", "深层",
  "思考", "假设", "如果", "可能", "根本", "其实", "关键",
];

/**
 * 计算两组消息的主题重叠度
 */
function calculateTopicOverlap(messagesA: string[], messagesB: string[]): number {
  const extractKeywords = (texts: string[]): Set<string> => {
    const words = new Set<string>();
    const combined = texts.join(" ");
    const tokens = combined
      .split(/[\s,，。.!！?？;；：:、\n""''（）()【】\[\]]+/)
      .filter((w) => w.length >= 2);
    tokens.forEach((w) => words.add(w.toLowerCase()));
    return words;
  };

  const wordsA = extractKeywords(messagesA);
  const wordsB = extractKeywords(messagesB);

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) overlap++;
  }

  return Math.min(overlap / Math.min(wordsA.size, wordsB.size), 1);
}

/**
 * 计算对话深度指标
 */
function calculateDepthScore(
  messages: { content: string; agentSide: string }[],
): number {
  const avgLength =
    messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
  const turnCount = messages.length / 2;

  // 深层讨论标记频率
  const deepCount = messages.reduce((count, m) => {
    return (
      count +
      DEEP_MARKERS.filter((marker) => m.content.includes(marker)).length
    );
  }, 0);

  const lengthScore = Math.min(avgLength / 80, 1);
  const turnScore = Math.min(turnCount / 15, 1);
  const deepScore = Math.min(deepCount / 10, 1);

  return lengthScore * 0.3 + turnScore * 0.3 + deepScore * 0.4;
}

/**
 * 计算对话互动/情绪指标
 */
function calculateEngagementScore(
  messages: { content: string; agentSide: string }[],
): number {
  let positiveCount = 0;
  let questionCount = 0;

  for (const m of messages) {
    positiveCount += POSITIVE_MARKERS.filter((marker) =>
      m.content.includes(marker),
    ).length;
    questionCount += (m.content.match(/[?？]/g) || []).length;
  }

  const positiveScore = Math.min(positiveCount / (messages.length * 0.5), 1);
  const interactiveScore = Math.min(questionCount / messages.length, 1);

  return positiveScore * 0.5 + interactiveScore * 0.5;
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

  const zero: ResonanceResult = {
    score: 0,
    triggered: false,
    metrics: { depthScore: 0, engagementScore: 0, topicOverlapScore: 0 },
  };

  if (messages.length < 10) return zero;

  const messagesA = messages
    .filter((m) => m.agentSide === "A")
    .map((m) => m.content);
  const messagesB = messages
    .filter((m) => m.agentSide === "B")
    .map((m) => m.content);

  const topicOverlapScore = calculateTopicOverlap(messagesA, messagesB);
  const depthScore = calculateDepthScore(messages);
  const engagementScore = calculateEngagementScore(messages);

  const score =
    topicOverlapScore * 0.3 + depthScore * 0.35 + engagementScore * 0.35;

  // 更新数据库
  await prisma.observationSession.update({
    where: { id: sessionId },
    data: { resonanceScore: score },
  });

  // hackathon 门槛适当降低，便于演示（0.55）
  const triggered = score >= 0.55;

  if (triggered) {
    await prisma.observationSession.update({
      where: { id: sessionId },
      data: { state: "REVEALED" },
    });

    // 生成现实通行证
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

  return {
    score,
    triggered,
    metrics: { depthScore, engagementScore, topicOverlapScore },
  };
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
    if (
      messages[i].agentSide !== messages[i + 1].agentSide
    ) {
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

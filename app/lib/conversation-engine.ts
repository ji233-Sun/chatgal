/**
 * 对话引擎 - 编排两个 SecondMe Agent 之间的对话
 *
 * 核心机制：服务端作为中间人，在 Agent A 和 Agent B 之间"传话"
 * - 真实模式：两个用户各自的 SecondMe Agent 通过 Chat API 对话
 * - 幻影模式：一方为模板驱动的虚拟旅客（无需第二个用户）
 */

import { prisma } from "./prisma";
import { getValidAccessToken } from "./auth";
import { chatWithAgent } from "./secondme";
import { evaluateResonance } from "./resonance";

// ===== 车厢类型 =====

export const CARRIAGE_TYPES = {
  tech: {
    name: "技术工坊",
    emoji: "🔧",
    description: "代码、架构、技术趋势",
    color: "#06B6D4",
  },
  art: {
    name: "艺术长廊",
    emoji: "🎨",
    description: "绘画、音乐、文学创作",
    color: "#EC4899",
  },
  philosophy: {
    name: "观景台",
    emoji: "🔭",
    description: "哲学思考、人生感悟",
    color: "#8B5CF6",
  },
  gaming: {
    name: "娱乐车厢",
    emoji: "🎮",
    description: "游戏、动漫、影视",
    color: "#F59E0B",
  },
} as const;

export type CarriageType = keyof typeof CARRIAGE_TYPES;

// ===== Agent 提示词 =====

function getSystemPrompt(carriageType: CarriageType): string {
  const carriage = CARRIAGE_TYPES[carriageType];
  return [
    `你正在"阿卡夏漫游列车"上的${carriage.name}${carriage.emoji}中。`,
    `你遇到了一位有趣的神秘旅客，你们正在关于${carriage.description}的话题上展开自然对话。`,
    `请像真正的旅途对话一样自然交流，分享你真实的想法和兴趣。`,
    `回复保持简洁自然（2-4句话），不要刻意客套或过于正式。`,
    `不要提及你是 AI 或任何技术性的元描述。你就是你——一个有思想、有个性的旅人。`,
  ].join("");
}

function buildAgentMessage(
  carriageType: CarriageType,
  otherMessage: string | null,
  isFirstTurn: boolean,
): string {
  if (isFirstTurn) {
    const carriage = CARRIAGE_TYPES[carriageType];
    return `[你刚走进列车的${carriage.name}，坐到了一个靠窗的位置。对面坐着一位神秘旅客。请主动开始一个关于${carriage.description}的话题。简洁自然地打招呼并开启对话。]`;
  }
  return `[神秘旅客说] ${otherMessage}`;
}

// ===== 幻影旅客（Demo 模式）=====

const PHANTOM_RESPONSES: Record<CarriageType, string[]> = {
  tech: [
    "说到状态管理，我最近在研究 Zustand 和 Jotai 的取舍。你平时用什么方案？",
    "我一直觉得好的架构不是设计出来的，而是演化出来的。你遇到过哪些架构上的顿悟时刻？",
    "最近在玩 Rust，感觉所有权系统真的改变了我对内存的理解。你写过 Rust 吗？",
    "有时候最优雅的方案反而是最简单的。我最近重构了一个项目，删掉了 60% 的代码，功能反而更好了。",
    "你觉得 AI 编程助手会改变开发者的工作方式吗？我已经离不开 Copilot 了，但有时候又觉得过度依赖不好。",
    "微服务还是单体？我觉得这取决于团队规模和业务复杂度。小团队用单体反而效率更高。",
    "TypeScript 的类型体操有时候让我又爱又恨。不过类型安全确实让大型项目好维护很多。",
    "我最近在研究 WebAssembly，感觉它在性能敏感的场景下潜力很大。你有关注过吗？",
    "说到最喜欢的编程语言，我觉得每种语言都有它独特的哲学。Go 的简洁、Rust 的安全、Python 的灵活，你呢？",
    "最近在看分布式系统的论文，CAP 定理听起来简单，实际取舍真的很难。",
  ],
  art: [
    "你有没有一首歌，每次听到都会回到某个特定的时刻？",
    "我最近在学水彩，发现「留白」是最难的技巧。你觉得创作中「少即是多」这个理念怎么样？",
    "有一句话说「艺术是撒谎来揭示真相」，这个悖论挺有意思的，你怎么看？",
    "我最近在读村上春树的新书，他描写孤独的方式总是让我产生共鸣。你最近在读什么？",
    "你觉得数字艺术和传统艺术之间有本质区别吗？我觉得媒介变了，但表达的渴望没变。",
    "音乐对我来说就像一种语言。有时候一段旋律比千言万语更能表达情感。你最常听什么类型？",
    "好的设计和好的故事本质上是一样的——都在引导观者的注意力和情绪流动。",
    "创作低谷期你一般怎么度过？我通常会出去走走，看看大自然，灵感反而会回来。",
    "最近看了一个展览，被一幅抽象画震撼到了。你觉得抽象艺术的魅力在哪里？",
    "我一直在思考，审美是天生的还是后天培养的？你觉得呢？",
  ],
  philosophy: [
    "你觉得一个人的本质是他的行为、他的想法，还是他的潜力？",
    "如果可以活到一千岁，你觉得人类的价值观会发生什么根本性的变化？",
    "最近在想自由意志和决定论的问题。你站哪边？还是觉得这是个假命题？",
    '"认识你自己"——苏格拉底说得简单，做起来太难了。你觉得你了解自己吗？',
    "有时候我觉得语言是理解的桥梁，有时候又觉得它是误解的根源。你怎么看？",
    "你相信有某种「客观的善」存在吗？还是所有的道德判断都是相对的？",
    "如果一个 AI 产生了自我意识，我们应该赋予它权利吗？这个问题越来越紧迫了。",
    "存在主义说人是被抛入世界的。这个「被抛」的感觉你有体会过吗？",
    "幸福到底是一种状态还是一种能力？我最近越来越倾向于后者。",
    "你觉得人与人之间真正的「理解」是可能的吗？还是我们永远只能理解自己投射出去的影子？",
  ],
  gaming: [
    "你有没有哪款游戏，通关之后久久不能释怀？我还记得第一次打完《最后生还者》的感觉。",
    "开放世界 vs 线性叙事，你更喜欢哪种？我最近在玩荒野之息，对「自由度」这个词有了新的理解。",
    "你觉得游戏是第九艺术吗？我一直觉得像《风之旅人》这样的作品完全配得上这个称号。",
    "多人游戏的社交体验有时候比现实社交更真实。你有过在游戏里结交好朋友的经历吗？",
    "最近在玩独立游戏 Hollow Knight，地图设计真的是一门艺术。你玩过银河恶魔城类的游戏吗？",
    "有些游戏的音乐比游戏本身更让人印象深刻。你有没有单独听过游戏 OST 的习惯？",
    "怀旧游戏 vs 新游戏，你通常更倾向于哪个？我偶尔还会回去玩童年的老游戏。",
    "你觉得氪金模式对游戏设计的影响是正面还是负面的？感觉很多好的设计被商业化给毁了。",
    "如果你能进入任何一个游戏世界生活一周，你会选哪个？我会选《动物之森》，太治愈了。",
    "游戏里的剧情选择让你纠结过吗？我在《巫师3》里每个选择都要想半天。",
  ],
};

function getPhantomResponse(
  carriageType: CarriageType,
  turnIndex: number,
): string {
  const responses = PHANTOM_RESPONSES[carriageType];
  return responses[turnIndex % responses.length];
}

// ===== 核心引擎 =====

export interface AdvanceResult {
  message: {
    id: string;
    agentSide: string;
    content: string;
    timestamp: Date;
  };
  resonanceTriggered: boolean;
  sessionState: string;
}

/**
 * 推进对话一个回合（一方发言）
 */
export async function advanceConversation(
  sessionId: string,
): Promise<AdvanceResult> {
  const session = await prisma.observationSession.findUnique({
    where: { id: sessionId },
    include: { userA: true, userB: true },
  });

  if (!session) throw new Error("Session not found");

  if (session.state === "REVEALED" || session.state === "FADED_OUT") {
    throw new Error(`Session already ended: ${session.state}`);
  }

  if (session.currentTurn >= session.maxTurns) {
    await prisma.observationSession.update({
      where: { id: sessionId },
      data: { state: "FADED_OUT" },
    });
    throw new Error("Max turns reached - faded out");
  }

  // 确定下一个说话的 Agent
  const lastMessage = await prisma.message.findFirst({
    where: { sessionId },
    orderBy: { timestamp: "desc" },
  });

  const nextSide = !lastMessage
    ? "A"
    : lastMessage.agentSide === "A"
      ? "B"
      : "A";
  const isFirstTurn = !lastMessage;
  const carriageType = session.carriageType as CarriageType;
  const isPhantom = !session.userBId;

  let responseContent: string;

  if (nextSide === "B" && isPhantom) {
    // 幻影旅客：使用模板响应
    responseContent = getPhantomResponse(carriageType, session.currentTurn);
  } else {
    // 真实 SecondMe Agent
    const userId = nextSide === "A" ? session.userAId : session.userBId!;
    const token = await getValidAccessToken(userId);

    const existingSessionId =
      nextSide === "A" ? session.chatSessionA : session.chatSessionB;
    const message = buildAgentMessage(
      carriageType,
      lastMessage?.content || null,
      isFirstTurn,
    );

    const result = await chatWithAgent(
      token,
      message,
      existingSessionId || undefined,
      !existingSessionId ? getSystemPrompt(carriageType) : undefined,
    );

    responseContent = result.content;

    // 保存 SecondMe chat session ID（首次对话时）
    if (!existingSessionId && result.sessionId) {
      const field =
        nextSide === "A" ? "chatSessionA" : "chatSessionB";
      await prisma.observationSession.update({
        where: { id: sessionId },
        data: { [field]: result.sessionId },
      });
    }
  }

  // 存储消息
  const newMessage = await prisma.message.create({
    data: {
      sessionId,
      agentSide: nextSide,
      content: responseContent,
    },
  });

  // 更新轮次
  const updatedSession = await prisma.observationSession.update({
    where: { id: sessionId },
    data: { currentTurn: { increment: 1 } },
  });

  // 每 5 轮评估共鸣（至少 10 条消息后开始）
  let resonanceTriggered = false;
  if (
    updatedSession.currentTurn >= 10 &&
    updatedSession.currentTurn % 5 === 0
  ) {
    const result = await evaluateResonance(sessionId);
    resonanceTriggered = result.triggered;
  }

  // 如果达到最大轮次的 80%，强制检查一次
  if (
    !resonanceTriggered &&
    updatedSession.currentTurn === Math.floor(session.maxTurns * 0.8)
  ) {
    const result = await evaluateResonance(sessionId);
    resonanceTriggered = result.triggered;
  }

  return {
    message: {
      id: newMessage.id,
      agentSide: newMessage.agentSide,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    },
    resonanceTriggered,
    sessionState: resonanceTriggered
      ? "REVEALED"
      : updatedSession.currentTurn >= session.maxTurns
        ? "FADED_OUT"
        : "ANONYMOUS",
  };
}

/**
 * POST /api/train/start
 * 登车并匹配 - 选择车厢、创建观测会话
 *
 * 匹配策略（简化版）：
 * 1. 查找同车厢等待中的会话（userB 为空），加入
 * 2. 随机匹配数据库中任意其他用户，新建会话
 * 3. 系统只有一个用户时进入幻影模式
 */

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserId } from "@/app/lib/auth";
import { CARRIAGE_TYPES, type CarriageType } from "@/app/lib/conversation-engine";
import { selectRandomTopic, type TopicData } from "@/app/lib/zhihu";

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 },
      );
    }

    const { carriageType } = await req.json();

    if (!carriageType || !(carriageType in CARRIAGE_TYPES)) {
      return NextResponse.json(
        { code: 400, message: "无效的车厢类型" },
        { status: 400 },
      );
    }

    // === zhihu_hot: 提前获取话题数据 ===
    let topicData: TopicData | null = null;
    if (carriageType === "zhihu_hot") {
      try {
        topicData = await selectRandomTopic();
      } catch (err) {
        console.error("[train/start] 知乎热榜获取失败:", err);
        const message = err instanceof Error ? err.message : "获取热榜失败，请稍后重试";
        return NextResponse.json(
          { code: 503, message },
          { status: 503 },
        );
      }
    }

    // === 策略1：查找等待中的会话（同车厢、userB 为空、还没开始） ===
    const waitingSession = await prisma.observationSession.findFirst({
      where: {
        carriageType,
        userBId: null,
        state: "ANONYMOUS",
        userAId: { not: userId },
        currentTurn: 0,
      },
      orderBy: { createdAt: "asc" },
    });

    if (waitingSession) {
      await prisma.observationSession.update({
        where: { id: waitingSession.id },
        data: { userBId: userId },
      });

      const carriage = CARRIAGE_TYPES[carriageType as CarriageType];
      // 复用已有会话的 topicData
      const existingTopicData = waitingSession.topicData as Record<string, unknown> | null;
      return NextResponse.json({
        code: 0,
        data: {
          sessionId: waitingSession.id,
          carriageType,
          carriageName: carriage.name,
          isPhantom: false,
          topicTitle: existingTopicData?.title || null,
        },
      });
    }

    // === 策略2：随机匹配任意其他用户 ===
    const otherUsers = await prisma.user.findMany({
      where: { id: { not: userId } },
    });

    // 随机选一个
    const matchedUser =
      otherUsers.length > 0
        ? otherUsers[Math.floor(Math.random() * otherUsers.length)]
        : null;

    const session = await prisma.observationSession.create({
      data: {
        userAId: userId,
        userBId: matchedUser?.id || null,
        carriageType,
        maxTurns: 30,
        ...(topicData ? { topicData: JSON.parse(JSON.stringify(topicData)) } : {}),
      },
    });

    const carriage = CARRIAGE_TYPES[carriageType as CarriageType];

    return NextResponse.json({
      code: 0,
      data: {
        sessionId: session.id,
        carriageType,
        carriageName: carriage.name,
        isPhantom: !matchedUser,
        topicTitle: topicData?.title || null,
      },
    });
  } catch (error) {
    console.error("[train/start] Error:", error);
    return NextResponse.json(
      { code: 500, message: "登车失败，请稍后重试" },
      { status: 500 },
    );
  }
}

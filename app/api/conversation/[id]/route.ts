/**
 * GET /api/conversation/[id]
 * 获取会话信息和消息列表
 */

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserId } from "@/app/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 },
      );
    }

    const { id: sessionId } = await params;

    const session = await prisma.observationSession.findUnique({
      where: { id: sessionId },
      include: {
        userA: { select: { id: true, name: true, avatarUrl: true, route: true } },
        userB: { select: { id: true, name: true, avatarUrl: true, route: true } },
        realityPass: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { code: 404, message: "会话不存在" },
        { status: 404 },
      );
    }

    // 验证用户权限
    const isUserA = session.userAId === userId;
    const isUserB = session.userBId === userId;

    if (!isUserA && !isUserB) {
      return NextResponse.json(
        { code: 403, message: "无权访问此会话" },
        { status: 403 },
      );
    }

    // userB 只能访问已共鸣的对话
    if (isUserB && session.state !== "REVEALED") {
      return NextResponse.json(
        { code: 403, message: "无权访问此会话" },
        { status: 403 },
      );
    }

    // 确定当前用户是 A 还是 B
    const mySide = session.userAId === userId ? "A" : "B";

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: "asc" },
      select: { id: true, agentSide: true, content: true, timestamp: true },
    });

    // 构建响应（揭面前隐藏对方信息）
    const isRevealed = session.state === "REVEALED";
    const isPhantom = !session.userBId;
    const stranger = mySide === "A" ? session.userB : session.userA;

    // 提取 topicData（zhihu_hot 专用）
    const topicData = (session.topicData as Record<string, unknown> | null) ?? null;

    return NextResponse.json({
      code: 0,
      data: {
        session: {
          id: session.id,
          state: session.state,
          carriageType: session.carriageType,
          currentTurn: session.currentTurn,
          maxTurns: session.maxTurns,
          resonanceScore: session.resonanceScore,
          isPhantom,
          mySide,
          createdAt: session.createdAt,
          topicData,
        },
        // 揭面后才显示对方信息
        stranger: isRevealed && !isPhantom
          ? {
              name: stranger?.name,
              avatarUrl: stranger?.avatarUrl,
              route: stranger?.route,
            }
          : null,
        realityPass: isRevealed ? session.realityPass : null,
        messages,
      },
    });
  } catch (error) {
    console.error("[conversation/[id]] Error:", error);
    return NextResponse.json(
      { code: 500, message: "获取会话失败" },
      { status: 500 },
    );
  }
}

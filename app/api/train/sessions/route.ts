/**
 * GET /api/train/sessions
 * 获取用户的所有观测会话列表
 * 支持 ?state=REVEALED|FADED_OUT|ANONYMOUS 可选筛选
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserId } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 },
      );
    }

    const stateFilter = request.nextUrl.searchParams.get("state");
    const roleFilter = request.nextUrl.searchParams.get("role");
    const validStates = ["ANONYMOUS", "REVEALED", "FADED_OUT", "ABANDONED"];

    const where: Record<string, unknown> = roleFilter === "B"
      ? { userBId: userId, state: "REVEALED" }
      : { userAId: userId };

    if (roleFilter !== "B" && stateFilter && validStates.includes(stateFilter)) {
      where.state = stateFilter;
    }

    const sessions = await prisma.observationSession.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        state: true,
        carriageType: true,
        currentTurn: true,
        maxTurns: true,
        resonanceScore: true,
        createdAt: true,
        updatedAt: true,
        userBId: true,
        topicData: true,
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
          select: {
            content: true,
            timestamp: true,
          },
        },
      },
    });

    return NextResponse.json({
      code: 0,
      data: {
        sessions: sessions.map((s) => {
          const lastMsg = s.messages[0] ?? null;
          return {
            id: s.id,
            state: s.state,
            carriageType: s.carriageType,
            currentTurn: s.currentTurn,
            maxTurns: s.maxTurns,
            resonanceScore: s.resonanceScore,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            isPhantom: !s.userBId,
            topicTitle: (s.topicData as Record<string, unknown> | null)?.title as string | null ?? null,
            lastMessagePreview: lastMsg
              ? lastMsg.content.length > 80
                ? lastMsg.content.slice(0, 80) + "..."
                : lastMsg.content
              : null,
            lastMessageAt: lastMsg?.timestamp ?? null,
          };
        }),
      },
    });
  } catch (error) {
    console.error("[train/sessions] Error:", error);
    return NextResponse.json(
      { code: 500, message: "获取会话列表失败" },
      { status: 500 },
    );
  }
}

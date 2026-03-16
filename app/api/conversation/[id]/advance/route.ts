/**
 * POST /api/conversation/[id]/advance
 * 推进对话一个回合
 */

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserId } from "@/app/lib/auth";
import { advanceConversation } from "@/app/lib/conversation-engine";

export async function POST(
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

    // 验证会话归属
    const session = await prisma.observationSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { code: 404, message: "会话不存在" },
        { status: 404 },
      );
    }

    if (session.userAId !== userId && session.userBId !== userId) {
      return NextResponse.json(
        { code: 403, message: "无权操作此会话" },
        { status: 403 },
      );
    }

    const result = await advanceConversation(sessionId);

    return NextResponse.json({
      code: 0,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "推进对话失败";
    const isExpected =
      message.includes("already ended") || message.includes("faded out") || message.includes("Max turns");

    console.error("[conversation/advance] Error:", message);

    return NextResponse.json(
      {
        code: isExpected ? 1 : 500,
        message,
        data: isExpected
          ? { sessionState: message.includes("REVEALED") ? "REVEALED" : "FADED_OUT" }
          : null,
      },
      { status: isExpected ? 200 : 500 },
    );
  }
}

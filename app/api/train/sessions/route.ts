/**
 * GET /api/train/sessions
 * 获取用户的所有观测会话列表
 */

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUserId } from "@/app/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { code: 401, message: "请先登录" },
        { status: 401 },
      );
    }

    const sessions = await prisma.observationSession.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        state: true,
        carriageType: true,
        currentTurn: true,
        resonanceScore: true,
        createdAt: true,
        userBId: true,
      },
    });

    return NextResponse.json({
      code: 0,
      data: {
        sessions: sessions.map((s) => ({
          ...s,
          isPhantom: !s.userBId,
        })),
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

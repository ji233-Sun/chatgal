import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ code: -1, message: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ code: -1, message: "用户不存在" }, { status: 404 });
  }

  return NextResponse.json({
    code: 0,
    data: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      route: user.route,
    },
  });
}

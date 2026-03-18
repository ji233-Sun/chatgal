import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 });
  }

  const session = await prisma.observationSession.findUnique({
    where: { id },
    select: { userAId: true, state: true },
  });

  if (!session || session.userAId !== userId) {
    return NextResponse.json({ code: 403, message: "无权操作" }, { status: 403 });
  }

  if (session.state !== "ANONYMOUS") {
    return NextResponse.json({ code: 400, message: "只能放弃进行中的旅途" }, { status: 400 });
  }

  await prisma.observationSession.update({
    where: { id },
    data: { state: "ABANDONED" },
  });

  return NextResponse.json({ code: 0, message: "已放弃旅途" });
}

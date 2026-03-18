import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ code: 401, message: "未登录" }, { status: 401 });
  }

  const result = await prisma.observationSession.updateMany({
    where: { userAId: userId, state: "ANONYMOUS" },
    data: { state: "ABANDONED" },
  });

  return NextResponse.json({ code: 0, data: { count: result.count } });
}

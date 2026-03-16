import { NextResponse } from "next/server";
import { getCurrentUserId, getValidAccessToken, callSecondMeApi } from "@/app/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ code: -1, message: "未登录" }, { status: 401 });
  }

  try {
    const accessToken = await getValidAccessToken(userId);
    const result = await callSecondMeApi(accessToken, "/api/secondme/user/info");

    if (result.code !== 0) {
      return NextResponse.json(
        { code: result.code, message: result.message },
        { status: 502 }
      );
    }

    return NextResponse.json({ code: 0, data: result.data });
  } catch (error) {
    console.error("Fetch user info error:", error);
    return NextResponse.json(
      { code: -1, message: "获取用户信息失败" },
      { status: 500 }
    );
  }
}

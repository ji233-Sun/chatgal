import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, callSecondMeApi } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Fetch user info from SecondMe
    const userInfoResult = await callSecondMeApi(
      tokens.accessToken,
      "/api/secondme/user/info"
    );

    if (userInfoResult.code !== 0 || !userInfoResult.data) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = userInfoResult.data;
    const secondmeUserId = userInfo.email || userInfo.route || "unknown";

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { secondmeUserId },
      update: {
        name: userInfo.name || null,
        avatarUrl: userInfo.avatarUrl || null,
        route: userInfo.route || null,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
      create: {
        secondmeUserId,
        name: userInfo.name || null,
        avatarUrl: userInfo.avatarUrl || null,
        route: userInfo.route || null,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
    });

    // Set user ID cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}

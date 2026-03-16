import { NextResponse } from "next/server";
import { buildAuthUrl } from "@/app/lib/auth";

export async function GET() {
  const authUrl = buildAuthUrl();
  return NextResponse.redirect(authUrl);
}

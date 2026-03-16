import { cookies } from "next/headers";
import { prisma } from "./prisma";

const API_BASE_URL = process.env.SECONDME_API_BASE_URL!;
const TOKEN_ENDPOINT = process.env.SECONDME_TOKEN_ENDPOINT!;
const REFRESH_ENDPOINT = process.env.SECONDME_REFRESH_ENDPOINT!;
const CLIENT_ID = process.env.SECONDME_CLIENT_ID!;
const CLIENT_SECRET = process.env.SECONDME_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SECONDME_REDIRECT_URI!;
const OAUTH_URL = process.env.SECONDME_OAUTH_URL!;

/**
 * Build SecondMe OAuth authorization URL
 */
export function buildAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    state: "chatgal",
  });
  return `${OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const result = await response.json();

  if (result.code !== 0 || !result.data) {
    throw new Error(`Token exchange failed: ${result.message || "Unknown error"}`);
  }

  return result.data as {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string[];
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(REFRESH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const result = await response.json();

  if (result.code !== 0 || !result.data) {
    throw new Error(`Token refresh failed: ${result.message || "Unknown error"}`);
  }

  return result.data as {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

/**
 * Get valid access token for a user, refreshing if needed
 */
export async function getValidAccessToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Token still valid (with 5-minute buffer)
  if (user.tokenExpiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
    return user.accessToken;
  }

  // Refresh the token
  const tokens = await refreshAccessToken(user.refreshToken);
  await prisma.user.update({
    where: { id: userId },
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
    },
  });

  return tokens.accessToken;
}

/**
 * Call SecondMe API with authorization
 */
export async function callSecondMeApi(accessToken: string, path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

/**
 * Get current logged-in user ID from cookie
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_id")?.value || null;
}

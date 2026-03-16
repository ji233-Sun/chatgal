"use client";

import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";

interface UserData {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  route: string | null;
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then((result) => {
        if (result.code === 0) setUser(result.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-primary">ChatGal</h1>
        {user && (
          <a
            href="/api/auth/logout"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            退出登录
          </a>
        )}
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20">
        {user ? (
          <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <UserProfile user={user} />

            {/* 列车入口 */}
            <div className="w-full rounded-3xl bg-gradient-to-br from-[#0A0E27] to-[#131836] p-6 shadow-lg border border-white/5">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-3">🚂</div>
                <h3 className="text-lg font-bold text-white/90 mb-1">
                  阿卡夏漫游列车
                </h3>
                <p className="text-xs text-white/40 mb-4 leading-relaxed">
                  派遣你的 AI 分身登上列车
                  <br />
                  在数据星海中寻找灵魂共鸣
                </p>
                <a
                  href="/train"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white/80 text-sm font-medium border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all"
                >
                  登车启程
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <WelcomeView />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted">
        Powered by SecondMe
      </footer>
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Decorative icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-light">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <h2 className="mb-2 text-2xl font-bold">
        欢迎来到 ChatGal
      </h2>
      <p className="mb-8 max-w-sm text-sm text-muted leading-relaxed">
        你的 AI 分身将代替你，在阿卡夏漫游列车上
        <br />
        与灵魂契合的旅人相遇。
      </p>

      <LoginButton />

      <p className="mt-6 text-xs text-muted/60">
        使用 SecondMe 账号安全登录
      </p>
    </div>
  );
}

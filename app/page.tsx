"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "arcadeui";
import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";
import PixelIcon from "./components/ui/PixelIcon";
import { CARRIAGE_NAMES } from "./lib/carriage";

interface UserData {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  route: string | null;
}

interface ActiveSession {
  id: string;
  carriageType: string;
  currentTurn: number;
  maxTurns: number;
  updatedAt: string;
}


export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [activeCount, setActiveCount] = useState(0);

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

  // 获取用户未完成的 ANONYMOUS 会话
  useEffect(() => {
    if (!user) return;
    fetch("/api/train/sessions?state=ANONYMOUS")
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 0) {
          const active = result.data.sessions.filter(
            (s: ActiveSession) => s.currentTurn > 0,
          );
          setActiveCount(active.length);
          if (active.length > 0) setActiveSession(active[0]);
        }
      })
      .catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F5]">
        {/* 像素火车加载动画 */}
        <div className="flex flex-col items-center gap-4">
          <PixelIcon name="icon-train" size={48} color="#FF9A76" className="animate-[bounce_1s_ease-in-out_infinite]" />
          <p className="font-pixel text-sm text-[#9B8E85]">正在穿越数据维度...</p>
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#FF9A76] animate-[bounce_1.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E27] text-white relative overflow-hidden">
      {/* 全局背景装饰 */}
      <div className="stars-layer fixed inset-0 opacity-40" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF9A76]/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 group cursor-default">
          <PixelIcon name="icon-train" size={24} color="#FF9A76" className="group-hover:animate-bounce" />
          <h1 className="font-pixel text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A76] to-[#ffd700]">
            AKASHA EXPRESS
          </h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-pixel text-[10px] text-white/30 hidden sm:inline">列车长已就绪</span>
            <a
              href="/api/auth/logout"
              className="font-pixel text-xs text-white/40 hover:text-[#FF9A76] transition-colors border border-white/10 px-3 py-1 rounded-sm hover:border-[#FF9A76]/30"
            >
              登出
            </a>
          </div>
        )}
      </header>

      {/* Main — 响应式：md 居中限宽, lg 双栏 */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        {user ? (
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl space-y-6">
            {/* 未完成会话恢复横幅 */}
            {activeSession && (
              <div className="rounded-lg bg-gradient-to-r from-[#131836] to-[#0F0F23] border border-purple-500/20 border-l-2 border-l-purple-500 p-4 flex items-center gap-4 animate-[fade-slide-up_0.5s_ease-out]">
                <div className="shrink-0 w-2 h-8 bg-purple-500 rounded-full animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="font-pixel text-[10px] text-white/60 mb-1">
                    你有一段未完成的旅途
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[10px] text-purple-400 font-bold">
                      {CARRIAGE_NAMES[activeSession.carriageType] || "UNKNOWN"}
                    </span>
                    <span className="font-pixel text-[8px] text-white/20">
                      {activeSession.currentTurn}/{activeSession.maxTurns}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  {activeCount > 1 && (
                    <Link
                      href="/train/history"
                      className="font-pixel text-[8px] text-white/30 hover:text-white/50 transition-colors"
                    >
                      查看全部 →
                    </Link>
                  )}
                  <Link
                    href={`/train/${activeSession.id}`}
                    className="font-pixel text-[10px] text-[#0A0E27] bg-purple-500 hover:bg-purple-400 px-3 py-1.5 rounded-sm transition-colors"
                  >
                    继续观测
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
            {/* 左栏：用户信息 - 去掉白边包裹层 */}
            <div className="w-full lg:w-2/5 flex flex-col">
              <UserProfile user={user} />
            </div>

            {/* 右栏：列车入口 */}
            <div className="w-full lg:w-3/5 flex flex-col">
              <div className="group h-full rounded-lg bg-gradient-to-br from-[#131836] to-[#0A0E27] p-8 border-4 border-[#8b5a2b] shadow-pixel hover:shadow-pixel-lg transition-all duration-500 relative overflow-hidden flex flex-col justify-center items-center">
                {/* 内部星光装饰 */}
                <div className="stars-layer opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1 h-1 bg-[#ffd700] animate-pulse" />
                  <div className="w-1 h-1 bg-[#ffd700] animate-pulse delay-75" />
                </div>

                <div className="flex flex-col items-center text-center relative z-10 w-full">
                  <div className="mb-6 relative">
                    <PixelIcon name="icon-train" size={64} color="#ffd700" className="group-hover:animate-[bounce_1.5s_ease-in-out_infinite]" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffd700]/20 blur-sm rounded-full" />
                  </div>
                  
                  <h3 className="font-pixel text-2xl font-bold text-white mb-3 tracking-tight">
                    阿卡夏漫游列车
                  </h3>
                  
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#8b5a2b] to-transparent mb-4" />
                  
                  <p className="font-retro text-sm text-white/50 mb-8 leading-relaxed max-w-xs">
                    派遣你的 AI 分身登上列车
                    <br />
                    在数据星海中寻找灵魂共鸣
                  </p>

                  <div className="relative group/btn">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700] to-[#ff8c00] rounded-sm blur opacity-25 group-hover/btn:opacity-50 transition duration-300" />
                    <Button
                      variant="primary"
                      size="lg"
                      className="relative !bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !border-[#8b5a2b] !text-[#0a0e27] !font-pixel !text-sm !font-bold !px-10 !py-6 !inline-flex !items-center !gap-3 hover:!translate-y-[-2px] active:!translate-y-[1px] transition-all"
                      onClick={() => {
                        window.location.href = "/train";
                      }}
                    >
                      登车启程
                      <PixelIcon name="icon-arrow-right" size={18} color="#0a0e27" />
                    </Button>
                  </div>

                  <Link
                    href="/train/history"
                    className="mt-4 font-pixel text-xs text-white/40 hover:text-[#ffd700] transition-colors"
                  >
                    旅途日志 →
                  </Link>

                  <div className="mt-6 flex gap-4 opacity-30 group-hover:opacity-60 transition-opacity">
                    <PixelIcon name="icon-scope" size={20} color="currentColor" />
                    <PixelIcon name="icon-food" size={20} color="currentColor" />
                    <PixelIcon name="icon-game" size={20} color="currentColor" />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        ) : (
          <WelcomeView />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/5 backdrop-blur-sm">
        <p className="font-pixel text-[10px] text-white/20 tracking-widest uppercase">
          Powered by SecondMe Protocol &copy; 2026
        </p>
      </footer>
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex flex-col items-center text-center max-w-md md:max-w-2xl px-4 animate-[fade-slide-up_1s_ease-out]">
      {/* Decorative icon - 像素风格 */}
      <div className="mb-8 relative group">
        <div className="absolute inset-0 bg-[#FF9A76] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A0E27] to-[#1a1f3a] border-4 border-[#FF9A76] shadow-pixel group-hover:scale-105 transition-transform duration-500">
          <PixelIcon name="icon-user" size={56} color="#FF9A76" className="animate-pulse" />
        </div>
      </div>

      <h2 className="mb-4 font-pixel text-3xl font-bold text-white tracking-tighter">
        欢迎来到 <span className="text-[#FF9A76]">CHATGAL</span>
      </h2>
      
      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF9A76] to-transparent mb-6" />

      <p className="mb-10 max-w-sm font-retro text-base text-white/50 leading-relaxed">
        你的 AI 分身将代替你，在阿卡夏漫游列车上
        <br />
        与灵魂契合的旅人相遇。
      </p>

      <div className="w-full max-w-xs transform hover:scale-105 transition-transform">
        <LoginButton />
      </div>

      <p className="mt-8 font-pixel text-[10px] text-white/20 tracking-widest uppercase flex items-center gap-2">
        <span className="w-4 h-[1px] bg-white/10" />
        使用 SecondMe 账号登录
        <span className="w-4 h-[1px] bg-white/10" />
      </p>
    </div>
  );
}

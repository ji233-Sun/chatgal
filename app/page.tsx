"use client";

import { useEffect, useState } from "react";
import { Button } from "arcadeui";
import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";
import PixelIcon from "./components/ui/PixelIcon";

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
    <div className="flex min-h-screen flex-col bg-[#FFF8F5]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b-2 border-[#3D3029]/10">
        <div className="flex items-center gap-2">
          <PixelIcon name="icon-train" size={24} color="#FF9A76" />
          <h1 className="font-pixel text-xl font-bold text-[#FF9A76]">ChatGal</h1>
        </div>
        {user && (
          <a
            href="/api/auth/logout"
            className="font-pixel text-xs text-[#9B8E85] hover:text-[#3D3029] transition-colors"
          >
            退出登录
          </a>
        )}
      </header>

      {/* Main — 响应式：md 居中限宽, lg 双栏 */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20">
        {user ? (
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full max-w-md md:max-w-2xl lg:max-w-4xl">
            {/* 左栏：用户信息 */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <UserProfile user={user} />
            </div>

            {/* 右栏：列车入口 */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full max-w-md rounded-lg bg-gradient-to-br from-[#0A0E27] to-[#131836] p-6 border-4 border-[#8b5a2b] shadow-pixel relative overflow-hidden">
                {/* 星星背景层 */}
                <div className="stars-layer opacity-30" />

                <div className="flex flex-col items-center text-center relative z-10">
                  <PixelIcon name="icon-train" size={48} color="#ffd700" className="mb-4" />
                  <h3 className="font-pixel text-lg font-bold text-white/90 mb-2">
                    阿卡夏漫游列车
                  </h3>
                  <p className="font-retro text-xs text-white/40 mb-6 leading-relaxed">
                    派遣你的 AI 分身登上列车
                    <br />
                    在数据星海中寻找灵魂共鸣
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="!bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !border-[#8b5a2b] !text-[#0a0e27] !font-pixel !text-sm !font-bold !inline-flex !items-center !gap-2"
                    onClick={() => {
                      window.location.href = "/train";
                    }}
                  >
                    登车启程
                    <PixelIcon name="icon-arrow-right" size={16} color="#0a0e27" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <WelcomeView />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center font-pixel text-xs text-[#9B8E85]">
        Powered by SecondMe
      </footer>
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex flex-col items-center text-center max-w-md md:max-w-2xl">
      {/* Decorative icon - 像素风格 */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFD4C2] to-[#FF9A76] border-4 border-[#FF9A76] shadow-pixel">
        <PixelIcon name="icon-user" size={48} color="#3D3029" />
      </div>

      <h2 className="mb-2 font-pixel text-2xl font-bold text-[#3D3029]">
        欢迎来到 ChatGal
      </h2>
      <p className="mb-8 max-w-sm font-retro text-sm text-[#9B8E85] leading-relaxed">
        你的 AI 分身将代替你，在阿卡夏漫游列车上
        <br />
        与灵魂契合的旅人相遇。
      </p>

      <LoginButton />

      <p className="mt-6 font-pixel text-xs text-[#9B8E85]/60">
        使用 SecondMe 账号安全登录
      </p>
    </div>
  );
}

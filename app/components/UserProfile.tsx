"use client";

import { useEffect, useState } from "react";
import { Avatar } from "arcadeui";
import PixelIcon from "./ui/PixelIcon";

interface UserProfileProps {
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    route: string | null;
  };
}

interface Shade {
  name?: string;
  label?: string;
  description?: string;
}

/** 深色主题区块卡片 —— 替代 ArcadeUI Card，彻底避免样式冲突 */
function ThemeCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#131836]/80 to-[#0d1230]/60 backdrop-blur-sm shadow-pixel-sm overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
        {icon}
        <span className="font-pixel text-xs tracking-wide text-white/50 uppercase">
          {title}
        </span>
      </div>
      {/* 内容区 */}
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

export default function UserProfile({ user }: UserProfileProps) {
  const [shades, setShades] = useState<Shade[]>([]);
  const [loadingShades, setLoadingShades] = useState(true);

  useEffect(() => {
    fetch("/api/user/shades")
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 0 && result.data?.shades) {
          setShades(result.data.shades);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingShades(false));
  }, []);

  const secondmeUrl = user.route
    ? `https://second.me/${user.route}`
    : null;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      {/* 列车长信息 */}
      <ThemeCard
        icon={<PixelIcon name="icon-user" size={14} color="#ffd700" />}
        title="列车长信息"
      >
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#ffd700]/30 to-[#ff8c00]/10 blur-sm group-hover:from-[#ffd700]/50 group-hover:to-[#ff8c00]/20 transition-all duration-500" />
            {user.avatarUrl ? (
              <Avatar
                src={user.avatarUrl}
                alt={user.name || "用户头像"}
                fallback={(user.name || "U").charAt(0).toUpperCase()}
                shape="circle"
                className="relative !w-20 !h-20 !border-2 !border-[#ffd700]/40 !bg-[#1a1f3a] !object-cover"
              />
            ) : (
              <div className="relative w-20 h-20 rounded-full border-2 border-[#ffd700]/40 bg-[#1a1f3a] flex items-center justify-center">
                <span className="font-pixel text-2xl text-[#ffd700]/80">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <h2 className="mt-4 font-pixel text-lg font-bold text-white tracking-tight">
            {user.name || "SecondMe 用户"}
          </h2>

          {/* SecondMe Link */}
          {secondmeUrl && (
            <a
              href={secondmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-retro text-xs text-[#ffd700]/60 hover:text-[#ffd700] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              访问 SecondMe 主页
            </a>
          )}
        </div>
      </ThemeCard>

      {/* 兴趣标签 */}
      <ThemeCard
        icon={<PixelIcon name="icon-star" size={14} color="#ff6ec7" />}
        title="兴趣标签"
      >
        {loadingShades ? (
          <div className="flex justify-center py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ffd700]/40 border-t-transparent" />
          </div>
        ) : shades.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {shades.map((shade, index) => (
              <span
                key={index}
                className="inline-block rounded-sm border border-[#ffd700]/20 bg-[#ffd700]/[0.08] px-2.5 py-1 font-retro text-xs text-[#ffd700]/80"
              >
                {shade.name || shade.label || "未知"}
              </span>
            ))}
          </div>
        ) : (
          <p className="py-2 text-center font-retro text-xs text-white/30">
            还没有兴趣标签
          </p>
        )}
      </ThemeCard>
    </div>
  );
}

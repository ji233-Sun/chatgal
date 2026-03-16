"use client";

/**
 * StrangerAvatar - 神秘旅客的匿名头像
 * 揭面前显示全息剪影（ArcadeUI Avatar + fallback），揭面后显示真实头像
 * 保留自定义动画 class（glow-pulse、avatar-reveal）
 */

import { Avatar } from "arcadeui";

interface StrangerAvatarProps {
  revealed: boolean;
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

/** 映射到 ArcadeUI Avatar 的 size */
const AVATAR_SIZE_MAP: Record<string, "sm" | "md" | "lg" | "xl"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export default function StrangerAvatar({
  revealed,
  avatarUrl,
  name,
  size = "md",
}: StrangerAvatarProps) {
  const arcadeSize = AVATAR_SIZE_MAP[size] || "md";

  if (revealed && avatarUrl) {
    return (
      <Avatar
        src={avatarUrl}
        alt={name || "旅客"}
        size={arcadeSize}
        shape="circle"
        className="!border-2 !border-violet-400/50 animate-[avatar-reveal_1s_ease-out]"
      />
    );
  }

  // 匿名状态：ArcadeUI Avatar + 面具 fallback + glow 动画
  return (
    <Avatar
      fallback="🎭"
      size={arcadeSize}
      shape="circle"
      className={`
        !bg-gradient-to-br !from-violet-600/30 !to-cyan-600/30
        !border !border-white/10
        ${!revealed ? "animate-[glow-pulse_3s_ease-in-out_infinite]" : ""}
      `}
    />
  );
}

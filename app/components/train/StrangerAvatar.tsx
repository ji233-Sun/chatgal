"use client";

/**
 * StrangerAvatar - Retro-Futurism Optimized
 */

import { memo } from "react";
import { Avatar } from "arcadeui";
import PixelIcon from "../ui/PixelIcon";

interface StrangerAvatarProps {
  revealed: boolean;
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<string, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const StrangerAvatar = memo(function StrangerAvatar({
  revealed,
  avatarUrl,
  name,
  size = "md",
}: StrangerAvatarProps) {
  const sizeClass = SIZE_CLASSES[size] || "w-10 h-10";

  if (revealed && avatarUrl) {
    return (
      <Avatar
        src={avatarUrl}
        alt={name || "旅客"}
        size={size}
        shape="square"
        className="!border !border-rose-500/50 !shadow-pixel-sm animate-[avatar-reveal_1s_ease-out]"
      />
    );
  }

  // 匿名状态：自定义 Div 模拟 Avatar + PixelIcon
  return (
    <div className={`
      relative group ${sizeClass} overflow-hidden
      bg-gradient-to-br from-purple-600/20 to-rose-600/20
      border border-white/10 shadow-pixel-sm
      flex items-center justify-center
      ${!revealed ? "animate-[glow-pulse_3s_ease-in-out_infinite]" : ""}
    `}>
      <div className="opacity-40 scale-75">
         <PixelIcon name="icon-mask" size={24} color="white" />
      </div>
    </div>
  );
});

export default StrangerAvatar;

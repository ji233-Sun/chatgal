"use client";

/**
 * StrangerAvatar - 神秘旅客的匿名头像
 * 揭面前显示全息剪影，揭面后显示真实头像
 */

interface StrangerAvatarProps {
  revealed: boolean;
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function StrangerAvatar({
  revealed,
  avatarUrl,
  name,
  size = "md",
}: StrangerAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
  };

  if (revealed && avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "旅客"}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-violet-400/50 animate-[avatar-reveal_1s_ease-out]`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        bg-gradient-to-br from-violet-600/30 to-cyan-600/30
        border border-white/10 backdrop-blur-sm
        ${!revealed ? "animate-[glow-pulse_3s_ease-in-out_infinite]" : ""}
      `}
    >
      <span className="opacity-70">🎭</span>
    </div>
  );
}

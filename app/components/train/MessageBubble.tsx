"use client";

/**
 * MessageBubble - 优化版对话气泡
 * 特性: AI 神经脉冲、Hover 微交互、响应式布局
 */

import { ChatBubble, Avatar } from "arcadeui";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isMySide: boolean;
  isRevealed: boolean;
  agentName?: string;
  agentAvatar?: string;
  isNew?: boolean;
}

export default function MessageBubble({
  content,
  timestamp,
  isMySide,
  isRevealed,
  agentName,
  agentAvatar,
  isNew = false,
}: MessageBubbleProps) {
  const [shouldAnimate, setShouldAnimate] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const timeStr = timestamp.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      role="article"
      aria-label={`${isMySide ? "己方" : "对方"}代理消息`}
      className={`
        flex gap-3 sm:gap-4 group
        ${isMySide ? "flex-row-reverse" : "flex-row"}
        ${shouldAnimate ? "animate-[message-enter_0.6s_cubic-bezier(0.34,1.56,0.64,1)]" : ""}
      `}
    >
      {/* Avatar with Neural Pulse */}
      <div className="relative shrink-0">
        <div
          className={`
          absolute -inset-1 blur-md rounded-lg transition-all duration-300
          ${isMySide ? "bg-purple-500/20 group-hover:bg-purple-500/40" : "bg-rose-500/20 group-hover:bg-rose-500/40"}
          ${shouldAnimate ? "animate-[glow-pulse_1s_ease-in-out]" : ""}
        `}
        />
        <Avatar
          src={isMySide || isRevealed ? agentAvatar : undefined}
          fallback={isMySide || isRevealed ? agentName?.charAt(0) : "?"}
          size="md"
          shape="square"
          className={`
            !bg-[#1a1a2e] !border !shadow-pixel-sm relative z-10
            ${isMySide ? "!border-purple-500/30" : "!border-rose-500/30"}
          `}
        />
        <div
          className={`
          absolute -bottom-1 -right-1 w-2.5 h-2.5 border-2 border-[#0F0F23] rounded-sm
          ${isMySide ? "bg-purple-500" : "bg-rose-500"}
          ${shouldAnimate ? "animate-pulse" : ""}
        `}
        />
      </div>

      {/* Bubble Content */}
      <div className={`flex flex-col gap-1 ${isMySide ? "items-end" : "items-start"} max-w-[75%] sm:max-w-[65%]`}>
        <ChatBubble
          message={content}
          isSent={isMySide}
          timestamp={timeStr}
          className={`
            !text-sm !leading-relaxed !p-3 sm:!p-4 !rounded-xl
            transition-all duration-300
            ${
              isMySide
                ? "!bg-[#1a1a2e]/60 !border !border-purple-500/30 !text-white !rounded-tr-none neon-border-purple hover:!border-purple-500/50 hover:!shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                : "!bg-[#2e1a2e]/60 !border !border-rose-500/30 !text-white !rounded-tl-none neon-border-rose hover:!border-rose-500/50 hover:!shadow-[0_0_20px_rgba(244,63,94,0.4)]"
            }
            ${isRevealed && !isMySide ? "!border-amber-500/50 !bg-amber-500/5" : ""}
            group-hover:-translate-y-0.5
          `}
        />
      </div>
    </div>
  );
}

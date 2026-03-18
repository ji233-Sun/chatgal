"use client";

/**
 * SessionHistoryCard - 历史会话卡片
 * 展示车厢图标、状态徽章、进度条、最后消息预览
 */

import PixelIcon from "../ui/PixelIcon";
import {
  CARRIAGE_NAMES,
  CARRIAGE_COLORS,
  CARRIAGE_ICONS,
} from "@/app/lib/carriage";

export interface SessionCardData {
  id: string;
  state: string;
  carriageType: string;
  currentTurn: number;
  maxTurns: number;
  resonanceScore: number | null;
  createdAt: string;
  updatedAt: string;
  isPhantom: boolean;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  topicTitle?: string | null;
}

interface SessionHistoryCardProps {
  session: SessionCardData;
  onClick: (id: string) => void;
  onAbandon?: (id: string) => void;
}

/** 状态徽章配置 */
const STATE_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  REVEALED: {
    label: "SYNCED",
    className:
      "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.3)]",
  },
  FADED_OUT: {
    label: "FADED",
    className: "bg-white/5 text-white/30 border-white/10",
  },
  ANONYMOUS: {
    label: "ACTIVE",
    className:
      "bg-purple-500/15 text-purple-400 border-purple-500/30 animate-pulse",
  },
  ABANDONED: {
    label: "ABANDONED",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
}

export default function SessionHistoryCard({
  session,
  onClick,
  onAbandon,
}: SessionHistoryCardProps) {
  const color = CARRIAGE_COLORS[session.carriageType] || "#7C3AED";
  const name = CARRIAGE_NAMES[session.carriageType] || "UNKNOWN_CAR";
  const icon = CARRIAGE_ICONS[session.carriageType] || "icon-train";
  const badge = STATE_BADGES[session.state] || STATE_BADGES.ANONYMOUS;
  const isActive = session.state === "ANONYMOUS";
  const progress = session.maxTurns
    ? (session.currentTurn / session.maxTurns) * 100
    : 0;

  const handleAbandonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAbandon) onAbandon(session.id);
  };

  return (
    <div
      onClick={() => onClick(session.id)}
      className={`
        w-full text-left rounded-lg border p-4 transition-all duration-300 cursor-pointer
        bg-[#0F0F23]/60 backdrop-blur-sm
        hover:scale-[1.02] hover:bg-[#0F0F23]/80
        focus:outline-none focus:ring-1 focus:ring-purple-500/50
        ${
          isActive
            ? "border-purple-500/50 shadow-[0_0_12px_rgba(124,58,237,0.15)] hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]"
            : "border-white/5 hover:border-white/10"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* 左侧：车厢图标 */}
        <div
          className="shrink-0 p-2 rounded-md border border-white/5"
          style={{ backgroundColor: `${color}10` }}
        >
          <PixelIcon name={icon} size={20} color={color} />
        </div>

        {/* 中部：信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-pixel text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ color }}
            >
              {name}
            </span>
            {/* 状态徽章 */}
            <span
              className={`font-pixel text-[8px] px-1.5 py-0.5 rounded-sm border ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          {/* 时间 */}
          <div className="font-pixel text-[8px] text-white/20 mb-2">
            {formatRelativeTime(session.lastMessageAt || session.updatedAt)}
          </div>

          {/* 知乎话题标题 */}
          {session.carriageType === "zhihu_hot" && session.topicTitle && (
            <p className="font-retro text-[11px] text-[#0084FF]/70 truncate mb-1">
              {session.topicTitle}
            </p>
          )}

          {/* 消息预览 */}
          {session.lastMessagePreview && (
            <p className="font-retro text-xs text-white/30 truncate leading-relaxed">
              {session.lastMessagePreview}
            </p>
          )}
        </div>

        {/* 右侧：进度/分数 */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          {session.state === "REVEALED" && session.resonanceScore != null && (
            <div className="flex items-center gap-1">
              <PixelIcon name="icon-sparkle" size={10} color="#f59e0b" />
              <span className="font-pixel text-[10px] text-amber-400 font-bold">
                {(session.resonanceScore * 100).toFixed(0)}%
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    session.state === "REVEALED"
                      ? "linear-gradient(to right, #f59e0b, #ef4444)"
                      : `linear-gradient(to right, ${color}, #7c3aed)`,
                }}
              />
            </div>
            <span className="font-pixel text-[8px] text-white/30 tabular-nums">
              {session.currentTurn}/{session.maxTurns}
            </span>
          </div>
        </div>
      </div>

      {/* 进行中卡片底部提示 */}
      {isActive && session.currentTurn > 0 && (
        <div className="mt-3 pt-2 border-t border-purple-500/10 flex items-center justify-between">
          <button
            onClick={handleAbandonClick}
            className="font-pixel text-[10px] text-white/30 hover:text-rose-500 transition-colors"
          >
            放弃
          </button>
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[10px] text-purple-400">
              TAP_TO_CONTINUE
            </span>
            <PixelIcon
              name="icon-arrow-right"
              size={10}
              color="#a855f7"
            />
          </div>
        </div>
      )}
    </div>
  );
}

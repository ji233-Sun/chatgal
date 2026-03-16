"use client";

/**
 * RevelationEffect - 揭面特效覆盖层
 * 共鸣达成时播放的全屏动画
 *
 * 使用 ArcadeUI Avatar + Card + Badge
 * 保留 4 阶段动画核心逻辑（glow → crack → reveal → done）
 *
 * 幻影模式下显示特殊文案（没有真实对手）
 * 真实匹配下显示对方头像和 SecondMe 链接
 */

import { useEffect, useState, useCallback } from "react";
import { Avatar, Card, Badge } from "arcadeui";
import PixelIcon from "../ui/PixelIcon";

interface RevelationEffectProps {
  active: boolean;
  isPhantom: boolean;
  stranger: {
    name?: string | null;
    avatarUrl?: string | null;
    route?: string | null;
  } | null;
  resonanceScore: number | null;
  onComplete: () => void;
}

export default function RevelationEffect({
  active,
  isPhantom,
  stranger,
  resonanceScore,
  onComplete,
}: RevelationEffectProps) {
  const [phase, setPhase] = useState<"idle" | "glow" | "crack" | "reveal" | "done">("idle");

  const handleDismiss = useCallback(() => {
    if (phase === "done") {
      setPhase("idle");
      onComplete();
    }
  }, [phase, onComplete]);

  useEffect(() => {
    if (!active) return;

    setPhase("glow");
    const t1 = setTimeout(() => setPhase("crack"), 1500);
    const t2 = setTimeout(() => setPhase("reveal"), 3000);
    const t3 = setTimeout(() => setPhase("done"), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  if (phase === "idle") return null;

  return (
    <div
      onClick={handleDismiss}
      className={`
        fixed inset-0 z-50 flex items-center justify-center cursor-pointer
        transition-all duration-1000
        ${phase === "glow" ? "bg-violet-900/60 backdrop-blur-sm" : ""}
        ${phase === "crack" ? "bg-violet-900/80 backdrop-blur-md" : ""}
        ${phase === "reveal" || phase === "done" ? "bg-[#0A0E27]/95 backdrop-blur-lg" : ""}
      `}
    >
      {/* 粒子效果 - 像素方块 */}
      {(phase === "crack" || phase === "reveal") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-sm animate-[float-up_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${60 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 共鸣光环 - 像素风格 */}
      {phase === "glow" && (
        <div className="relative">
          <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-violet-500/50 to-cyan-500/50 border-4 border-violet-400/50 animate-[glow-pulse_1s_ease-in-out_infinite] flex items-center justify-center shadow-pixel-lg">
            <PixelIcon name="icon-mask" size={48} color="#ffd700" />
          </div>
          <p className="font-pixel text-white/60 text-sm text-center mt-6 animate-pulse">
            检测到深度共鸣...
          </p>
        </div>
      )}

      {/* 面具碎裂 - 像素风格 */}
      {phase === "crack" && (
        <div className="relative">
          <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 border-4 border-violet-400 flex items-center justify-center animate-[mask-crack_1.5s_ease-out_forwards] shadow-pixel-lg">
            <PixelIcon name="icon-mask" size={48} color="#ffffff" />
          </div>
          <p className="font-pixel text-white/80 text-sm text-center mt-6">
            身份面纱正在揭开...
          </p>
        </div>
      )}

      {/* 揭面结果 */}
      {(phase === "reveal" || phase === "done") && (
        <div className="flex flex-col items-center gap-6 animate-[fade-in_1s_ease-out] px-4">
          <div className="font-pixel text-amber-400 text-sm font-bold tracking-wider mb-2 flex items-center gap-2">
            <PixelIcon name="icon-sparkle" size={16} color="#ffd700" />
            共鸣达成
            <PixelIcon name="icon-sparkle" size={16} color="#ffd700" />
          </div>

          {isPhantom ? (
            <>
              {/* 幻影模式 — 没有真实对手 */}
              <Avatar
                fallback="✨"
                size="xl"
                shape="square"
                className="!bg-gradient-to-br !from-amber-400/20 !to-violet-500/20 !border-4 !border-amber-400/30"
              />
              <div className="text-center max-w-xs">
                <h3 className="font-pixel text-lg font-bold text-white mb-2">
                  你的 Agent 展现了真实的自己
                </h3>
                <p className="font-retro text-sm text-white/40 leading-relaxed">
                  这是一次与星海幻影的对话演练。
                  当另一位真实旅客登上列车时，
                  你的 Agent 将以同样的真诚与他们相遇。
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 真实匹配 — ArcadeUI Avatar 显示对方信息 */}
              <Avatar
                src={stranger?.avatarUrl || undefined}
                fallback={(stranger?.name || "旅").charAt(0)}
                alt={stranger?.name || "旅客"}
                size="xl"
                shape="square"
                className="!border-4 !border-amber-400/50 animate-[avatar-reveal_1.5s_ease-out]"
              />

              <div className="text-center">
                <h3 className="font-pixel text-xl font-bold text-white">
                  {stranger?.name || "旅客"}
                </h3>
                {stranger?.route && (
                  <a
                    href={`https://second.me/${stranger.route}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-pixel text-sm text-amber-400/80 hover:text-amber-400 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    SecondMe Profile
                    <PixelIcon name="icon-arrow-right" size={12} color="currentColor" />
                  </a>
                )}
              </div>
            </>
          )}

          {/* 共鸣指数 — ArcadeUI Card + Badge */}
          {resonanceScore !== null && (
            <Card
              variant="outlined"
              className="!mt-2 !bg-white/5 !border-white/10"
            >
              <div className="px-6 py-3 text-center">
                <div className="font-pixel text-xs text-white/40 mb-1">共鸣指数</div>
                <div className="font-pixel text-2xl font-bold text-center text-amber-400 flex items-center justify-center gap-2">
                  <PixelIcon name="icon-star" size={20} color="#ffd700" />
                  <Badge variant="warning" size="lg">
                    {(resonanceScore * 100).toFixed(1)}%
                  </Badge>
                  <PixelIcon name="icon-star" size={20} color="#ffd700" />
                </div>
              </div>
            </Card>
          )}

          {phase === "done" && (
            <p className="font-pixel text-white/40 text-xs mt-4 animate-pulse">
              点击任意位置关闭
            </p>
          )}
        </div>
      )}
    </div>
  );
}

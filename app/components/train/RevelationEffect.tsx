/**
 * RevelationEffect.tsx - 赛博朋克揭示层（完全重构版）
 *
 * 设计理念：
 * - 阶段一：暴力破解与信息流（扫描线 + 进度条 + ASCII 乱码）
 * - 阶段二：数字故障与视觉冲击（RGB 分离 + 白屏闪烁 + 画面撕裂）
 * - 阶段三：机密档案打印输出（打字机效果 + 血红印章）
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Avatar, Badge } from "arcadeui";
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
  const [phase, setPhase] = useState<"idle" | "hacking" | "glitch" | "printing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showStamp, setShowStamp] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // 🎬 阶段一：暴力破解与信息流
  useEffect(() => {
    if (!active || phase !== "idle") return;

    setPhase("hacking");

    // 进度条从 0% 滚动到 100%
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setPhase("glow"); // 触发阶段二
      }
      setProgress(Math.min(currentProgress, 100));
    }, 100);

    return () => clearInterval(progressInterval);
  }, [active]);

  // 🎬 阶段二：数字故障与视觉冲击
  useEffect(() => {
    if (phase !== "hacking") return;

    const timer = setTimeout(() => {
      setPhase("glitch");
    }, 3000);

    return () => clearTimeout(timer);
  }, [phase]);

  // 💥 数字故障效果（Glitch + RGB 分离）
  useEffect(() => {
    if (phase !== "glow") return;

    // RGB 色彩分离 + 白屏闪烁
    const glitchTimer = setTimeout(() => {
      setPhase("printing");
    }, 500);

    return () => clearTimeout(glitchTimer);
  }, [phase]);

  // 🎬 阶段三：机密档案打印输出
  useEffect(() => {
    if (phase !== "printing") return;

    // 打字机效果：逐字显示
    const targetText = isPhantom
      ? ">> PHANTOM_DETECTED..._"
      : `>> SUBJECT: ${stranger?.name || "UNKNOWN"}_`;

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < targetText.length) {
        setCurrentText(prev => prev + targetText[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);

        // 显示共鸣度滚动动画
        let scoreProgress = 0;
        const scoreInterval = setInterval(() => {
          scoreProgress += 2.5;
          if (scoreProgress >= (resonanceScore || 0)) {
            scoreProgress = resonanceScore || 0;
            clearInterval(scoreInterval);

            // 显示血红色印章
            setTimeout(() => setShowStamp(true), 500);

            // 完成状态
            setTimeout(() => setPhase("done"), 1000);
          }
          setDisplayScore(scoreProgress);
        }, 20);
      }
    }, 50);

    return () => {
      clearInterval(typeInterval);
    };
  }, [phase, isPhantom, stranger, resonanceScore]);

  // 🎨 渲染扫描线效果
  useEffect(() => {
    if (phase === "hacking" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let scanlineY = 0;

      const animate = () => {
        if (phase !== "hacking") return;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制扫描线
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanlineY);
        ctx.lineTo(canvas.width, scanlineY);
        ctx.stroke();

        scanlineY += 8;
        if (scanlineY > canvas.height) {
          scanlineY = 0;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase]);

  // 🖱️ 点击关闭（仅在 done 阶段）
  const handleDismiss = useCallback(() => {
    if (phase === "done") {
      setPhase("idle");
      onComplete();
    }
  }, [phase, onComplete]);

  if (phase === "idle") return null;

  return (
    <div
      onClick={handleDismiss}
      className={`
        fixed inset-0 z-[2000] flex items-center justify-center cursor-pointer
        bg-[#0a0a0a] overflow-hidden
        ${phase === "glitch" ? "animate-glitch-flash" : ""}
      `}
      style={{ fontFamily: 'monospace' }}
    >
      {/* 📡 扫描线效果 */}
      {phase === "hacking" && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* 🎬 阶段一：暴力破解与信息流 */}
      {phase === "hacking" && (
        <div className="relative flex flex-col items-center gap-8">
          {/* 进度条 */}
          <div className="w-96 bg-black border-2 border-green-500 p-4">
            <div className="font-mono text-xs text-green-400 mb-2 tracking-widest">
              >> NEURAL_DECRYPT_IN_PROGRESS
            </div>
            <div className="font-mono text-lg text-white mb-4">
              [{Array.from({ length: Math.floor(progress / 5) }).fill('█').join('')}{Array.from({ length: 20 - Math.floor(progress / 5) }).fill('░').join('')}]
            </div>
            <div className="flex justify-between font-mono text-xs text-green-400">
              <span>{progress.toFixed(1)}%</span>
              <span className="animate-pulse">SCANNING...</span>
            </div>
          </div>

          {/* ASCII 乱码 */}
          <div className="font-mono text-sm text-green-500 animate-pulse text-center leading-relaxed max-w-md">
            {Array.from({ length: 8 }).map(() =>
              String.fromCharCode(0x0020 + Math.random() * 95)
            ).join('')}
          </div>
        </div>
      )}

      {/* 💥 阶段二：数字故障（RGB 分离 + 白屏闪烁） */}
      {phase === "glow" && (
        <div className="relative flex flex-col items-center">
          {/* RGB 色彩分离效果 */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-red-500 mix-blend-screen animate-glitch-shift" style={{ animationDelay: '0s' }} />
            <div className="absolute inset-0 bg-green-500 mix-blend-screen animate-glitch-shift" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-0 bg-blue-500 mix-blend-screen animate-glitch-shift" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-0 bg-white animate-glitch-flash" />
          </div>
          <div className="font-mono text-xs text-white animate-pulse">
            >> FIREWALL_BREACH_DETECTED
          </div>
        </div>
      )}

      {/* 🎬 阶段三：机密档案打印输出 */}
      {(phase === "printing" || phase === "done") && (
        <div className="relative w-full max-w-2xl p-8">
          {/* 档案卡片 */}
          <div className="relative bg-black border-4 border-white p-8"
               style={{
                 clipPath: 'polygon(0 0, 100% 0, calc(100% - 20px) 100%, 20px 100%, 0 100%)',
                 boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
               }}>
            {/* 噪点叠加 */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/feColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

            {/* 顶部标识 */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-white pb-4">
              <div className="font-mono text-xs text-green-500 tracking-[0.2em]">
                >> CLASSIFIED_DOSSIER
              </div>
              <div className="font-mono text-xs text-white/50">
                TOP_SECRET
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex gap-6 mb-6">
              {/* 头像 - 通缉令样式 */}
              <div className="flex-shrink-0">
                <div className="border-2 border-white p-2 bg-white">
                  {isPhantom ? (
                    <div className="w-20 h-20 flex items-center justify-center bg-black">
                      <span className="font-mono text-4xl text-green-500">?</span>
                    </div>
                  ) : (
                    <Avatar
                      src={stranger?.avatarUrl || undefined}
                      fallback={(stranger?.name || "U").charAt(0)}
                      size="xl"
                      shape="square"
                      className="!w-20 !h-20 !bg-white !text-black"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  )}
                </div>
              </div>

              {/* 信息打印 */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="font-mono text-[10px] text-white/30 uppercase">
                    >> SUBJECT_NAME
                  </div>
                  <div className="font-mono text-xl text-white tracking-wider"
                       style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                    {isPhantom ? "VOID_PHANTOM" : (stranger?.name || "UNKNOWN")}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-white/30 uppercase">
                    >> STATUS
                  </div>
                  <div className="font-mono text-sm text-green-500">
                    {isPhantom ? "[PHANTOM_SIGNAL]" : "[IDENTITY_CONFIRMED]"}
                  </div>
                </div>

                {/* 共鸣度滚动显示 */}
                <div>
                  <div className="font-mono text-[10px] text-white/30 uppercase">
                    >> RESONANCE_INDEX
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-4xl font-bold text-red-500
                                 style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}>
                      {displayScore.toFixed(2)}%
                    </div>
                    <Badge variant="success" size="sm"
                          className="!bg-red-500/10 !text-red-500 !border-red-500/20 !font-mono !text-[8px] !px-2">
                      SYNCHRONIZED
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 条形码装饰 */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-white/30">
              <div className="flex justify-center">
                <div className="h-8 bg-repeat-x"
                     style={{
                       backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'2\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'2\' height=\'20\' fill=\'%23000\'/%3E%3C/svg%3E")',
                       width: '200px',
                       backgroundSize: '4px 20px'
                     }} />
              </div>
            </div>

            {/* 血红色印章 */}
            {showStamp && (
              <div className="absolute bottom-8 right-8 transform -rotate-12 border-4 border-red-600 px-4 py-2"
                   style={{
                     boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)',
                     animation: 'stamp-in 0.3s ease-out'
                   }}>
                <div className="font-mono text-sm font-bold text-red-600 tracking-widest"
                     style={{ fontFamily: 'monospace' }}>
                  [ SYNCHRONIZED ]
                </div>
              </div>
            )}
          </div>

          {/* 底部提示 */}
          {phase === "done" && (
            <div className="text-center mt-8 space-y-4 animate-fade-in">
              <div className="font-mono text-xs text-white/30 uppercase tracking-widest">
                >> PRESS_ANYWHERE_TO_DISMISS
              </div>
              <div className="w-1 h-12 bg-gradient-to-b from-green-500/40 to-transparent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

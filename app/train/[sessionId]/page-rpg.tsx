/**
 * /train/[sessionId] - RPG 风格观测页面（新版本）
 *
 * 核心变化：
 * - 移除 ConversationObserver（对话气泡界面）
 * - 使用 TrainScene（RPG 静态场景）
 * - 纯视觉状态展示 + 点击气泡跳转
 */

"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "arcadeui";
import TrainScene from "@/app/components/train/TrainScene";
import PixelIcon from "@/app/components/ui/PixelIcon";
import { useEffect, useState } from "react";

interface SessionData {
  id: string;
  state: string;
  carriageType: string;
  currentTurn: number;
  maxTurns: number;
  resonanceScore: number | null;
}

export default function ObservationPageRPG() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    // 加载会话数据（用于顶部状态栏）
    async function loadSession() {
      try {
        const res = await fetch(`/api/conversation/${sessionId}`);
        const result = await res.json();
        if (result.code === 0) {
          setSession(result.data.session);
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSession();
  }, [sessionId]);

  return (
    <div className="h-screen flex flex-col bg-[#0F0F23] relative overflow-hidden">
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="crt-scanline" />

      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#0F0F23]/80 backdrop-blur-md relative z-[1001]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/train")}
          className="!bg-transparent !border-transparent !text-white/40 hover:!text-white/80 !font-pixel !text-[10px] !p-0 transition-colors"
        >
          <PixelIcon name="icon-arrow-left" size={12} color="currentColor" className="mr-2" />
          TERMINAL_EXIT
        </Button>
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-white/30 tracking-widest uppercase glitch-text">
            Akasha Roaming Express
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
        </div>
        {session && (
          <div className="font-pixel text-[9px] text-white/20">
            TURN {session.currentTurn}/{session.maxTurns}
          </div>
        )}
      </header>

      {/* RPG 场景区域 */}
      <div className="flex-1 overflow-hidden relative">
        <TrainScene />
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-[9px] text-white/20 bg-black/40 px-4 py-2 rounded z-50">
        点击 ! 气泡进入对话终端
      </div>
    </div>
  );
}

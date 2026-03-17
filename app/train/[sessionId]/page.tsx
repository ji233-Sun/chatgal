"use client";

/**
 * /train/[sessionId] - 观测页面
 * 用户在此静默观看 Agent 对话
 */

import { useParams, useRouter } from "next/navigation";
import { Button } from "arcadeui";
import ConversationObserver from "@/app/components/train/ConversationObserver";
import PixelIcon from "@/app/components/ui/PixelIcon";

export default function ObservationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

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
          <span className="font-pixel text-[10px] text-white/30 tracking-widest uppercase glitch-text">Akasha Roaming Express</span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
        </div>
      </header>

      {/* 观测区域 */}
      <div className="flex-1 overflow-hidden relative">
        <ConversationObserver sessionId={sessionId} />
      </div>
    </div>
  );
}

/**
 * /terminal/[agentId] - 终端层路由页面
 *
 * 第三层：骇入层 (Terminal Route)
 * 显示 Agent 的详细对话内容
 * 复用现有的 ConversationObserver 逻辑
 */

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "arcadeui";
import ConversationObserver from "@/app/components/train/ConversationObserver";
import PixelIcon from "@/app/components/ui/PixelIcon";

export default function TerminalPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // 修复：使用 Next.js 的 useSearchParams
  const router = useRouter();
  const agentId = params.agentId as string;
  const sessionId = searchParams.get('sessionId') || '';

  // 🔍 调试日志
  console.log('🔍 Terminal 页面加载');
  console.log('  agentId:', agentId);
  console.log('  sessionId:', sessionId);
  console.log('  完整 URL:', typeof window !== 'undefined' ? window.location.href : 'server-side');

  return (
    <div className="h-screen flex flex-col bg-[#0F0F23] relative overflow-hidden">
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="crt-scanline" />

      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#0F0F23]/80 backdrop-blur-md relative z-[1001]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/train')}
          className="!bg-transparent !border-transparent !text-white/40 hover:!text-white/80 !font-pixel !text-[10px] !p-0 transition-colors"
        >
          <PixelIcon name="icon-arrow-left" size={12} color="currentColor" className="mr-2" />
          BACK_TO_OBSERVATION
        </Button>

        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-white/30 tracking-widest uppercase glitch-text">
            Terminal Access
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
        </div>

        <div className="font-pixel text-[9px] text-white/20">
          AGENT: {agentId}
        </div>
      </header>

      {/* 终端内容区域 - 复用 ConversationObserver */}
      <div className="flex-1 overflow-hidden relative">
        <ConversationObserver sessionId={sessionId} />
      </div>

      {/* 底部状态栏 */}
      <div className="px-6 py-4 border-t border-white/5 bg-[#0F0F23]/90 backdrop-blur-md relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_currentColor]" />
            <div className="flex flex-col">
              <span className="font-pixel text-[10px] text-white/80 tracking-widest uppercase">
                TERMINAL_CONNECTED
              </span>
              <span className="font-pixel text-[8px] text-white/20 mt-0.5 uppercase">Secure Link Established</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="font-pixel text-[8px] text-white/10 uppercase mb-1">Encryption</span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1 h-3 rounded-sm bg-green-400/60" />
                ))}
              </div>
            </div>
            <PixelIcon name="icon-scope" size={20} color="#4ade80" className="animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

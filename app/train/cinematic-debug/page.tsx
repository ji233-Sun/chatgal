/**
 * /train/cinematic-debug - 调试测试入口
 */

"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import ScriptedCutsceneDebug from "@/app/components/train/ScriptedCutsceneDebug";

export default function CinematicDebugPage() {
  const router = useRouter();
  const testSessionId = `debug-conversation-${useId().replace(/:/g, "")}`;

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* 🎬 调试版过场动画 */}
      <ScriptedCutsceneDebug
        sessionId={testSessionId}
        conversationId={testSessionId}
      />

      {/* 🎬 退出按钮 */}
      <button
        onClick={() => router.push("/train")}
        className="absolute top-4 left-4 z-50 font-mono text-xs text-white/30 hover:text-white/60 bg-black/20 px-3 py-1 border border-white/10 transition-colors"
      >
        ← EXIT
      </button>

      {/* 🎬 说明面板 */}
      <div className="absolute top-4 right-4 font-mono text-xs text-white/50 text-right">
        <div className="mb-2">🎬 调试模式</div>
        <div>红色方块 = Agent A</div>
        <div>蓝色方块 = Agent B</div>
        <div>绿色十字 = 中心点</div>
        <div>网格 = 100px 间距</div>
      </div>
    </div>
  );
}

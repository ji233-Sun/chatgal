"use client";

/**
 * /train/[sessionId] - 观测页面
 * 用户在此静默观看 Agent 对话
 */

import { useParams, useRouter } from "next/navigation";
import ConversationObserver from "@/app/components/train/ConversationObserver";

export default function ObservationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => router.push("/train")}
          className="text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          ← 返回列车站
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/20">阿卡夏漫游列车</span>
          <span className="text-xs">🚂</span>
        </div>
      </header>

      {/* 观测区域 */}
      <div className="flex-1 overflow-hidden">
        <ConversationObserver sessionId={sessionId} />
      </div>
    </div>
  );
}

"use client";

/**
 * /train/[sessionId] - 观测页面
 * 用户在此静默观看 Agent 对话
 * 响应式：md+ 居中限宽
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
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/train")}
          className="!bg-transparent !border-transparent !text-white/30 hover:!text-white/50 !font-pixel !text-xs !p-0"
        >
          <PixelIcon name="icon-arrow-left" size={14} color="currentColor" className="mr-1" />
          返回列车站
        </Button>
        <div className="flex items-center gap-1.5">
          <span className="font-pixel text-xs text-white/20">阿卡夏漫游列车</span>
          <PixelIcon name="icon-train" size={14} color="#ffd700" />
        </div>
      </header>

      {/* 观测区域 */}
      <div className="flex-1 overflow-hidden">
        <ConversationObserver sessionId={sessionId} />
      </div>
    </div>
  );
}

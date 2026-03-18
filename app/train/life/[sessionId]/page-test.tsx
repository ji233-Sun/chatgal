/**
 * /train/life/[sessionId] - 测试版本
 */

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "arcadeui";
import LifeSceneSimple from "@/app/components/train/LifeSceneSimple";
import PixelIcon from "@/app/components/ui/PixelIcon";
import { useRouter } from "next/navigation";

export default function LifeLayerPageTest() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const carriageType = searchParams.get('carriage') || 'unknown';

  return (
    <div className="h-screen flex flex-col bg-[#0F0F23] relative overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#0F0F23]/80 backdrop-blur-md relative z-[1001]">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/train")}
          className="!bg-transparent !border-transparent !text-white/40 hover:!text-white/80 !font-pixel !text-[10px] !p-0 transition-colors"
        >
          <PixelIcon name="icon-arrow-left" size={12} color="currentColor" className="mr-2" />
          EXIT_STATION
        </Button>

        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-white/30 tracking-widest uppercase">
            TEST_MODE
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </header>

      {/* 生活层场景 */}
      <div className="flex-1 overflow-hidden relative">
        <LifeSceneSimple sessionId={sessionId} carriageType={carriageType} />
      </div>
    </div>
  );
}

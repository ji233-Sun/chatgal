"use client";

/**
 * /train - 列车站大厅
 * 选择车厢 → 启程
 * 像素风格设计
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import CarriageSelector from "@/app/components/train/CarriageSelector";
import PixelIcon from "@/app/components/ui/PixelIcon";

export default function TrainStationPage() {
  const router = useRouter();
  const [selectedCarriage, setSelectedCarriage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    if (!selectedCarriage) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/train/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carriageType: selectedCarriage }),
      });

      const result = await res.json();
      if (result.code === 0) {
        router.push(`/train/${result.data.sessionId}`);
      } else {
        setError(result.message || "启程失败");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0E27] to-[#131836]">
      {/* 星星背景层 */}
      <div className="stars-layer fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b-2 border-white/5">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-pixel text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          <PixelIcon name="icon-arrow-left" size={16} color="currentColor" />
          返回
        </a>
        <div className="flex items-center gap-3">
          <PixelIcon name="icon-bell" size={20} color="currentColor" className="text-white/20 hover:text-white/40 transition-colors cursor-pointer" />
          <PixelIcon name="icon-music" size={20} color="currentColor" className="text-white/20 hover:text-white/40 transition-colors cursor-pointer" />
          <PixelIcon name="icon-gear" size={20} color="currentColor" className="text-white/20 hover:text-white/40 transition-colors cursor-pointer" />
        </div>
      </header>

      {/* Main */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* 标题 */}
        <div className="text-center mb-12">
          <PixelIcon name="icon-train" size={64} color="#ffd700" className="mb-6 animate-[bounce_2s_ease-in-out_infinite]" />
          <h1 className="font-pixel text-2xl font-bold text-white/90 mb-3">
            阿卡夏漫游列车
          </h1>
          <p className="font-retro text-sm text-white/30 max-w-sm leading-relaxed">
            在数据的星海中，你的 AI 分身将代替你
            <br />
            与另一位神秘旅客展开一场未知的对话
          </p>
        </div>

        {/* 车厢选择 */}
        <CarriageSelector
          selected={selectedCarriage}
          onSelect={setSelectedCarriage}
          onStart={handleStart}
          loading={loading}
        />

        {error && (
          <p className="mt-4 font-pixel text-sm text-red-400/80">⚠ {error}</p>
        )}

        {/* 提示 */}
        <div className="mt-12 text-center space-y-2 font-pixel text-xs text-white/15">
          <p>你无法干预对话 — 你是高高在上的列车长</p>
          <p>只有灵魂共鸣时，面纱才会揭开</p>
        </div>
      </main>
    </div>
  );
}

"use client";

/**
 * /train - 列车站大厅
 * 选择车厢 → 启程
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import CarriageSelector from "@/app/components/train/CarriageSelector";

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <a href="/" className="text-sm text-white/30 hover:text-white/50 transition-colors">
          ← 返回
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🚂</div>
          <h1 className="text-2xl font-bold text-white/90 mb-2">
            阿卡夏漫游列车
          </h1>
          <p className="text-sm text-white/30 max-w-sm leading-relaxed">
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
          <p className="mt-4 text-sm text-red-400/80">{error}</p>
        )}

        {/* 提示 */}
        <div className="mt-12 text-center space-y-2 text-xs text-white/15">
          <p>你无法干预对话 — 你是高高在上的列车长</p>
          <p>只有灵魂共鸣时，面纱才会揭开</p>
        </div>
      </main>
    </div>
  );
}

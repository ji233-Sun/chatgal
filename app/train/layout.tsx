/**
 * /train 列车布局 - 深色宇宙主题
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "阿卡夏漫游列车",
  description: "在数据的星海中，寻找与你灵魂共振的人",
};

export default function TrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="train-theme min-h-screen bg-[#0A0E27] text-white relative overflow-hidden">
      {/* 星空背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* 星星层 */}
        <div className="stars-layer" />
        {/* 渐变氛围 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />
      </div>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

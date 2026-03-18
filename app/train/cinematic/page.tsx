/**
 * /train/cinematic - 过场动画测试入口
 */

"use client";

import { useRouter } from "next/navigation";

export default function CinematicIndexPage() {
  const router = useRouter();

  const testSessionId = "test-conversation-" + Date.now();

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="font-pixel text-2xl text-green-400">
          🎬 脚本化过场动画测试
        </h1>

        <button
          onClick={() => router.push(`/train/cinematic/${testSessionId}`)}
          className="font-pixel text-sm text-white bg-green-600 hover:bg-green-500 px-8 py-4 border-2 border-green-400 transition-colors"
        >
          ▶️ 播放过场动画
        </button>

        <div className="font-pixel text-xs text-white/30 space-y-2">
          <p>时间线：</p>
          <p>0秒 - 两 Agent 从两侧相向移动</p>
          <p>3秒 - 中间相遇，停止</p>
          <p>3.5秒 - 弹出 ! 气泡</p>
          <p>点击 ! → 跳转到终端页面</p>
        </div>

        <button
          onClick={() => router.push("/train")}
          className="font-pixel text-xs text-white/30 hover:text-white/60"
        >
          ← 返回训练场选择
        </button>
      </div>
    </div>
  );
}

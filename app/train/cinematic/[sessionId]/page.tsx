/**
 * /train/cinematic/[sessionId] - 脚本化过场动画页面
 */

"use client";

import { useParams } from "next/navigation";
import ScriptedCutscene from "@/app/components/train/ScriptedCutscene";
import { useRouter } from "next/navigation";

export default function CinematicPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const conversationId = sessionId; // 使用 sessionId 作为 conversationId

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* 🎬 脚本化过场动画 */}
      <ScriptedCutscene sessionId={sessionId} conversationId={conversationId} />

      {/* 🎬 极简退出按钮 */}
      <button
        onClick={() => router.push("/train")}
        className="absolute top-4 left-4 z-50 font-pixel text-[10px] text-white/30 hover:text-white/60 bg-black/20 px-3 py-1 border border-white/10 transition-colors"
      >
        ← EXIT
      </button>
    </div>
  );
}

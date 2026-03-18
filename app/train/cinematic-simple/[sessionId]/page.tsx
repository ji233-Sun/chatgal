/**
 * /train/cinematic-simple/[sessionId] - 极简测试版本
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SimpleCinematicPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [agentAPos, setAgentAPos] = useState<string>('18%');
  const [agentBPos, setAgentBPos] = useState<string>('90%');
  const [shouldMove, setShouldMove] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    console.log('🚀 极简版本启动');

    const timer0 = setTimeout(() => {
      console.log('✅ 启用 transition');
      setShouldMove(true);
    }, 100);

    const timer1 = setTimeout(() => {
      console.log('✅ 开始移动');
      setAgentAPos('calc(50% - 40px)');
      setAgentBPos('calc(50% + 40px)');
    }, 200);

    const timer2 = setTimeout(() => {
      console.log('✅ 显示气泡');
      setShowBubble(true);
    }, 3500);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/train_interior_bullet.png')",
          imageRendering: 'pixelated',
        }}
      />

      {/* 中心线 */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-green-500/50" style={{ left: '50%' }} />

      {/* Agent A - 红色方块 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: agentAPos,
          top: '65%',
          transform: 'translate(-50%, -50%)',
          transition: shouldMove ? 'left 3s linear' : 'none',
          width: '80px',
          height: '80px',
        }}
      >
        <div className="w-full h-full bg-red-500 border-4 border-red-300 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
      </div>

      {/* Agent B - 蓝色方块 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: agentBPos,
          top: '65%',
          transform: 'translate(-50%, -50%)',
          transition: shouldMove ? 'left 3s linear' : 'none',
          width: '80px',
          height: '80px',
        }}
      >
        <div className="w-full h-full bg-blue-500 border-4 border-blue-300 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
      </div>

      {/* 气泡 */}
      {showBubble && (
        <div
          className="absolute cursor-pointer animate-bounce"
          style={{
            left: '50%',
            top: 'calc(65% - 100px)',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => {
            console.log('🚀 点击气泡');
            alert('点击气泡！将跳转到 /terminal/' + sessionId);
          }}
        >
          <div className="flex items-center justify-center bg-yellow-400 border-4 border-yellow-200 rounded-full w-16 h-16">
            <span className="font-black text-4xl text-black">!</span>
          </div>
        </div>
      )}

      {/* 调试信息 */}
      <div className="absolute top-4 right-4 bg-black/80 text-white font-mono text-xs p-4 rounded">
        <div>Phase: {shouldMove ? 'Moving' : 'Idle'}</div>
        <div>Agent A: {agentAPos}</div>
        <div>Agent B: {agentBPos}</div>
        <div>Bubble: {showBubble ? 'Yes' : 'No'}</div>
      </div>

      {/* 退出按钮 */}
      <button
        onClick={() => router.push("/train")}
        className="absolute top-4 left-4 font-mono text-xs text-white bg-black/50 px-3 py-1"
      >
        ← EXIT
      </button>
    </div>
  );
}

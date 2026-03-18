/**
 * ScriptedCutsceneDebug.tsx - 调试版本（CSS calc 版本）
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScriptedCutsceneDebugProps {
  sessionId: string;
  conversationId: string;
}

export default function ScriptedCutsceneDebug({ sessionId, conversationId }: ScriptedCutsceneDebugProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<'moving' | 'met' | 'bubble'>('moving');
  const [showBubble, setShowBubble] = useState(false);

  // 🎯 Agent 位置（使用 CSS calc 字符串）
  const [agentAPos, setAgentAPos] = useState<string>('18%'); // 初始：左侧 18%
  const [agentBPos, setAgentBPos] = useState<string>('90%'); // 初始：右侧 90%
  const [shouldMove, setShouldMove] = useState(false);

  // 🎬 时间线脚本
  useEffect(() => {
    console.log('⏱️ 设置时间线...');

    // 第 0.1 秒：启用 transition
    const timer0 = setTimeout(() => {
      console.log('🚀 启用 transition');
      setShouldMove(true);
    }, 100);

    // 第 0.2 秒：开始移动到中心
    const timer1 = setTimeout(() => {
      console.log('🚀 开始移动到中心：calc(50% ± 40px)');
      setAgentAPos('calc(50% - 40px)'); // 中心偏左
      setAgentBPos('calc(50% + 40px)'); // 中心偏右
    }, 200);

    // 第 3 秒：相遇
    const timer3 = setTimeout(() => {
      console.log('✅ 相遇');
      setPhase('met');
    }, 3200);

    // 第 3.5 秒：弹出气泡
    const timer35 = setTimeout(() => {
      console.log('💬 弹出气泡');
      setPhase('bubble');
      setShowBubble(true);
    }, 3700);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer3);
      clearTimeout(timer35);
    };
  }, []);

  // 🖱️ 点击气泡交互
  const handleBubbleClick = () => {
    console.log('🚀 跳转到终端:', conversationId);
    router.push(`/terminal/${conversationId}`);
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* 背景网格（便于观察位置） */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* 中心线标记（完全响应式） */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-green-500/50" style={{ left: '50%' }} />
      <div className="absolute left-0 right-0 h-0.5 bg-green-500/50" style={{ top: '65%' }} />

      {/* 🎬 Agent A - 红色方块 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: agentAPos,
          top: '65%',
          transform: 'translate(-50%, -50%)',
          transition: shouldMove && phase === 'moving' ? 'left 3s linear' : 'none',
          width: '80px',
          height: '80px',
        }}
      >
        <div className="w-full h-full bg-red-500 border-4 border-red-300 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-400 font-mono text-xs">
          {agentAPos}
        </div>
      </div>

      {/* 🎬 Agent B - 蓝色方块 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: agentBPos,
          top: '65%',
          transform: 'translate(-50%, -50%)',
          transition: shouldMove && phase === 'moving' ? 'left 3s linear' : 'none',
          width: '80px',
          height: '80px',
        }}
      >
        <div className="w-full h-full bg-blue-500 border-4 border-blue-300 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-400 font-mono text-xs">
          {agentBPos}
        </div>
      </div>

      {/* 🎬 ! 气泡（响应式） */}
      {showBubble && (
        <div
          className="absolute cursor-pointer animate-bounce"
          style={{
            left: '50%',
            top: 'calc(65% - 100px)',
            transform: 'translate(-50%, -50%)',
            animationDuration: '0.5s',
          }}
          onClick={handleBubbleClick}
        >
          <div className="flex items-center justify-center bg-yellow-400 border-4 border-yellow-200 rounded-full w-16 h-16">
            <span className="font-black text-4xl text-black">!</span>
          </div>
        </div>
      )}

      {/* 🎬 底部提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-sm text-white/50">
        {phase === 'moving' && '正在靠近...'}
        {phase === 'met' && '相遇！'}
        {phase === 'bubble' && '点击 ! 开始对话'}
      </div>

      {/* 调试信息面板 */}
      <div className="absolute top-4 right-4 bg-black/80 text-white font-mono text-xs p-4 rounded border border-white/20">
        <div className="font-bold mb-2">调试信息（CSS calc 版本）</div>
        <div>Phase: {phase}</div>
        <div>Should Move: {shouldMove ? 'Yes' : 'No'}</div>
        <div>Agent A: {agentAPos}</div>
        <div>Agent B: {agentBPos}</div>
        <div className="bg-green-900/50 px-2 py-1 my-1">
          中心线: left: 50%
        </div>
        <div className="bg-blue-900/50 px-2 py-1 my-1">
          目标位置: calc(50% ± 40px)
        </div>
      </div>
    </div>
  );
}

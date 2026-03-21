/**
 * ScriptedCutscene.tsx - 终极修复版
 * 修复：
 * 1. 使用 useRef 防止时间线被 React 重新渲染打断
 * 2. 删除错误的 CSS scaleX(-1) 翻转
 * 3. 加入走路交替动画逻辑
 */

"use client";

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TRAIN_LAYOUT } from '@/app/lib/train-layout';
import { loadNPCSpriteSheet, getFrame, SpriteSheet } from '@/app/lib/train-sprite-processor';

interface ScriptedCutsceneProps {
  sessionId: string;
  conversationId: string;
}

export default function ScriptedCutscene({ sessionId, conversationId }: ScriptedCutsceneProps) {
  const router = useRouter();
  const [spriteSheet, setSpriteSheet] = useState<SpriteSheet | null>(null);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [phase, setPhase] = useState<'moving' | 'met' | 'bubble'>('moving');
  const [showBubble, setShowBubble] = useState(false);

  const [agentAPos, setAgentAPos] = useState<string>('-10%'); // A 从屏幕左外侧进入
  const [agentBPos, setAgentBPos] = useState<string>('110%'); // B 从屏幕右外侧进入
  const [shouldMove, setShouldMove] = useState(false);

  // 关键修复：用 useRef 防止时间线被 React 重新渲染打断
  const timelineStarted = useRef(false);

  // 走路动画帧切换 (1 或 2)
  const [walkStep, setWalkStep] = useState<1 | 2>(1);

  useEffect(() => {
    async function loadSprites() {
      try {
        const sheet = await loadNPCSpriteSheet(TRAIN_LAYOUT.assets.sprite);
        setSpriteSheet(sheet);
        setSpritesLoaded(true);
      } catch (error) {
        console.error('❌ 精灵表加载失败:', error);
      }
    }
    loadSprites();
  }, []);

  // 🎬 时间线主控 (关键修复：依赖项只有 spritesLoaded)
  useEffect(() => {
    if (!spritesLoaded || timelineStarted.current) return;
    timelineStarted.current = true;

    // 1. 稍微延迟后开启 CSS 过渡并开始移动
    const timer1 = setTimeout(() => {
      console.log('🚀 开始移动到中心');
      setShouldMove(true);
      setAgentAPos('calc(50% - 40px)');
      setAgentBPos('calc(50% + 40px)');
    }, 500);

    // 2. 3.5秒后相遇 (3秒移动时间 + 0.5秒延迟)
    const timer2 = setTimeout(() => {
      console.log('✅ 相遇');
      setPhase('met');
    }, 3500);

    // 3. 4秒后弹出气泡
    const timer3 = setTimeout(() => {
      console.log('💬 弹出气泡');
      setPhase('bubble');
      setShowBubble(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [spritesLoaded]);

  // 🚶‍♂️ 腿部走路动画 (每 250ms 切换一次帧)
  useEffect(() => {
    if (phase !== 'moving') return;
    const interval = setInterval(() => {
      setWalkStep(prev => prev === 1 ? 2 : 1);
    }, 250);
    return () => clearInterval(interval);
  }, [phase]);

  const handleBubbleClick = () => {
    const targetUrl = `/terminal/${conversationId}?sessionId=${sessionId}`;
    console.log('🚀 跳转到终端');
    console.log('  conversationId:', conversationId);
    console.log('  sessionId:', sessionId);
    console.log('  目标 URL:', targetUrl);
    router.replace(targetUrl);
  };

  if (!spritesLoaded || !spriteSheet) {
    return (
      <div className="relative w-screen h-screen bg-black flex flex-col items-center justify-center">
        <div className="font-pixel text-xs text-green-400 animate-pulse">LOADING_ASSETS...</div>
      </div>
    );
  }

  // 获取方向和具体帧
  const frameA = getFrame(spriteSheet, phase === 'moving' ? 'right' : 'down');
  const frameB = getFrame(spriteSheet, phase === 'moving' ? 'left' : 'down');

  // 移动时交替使用 frame1 和 frame2，静止时只用 frame1
  const srcA = phase === 'moving' ? (walkStep === 1 ? frameA.frame1 : frameA.frame2) : frameA.frame1;
  const srcB = phase === 'moving' ? (walkStep === 1 ? frameB.frame1 : frameB.frame2) : frameB.frame1;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Image
        src={TRAIN_LAYOUT.assets.background}
        alt="train background"
        className="absolute inset-0 w-full h-full object-cover"
        unoptimized
        fill
        sizes="100vw"
        style={{ imageRendering: 'pixelated', zIndex: 0 }}
      />

      <Image
        src={srcA}
        alt="Agent A"
        className="absolute"
        unoptimized
        width={64}
        height={64}
        style={{
          top: '65%',
          left: agentAPos,
          transform: 'translate(-50%, -50%)', // 保持中心点
          transition: shouldMove && phase === 'moving' ? 'left 3s linear' : 'none',
          imageRendering: 'pixelated',
          width: '64px', height: '64px',
          zIndex: 10,
        }}
      />

      <Image
        src={srcB}
        alt="Agent B"
        className="absolute"
        unoptimized
        width={64}
        height={64}
        style={{
          top: '65%',
          left: agentBPos,
          transform: 'translate(-50%, -50%)', // 关键修复：删除了错误的 scaleX(-1)
          transition: shouldMove && phase === 'moving' ? 'left 3s linear' : 'none',
          imageRendering: 'pixelated',
          width: '64px', height: '64px',
          zIndex: 10,
        }}
      />

      {showBubble && (
        <div
          className="absolute cursor-pointer animate-bounce"
          style={{
            left: '50%', top: 'calc(65% - 100px)', transform: 'translate(-50%, -50%)',
            animationDuration: '0.6s', zIndex: 20,
          }}
          onClick={handleBubbleClick}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-black rounded-full" style={{ imageRendering: 'pixelated' }}>
            <span className="font-pixel text-3xl text-black">!</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-white/30" style={{ zIndex: 30 }}>
        {phase === 'moving' && '正在建立神经连接...'}
        {phase === 'met' && '协议握手完成'}
        {phase === 'bubble' && '点击 [!] 骇入对话流'}
      </div>
    </div>
  );
}

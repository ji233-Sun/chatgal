/**
 * AgentSprite.tsx - 完全重构版
 *
 * 核心特性：
 * 1. 使用去绿幕的精灵
 * 2. isPlayer 标记（绿色发光）
 * 3. 点击 ! 直接跳转
 */

"use client";

import { useRouter } from 'next/navigation';
import { SpriteSheet, getFrame } from '@/app/lib/sprite-processor';

export type Direction = 'down' | 'up' | 'left' | 'right';

export interface AgentState {
  id: string;
  name: string;
  isPlayer: boolean;
  status: 'idle' | 'walking' | 'conversing';
  position: { x: string; y: string };
  direction: Direction;
  targetPosition: { x: string; y: string } | null;
  conversingWith: string | null;
}

interface AgentSpriteProps {
  agent: AgentState;
  spriteSheet: SpriteSheet | null;
}

export default function AgentSprite({ agent, spriteSheet }: AgentSpriteProps) {
  const router = useRouter();

  if (!spriteSheet) return null;

  // 获取当前帧
  const currentFrame = getFrame(spriteSheet, agent.direction);

  // 🎯 玩家标记：绿色发光
  const playerGlow = agent.isPlayer
    ? 'drop-shadow(0px 0px 10px #00ff00)'
    : 'none';

  const showBubble = agent.status === 'conversing';

  // 🎯 点击气泡：直接跳转
  const handleBubbleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 点击气泡，跳转:', agent.id);
    router.push(`/terminal/${agent.id}`);
  };

  return (
    <div
      className="absolute"
      style={{
        left: agent.targetPosition?.x || agent.position.x,
        top: agent.targetPosition?.y || agent.position.y,
        transform: 'translate(-50%, -100%)',
        // 🎯 只有 walking 状态有过渡
        transition: agent.status === 'walking' ? 'left 3s linear, top 3s linear' : 'none',
      }}
    >
      {/* 对话气泡 */}
      {showBubble && (
        <button
          className="absolute -top-10 left-1/2 -translate-x-1/2 cursor-pointer z-[9999] bg-transparent border-0"
          style={{ minWidth: '32px', minHeight: '32px' }}
          onClick={handleBubbleClick}
        >
          <img
            src="/Train Example/assets/emotes/question.png"
            alt="对话中"
            className="w-6 h-6 animate-bounce"
            style={{ imageRendering: 'pixelated' }}
          />
        </button>
      )}

      {/* 人物精灵 */}
      <img
        src={currentFrame.dataUrl}
        alt={agent.name}
        style={{
          width: '32px',
          height: '32px',
          imageRendering: 'pixelated',
          filter: playerGlow,
        }}
      />
    </div>
  );
}

/**
 * TrainScene.tsx - RPG 列车场景主组件（原型）
 *
 * 架构设计：
 * - 单张静态背景图 + 绝对定位的精灵层
 * - 数据驱动渲染：agents 状态数组直接映射到 DOM
 * - 零物理引擎，零碰撞检测，纯坐标映射
 */

"use client";

import { useState, useEffect } from 'react';
import AgentSprite, { AgentState } from './AgentSprite';
import { loadNPCSpriteSheet, SpriteSheet } from '@/app/lib/sprite-processor';
import trainLayout from '@/app/lib/train-layout.json';

interface TrainLayout {
  backgroundPath: string;
  spritePath: string;
}

export default function TrainScene() {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [layout, setLayout] = useState<TrainLayout | null>(null);
  const [spriteSheet, setSpriteSheet] = useState<SpriteSheet | null>(null);

  useEffect(() => {
    setLayout(trainLayout as TrainLayout);

    // 加载精灵表
    async function loadSprites() {
      try {
        const sheet = await loadNPCSpriteSheet(trainLayout.spritePath);
        setSpriteSheet(sheet);
      } catch (error) {
        console.error('❌ 加载精灵失败:', error);
      }
    }
    loadSprites();

    // 初始化 Mock Agents
    const mockAgents: AgentState[] = [
      {
        id: 'agent_1',
        name: 'Stranger A',
        isPlayer: true,
        status: 'idle',
        position: { x: '20%', y: '60%' },
        direction: 'right',
        targetPosition: null,
        conversingWith: null,
      },
      {
        id: 'agent_2',
        name: 'Stranger B',
        isPlayer: false,
        status: 'conversing',
        position: { x: '40%', y: '60%' },
        direction: 'left',
        targetPosition: null,
        conversingWith: 'agent_1',
      },
      {
        id: 'agent_3',
        name: 'Stranger C',
        isPlayer: false,
        status: 'idle',
        position: { x: '60%', y: '60%' },
        direction: 'down',
        targetPosition: null,
        conversingWith: null,
      },
      {
        id: 'agent_4',
        name: 'Stranger D',
        isPlayer: false,
        status: 'idle',
        position: { x: '80%', y: '60%' },
        direction: 'left',
        targetPosition: null,
        conversingWith: null,
      },
    ];

    setAgents(mockAgents);

    // 模拟状态变化（演示用）
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: (Math.random() > 0.7 ? 'conversing' : 'idle') as AgentState['status'],
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!layout) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0F0F23]">
        <div className="font-pixel text-xs text-rose-500 animate-pulse">
          LOADING_TRAIN_LAYOUT...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#0F0F23] overflow-hidden">
      {/* 背景层 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${layout.backgroundPath}')`,
          imageRendering: 'pixelated',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* 精灵层 */}
      <div className="absolute inset-0">
        {agents.map((agent) => (
          <AgentSprite
            key={agent.id}
            agent={agent}
            spriteSheet={spriteSheet}
          />
        ))}
      </div>

      {/* 场景装饰层 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F0F23]/80 to-transparent pointer-events-none" />

      {/* 状态指示器 */}
      <div className="absolute top-4 right-4 font-pixel text-[10px] text-white/30 bg-black/30 px-3 py-1 rounded">
        ACTIVE_AGENTS: {agents.length}
      </div>
    </div>
  );
}

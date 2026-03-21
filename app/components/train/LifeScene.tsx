/**
 * LifeScene.tsx - 完全重构版
 *
 * 核心特性：
 * 1. 全屏背景，像素化
 * 2. 轴向移动（不斜向）
 * 3. 过道限制
 * 4. conversing 完全锁定
 */

"use client";

import { useState, useEffect, useCallback } from 'react';
import { loadNPCSpriteSheet, SpriteSheet } from '@/app/lib/sprite-processor';
import trainLayout from '@/app/lib/train-layout.json';
import AgentSprite, { AgentState, Direction } from './AgentSprite';

interface TrainLayout {
  backgroundPath: string;
  spritePath: string;
}

interface LifeSceneProps {
  sessionId: string;
  carriageType: string;
}

// 🎯 过道限制（根据 train_interior_bullet.png 调整）
const WALKABLE_ZONE = {
  minX: 30,
  maxX: 70,
  minY: 60,
  maxY: 80,
};

const MOVE_DURATION = 3000;
const STATIC_LAYOUT = trainLayout as TrainLayout;
const INITIAL_AGENTS: AgentState[] = [
  {
    id: 'agent_1',
    name: 'Player',
    isPlayer: true,
    status: 'idle',
    position: { x: '40%', y: '70%' },
    direction: 'down',
    targetPosition: null,
    conversingWith: null,
  },
  {
    id: 'agent_2',
    name: 'Stranger A',
    isPlayer: false,
    status: 'idle',
    position: { x: '50%', y: '70%' },
    direction: 'down',
    targetPosition: null,
    conversingWith: null,
  },
  {
    id: 'agent_3',
    name: 'Stranger B',
    isPlayer: false,
    status: 'idle',
    position: { x: '60%', y: '70%' },
    direction: 'down',
    targetPosition: null,
    conversingWith: null,
  },
];

export default function LifeScene({}: LifeSceneProps) {
  const [layout] = useState<TrainLayout>(STATIC_LAYOUT);
  const [spriteSheet, setSpriteSheet] = useState<SpriteSheet | null>(null);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);

  // 加载精灵表和初始化 Agents
  useEffect(() => {
    async function loadSprites() {
      try {
        const sheet = await loadNPCSpriteSheet(layout.spritePath);
        setSpriteSheet(sheet);
      } catch (error) {
        console.error('❌ 加载精灵失败:', error);
      }
    }

    loadSprites();
  }, [layout]);

  // 🎯 轴向移动
  const startWalking = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id !== agentId || agent.status !== 'idle') return agent;

        const currentX = parseFloat(agent.position.x);
        const currentY = parseFloat(agent.position.y);
        const axis = Math.random() > 0.5 ? 'x' : 'y';

        let targetX = currentX;
        let targetY = currentY;

        if (axis === 'x') {
          targetX = WALKABLE_ZONE.minX + Math.random() * (WALKABLE_ZONE.maxX - WALKABLE_ZONE.minX);
        } else {
          targetY = WALKABLE_ZONE.minY + Math.random() * (WALKABLE_ZONE.maxY - WALKABLE_ZONE.minY);
        }

        let direction: Direction = 'down';
        if (axis === 'x') {
          direction = targetX > currentX ? 'right' : 'left';
        } else {
          direction = targetY > currentY ? 'down' : 'up';
        }

        return {
          ...agent,
          status: 'walking' as const,
          direction,
          targetPosition: { x: `${targetX}%`, y: `${targetY}%` },
        };
      })
    );
  }, []);

  // 移动完成检测
  const handleMovementComplete = useCallback((agentId: string) => {
    setAgents((prev) => {
      const updatedAgents = prev.map((agent) => {
        if (agent.id !== agentId) return agent;
        return {
          ...agent,
          status: 'idle' as const,
          position: agent.targetPosition || agent.position,
          targetPosition: null,
        };
      });

      const currentAgent = updatedAgents.find((a) => a.id === agentId);
      if (!currentAgent) return updatedAgents;

      const nearbyAgent = updatedAgents.find((a) => {
        if (a.id === agentId || a.status === 'conversing') return false;
        const dx = Math.abs(parseFloat(currentAgent.position.x) - parseFloat(a.position.x));
        const dy = Math.abs(parseFloat(currentAgent.position.y) - parseFloat(a.position.y));
        return Math.sqrt(dx * dx + dy * dy) < 3;
      });

      if (nearbyAgent) {
        console.log(`💬 相遇: ${agentId} + ${nearbyAgent.id}`);
        return updatedAgents.map((a) => {
          if (a.id === agentId || a.id === nearbyAgent.id) {
            return { ...a, status: 'conversing' as const, targetPosition: null };
          }
          return a;
        });
      }

      return updatedAgents;
    });
  }, []);

  // 🎯 核心：状态机（完全锁定 conversing）
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    agents.forEach((agent) => {
      // 🎯 conversing 状态：完全静止，不参与任何逻辑
      if (agent.status === 'conversing') {
        return;
      }

      // idle 状态
      if (agent.status === 'idle') {
        const waitTime = Math.random() * 3000 + 2000;
        const timer = setTimeout(() => {
          startWalking(agent.id);
        }, waitTime);
        timers.push(timer);
      }

      // walking 状态
      if (agent.status === 'walking') {
        const timer = setTimeout(() => {
          handleMovementComplete(agent.id);
        }, MOVE_DURATION);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [agents, handleMovementComplete, startWalking]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 🎮 全屏背景 - 像素化 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${layout.backgroundPath}')`,
          imageRendering: 'pixelated',
          backgroundSize: 'cover',
        }}
      />

      {/* Agents 层 */}
      {agents.map((agent) => (
        <AgentSprite
          key={agent.id}
          agent={agent}
          spriteSheet={spriteSheet}
        />
      ))}

      {/* 底部提示 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-white/20 z-50">
        绿色光晕是你 | 等待相遇
      </div>
    </div>
  );
}

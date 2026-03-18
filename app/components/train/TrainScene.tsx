/**
 * TrainScene.tsx - RPG 列车场景主组件
 *
 * 架构设计（参考 Star-Office-UI）：
 * - 单张静态背景图 + 绝对定位的精灵层
 * - 数据驱动渲染：agents 状态数组直接映射到 DOM
 * - 零物理引擎，零碰撞检测，纯坐标映射
 */

"use client";

import { useState, useEffect } from 'react';
import AgentSprite, { AgentState } from './AgentSprite';
import trainLayout from '@/app/lib/train-layout.json';

interface Seat {
  id: string;
  x: string;
  y: string;
}

interface TrainLayout {
  background: string;
  backgroundHeight: number;
  seats: Seat[];
}

export default function TrainScene() {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [layout, setLayout] = useState<TrainLayout | null>(null);

  useEffect(() => {
    // 加载布局配置
    setLayout(trainLayout as TrainLayout);

    // 初始化 Mock Agents（实际应从 API 获取）
    const mockAgents: AgentState[] = [
      {
        id: 'agent_1',
        seatId: 'seat_1',
        status: 'idle',
        name: 'Stranger A',
      },
      {
        id: 'agent_2',
        seatId: 'seat_2',
        status: 'conversing', // 这个会显示 ! 气泡
        name: 'Stranger B',
      },
      {
        id: 'agent_3',
        seatId: 'seat_3',
        status: 'thinking',
        name: 'Stranger C',
      },
      {
        id: 'agent_4',
        seatId: 'seat_4',
        status: 'idle',
        name: 'Stranger D',
      },
    ];

    setAgents(mockAgents);

    // 模拟状态变化（演示用）
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: Math.random() > 0.7 ? 'conversing' : 'idle',
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
      {/* 背景层 - 单张静态大图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Train Example/assets/sprites/${layout.background}')`,
          imageRendering: 'pixelated',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* 精灵层 - 数据驱动渲染 */}
      <div className="absolute inset-0">
        {agents.map((agent) => {
          const seat = layout.seats.find((s) => s.id === agent.seatId);
          if (!seat) return null;

          return (
            <AgentSprite
              key={agent.id}
              agent={agent}
              position={{ x: seat.x, y: seat.y }}
            />
          );
        })}
      </div>

      {/* 场景装饰层（可选） */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F0F23]/80 to-transparent pointer-events-none" />

      {/* 状态指示器 */}
      <div className="absolute top-4 right-4 font-pixel text-[10px] text-white/30 bg-black/30 px-3 py-1 rounded">
        ACTIVE_AGENTS: {agents.length}
      </div>
    </div>
  );
}

/**
 * TrainCanvasScene.tsx - 修复版
 *
 * 核心修复：
 * - 背景预加载
 * - Canvas 正确渲染
 * - 图片显示调试
 */

"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TRAIN_LAYOUT } from '@/app/lib/train-layout';
import { loadNPCSpriteSheet, getFrame, SpriteSheet } from '@/app/lib/train-sprite-processor';

interface Agent {
  id: string;
  name: string;
  isPlayer: boolean;
  status: 'idle' | 'walking' | 'conversing';
  currentWaypointId: string;
  targetWaypointId: string | null;
  direction: 'left' | 'right';
  x: number;
  y: number;
  conversingWith: string | null;
}

interface TrainCanvasSceneProps {
  sessionId: string;
  carriageType: string;
}

const MOVE_DURATION = 3000;

export default function TrainCanvasScene({ sessionId, carriageType }: TrainCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const [spriteSheet, setSpriteSheet] = useState<SpriteSheet | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [bubbleLoaded, setBubbleLoaded] = useState(false);

  // 使用 ref 存储已加载的图片对象
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bubbleImageRef = useRef<HTMLImageElement | null>(null);
  const agentImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // 预加载背景
  useEffect(() => {
    const bgImg = new Image();
    bgImg.src = TRAIN_LAYOUT.assets.background;
    bgImg.onload = () => {
      console.log('✅ 背景加载完成:', TRAIN_LAYOUT.assets.background);
      bgImageRef.current = bgImg;
      setBackgroundLoaded(true);
    };
    bgImg.onerror = () => {
      console.error('❌ 背景加载失败:', TRAIN_LAYOUT.assets.background);
    };
  }, []);

  // 预加载气泡
  useEffect(() => {
    const bubbleImg = new Image();
    bubbleImg.src = TRAIN_LAYOUT.assets.bubble;
    bubbleImg.onload = () => {
      console.log('✅ 气泡加载完成:', TRAIN_LAYOUT.assets.bubble);
      bubbleImageRef.current = bubbleImg;
      setBubbleLoaded(true);
    };
    bubbleImg.onerror = () => {
      console.error('❌ 气泡加载失败:', TRAIN_LAYOUT.assets.bubble);
    };
  }, []);

  // 初始化 Agents 和精灵表
  useEffect(() => {
    async function init() {
      try {
        const sheet = await loadNPCSpriteSheet(TRAIN_LAYOUT.assets.sprite);
        setSpriteSheet(sheet);

        // 🎯 预加载所有方向的精灵图
        const directions: Array<'down' | 'up' | 'left' | 'right'> = ['down', 'up', 'left', 'right'];
        for (const direction of directions) {
          const frame = getFrame(sheet, direction);
          const img = new Image();
          img.src = frame.frame1;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
          });
          agentImagesRef.current.set(direction, img);
        }
        console.log('✅ 精灵图预加载完成');

        const initialAgents: Agent[] = [
          {
            id: 'agent_1',
            name: 'Player',
            isPlayer: true,
            status: 'idle',
            currentWaypointId: 'wp_1',
            targetWaypointId: null,
            direction: 'right',
            x: TRAIN_LAYOUT.aisleWaypoints[0].x,
            y: TRAIN_LAYOUT.aisleWaypoints[0].y,
            conversingWith: null,
          },
          {
            id: 'agent_2',
            name: 'NPC A',
            isPlayer: false,
            status: 'idle',
            currentWaypointId: 'wp_3',
            targetWaypointId: null,
            direction: 'left',
            x: TRAIN_LAYOUT.aisleWaypoints[2].x,
            y: TRAIN_LAYOUT.aisleWaypoints[2].y,
            conversingWith: null,
          },
          {
            id: 'agent_3',
            name: 'NPC B',
            isPlayer: false,
            status: 'idle',
            currentWaypointId: 'wp_5',
            targetWaypointId: null,
            direction: 'left',
            x: TRAIN_LAYOUT.aisleWaypoints[4].x,
            y: TRAIN_LAYOUT.aisleWaypoints[4].y,
            conversingWith: null,
          },
        ];

        setAgents(initialAgents);
        console.log('✅ Agents 初始化完成');
      } catch (error) {
        console.error('❌ 初始化失败:', error);
      }
    }

    init();
  }, []);

  // 🎯 Canvas 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spriteSheet || !backgroundLoaded || !bubbleLoaded) return;
    if (!bgImageRef.current || !bubbleImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 清空画布
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🎯 绘制背景（全屏，pixelated）
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bgImageRef.current!, 0, 0, canvas.width, canvas.height);

      // 绘制 Agents
      agents.forEach((agent) => {
        // 获取预加载的精灵图
        const agentImg = agentImagesRef.current.get(agent.direction);
        if (!agentImg) return;

        // 🎯 玩家标记：绿色发光
        if (agent.isPlayer) {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        // 绘制精灵（32x32，2x 放大）
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(agentImg, agent.x - 16, agent.y - 32, 32, 32);

        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // 🎯 绘制 ! 气泡（conversing 状态）
        if (agent.status === 'conversing') {
          // 跳动效果
          const bounce = Math.sin(Date.now() / 200) * 3;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(bubbleImageRef.current!, agent.x - 8, agent.y - 48 + bounce, 16, 16);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [spriteSheet, agents, backgroundLoaded, bubbleLoaded]);

  // 状态机
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    agents.forEach((agent) => {
      if (agent.status === 'conversing') return;

      if (agent.status === 'idle') {
        const waitTime = Math.random() * 3000 + 2000;
        const timer = setTimeout(() => {
          startWalking(agent.id);
        }, waitTime);
        timers.push(timer);
      }

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
  }, [agents]);

  // 水平移动
  const startWalking = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id !== agentId || agent.status !== 'idle') return agent;

        const currentWaypointIndex = TRAIN_LAYOUT.aisleWaypoints.findIndex(
          wp => wp.id === agent.currentWaypointId
        );

        const availableWaypoints = TRAIN_LAYOUT.aisleWaypoints.filter(
          (wp, idx) => idx !== currentWaypointIndex
        );
        const nextWaypoint = availableWaypoints[
          Math.floor(Math.random() * availableWaypoints.length)
        ];

        const direction: 'left' | 'right' = nextWaypoint.x > agent.x ? 'right' : 'left';

        return {
          ...agent,
          status: 'walking' as const,
          currentWaypointId: nextWaypoint.id,
          targetWaypointId: nextWaypoint.id,
          direction,
          x: nextWaypoint.x,
          y: nextWaypoint.y, // Y 轴固定
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
          currentWaypointId: agent.targetWaypointId || agent.currentWaypointId,
          targetWaypointId: null,
        };
      });

      // 相遇检测
      const currentAgent = updatedAgents.find((a) => a.id === agentId);
      if (!currentAgent) return updatedAgents;

      const nearbyAgent = updatedAgents.find((a) => {
        if (a.id === agentId || a.status === 'conversing') return false;
        return (
          a.currentWaypointId === currentAgent.currentWaypointId &&
          a.currentWaypointId !== null
        );
      });

      if (nearbyAgent) {
        console.log(`💬 相遇: ${agentId} + ${nearbyAgent.id}`);
        return updatedAgents.map((a) => {
          if (a.id === agentId || a.id === nearbyAgent.id) {
            return { ...a, status: 'conversing' as const };
          }
          return a;
        });
      }

      return updatedAgents;
    });
  }, []);

  // Canvas 点击事件
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    agents.forEach((agent) => {
      if (agent.status !== 'conversing') return;

      // 气泡区域
      const bubbleX = agent.x;
      const bubbleY = agent.y - 48;
      const bubbleSize = 16;

      if (
        clickX >= bubbleX - bubbleSize &&
        clickX <= bubbleX + bubbleSize &&
        clickY >= bubbleY - bubbleSize &&
        clickY <= bubbleY + bubbleSize
      ) {
        console.log('🚀 点击气泡，跳转:', agent.id);
        router.push(`/terminal/${agent.id}`);
      }
    });
  }, [agents, router]);

  if (!backgroundLoaded || !bubbleLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="font-pixel text-xs text-green-400 animate-pulse">
          LOADING_ASSETS...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <canvas
        ref={canvasRef}
        width={TRAIN_LAYOUT.game.width}
        height={TRAIN_LAYOUT.game.height}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
        onClick={handleCanvasClick}
      />

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 font-pixel text-[8px] text-white/20">
          Canvas: {TRAIN_LAYOUT.game.width}x{TRAIN_LAYOUT.game.height}
          <br />
          Agents: {agents.length}
          <br />
          背景: {TRAIN_LAYOUT.assets.background}
        </div>
      )}

      {/* 底部提示 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-white/20 z-50">
        绿色光晕是你 | 点击 ! 气泡
      </div>
    </div>
  );
}

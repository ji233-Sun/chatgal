/**
 * LifeSceneSimple.tsx - 简化测试版本
 */

"use client";

import { useState, useEffect } from 'react';
import trainLayout from '@/app/lib/train-layout.json';

interface TrainLayout {
  backgroundPath: string;
  spritePath: string;
  waypoints: Array<{ id: string; x: string; y: string }>;
}

interface LifeSceneSimpleProps {
  sessionId: string;
  carriageType: string;
}

export default function LifeSceneSimple({ sessionId, carriageType }: LifeSceneSimpleProps) {
  const [layout, setLayout] = useState<TrainLayout | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log('🚀 LifeSceneSimple mounted');
    setLayout(trainLayout as TrainLayout);
    setLoaded(true);
    console.log('✅ Layout loaded:', trainLayout);
  }, []);

  if (!layout || !loaded) {
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
        }}
      />

      {/* 测试标记 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-green-500 text-white px-4 py-2 rounded font-pixel text-sm">
          LIFE_SCENE_LOADED
        </div>
      </div>

      {/* 状态栏 */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="font-pixel text-[10px] text-white/30 bg-black/30 px-3 py-1 rounded">
          Session: {sessionId}
        </div>
        <div className="font-pixel text-[10px] text-white/30 bg-black/30 px-3 py-1 rounded">
          CARRIAGE: {carriageType.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

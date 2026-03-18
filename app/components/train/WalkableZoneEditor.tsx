/**
 * WalkableZoneEditor.tsx - 可走动区域编辑器
 *
 * 用于在页面上直观地调整可走动区域
 */

"use client";

import { useState, useRef, useEffect } from 'react';

interface WalkableZoneEditorProps {
  currentZone: { minX: number; maxX: number; minY: number; maxY: number };
  onUpdate: (zone: { minX: number; maxX: number; minY: number; maxY: number }) => void;
  onClose: () => void;
}

export default function WalkableZoneEditor({ currentZone, onUpdate, onClose }: WalkableZoneEditorProps) {
  const [zone, setZone] = useState(currentZone);
  const [dragging, setDragging] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (edge: 'left' | 'right' | 'top' | 'bottom') => {
    setDragging(edge);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZone((prev) => {
      const newZone = { ...prev };

      switch (dragging) {
        case 'left':
          newZone.minX = Math.max(0, Math.min(x, prev.maxX - 5));
          break;
        case 'right':
          newZone.maxX = Math.max(prev.minX + 5, Math.min(x, 100));
          break;
        case 'top':
          newZone.minY = Math.max(0, Math.min(y, prev.maxY - 5));
          break;
        case 'bottom':
          newZone.maxY = Math.max(prev.minY + 5, Math.min(y, 100));
          break;
      }

      return newZone;
    });
  };

  const handleMouseUp = () => {
    setDragging(null);
    onUpdate(zone);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZone((prev) => {
        const newZone = { ...prev };

        switch (dragging) {
          case 'left':
            newZone.minX = Math.max(0, Math.min(x, prev.maxX - 5));
            break;
          case 'right':
            newZone.maxX = Math.max(prev.minX + 5, Math.min(x, 100));
            break;
          case 'top':
            newZone.minY = Math.max(0, Math.min(y, prev.maxY - 5));
            break;
          case 'bottom':
            newZone.maxY = Math.max(prev.minY + 5, Math.min(y, 100));
            break;
        }

        return newZone;
      });
    };

    const handleGlobalMouseUp = () => {
      if (dragging) {
        setDragging(null);
        onUpdate(zone);
      }
    };

    if (dragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragging, zone, onUpdate]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative bg-black border-4 border-white"
        style={{ width: '80vw', height: '80vh', imageRendering: 'pixelated' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* 背景图 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/Train Example/assets/backgrounds/train_interior_bullet.png')",
            backgroundSize: 'cover',
          }}
        />

        {/* 可走动区域 */}
        <div
          className="absolute border-4 border-green-400 bg-green-400/20"
          style={{
            left: `${zone.minX}%`,
            top: `${zone.minY}%`,
            width: `${zone.maxX - zone.minX}%`,
            height: `${zone.maxY - zone.minY}%`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          {/* 拖动边框 */}
          <div
            className="absolute top-0 left-0 right-0 h-2 bg-green-400 cursor-n-resize hover:bg-green-300"
            onMouseDown={() => handleMouseDown('top')}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 bg-green-400 cursor-s-resize hover:bg-green-300"
            onMouseDown={() => handleMouseDown('bottom')}
          />
          <div
            className="absolute top-0 bottom-0 left-0 w-2 bg-green-400 cursor-e-resize hover:bg-green-300"
            onMouseDown={() => handleMouseDown('left')}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-2 bg-green-400 cursor-w-resize hover:bg-green-300"
            onMouseDown={() => handleMouseDown('right')}
          />
        </div>

        {/* 信息面板 */}
        <div className="absolute top-4 left-4 bg-black/90 border-2 border-white p-4 font-pixel text-[10px] text-white">
          <div className="mb-2">拖动绿色边框调整可走动区域</div>
          <div>X: {zone.minX.toFixed(0)}% - {zone.maxX.toFixed(0)}%</div>
          <div>Y: {zone.minY.toFixed(0)}% - {zone.maxY.toFixed(0)}%</div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onUpdate(zone)}
              className="bg-green-500 text-black px-4 py-2 hover:bg-green-400"
            >
              应用
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-black px-4 py-2 hover:bg-red-400"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

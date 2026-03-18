"use client";

/**
 * ResonanceVisualizer - 共鸣粒子连线效果
 */

interface ResonanceVisualizerProps {
  score: number;
  isActive: boolean;
}

export default function ResonanceVisualizer({ score, isActive }: ResonanceVisualizerProps) {
  if (!isActive || score < 0.3) return null;

  const opacity = Math.min(score, 0.8);

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ opacity }}>
      <defs>
        <linearGradient id="resonance-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <line
        x1="15%"
        y1="50%"
        x2="85%"
        y2="50%"
        stroke="url(#resonance-gradient)"
        strokeWidth="2"
        strokeDasharray="8,4"
        className="animate-[dash_2s_linear_infinite]"
      />
      {[...Array(5)].map((_, i) => (
        <circle
          key={i}
          cx={`${20 + i * 15}%`}
          cy="50%"
          r="3"
          fill={i % 2 === 0 ? "#7C3AED" : "#F43F5E"}
          opacity="0.6"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

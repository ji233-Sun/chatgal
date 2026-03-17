"use client";

import type { CSSProperties } from "react";

/**
 * PixelIcon - 统一像素图标组件
 * 所有图标均为 16x16 / 24x24 / 32x32 SVG 像素图标
 */

interface PixelIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function PixelIcon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  style,
}: PixelIconProps) {
  const iconPaths: Record<string, string> = {
    // 通知铃铛
    "icon-bell":
      "M12 2v1M12 18v1M7 7a5 5 0 0 1 10 0c0 5 2 7 2 7H5s2-2 2-7zM7.5 17h9M12 2a3 3 0 0 0-3 3",

    // 音符
    "icon-music":
      "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",

    // 搜索放大镜
    "icon-search":
      "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",

    // 齿轮设置
    "icon-gear":
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",

    // 眼睛（观测状态）
    "icon-eye":
      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",

    // 面具（匿名状态）
    "icon-mask":
      "M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z M8 7a4 4 0 0 1 8 0 M8 16c0 2 2 3 4 3s4-1 4-3M4 12a8 8 0 0 0 16 0",

    // 像素火车
    "icon-train":
      "M12 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1v2h2v-2h2v2h2v-2h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4zM8 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm6 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z",

    // 星星（共鸣评价）
    "icon-star":
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",

    // 空心星
    "icon-star-empty":
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 3.5L9.5 10l-5.2.8 3.7 3.6-.9 5.1L12 17.2l4.9 2.3-.9-5.1 3.7-3.6-5.2-.8L12 5.5z",

    // 餐盘（餐车）
    "icon-food":
      "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3",

    // 望远镜（观景台）
    "icon-scope":
      "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM10 7v6M4 4l3 3",

    // 游戏手柄（娱乐车厢）
    "icon-game":
      "M6 11h4M14 11h4M6 14h3m6 0h3M12 2a10 10 0 1 0 10 10H12V2z M2 12h10M12 2v10",

    // 扳手（技术工坊）
    "icon-wrench":
      "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",

    // 左箭头
    "icon-arrow-left":
      "M19 12H5M12 19l-7-7 7-7",

    // 右箭头
    "icon-arrow-right":
      "M5 12h14M12 5l7 7-7 7",

    // 用户头像
    "icon-user":
      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",

    // 对话气泡
    "icon-chat":
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",

    // 思考气泡
    "icon-thought":
      "M12 2a5 5 0 0 1 5 5v1a3 3 0 0 1-3 3h-1a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a3 3 0 0 0-3-3H2a3 3 0 0 1-3-3V7a5 5 0 0 1 5-5h8zM2 7a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H2V7z",

    // 链接（匹配连接）
    "icon-link":
      "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",

    // 闪光（共鸣特效）
    "icon-sparkle":
      "M12 2L14 10l8 2-8 2-2 8-2-8-8-2 8-2z",

    // 车票（通行证）
    "icon-ticket":
      "M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9z M2 12h20 M12 9v6",
  };

  const pathD = iconPaths[name];

  if (!pathD) {
    console.warn(`PixelIcon: "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`pixel-icon ${className}`}
      aria-hidden="true"
      style={{ imageRendering: "pixelated", ...style }}
    >
      <path d={pathD} />
    </svg>
  );
}

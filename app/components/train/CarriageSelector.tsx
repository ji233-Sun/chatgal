"use client";

/**
 * 车厢选择器 - 用户选择进入哪节车厢
 * 使用 ArcadeUI Card + Button 组件
 */

import { Card, Button } from "arcadeui";
import PixelIcon from "../ui/PixelIcon";

const CARRIAGES = [
  {
    type: "tech",
    name: "技术工坊",
    icon: "icon-wrench",
    description: "代码、架构、技术趋势",
    color: "#00d9ff",
    bgColor: "rgba(0, 217, 255, 0.1)",
  },
  {
    type: "art",
    name: "艺术长廊",
    icon: "icon-food",
    description: "绘画、音乐、文学创作",
    color: "#ff6ec7",
    bgColor: "rgba(255, 110, 199, 0.1)",
  },
  {
    type: "philosophy",
    name: "观景台",
    icon: "icon-scope",
    description: "哲学思考、人生感悟",
    color: "#a78bfa",
    bgColor: "rgba(167, 139, 250, 0.1)",
  },
  {
    type: "gaming",
    name: "娱乐车厢",
    icon: "icon-game",
    description: "游戏、动漫、影视",
    color: "#ffd700",
    bgColor: "rgba(255, 215, 0, 0.1)",
  },
] as const;

interface CarriageSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
  onStart: () => void;
  loading?: boolean;
}

export default function CarriageSelector({
  selected,
  onSelect,
  onStart,
  loading,
}: CarriageSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <h2 className="font-pixel text-xl font-bold text-white/90 mb-2">
          选择你的车厢
        </h2>
        <p className="font-retro text-sm text-white/40">
          每节车厢都有独特的话题维度
        </p>
      </div>

      {/* 响应式网格：mobile 1列, sm 2列, lg 4列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {CARRIAGES.map((carriage) => {
          const isSelected = selected === carriage.type;
          return (
            <Card
              key={carriage.type}
              variant="outlined"
              className={`
                !cursor-pointer !transition-all !duration-200 !text-left
                ${isSelected
                  ? "!scale-[1.02]"
                  : "hover:!border-white/20"
                }
              `}
            >
              <button
                onClick={() => onSelect(carriage.type)}
                className="relative w-full p-5 text-left"
                style={{
                  backgroundColor: carriage.bgColor,
                  borderColor: isSelected ? carriage.color : undefined,
                }}
              >
                <PixelIcon
                  name={carriage.icon}
                  size={32}
                  color={carriage.color}
                  className="mb-2"
                />
                <div className="font-pixel text-sm font-bold text-white/90">
                  {carriage.name}
                </div>
                <div className="font-retro text-xs text-white/40 mt-1">
                  {carriage.description}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
            </Card>
          );
        })}
      </div>

      {/* 启程按钮 */}
      <Button
        variant="primary"
        size="lg"
        onClick={onStart}
        disabled={!selected || loading}
        className={`
          !mt-4 !font-pixel !text-sm !font-bold
          ${selected
            ? "!bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !text-[#0a0e27] !border-[#8b5a2b]"
            : "!bg-white/5 !text-white/30 !border-white/10 !cursor-not-allowed"
          }
          ${loading ? "!animate-pulse" : ""}
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#0a0e27] rounded-sm animate-[bounce_1.4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </span>
            正在搜索旅客...
          </span>
        ) : (
          "启程"
        )}
      </Button>
    </div>
  );
}

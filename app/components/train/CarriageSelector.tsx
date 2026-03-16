"use client";

/**
 * 车厢选择器 - 用户选择进入哪节车厢
 * 使用 ArcadeUI 风格 + 像素化设计
 */

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
    icon: "icon-food", // 使用餐盘图标代替艺术
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
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="font-pixel text-xl font-bold text-white/90 mb-2">
          选择你的车厢
        </h2>
        <p className="font-retro text-sm text-white/40">
          每节车厢都有独特的话题维度
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {CARRIAGES.map((carriage) => (
          <button
            key={carriage.type}
            onClick={() => onSelect(carriage.type)}
            className={`
              relative p-5 rounded-lg border-4 text-left
              transition-all duration-200
              ${selected === carriage.type
                ? `border-[${carriage.color}] shadow-pixel-lg scale-[1.02]`
                : "border-white/10 hover:border-white/20 hover:shadow-pixel"
              }
            `}
            style={{
              backgroundColor: carriage.bgColor,
              borderColor: selected === carriage.type ? carriage.color : "rgba(255, 255, 255, 0.1)",
              boxShadow: selected === carriage.type ? "6px 6px 0px 0px rgba(0, 0, 0, 0.75)" : "none",
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

            {selected === carriage.type && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={!selected || loading}
        className={`
          mt-4 px-8 py-4 rounded-lg font-pixel text-sm font-bold
          transition-all duration-200
          ${selected
            ? "bg-gradient-to-b from-[#ffd700] to-[#ff8c00] text-[#0a0e27] border-4 border-[#8b5a2b] hover:translate-y-[-2px] hover:shadow-pixel-lg active:translate-y-[2px] active:shadow-pixel-sm shadow-pixel"
            : "bg-white/5 text-white/30 border-4 border-white/10 cursor-not-allowed"
          }
          ${loading ? "animate-pulse" : ""}
        `}
        style={selected ? { boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.75)" } : {}}
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
      </button>
    </div>
  );
}

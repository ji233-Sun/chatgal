"use client";

/**
 * 车厢选择器 - 用户选择进入哪节车厢
 * 使用 ArcadeUI Card + Button 组件
 */

import { Button } from "arcadeui";
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
  {
    type: "zhihu_hot",
    name: "热榜议事厅",
    icon: "icon-sparkle",
    description: "知乎热榜实时话题讨论",
    color: "#0084FF",
    bgColor: "rgba(0, 132, 255, 0.1)",
  },
] as const;

interface CarriageSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
  onStart: () => void;
  loading?: boolean;
}

// 颜文字库
const EMOTES: Record<string, string[]> = {
  joy: ["(^_^)", "(^o^)", "(*^-^*)", "(>v<)"],
  thinking: ["(._. )", "(?.?)", "(*^_^*)", "(•ิ_•ิ)"],
  surprised: ["(o.o;)", "(!?)", "(O_O;)", "(⊙_⊙)"],
  cool: ["(-_-)", "(~_^)", "(-v-)", "(▀̿Ĺ̯▀̿ ̿)"],
};

export default function CarriageSelector({
  selected,
  onSelect,
  onStart,
  loading,
}: CarriageSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full animate-[fade-slide-up_0.8s_ease-out]">
      <div className="text-center space-y-2">
        <div className="font-pixel text-[10px] text-amber-400/40 uppercase tracking-[0.3em] mb-4">
          Station Protocol Alpha-7
        </div>
        <h2 className="font-pixel text-3xl font-bold text-white tracking-tighter">
          选择你的 <span className="text-amber-400">车厢</span>
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mt-4" />
        <p className="font-retro text-sm text-white/30 max-w-xs mx-auto pt-2">
          每节车厢都有独特的话题维度
        </p>
      </div>

      {/* 响应式网格：mobile 1列, sm 2列, lg 5列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full max-w-6xl">
        {CARRIAGES.map((carriage) => {
          const isSelected = selected === carriage.type;
          return (
            <div
              key={carriage.type}
              className={`
                group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-500 transform
                ${isSelected
                  ? "scale-105 shadow-[0_0_30px_rgba(255,215,0,0.15)] border-amber-400/50 bg-white/5"
                  : "hover:scale-102 hover:border-white/30 border-white/5 bg-white/[0.02]"
                }
              `}
              onClick={() => onSelect(carriage.type)}
            >
              {/* 背景修饰 */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                style={{ backgroundColor: carriage.color }}
              />
              {isSelected && (
                <div 
                  className="absolute inset-0 opacity-5 transition-opacity"
                  style={{ backgroundColor: carriage.color }}
                />
              )}
              
              <div className="p-6 relative z-10 flex flex-col items-center text-center h-full">
                <div className={`
                  mb-5 p-4 rounded-lg border-2 transition-all duration-500
                  ${isSelected ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 group-hover:border-white/20"}
                `}>
                  <PixelIcon
                    name={carriage.icon}
                    size={40}
                    color={isSelected ? carriage.color : "rgba(255,255,255,0.2)"}
                    className={`transition-all duration-500 ${isSelected ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "group-hover:scale-110 group-hover:opacity-100 opacity-60"}`}
                  />
                </div>
                
                <div className={`font-pixel text-lg font-bold transition-colors duration-500 ${isSelected ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                  {carriage.name}
                </div>
                
                <div className="font-retro text-xs text-white/30 mt-3 leading-relaxed group-hover:text-white/50 transition-colors">
                  {carriage.description}
                </div>

                {isSelected && (
                  <div className="mt-6 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse delay-150" />
                  </div>
                )}
              </div>
              
              {/* 装饰性 corner */}
              <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0"}`}>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400/40" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 启程按钮 */}
      <div className="relative group/btn mt-8">
        {selected && !loading && (
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-sm blur opacity-25 group-hover/btn:opacity-60 transition duration-500 animate-pulse" />
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          disabled={!selected || loading}
          className={`
            relative !font-pixel !text-sm !font-bold !px-16 !py-6 !transition-all !duration-500
            ${selected
              ? "!bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !text-[#0a0e27] !border-[#8b5a2b] hover:!translate-y-[-2px] active:!translate-y-[1px]"
              : "!bg-white/5 !text-white/10 !border-white/10 !cursor-not-allowed"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-4">
              <span className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_infinite]" />
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
              </span>
              正在初始化量子链路...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              登车启程
              <PixelIcon name="icon-arrow-right" size={18} color="currentColor" />
            </span>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 opacity-10 font-pixel text-[8px] tracking-[0.4em] uppercase">
        <div className="w-12 h-px bg-white" />
        Departure Sync
        <div className="w-12 h-px bg-white" />
      </div>
    </div>
  );
}

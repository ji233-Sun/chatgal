"use client";

/**
 * 车厢选择器 - 用户选择进入哪节车厢
 */

const CARRIAGES = [
  {
    type: "tech",
    name: "技术工坊",
    emoji: "🔧",
    description: "代码、架构、技术趋势",
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    glow: "hover:shadow-cyan-500/20",
  },
  {
    type: "art",
    name: "艺术长廊",
    emoji: "🎨",
    description: "绘画、音乐、文学创作",
    gradient: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    glow: "hover:shadow-pink-500/20",
  },
  {
    type: "philosophy",
    name: "观景台",
    emoji: "🔭",
    description: "哲学思考、人生感悟",
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/30",
    glow: "hover:shadow-violet-500/20",
  },
  {
    type: "gaming",
    name: "娱乐车厢",
    emoji: "🎮",
    description: "游戏、动漫、影视",
    gradient: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30",
    glow: "hover:shadow-amber-500/20",
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
        <h2 className="text-xl font-bold text-white/90 mb-2">
          选择你的车厢
        </h2>
        <p className="text-sm text-white/40">
          每节车厢都有独特的话题维度
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {CARRIAGES.map((carriage) => (
          <button
            key={carriage.type}
            onClick={() => onSelect(carriage.type)}
            className={`
              relative p-5 rounded-2xl border text-left transition-all duration-300
              bg-gradient-to-br ${carriage.gradient}
              ${selected === carriage.type
                ? `${carriage.border} border-2 shadow-lg ${carriage.glow} scale-[1.02]`
                : "border-white/10 hover:border-white/20"
              }
            `}
          >
            <div className="text-3xl mb-2">{carriage.emoji}</div>
            <div className="text-sm font-semibold text-white/90">
              {carriage.name}
            </div>
            <div className="text-xs text-white/40 mt-1">
              {carriage.description}
            </div>

            {selected === carriage.type && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={!selected || loading}
        className={`
          mt-4 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300
          ${selected
            ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-lg"
            : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
          }
          ${loading ? "animate-pulse" : ""}
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            正在搜索旅客...
          </span>
        ) : (
          "启程"
        )}
      </button>
    </div>
  );
}

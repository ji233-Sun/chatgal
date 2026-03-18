"use client";

/**
 * TypingIndicator - AI 思考中指示器
 */

export default function TypingIndicator({ isMySide = false }: { isMySide?: boolean }) {
  return (
    <div className={`flex gap-3 ${isMySide ? "flex-row-reverse" : "flex-row"} animate-[fade-in_0.3s_ease-out]`}>
      <div className="w-10 h-10 shrink-0" />
      <div className="flex gap-2 items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full animate-bounce ${isMySide ? "bg-purple-500/60" : "bg-rose-500/60"}`}
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
        <span className="font-pixel text-[8px] text-white/30 tracking-wider">PROCESSING</span>
      </div>
    </div>
  );
}

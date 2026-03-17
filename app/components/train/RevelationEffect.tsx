"use client";

/**
 * RevelationEffect - Retro-Futurism Optimized
 */

import { useEffect, useState, useCallback } from "react";
import { Avatar, Card, Badge } from "arcadeui";
import PixelIcon from "../ui/PixelIcon";

interface RevelationEffectProps {
  active: boolean;
  isPhantom: boolean;
  stranger: {
    name?: string | null;
    avatarUrl?: string | null;
    route?: string | null;
  } | null;
  resonanceScore: number | null;
  onComplete: () => void;
}

export default function RevelationEffect({
  active,
  isPhantom,
  stranger,
  resonanceScore,
  onComplete,
}: RevelationEffectProps) {
  const [phase, setPhase] = useState<"idle" | "glow" | "crack" | "reveal" | "done">("idle");
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; animationDelay: string }[]>([]);

  const handleDismiss = useCallback(() => {
    if (phase === "done") {
      setPhase("idle");
      onComplete();
    }
  }, [phase, onComplete]);

  useEffect(() => {
    if (!active) return;

    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${70 + Math.random() * 30}%`,
        animationDelay: `${Math.random() * 2}s`,
      }))
    );

    setPhase("glow");
    const t1 = setTimeout(() => setPhase("crack"), 1500);
    const t2 = setTimeout(() => setPhase("reveal"), 3000);
    const t3 = setTimeout(() => setPhase("done"), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  if (phase === "idle") return null;

  return (
    <div
      onClick={handleDismiss}
      className={`
        fixed inset-0 z-[2000] flex items-center justify-center cursor-pointer
        transition-all duration-1000
        ${phase === "glow" ? "bg-purple-900/40 backdrop-blur-sm" : ""}
        ${phase === "crack" ? "bg-purple-900/60 backdrop-blur-md" : ""}
        ${phase === "reveal" || phase === "done" ? "bg-[#0F0F23]/95 backdrop-blur-xl" : ""}
      `}
    >
      {/* Particle Effects */}
      {(phase === "crack" || phase === "reveal") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-rose-500/60 rounded-sm animate-[float-up_3s_ease-out_forwards]"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>
      )}

      {/* Phase 1: Glow */}
      {phase === "glow" && (
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-rose-500/30 border-2 border-purple-500/50 animate-[glow-pulse_1s_ease-in-out_infinite] flex items-center justify-center shadow-pixel-lg">
            <PixelIcon name="icon-mask" size={32} color="#f43f5e" />
          </div>
          <p className="font-pixel text-rose-500 text-[10px] tracking-[0.3em] uppercase mt-8 animate-pulse neon-glow-rose">
            SYNC_RESONANCE_DETECTED
          </p>
        </div>
      )}

      {/* Phase 2: Crack */}
      {phase === "crack" && (
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-rose-600 border-2 border-white/20 flex items-center justify-center animate-[mask-crack_1.5s_ease-out_forwards] shadow-pixel-xl">
            <PixelIcon name="icon-mask" size={32} color="#ffffff" />
          </div>
          <p className="font-pixel text-white/80 text-[10px] tracking-[0.2em] uppercase mt-8">
            DECRYPTING_IDENTITY_CORE...
          </p>
        </div>
      )}

      {/* Result Phase */}
      {(phase === "reveal" || phase === "done") && (
        <div className="flex flex-col items-center gap-8 animate-[fade-in_1s_ease-out] px-4 w-full max-w-lg">
          <div className="font-pixel text-rose-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-2 flex items-center gap-4 bg-rose-500/10 px-8 py-3 border border-rose-500/20 rounded-sm neon-glow-rose">
            <PixelIcon name="icon-sparkle" size={14} color="currentColor" className="animate-spin" style={{ animationDuration: '4s' }} />
            PROTOCOL_ESTABLISHED
            <PixelIcon name="icon-sparkle" size={14} color="currentColor" className="animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <div className="relative group w-full flex justify-center perspective-1000">
            <div className={`
                relative w-full max-w-sm bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl overflow-hidden shadow-2xl
                ${phase === "reveal" ? "animate-[ticket-fall_1.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]" : ""}
            `}>
                <div className="absolute top-0 right-0 p-4 font-pixel text-[8px] text-white/5 tracking-[0.5em] leading-none text-right">
                    AKASHA_PASS<br/>RECOVERY_COMPLETE
                </div>
                
                <div className="flex gap-6 items-center mb-10">
                    <div className="p-1 border border-purple-500/30 rounded-lg shadow-pixel-sm">
                        {isPhantom ? (
                            <div className="w-16 h-16 flex items-center justify-center font-pixel text-2xl bg-white/5 rounded-sm">?</div>
                        ) : (
                            <Avatar
                                src={stranger?.avatarUrl || undefined}
                                fallback={(stranger?.name || "U").charAt(0)}
                                size="lg"
                                shape="square"
                                className="!bg-white/5 !w-16 !h-16"
                            />
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-pixel text-[8px] text-white/30 uppercase mb-2">Subject Name</div>
                        <div className="font-pixel text-xl font-bold text-white tracking-tight neon-glow-purple">
                            {isPhantom ? "VOID_PHANTOM" : (stranger?.name || "UNNAMED_TRAVELER")}
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-dashed border-white/10 my-8" />
                
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <div className="font-pixel text-[8px] text-white/30 uppercase">Resonance Index</div>
                        <div className="flex items-center gap-3">
                            <div className="font-pixel text-2xl font-bold text-rose-500 neon-glow-rose">
                                {resonanceScore ? (resonanceScore * 100).toFixed(1) : "---"}%
                            </div>
                            <Badge variant="success" size="sm" className="!bg-rose-500/10 !text-rose-500 !border-rose-500/20 !font-pixel !text-[8px] !px-2">
                                SYNCED
                            </Badge>
                        </div>
                    </div>
                    
                    {!isPhantom && stranger?.route && (
                        <div className="bg-white text-[#0F0F23] font-pixel text-[10px] px-6 py-3 rounded-sm shadow-pixel hover:bg-rose-500 hover:text-white transition-colors">
                            VIEW_PROFILE
                        </div>
                    )}
                </div>

                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-rose-500 to-purple-500" />
            </div>
          </div>

          <div className="text-center mt-4 space-y-6 animate-[fade-in_1s_ease-out_0.5s_both]">
            <p className="font-retro text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
              {isPhantom 
                ? "Transmission complete. Data phantom detected. True resonance requires biological presence."
                : "Deep neural sync established. Subject identity parameters fully recovered from the stream."}
            </p>
            
            {phase === "done" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-1 h-12 bg-gradient-to-b from-rose-500/40 to-transparent" />
                <p className="font-pixel text-rose-500/40 text-[9px] tracking-[0.3em] uppercase animate-pulse">
                  TAP_TO_RETURN_TERMINAL
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

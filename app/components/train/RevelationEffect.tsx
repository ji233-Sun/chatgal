"use client";

/**
 * RevelationEffect - Cinematic Resonance Reveal
 *
 * 4-phase full-screen overlay:
 *   glow   → concentric rings + energy orb
 *   burst  → mask shatters into fragments + flash
 *   reveal → identity card materializes with light sweep
 *   done   → settled state, tap to dismiss
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { Avatar, Badge } from "arcadeui";
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

/* ---------- Particle generators (stable across re-renders) ---------- */

function generateMotes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    hue: (["rose", "purple", "cyan"] as const)[i % 3],
  }));
}

function generateFragments(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 80 + Math.random() * 180;
    return {
      id: i,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      rot: Math.random() * 720 - 360,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 0.25,
    };
  });
}

const HUE_MAP = { rose: "#f43f5e", purple: "#a855f7", cyan: "#22d3ee" } as const;

export default function RevelationEffect({
  active,
  isPhantom,
  stranger,
  resonanceScore,
  onComplete,
}: RevelationEffectProps) {
  const [phase, setPhase] = useState<"idle" | "glow" | "burst" | "reveal" | "done">(
    active ? "glow" : "idle"
  );

  const motes = useMemo(() => generateMotes(24), []);
  const fragments = useMemo(() => generateFragments(16), []);

  const handleDismiss = useCallback(() => {
    if (phase === "done") {
      setPhase("idle");
      onComplete();
    }
  }, [phase, onComplete]);

  useEffect(() => {
    if (!active) return;

    const start = setTimeout(() => setPhase("glow"), 0);
    const t1 = setTimeout(() => setPhase("burst"), 1800);
    const t2 = setTimeout(() => setPhase("reveal"), 2600);
    const t3 = setTimeout(() => setPhase("done"), 4600);
    return () => {
      clearTimeout(start);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  if (phase === "idle") return null;

  const showCard = phase === "reveal" || phase === "done";

  return (
    <div
      onClick={handleDismiss}
      className={`
        fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden
        transition-all duration-700
        ${phase === "done" ? "cursor-pointer" : "cursor-default"}
      `}
      style={{
        backgroundColor:
          phase === "glow"
            ? "rgba(15,15,35,0.55)"
            : phase === "burst"
              ? "rgba(15,15,35,0.75)"
              : "rgba(15,15,35,0.95)",
        backdropFilter:
          phase === "glow"
            ? "blur(4px)"
            : phase === "burst"
              ? "blur(8px)"
              : "blur(20px)",
      }}
    >
      {/* ── Ambient motes ── */}
      <div className="absolute inset-0 pointer-events-none">
        {motes.map((m) => (
          <div
            key={m.id}
            className="absolute rounded-full rev-mote"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.size,
              height: m.size,
              backgroundColor: HUE_MAP[m.hue],
              boxShadow: `0 0 ${m.size * 4}px ${HUE_MAP[m.hue]}50`,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.duration}s`,
              opacity: phase === "burst" ? 0.7 : 0.35,
            }}
          />
        ))}
      </div>

      {/* ═══════════ Phase 1: GLOW ═══════════ */}
      {phase === "glow" && (
        <div className="relative flex flex-col items-center animate-[rev-fade-in_0.4s_ease-out]">
          {/* Concentric rings */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border rev-ring"
              style={{
                width: 80 + i * 50,
                height: 80 + i * 50,
                borderColor: i % 2 === 0 ? "rgba(168,85,247,0.25)" : "rgba(244,63,94,0.2)",
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))}

          {/* Central orb */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/30 to-rose-600/30 rev-orb-pulse" />
            <div className="absolute inset-3 rounded-full bg-[#12122a]/90 border border-white/10" />
            <PixelIcon name="icon-mask" size={36} color="#f43f5e" className="relative z-10" />
          </div>

          {/* Label */}
          <p className="font-pixel text-rose-500 text-[10px] tracking-[0.3em] uppercase mt-10 neon-glow-rose animate-[rev-fade-in_0.5s_ease-out_0.3s_both]">
            RESONANCE_DETECTED
          </p>
          <div className="flex gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-1.5 h-1.5 rounded-full bg-rose-500/50 animate-pulse"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ Phase 2: BURST ═══════════ */}
      {phase === "burst" && (
        <div className="relative flex flex-col items-center">
          {/* White flash */}
          <div className="fixed inset-0 bg-white/15 rev-flash pointer-events-none" />

          {/* Flying fragments */}
          <div className="relative w-28 h-28">
            {fragments.map((f) => (
              <div
                key={f.id}
                className="absolute top-1/2 left-1/2 rounded-sm rev-fragment"
                style={{
                  width: f.size,
                  height: f.size,
                  background: `linear-gradient(135deg, #a855f7, #f43f5e)`,
                  boxShadow: "0 0 6px rgba(168,85,247,0.6)",
                  "--frag-tx": `${f.tx}px`,
                  "--frag-ty": `${f.ty}px`,
                  "--frag-rot": `${f.rot}deg`,
                  animationDelay: `${f.delay}s`,
                  marginLeft: -f.size / 2,
                  marginTop: -f.size / 2,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <p className="font-pixel text-white/50 text-[10px] tracking-[0.25em] uppercase mt-10 animate-pulse">
            IDENTITY_DECRYPTED
          </p>
        </div>
      )}

      {/* ═══════════ Phase 3 & 4: REVEAL / DONE ═══════════ */}
      {showCard && (
        <div className="flex flex-col items-center gap-6 px-4 w-full max-w-lg animate-[rev-fade-in_0.5s_ease-out]">
          {/* Status badge */}
          <div className="font-pixel text-rose-500 text-[10px] font-bold tracking-[0.35em] uppercase flex items-center gap-3 bg-rose-500/8 px-6 py-2.5 border border-rose-500/15 rounded-sm neon-glow-rose">
            <PixelIcon name="icon-sparkle" size={12} color="currentColor" className="animate-[spin_5s_linear_infinite]" />
            SYNC_ESTABLISHED
            <PixelIcon name="icon-sparkle" size={12} color="currentColor" className="animate-[spin_5s_linear_infinite_reverse]" />
          </div>

          {/* ── Identity Card ── */}
          <div className="relative w-full flex justify-center">
            <div
              className={`relative w-full max-w-sm rounded-2xl overflow-hidden ${
                phase === "reveal" ? "rev-card-enter" : ""
              }`}
            >
              {/* Glow border */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/40 via-rose-500/25 to-cyan-500/30 pointer-events-none" />

              {/* Card body */}
              <div className="relative bg-[#12122a] m-px rounded-2xl p-7">
                {/* Light sweep overlay */}
                {phase === "reveal" && <div className="absolute inset-0 rounded-2xl rev-light-sweep pointer-events-none" />}

                {/* Watermark */}
                <div className="absolute top-3 right-3 font-pixel text-[7px] text-white/[0.04] tracking-[0.4em] leading-relaxed text-right select-none">
                  AKASHA_PASS<br />REALITY_VERIFIED
                </div>

                {/* Profile */}
                <div className="flex gap-5 items-center mb-7">
                  <div className="relative">
                    <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-br from-purple-500/30 to-rose-500/30 blur-md" />
                    <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-purple-500/50 to-rose-500/50">
                      {isPhantom ? (
                        <div className="w-16 h-16 flex items-center justify-center font-pixel text-2xl bg-[#12122a] rounded-lg text-white/25">
                          ?
                        </div>
                      ) : (
                        <Avatar
                          src={stranger?.avatarUrl || undefined}
                          fallback={(stranger?.name || "U").charAt(0)}
                          size="lg"
                          shape="square"
                          className="!bg-[#12122a] !w-16 !h-16 !rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[8px] text-white/25 uppercase mb-1.5 tracking-wider">
                      Subject Name
                    </div>
                    <div className="font-pixel text-lg font-bold text-white tracking-tight neon-glow-purple truncate">
                      {isPhantom ? "VOID_PHANTOM" : stranger?.name || "UNNAMED_TRAVELER"}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="border-t border-dashed border-white/8" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#12122a] px-2">
                    <PixelIcon name="icon-ticket" size={10} color="rgba(255,255,255,0.12)" />
                  </div>
                </div>

                {/* Score + action */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-pixel text-[8px] text-white/25 uppercase mb-2 tracking-wider">
                      Resonance Index
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-pixel text-2xl font-bold text-rose-500 neon-glow-rose tabular-nums">
                        {resonanceScore ? (resonanceScore * 100).toFixed(1) : "---"}%
                      </div>
                      <Badge
                        variant="success"
                        size="sm"
                        className="!bg-rose-500/10 !text-rose-500 !border-rose-500/20 !font-pixel !text-[7px] !px-2 !py-0.5"
                      >
                        SYNCED
                      </Badge>
                    </div>
                  </div>

                  {!isPhantom && stranger?.route && (
                    <div className="bg-white/90 text-[#0F0F23] font-pixel text-[9px] px-5 py-2.5 rounded-sm shadow-pixel hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">
                      VIEW_PROFILE
                    </div>
                  )}
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-1 space-y-4 animate-[rev-fade-in_0.6s_ease-out_0.4s_both]">
            <p className="font-retro text-xs text-white/30 leading-relaxed max-w-xs mx-auto">
              {isPhantom
                ? "Data phantom detected. True resonance requires biological presence."
                : "Neural sync established. Subject identity recovered from the stream."}
            </p>

            {phase === "done" && (
              <div className="flex flex-col items-center gap-2 animate-[rev-fade-in_0.4s_ease-out]">
                <div className="w-px h-8 bg-gradient-to-b from-rose-500/25 to-transparent" />
                <p className="font-pixel text-rose-500/25 text-[8px] tracking-[0.3em] uppercase animate-pulse">
                  TAP_TO_CONTINUE
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

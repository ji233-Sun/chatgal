"use client";

/**
 * ConversationObserver - Retro-Futurism Optimized
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, Badge } from "arcadeui";
import StrangerAvatar from "./StrangerAvatar";
import RevelationEffect from "./RevelationEffect";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ResonanceVisualizer from "./ResonanceVisualizer";
import PixelIcon from "../ui/PixelIcon";
import { CARRIAGE_NAMES, CARRIAGE_COLORS } from "@/app/lib/carriage";

interface Message {
  id: string;
  agentSide: string;
  content: string;
  timestamp: string;
}

interface SessionData {
  id: string;
  state: string;
  carriageType: string;
  currentTurn: number;
  maxTurns: number;
  resonanceScore: number | null;
  isPhantom: boolean;
  mySide: string;
  topicData?: { title: string; linkUrl: string } | null;
}

interface StrangerInfo {
  name?: string | null;
  avatarUrl?: string | null;
  route?: string | null;
}

interface ConversationObserverProps {
  sessionId: string;
}

export default function ConversationObserver({ sessionId }: ConversationObserverProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stranger, setStranger] = useState<StrangerInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAdvancingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversation/${sessionId}`);
      const result = await res.json();
      if (result.code === 0) {
        setSession(result.data.session);
        setMessages(result.data.messages);
        if (result.data.stranger) setStranger(result.data.stranger);
        if (result.data.session.state === "REVEALED" && !revealComplete) setShowReveal(true);
      }
    } catch (e) { console.error(e); }
  }, [sessionId, revealComplete]);

  const advance = useCallback(async () => {
    if (isAdvancingRef.current || !session) return;
    if (session.state === "REVEALED" || session.state === "FADED_OUT") return;

    isAdvancingRef.current = true;
    setIsTyping(true);

    try {
      const res = await fetch(`/api/conversation/${sessionId}/advance`, { method: "POST" });
      const result = await res.json();
      if (result.code === 0 && result.data) {
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
        setMessages((prev) => [...prev, result.data.message]);
        setIsTyping(false);
        setSession((prev) => prev ? { ...prev, currentTurn: prev.currentTurn + 1, state: result.data.sessionState } : prev);
        if (result.data.resonanceTriggered) {
          await loadSession();
          setShowReveal(true);
        }
      } else {
        setIsTyping(false);
      }
    } catch (e) { setIsTyping(false); } finally { isAdvancingRef.current = false; }
  }, [session, sessionId, loadSession]);

  useEffect(() => { loadSession(); }, [loadSession]);

  useEffect(() => {
    if (!session || session.state === "REVEALED" || session.state === "FADED_OUT") return;
    advanceTimerRef.current = setInterval(advance, 5000 + Math.random() * 3000);
    if (messages.length === 0) advance();
    return () => { if (advanceTimerRef.current) clearInterval(advanceTimerRef.current); };
  }, [session, advance, messages.length]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  if (!session) return (
    <div className="flex h-full items-center justify-center bg-[#0F0F23]">
      <div className="font-pixel text-xs text-rose-500 animate-pulse">SYNCING_QUANTUM_LINK...</div>
    </div>
  );

  const carriageColor = CARRIAGE_COLORS[session.carriageType] || "#7C3AED";

  return (
    <div className="flex flex-col h-full bg-[#0F0F23] relative font-retro text-white">
      {/* 揭面特效 */}
      <RevelationEffect
        active={showReveal}
        isPhantom={session.isPhantom}
        stranger={stranger}
        resonanceScore={session.resonanceScore}
        onComplete={() => {
          setRevealComplete(true);
          setShowReveal(false);
          // 不在此处调用 loadSession()：revealComplete 状态变化会通过
          // useCallback 依赖链重建 loadSession，进而触发 useEffect 自动刷新数据
        }}
      />

      {/* Header Panel */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#0F0F23]/90 backdrop-blur-xl relative z-20">
        <div className="flex items-center justify-between container-responsive">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-purple-500/20 blur-sm rounded-lg" />
              <div className="relative p-2 bg-[#1a1a2e] border border-white/10 rounded-lg">
                <PixelIcon name="icon-train" size={20} color={carriageColor} className="animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs font-bold tracking-[0.2em] text-white/90 uppercase neon-glow-purple">
                  {CARRIAGE_NAMES[session.carriageType] || "UNKNOWN_CAR"}
                </span>
                <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 animate-[shimmer_2s_infinite] w-1/2" />
                </div>
              </div>
              {session.topicData?.title && (
                <div className="font-retro text-[11px] text-[#0084FF]/80 mt-1 truncate max-w-[200px] sm:max-w-[300px]" title={session.topicData.title}>
                  {session.topicData.title}
                </div>
              )}
              <div className="font-pixel text-[8px] text-white/20 mt-1 uppercase tracking-widest">
                ID: {sessionId.slice(0, 8)} // PASSIVE_OBSERVATION
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex flex-col items-end border-r border-white/5 pr-6">
              <span className="font-pixel text-[8px] text-white/20 mb-1">BUFFER_CAPACITY</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-1000 shadow-[0_0_8px_#7c3aed]" 
                    style={{ width: `${(session.currentTurn / session.maxTurns) * 100}%` }} 
                  />
                </div>
                <span className="font-pixel text-[10px] text-white/60 tabular-nums">
                  {session.currentTurn}/{session.maxTurns}
                </span>
              </div>
            </div>
            {session.resonanceScore !== null && (
              <div className="flex flex-col items-end">
                <span className="font-pixel text-[8px] text-rose-500/50 mb-1">RESONANCE</span>
                <div className="font-pixel text-xs text-rose-500 font-bold neon-glow-rose flex items-center gap-2">
                  <PixelIcon name="icon-sparkle" size={12} color="currentColor" />
                  {(session.resonanceScore * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Flow */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-12 scroll-smooth relative z-10"
      >
        {/* Resonance Visualizer */}
        <ResonanceVisualizer
          score={session.resonanceScore || 0}
          isActive={messages.length > 5 && !revealComplete}
        />

        <div className="container-responsive space-y-12 pb-24">
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-32 animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white/5 rounded-full mb-6 flex items-center justify-center border-dashed">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </div>
              <div className="font-pixel text-[10px] text-white/10 uppercase tracking-[0.3em]">Waiting for transmission...</div>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isMySide = msg.agentSide === session.mySide;
            const isLast = idx === messages.length - 1;

            return (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                timestamp={new Date(msg.timestamp)}
                isMySide={isMySide}
                isRevealed={revealComplete}
                agentName={isMySide ? "OWNER" : stranger?.name || undefined}
                agentAvatar={isMySide ? undefined : stranger?.avatarUrl || undefined}
                isNew={isLast && idx === messages.length - 1}
              />
            );
          })}

          {isTyping && <TypingIndicator isMySide={false} />}

          {revealComplete && session.state === "REVEALED" && stranger && (
            <div className="flex justify-center py-10">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 blur opacity-30 group-hover:opacity-60 transition duration-1000" />
                <div className="relative bg-[#0F0F23] border border-white/10 p-6 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-4 font-pixel text-[8px] text-white/5 tracking-[0.5em] leading-none">
                    AKASHA_PASS<br/>RECOVERY_COMPLETE
                  </div>

                  <div className="flex gap-5 items-center mb-8">
                    <div className="p-1 border border-amber-500/30 rounded-lg">
                      <Avatar src={stranger.avatarUrl || undefined} fallback="?" size="lg" shape="square" className="!bg-white/5" />
                    </div>
                    <div>
                      <div className="font-pixel text-base font-bold text-white mb-1 neon-glow-purple">{stranger.name || "UNNAMED"}</div>
                      <Badge variant="info" className="!bg-amber-500/10 !text-amber-500 !border-amber-500/20 !font-pixel !text-[8px]">DEPTH_SYNCED</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                    <div>
                      <div className="font-pixel text-[8px] text-white/30 uppercase mb-1">Resonance</div>
                      <div className="font-pixel text-lg font-bold text-rose-500 neon-glow-rose">{(session.resonanceScore! * 100).toFixed(1)}%</div>
                    </div>
                    {stranger.route && (
                      <div className="flex items-end justify-end">
                        <a
                          href={`https://second.me/${stranger.route}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-pixel text-[10px] bg-white text-[#0F0F23] px-4 py-2 rounded-sm hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2"
                        >
                          CONNECT
                          <PixelIcon name="icon-arrow-right" size={10} color="currentColor" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 知乎原文链接（会话结束后显示） */}
          {(session.state === "REVEALED" || session.state === "FADED_OUT") && session.topicData?.linkUrl && (
            <div className="flex justify-center py-4">
              <a
                href={session.topicData.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[11px] text-[#0084FF] hover:text-[#0084FF]/80 border border-[#0084FF]/30 px-5 py-2.5 rounded-lg hover:bg-[#0084FF]/10 transition-all flex items-center gap-2"
              >
                <PixelIcon name="icon-sparkle" size={12} color="#0084FF" />
                查看知乎原文
                <PixelIcon name="icon-arrow-right" size={10} color="#0084FF" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-6 py-4 border-t border-white/5 bg-[#0F0F23]/90 backdrop-blur-md relative z-20">
        <div className="container-responsive flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${session.state === 'REVEALED' ? 'bg-amber-500' : 'bg-purple-500'} animate-pulse shadow-[0_0_8px_currentColor]`} />
            <div className="flex flex-col">
              <span className="font-pixel text-[10px] text-white/80 tracking-widest uppercase">
                {session.state === "REVEALED" ? "PROTOCOL_STABLE" : "SYNCING_BITSTREAM..."}
              </span>
              <span className="font-pixel text-[8px] text-white/20 mt-0.5 uppercase">Passive Observation Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="font-pixel text-[8px] text-white/10 uppercase mb-1">Connection State</span>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-1 h-3 rounded-sm ${i < 3 ? 'bg-purple-500/40' : 'bg-white/5'}`} />
                  ))}
                </div>
             </div>
             <PixelIcon name="icon-scope" size={20} color={session.state === 'REVEALED' ? '#f59e0b' : '#7c3aed'} className="animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

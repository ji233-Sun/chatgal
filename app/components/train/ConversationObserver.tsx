"use client";

/**
 * ConversationObserver - 核心观测界面
 * 用户作为"列车长"静默观看 Agent 对话
 * 特点：无输入框、自动推进、实时展示
 */

import { useEffect, useState, useRef, useCallback } from "react";
import StrangerAvatar from "./StrangerAvatar";
import RevelationEffect from "./RevelationEffect";

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
}

interface StrangerInfo {
  name?: string | null;
  avatarUrl?: string | null;
  route?: string | null;
}

interface ConversationObserverProps {
  sessionId: string;
}

const CARRIAGE_NAMES: Record<string, string> = {
  tech: "技术工坊",
  art: "艺术长廊",
  philosophy: "观景台",
  gaming: "娱乐车厢",
};

const CARRIAGE_EMOJI: Record<string, string> = {
  tech: "🔧",
  art: "🎨",
  philosophy: "🔭",
  gaming: "🎮",
};

export default function ConversationObserver({
  sessionId,
}: ConversationObserverProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stranger, setStranger] = useState<StrangerInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAdvancingRef = useRef(false);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // 加载会话数据
  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversation/${sessionId}`);
      const result = await res.json();
      if (result.code === 0) {
        setSession(result.data.session);
        setMessages(result.data.messages);
        if (result.data.stranger) setStranger(result.data.stranger);

        // 检查是否已揭面
        if (result.data.session.state === "REVEALED" && !revealComplete) {
          setShowReveal(true);
        }
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    }
  }, [sessionId, revealComplete]);

  // 推进对话
  const advance = useCallback(async () => {
    if (isAdvancingRef.current) return;
    if (!session) return;
    if (session.state === "REVEALED" || session.state === "FADED_OUT") return;

    isAdvancingRef.current = true;
    setIsTyping(true);

    try {
      const res = await fetch(`/api/conversation/${sessionId}/advance`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.code === 0 && result.data) {
        const { message, resonanceTriggered, sessionState } = result.data;

        // 模拟打字延迟后显示消息
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));

        setMessages((prev) => [...prev, message]);
        setIsTyping(false);
        setSession((prev) =>
          prev
            ? {
                ...prev,
                currentTurn: prev.currentTurn + 1,
                state: sessionState,
              }
            : prev,
        );

        if (resonanceTriggered) {
          // 重新加载以获取完整揭面数据
          await loadSession();
          setShowReveal(true);
          return;
        }

        if (sessionState === "FADED_OUT") return;
      } else if (result.code === 1) {
        // 会话已结束
        setSession((prev) =>
          prev
            ? { ...prev, state: result.data?.sessionState || "FADED_OUT" }
            : prev,
        );
        setIsTyping(false);
        return;
      } else {
        setError(result.message || "推进对话失败");
        setIsTyping(false);
      }
    } catch (e) {
      console.error("Advance error:", e);
      setIsTyping(false);
    } finally {
      isAdvancingRef.current = false;
    }
  }, [session, sessionId, loadSession]);

  // 初始加载
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // 自动推进对话
  useEffect(() => {
    if (!session) return;
    if (session.state === "REVEALED" || session.state === "FADED_OUT") return;

    // 3-5秒间隔推进
    const interval = 3000 + Math.random() * 2000;
    advanceTimerRef.current = setInterval(advance, interval);

    // 首次立即推进（如果没有消息）
    if (messages.length === 0) {
      advance();
    }

    return () => {
      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
    };
  }, [session?.state, session?.id, advance, messages.length]);

  // 自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  const carriageName = CARRIAGE_NAMES[session.carriageType] || session.carriageType;
  const carriageEmoji = CARRIAGE_EMOJI[session.carriageType] || "🚃";

  return (
    <div className="flex flex-col h-full">
      {/* 揭面特效 */}
      <RevelationEffect
        active={showReveal}
        isPhantom={session.isPhantom}
        stranger={stranger}
        resonanceScore={session.resonanceScore}
        onComplete={() => {
          setRevealComplete(true);
          setShowReveal(false);
          loadSession();
        }}
      />

      {/* 车厢头部 */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{carriageEmoji}</span>
            <span className="text-sm font-medium text-white/70">
              {carriageName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>
              {session.currentTurn}/{session.maxTurns} 轮
            </span>
            {session.resonanceScore !== null && (
              <span className="text-amber-400/60">
                共鸣 {(session.resonanceScore * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 对话流 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        {/* 开场白 */}
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-12 text-white/20 text-sm">
            列车缓缓驶入数据星海...
          </div>
        )}

        {messages.map((msg) => {
          const isMyAgent = msg.agentSide === session.mySide;
          return (
            <div
              key={msg.id}
              className={`flex gap-3 animate-[fade-slide-up_0.4s_ease-out] ${
                isMyAgent ? "flex-row-reverse" : ""
              }`}
            >
              {/* 头像 */}
              {isMyAgent ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-sm shrink-0">
                  👤
                </div>
              ) : (
                <div className="shrink-0">
                  <StrangerAvatar
                    revealed={revealComplete}
                    avatarUrl={stranger?.avatarUrl}
                    name={stranger?.name}
                    size="sm"
                  />
                </div>
              )}

              {/* 消息气泡 */}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMyAgent
                    ? "bg-cyan-500/10 text-white/80 rounded-tr-sm"
                    : "bg-white/5 text-white/70 rounded-tl-sm"
                }`}
              >
                {/* 身份标签 */}
                <div
                  className={`text-[10px] mb-1 ${
                    isMyAgent ? "text-cyan-400/50" : "text-violet-400/50"
                  }`}
                >
                  {isMyAgent
                    ? "你的 Agent"
                    : revealComplete && stranger?.name
                      ? stranger.name
                      : `Passenger #${sessionId.slice(-4).toUpperCase()}`}
                </div>
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}

        {/* 打字指示器 */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="shrink-0">
              <StrangerAvatar revealed={false} size="sm" />
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" />
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
              </div>
            </div>
          </div>
        )}

        {/* 和平散场 */}
        {session.state === "FADED_OUT" && (
          <div className="text-center py-8 space-y-3 animate-[fade-in_1s_ease-out]">
            <div className="text-white/20 text-sm italic">
              Passenger #{sessionId.slice(-4).toUpperCase()} 站起身，整理了一下衣领
            </div>
            <div className="text-white/15 text-sm italic">
              向你的 Agent 点了点头
            </div>
            <div className="text-white/10 text-sm italic">
              转身走向车厢连接处，消失在闪烁的星海中
            </div>
            <div className="text-white/30 text-xs mt-6">
              相忘于星海 — 对话已结束
            </div>
          </div>
        )}

        {/* 揭面后的信息 */}
        {revealComplete && session.state === "REVEALED" && stranger && (
          <div className="mx-auto max-w-xs mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-violet-500/10 border border-amber-500/20 text-center animate-[fade-in_1s_ease-out]">
            <div className="text-amber-400 text-xs font-medium mb-2">
              ✦ 共鸣唱片 ✦
            </div>
            <div className="text-white/80 text-sm font-medium">
              {stranger.name || "神秘旅客"}
            </div>
            {session.resonanceScore !== null && (
              <div className="text-amber-400/70 text-xs mt-1">
                共鸣指数 {(session.resonanceScore * 100).toFixed(1)}%
              </div>
            )}
            {stranger.route && (
              <a
                href={`https://second.me/${stranger.route}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-400 text-xs hover:bg-amber-400/20 transition-colors"
              >
                申请连接 →
              </a>
            )}
          </div>
        )}
      </div>

      {/* 底部状态栏 - 绝对无输入框！ */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
          <span>
            {session.state === "REVEALED"
              ? "共鸣已达成"
              : session.state === "FADED_OUT"
                ? "旅途已结束"
                : "观测中 — 列车长无需干预"}
          </span>
        </div>
      </div>
    </div>
  );
}

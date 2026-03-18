"use client";

/**
 * /train/history - 旅途日志
 * 查看所有历史对话，按状态筛选，恢复未完成对话
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionHistoryCard, {
  type SessionCardData,
} from "@/app/components/train/SessionHistoryCard";
import PixelIcon from "@/app/components/ui/PixelIcon";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

type FilterTab = "ALL" | "REVEALED" | "FADED_OUT" | "ANONYMOUS";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "全部" },
  { key: "REVEALED", label: "共鸣" },
  { key: "FADED_OUT", label: "消逝" },
  { key: "ANONYMOUS", label: "进行中" },
];

/** 各 tab 空态文案 */
const EMPTY_MESSAGES: Record<FilterTab, { text: string; icon: string }> = {
  ALL: { text: "暂无旅途记录，去启程一段新的旅途吧", icon: "icon-train" },
  REVEALED: { text: "还没有共鸣记录，继续探索吧", icon: "icon-sparkle" },
  FADED_OUT: { text: "没有消逝的旅途", icon: "icon-star-empty" },
  ANONYMOUS: { text: "没有进行中的旅途", icon: "icon-scope" },
};

export default function HistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [sessions, setSessions] = useState<SessionCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [showAbandonAllConfirm, setShowAbandonAllConfirm] = useState(false);
  const [abandoningSessionId, setAbandoningSessionId] = useState<string | null>(null);

  const fetchSessions = useCallback(async (tab: FilterTab) => {
    setLoading(true);
    try {
      const param = tab === "ALL" ? "" : `?state=${tab}`;
      const res = await fetch(`/api/train/sessions${param}`);
      const result = await res.json();
      if (result.code === 0) {
        setSessions(result.data.sessions);
      }
    } catch (e) {
      console.error("[history] fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAbandonAll = useCallback(async () => {
    setIsAbandoning(true);
    setShowAbandonAllConfirm(false);
    try {
      const res = await fetch("/api/train/abandon-all", { method: "POST" });
      const result = await res.json();
      if (result.code === 0) {
        await fetchSessions(activeTab);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAbandoning(false);
    }
  }, [activeTab, fetchSessions]);

  const handleAbandonOne = useCallback(async (sessionId: string) => {
    setAbandoningSessionId(null);
    try {
      const res = await fetch(`/api/conversation/${sessionId}/abandon`, { method: "POST" });
      const result = await res.json();
      if (result.code === 0) {
        await fetchSessions(activeTab);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab, fetchSessions]);

  useEffect(() => {
    fetchSessions(activeTab);
  }, [activeTab, fetchSessions]);

  function handleTabChange(tab: FilterTab) {
    if (tab === activeTab) return;
    setActiveTab(tab);
  }

  function handleCardClick(sessionId: string) {
    router.push(`/train/${sessionId}`);
  }

  const emptyState = EMPTY_MESSAGES[activeTab];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b-2 border-white/5">
        <Link
          href="/train"
          className="inline-flex items-center gap-2 font-pixel text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          <PixelIcon name="icon-arrow-left" size={16} color="currentColor" />
          返回
        </Link>
        <h1 className="font-pixel text-sm font-bold tracking-[0.2em] text-white/80 uppercase">
          VOYAGE_LOG
        </h1>
        <div className="w-12" />
      </header>

      {/* Filter Tabs */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`
                  font-pixel text-[10px] px-3 py-1.5 rounded-sm border transition-all
                  ${
                    activeTab === tab.key
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_8px_rgba(124,58,237,0.2)]"
                      : "border-white/5 bg-transparent text-white/30 hover:text-white/50 hover:border-white/10"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {sessions.some(s => s.state === "ANONYMOUS") && (
            <button
              onClick={() => setShowAbandonAllConfirm(true)}
              disabled={isAbandoning}
              className="font-pixel text-[10px] text-white/30 hover:text-rose-500 transition-colors disabled:opacity-50 border border-white/5 hover:border-rose-500/30 px-3 py-1.5 rounded-sm"
            >
              {isAbandoning ? "..." : "放弃全部"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {loading ? (
            /* Skeleton 加载态 */
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full rounded-lg border border-white/5 p-4 animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-white/5 rounded" />
                      <div className="h-2 w-16 bg-white/5 rounded" />
                      <div className="h-2 w-48 bg-white/5 rounded" />
                    </div>
                    <div className="w-16 h-3 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </>
          ) : sessions.length === 0 ? (
            /* 空态 */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 p-4 rounded-full bg-white/5 border border-white/5">
                <PixelIcon
                  name={emptyState.icon}
                  size={32}
                  color="rgba(255,255,255,0.15)"
                />
              </div>
              <p className="font-pixel text-xs text-white/20 max-w-xs">
                {emptyState.text}
              </p>
              {activeTab === "ALL" && (
                <Link
                  href="/train"
                  className="mt-6 font-pixel text-[10px] text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 px-4 py-2 rounded-sm hover:bg-purple-500/10"
                >
                  启程出发 →
                </Link>
              )}
            </div>
          ) : (
            /* 会话列表 */
            sessions.map((s) => (
              <SessionHistoryCard
                key={s.id}
                session={s}
                onClick={handleCardClick}
                onAbandon={(id) => setAbandoningSessionId(id)}
              />
            ))
          )}
        </div>
      </main>

      {/* 放弃单个旅途确认对话框 */}
      <ConfirmDialog
        open={abandoningSessionId !== null}
        title="确定要放弃这次旅途吗？"
        message="放弃后将无法继续当前对话"
        confirmText="放弃"
        cancelText="取消"
        variant="danger"
        onConfirm={() => abandoningSessionId && handleAbandonOne(abandoningSessionId)}
        onCancel={() => setAbandoningSessionId(null)}
      />

      {/* 放弃全部旅途确认对话框 */}
      <ConfirmDialog
        open={showAbandonAllConfirm}
        title="确定要放弃所有进行中的旅途吗？"
        message={`将放弃 ${sessions.filter(s => s.state === "ANONYMOUS").length} 个进行中的旅途`}
        confirmText="全部放弃"
        cancelText="取消"
        variant="danger"
        onConfirm={handleAbandonAll}
        onCancel={() => setShowAbandonAllConfirm(false)}
      />
    </div>
  );
}

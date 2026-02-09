"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Spark, FeedItem, ChainData, UserStats } from "@/lib/types";
import { tokensToUsd, formatUsd } from "@/lib/types";
import SparkCard from "./SparkCard";
import Feed from "./Feed";
import IgniteGraph from "./KindnessGraph";
import AIInsightPanel from "./AIInsightPanel";
import Sidebar from "./Sidebar";

interface Props {
  sparks: Spark[];
  feedItems: FeedItem[];
  chainData: ChainData | null;
  stats: UserStats;
  currentUserId: string;
  displayName: string;
  onCreateSpark: () => void;
  onTapSpark: (spark: Spark) => void;
  onLogout: () => void;
}

type Tab = "sparks" | "feed" | "graph";

export default function Dashboard({ sparks, feedItems, chainData, stats, currentUserId, displayName, onCreateSpark, onTapSpark, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("sparks");
  const [filter, setFilter] = useState<"all" | "active" | "ignited">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredSparks = filter === "all" ? sparks : sparks.filter((s) => s.status === filter);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* ─── Native-style header ─── */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-xl">
        <div className="safe-top" />
        <div className="max-w-md mx-auto px-4 h-11 flex items-center justify-between">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-xl active:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
              <rect x="2" y="9.25" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.45" />
              <rect x="2" y="14.5" width="16" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
            </svg>
          </button>

          {/* Center title */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <h1 className="text-[15px] font-bold gradient-text tracking-tight">Spark Ignite</h1>
          </div>

          {/* Token badge — compact */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full bg-ignite-gold" />
            <span className="text-xs font-semibold text-ignite-gold">{formatUsd(tokensToUsd(stats.balance))}</span>
          </div>
        </div>

        {/* Tab bar — iOS segmented control style */}
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="flex h-8 p-0.5 rounded-lg bg-white/[0.05]">
            {(["sparks", "feed", "graph"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 flex items-center justify-center text-[11px] font-semibold rounded-md transition-all ${
                  tab === t ? "text-white" : "text-white/35"
                }`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t === "sparks" ? "Sparks" : t === "feed" ? "Feed" : "Graph"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {/* AI Insights — compact strip */}
        <div className="mb-3">
          <AIInsightPanel />
        </div>

        {tab === "sparks" && (
          <>
            {/* Filter chips */}
            <div className="flex gap-1.5 mb-3">
              {(["all", "active", "ignited"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[11px] px-3 py-1 rounded-full transition-all ${
                    filter === f
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-white/25 active:bg-white/[0.04]"
                  }`}
                >
                  {f === "all" ? "All" : f === "active" ? "Active" : "Ignited"}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredSparks.map((spark) => (
                <SparkCard key={spark.id} spark={spark} currentUserId={currentUserId} onTap={onTapSpark} />
              ))}
            </div>

            {filteredSparks.length === 0 && (
              <div className="text-center py-16 text-white/20">
                <div className="text-3xl mb-3">✨</div>
                <div className="text-sm font-medium">No sparks here yet</div>
                <div className="text-xs text-white/15 mt-1">Create one to get started</div>
              </div>
            )}
          </>
        )}

        {tab === "feed" && <Feed items={feedItems} />}

        {tab === "graph" && (
          <div className="h-[420px] rounded-2xl overflow-hidden border border-white/[0.04]">
            <IgniteGraph data={chainData} currentUserId={currentUserId} />
          </div>
        )}
      </div>

      {/* ─── FAB ─── */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30">
        <motion.button
          onClick={onCreateSpark}
          className="h-12 px-6 rounded-full bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold text-sm shadow-lg shadow-ignite-flame/25 flex items-center gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Spark
        </motion.button>
      </div>

      {/* ─── Sidebar ─── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        stats={stats}
        sparks={sparks}
        currentUserId={currentUserId}
        displayName={displayName}
        onLogout={onLogout}
      />
    </div>
  );
}

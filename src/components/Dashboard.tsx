"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Spark, FeedItem, ChainData, UserStats } from "@/lib/types";
import SparkCard from "./SparkCard";
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

export default function Dashboard({ sparks, feedItems, chainData, stats, currentUserId, displayName, onCreateSpark, onTapSpark, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-40 bg-[#060B14]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="safe-top" />
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl active:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
              <rect x="2" y="9.25" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.45" />
              <rect x="2" y="14.5" width="16" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
            </svg>
          </button>

          {/* Center title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h1 style={{ fontSize: 18, fontWeight: 700, background: "linear-gradient(135deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Spark Ignite
            </h1>
          </div>

          {/* Alien balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="text-xs">👽</span>
            <span className="text-xs font-semibold text-white/70">{stats.balance}</span>
          </div>
        </div>
      </div>

      {/* ─── Sparks list ─── */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-24">
        <div className="space-y-3">
          {sparks.map((spark) => (
            <SparkCard key={spark.id} spark={spark} currentUserId={currentUserId} onTap={onTapSpark} />
          ))}
        </div>

        {sparks.length === 0 && (
          <div className="text-center py-16 text-white/20">
            <div className="text-3xl mb-3">✨</div>
            <div className="text-sm font-medium">No sparks here yet</div>
            <div className="text-xs text-white/15 mt-1">Create one to get started</div>
          </div>
        )}
      </div>

      {/* ─── FAB ─── */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30">
        <motion.button
          onClick={onCreateSpark}
          style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", boxShadow: "0 4px 24px rgba(59,130,246,0.3)" }}
          className="h-12 px-6 rounded-full text-white font-semibold text-sm flex items-center gap-1.5"
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

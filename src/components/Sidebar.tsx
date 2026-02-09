"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Spark, UserStats } from "@/lib/types";
import { tokensToUsd, formatUsd } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  sparks: Spark[];
  currentUserId: string;
  displayName: string;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, stats, sparks, currentUserId, displayName, onLogout }: Props) {
  const mySparks = sparks.filter((s) => s.creatorId === currentUserId);
  const backing = sparks.filter((s) => s.backerIds.includes(currentUserId) && s.creatorId !== currentUserId);
  const ignitedCount = sparks.filter((s) => s.status === "ignited").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[#0e0e20] border-r border-white/[0.06] flex flex-col"
          >
            {/* Profile header */}
            <div className="px-5 pt-14 pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ignite-flame to-ignite-ember flex items-center justify-center text-base font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{displayName}</div>
                  <div className="text-[11px] text-white/30">Verified Human</div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center px-2 py-2 rounded-xl bg-white/[0.04]">
                  <div className="text-sm font-bold text-ignite-gold">{formatUsd(tokensToUsd(stats.balance))}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">{stats.balance} tokens</div>
                </div>
                <div className="text-center px-2 py-2 rounded-xl bg-white/[0.04]">
                  <div className="text-sm font-bold text-ignite-teal">{stats.sparksBacked}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Backed</div>
                </div>
                <div className="text-center px-2 py-2 rounded-xl bg-white/[0.04]">
                  <div className="text-sm font-bold text-ignite-flame">{stats.sparksCreated}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Created</div>
                </div>
              </div>
            </div>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto py-3">
              {/* My Sparks */}
              <div className="px-4 mb-1">
                <div className="text-[10px] text-white/25 uppercase tracking-widest font-medium px-1 mb-2">My Sparks</div>
                {mySparks.length === 0 ? (
                  <div className="text-xs text-white/20 px-1 py-2">No sparks created yet</div>
                ) : (
                  mySparks.map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "ignited" ? "bg-ignite-flame" : "bg-ignite-cosmic"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 truncate">{s.title}</div>
                        <div className="text-[10px] text-white/30">{formatUsd(tokensToUsd(s.raised))}/{formatUsd(s.goalUsd)} · {s.backerIds.length} backers</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mx-4 border-t border-white/[0.04] my-2" />

              {/* Backing */}
              <div className="px-4 mb-1">
                <div className="text-[10px] text-white/25 uppercase tracking-widest font-medium px-1 mb-2">Funding</div>
                {backing.length === 0 ? (
                  <div className="text-xs text-white/20 px-1 py-2">Not backing any sparks yet</div>
                ) : (
                  backing.map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "ignited" ? "bg-ignite-flame" : "bg-ignite-teal"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 truncate">{s.title}</div>
                        <div className="text-[10px] text-white/30">{Math.round((s.raised / s.goal) * 100)}% funded</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mx-4 border-t border-white/[0.04] my-2" />

              {/* Activity summary */}
              <div className="px-4">
                <div className="text-[10px] text-white/25 uppercase tracking-widest font-medium px-1 mb-2">Activity</div>
                <div className="px-2 py-2 text-xs text-white/40 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Total contributed</span>
                    <span className="text-ignite-gold font-medium">{formatUsd(tokensToUsd(stats.totalContributed))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sparks ignited</span>
                    <span className="text-ignite-flame font-medium">{ignitedCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/[0.06]">
              <button
                onClick={onLogout}
                className="text-xs text-white/25 hover:text-white/40 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

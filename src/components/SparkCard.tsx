"use client";

import { motion } from "framer-motion";
import type { Spark } from "@/lib/types";
import { IGNITE_THRESHOLD } from "@/lib/types";
import { TOKEN_USD_RATE } from "./SparkDetailView";

interface Props {
  spark: Spark;
  currentUserId?: string;
  onTap: (spark: Spark) => void;
}

export default function SparkCard({ spark, currentUserId, onTap }: Props) {
  const pct = Math.min(100, Math.round((spark.raised / spark.goal) * 100));
  const backersNeeded = Math.max(0, IGNITE_THRESHOLD - spark.backerIds.length);
  const isIgnited = spark.status === "ignited";
  const isCreator = currentUserId === spark.creatorId;
  const hasPledged = currentUserId ? spark.backerIds.includes(currentUserId) : false;
  const usdRaised = (spark.raised * TOKEN_USD_RATE).toFixed(2);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onTap(spark)}
      className={`w-full text-left rounded-2xl border overflow-hidden transition-colors active:scale-[0.98] ${
        isIgnited
          ? "bg-gradient-to-br from-ignite-flame/[0.08] to-ignite-gold/[0.06] border-ignite-flame/20"
          : "bg-white/[0.02] border-white/[0.05] active:bg-white/[0.04]"
      }`}
    >
      <div className="px-4 py-3.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-white leading-tight truncate">{spark.title}</h3>
            <p className="text-[11px] text-white/30 mt-0.5">by {spark.creatorName}{isCreator ? " (you)" : ""}</p>
          </div>
          {isIgnited && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ignite-flame/15 text-ignite-flame font-semibold flex-shrink-0">
              IGNITED
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-white/40 leading-relaxed mb-3 line-clamp-2">{spark.description}</p>

        {/* Progress bar */}
        <div className="mb-2.5">
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className={`h-full rounded-full progress-bar-fill ${
                isIgnited
                  ? "bg-gradient-to-r from-ignite-flame to-ignite-gold"
                  : "bg-gradient-to-r from-ignite-cosmic to-ignite-teal"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/50">
              <span className="font-semibold text-ignite-gold">{spark.raised}</span>
              <span className="text-white/25">/{spark.goal}</span>
              <span className="text-white/20 ml-1">${usdRaised}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Pledge dots */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: IGNITE_THRESHOLD }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < spark.backerIds.length
                      ? isIgnited ? "bg-ignite-flame" : "bg-ignite-teal"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/25">
              {isIgnited ? "Ignited" : `${backersNeeded} more`}
            </span>

            {/* Chevron */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/15 ml-1">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Spark } from "@/lib/types";
import { IGNITE_THRESHOLD, CATEGORY_EMOJI } from "@/lib/types";

// Constants
export const TOKEN_USD_RATE = 0.47;

export function formatUsd(tokens: number): string {
  return "$" + (tokens * TOKEN_USD_RATE).toFixed(2);
}

interface Props {
  spark: Spark;
  currentUserId: string;
  onBack: () => void;
  onPledge: (sparkId: string) => Promise<void>;
  onFund: (sparkId: string, amount: number) => Promise<void>;
  onShare: (spark: Spark) => void;
}

interface BackerDisplay {
  id: string;
  name: string;
  amount: number;
  note?: string;
  createdAt: number;
  avatar?: string;
}

export default function SparkDetailView({
  spark,
  currentUserId,
  onBack,
  onPledge,
  onFund,
  onShare,
}: Props) {
  const [fundAmount, setFundAmount] = useState(5);
  const [fundingInProgress, setFundingInProgress] = useState(false);
  const [pledgingInProgress, setPledgingInProgress] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);
  const [pledgeError, setPledgeError] = useState<string | null>(null);
  const [showFundSuccess, setShowFundSuccess] = useState(false);
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);

  const isCreator = currentUserId === spark.creatorId;
  const hasPledged = spark.backerIds.includes(currentUserId);
  const backersNeeded = Math.max(0, IGNITE_THRESHOLD - spark.backerIds.length);
  const fundingPercentage = Math.min(100, Math.round((spark.raised / spark.goal) * 100));
  const isIgnited = spark.status === "ignited";

  // Mock backer data - in production this would come from API
  const backers: BackerDisplay[] = useMemo(() => {
    const mockAmounts = [5, 10, 3, 7, 2, 15];
    const mockNotes = [
      "Love this idea!",
      "Can't wait to see this happen",
      "Supporting all the way",
      undefined,
      "Amazing work",
      undefined,
    ];

    return spark.backerIds.slice(0, 6).map((id, index) => ({
      id,
      name: `Backer ${index + 1}`,
      amount: mockAmounts[index % mockAmounts.length],
      note: mockNotes[index % mockNotes.length],
      createdAt: spark.createdAt + (index + 1) * 3600000, // Stagger by 1 hour
      avatar: `avatar-${index + 1}`,
    }));
  }, [spark.backerIds, spark.createdAt]);

  const handlePledge = async () => {
    if (pledgingInProgress) return;
    setPledgingInProgress(true);
    setPledgeError(null);

    try {
      await onPledge(spark.id);
      setShowPledgeSuccess(true);
      setTimeout(() => setShowPledgeSuccess(false), 2000);
    } catch (err) {
      setPledgeError(
        err instanceof Error ? err.message : "Failed to pledge. Please try again."
      );
    } finally {
      setPledgingInProgress(false);
    }
  };

  const handleFund = async () => {
    if (fundingInProgress || fundAmount <= 0) return;
    setFundingInProgress(true);
    setFundError(null);

    try {
      await onFund(spark.id, fundAmount);
      setShowFundSuccess(true);
      setFundAmount(5); // Reset
      setTimeout(() => setShowFundSuccess(false), 2000);
    } catch (err) {
      setFundError(err instanceof Error ? err.message : "Failed to fund. Please try again.");
    } finally {
      setFundingInProgress(false);
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-ignite-void flex flex-col safe-top overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-ignite-void/80 backdrop-blur-sm border-b border-white/5 px-4 py-3"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Back button */}
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <span className="text-lg">←</span>
          </motion.button>

          {/* Title */}
          <h1 className="flex-1 text-center text-base font-bold text-white truncate px-2">
            {spark.title}
          </h1>

          {/* Share button - only for creator */}
          {isCreator && (
            <motion.button
              onClick={() => onShare(spark)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <span className="text-lg">↗</span>
            </motion.button>
          )}

          {!isCreator && <div className="w-10" />}
        </div>
      </motion.header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section - Progress Ring */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-8 flex flex-col items-center justify-center"
        >
          {/* Circular Progress */}
          <div className="relative w-48 h-48 mb-6">
            {/* Background circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={565}
                strokeDashoffset={565 * (1 - fundingPercentage / 100)}
                initial={{ strokeDashoffset: 565 }}
                animate={{ strokeDashoffset: 565 * (1 - fundingPercentage / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8C42" />
                  <stop offset="100%" stopColor="#FF4B6E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-center"
              >
                <p className="text-sm text-white/60 mb-1">Raised</p>
                <p className="text-3xl font-bold gradient-text mb-2">{spark.raised}</p>
                <p className="text-xs text-white/40">of {spark.goal} tokens</p>
              </motion.div>
            </div>
          </div>

          {/* Token and USD amounts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-white/60 mb-1">
              {spark.raised} tokens ≈ <span className="text-ignite-gold font-bold">
                {formatUsd(spark.raised)}
              </span>
            </p>
            {isIgnited && (
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mt-2 px-3 py-1 rounded-full bg-ignite-flame/20 text-ignite-flame text-xs font-bold"
              >
                🔥 IGNITED
              </motion.span>
            )}
          </motion.div>

          {/* Category and creator info */}
          <div className="flex items-center gap-4 text-white/60 text-sm mb-2">
            <span>{CATEGORY_EMOJI[spark.category]} {spark.category}</span>
            <span>by {spark.creatorName}</span>
          </div>

          <p className="text-sm text-white/60 text-center max-w-sm leading-relaxed mb-4">
            {spark.description}
          </p>
        </motion.section>

        {/* Pledge Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-4 py-6 border-t border-white/5"
        >
          <h2 className="text-sm font-bold text-white mb-4">Help Ignite</h2>

          <div className="mb-4">
            <p className="text-xs text-white/60 mb-3">
              {spark.backerIds.length} of {IGNITE_THRESHOLD} backers
              {backersNeeded > 0 && (
                <span className="text-ignite-flame ml-1">({backersNeeded} more needed)</span>
              )}
            </p>

            {/* Backer circles */}
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: IGNITE_THRESHOLD }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < spark.backerIds.length
                      ? "bg-gradient-to-br from-ignite-flame to-ignite-gold text-ignite-void"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {i < spark.backerIds.length ? "✓" : i + 1}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pledge button */}
          {!isCreator && !hasPledged && (
            <motion.button
              onClick={handlePledge}
              disabled={pledgingInProgress}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-bold text-ignite-void bg-gradient-to-r from-ignite-flame to-ignite-ember disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
            >
              {pledgingInProgress ? "Pledging..." : "Pledge (1 vote)"}
            </motion.button>
          )}

          {hasPledged && !isCreator && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full py-3 rounded-lg font-bold text-white/60 bg-white/5 flex items-center justify-center gap-2"
            >
              <span>✓</span> You've pledged
            </motion.div>
          )}

          {isCreator && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full py-3 rounded-lg font-bold text-white/40 bg-white/5 text-center"
            >
              You created this spark
            </motion.div>
          )}

          <AnimatePresence>
            {pledgeError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-ignite-ember text-center"
              >
                {pledgeError}
              </motion.p>
            )}
            {showPledgeSuccess && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-ignite-gold text-center"
              >
                ✓ Pledge received!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Fund Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6 border-t border-white/5"
        >
          <h2 className="text-sm font-bold text-white mb-4">Fund This Spark</h2>

          {/* Token amount input */}
          <div className="mb-4">
            <label className="text-xs text-white/60 block mb-2">Amount (tokens)</label>
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-ignite-flame/50 focus:ring-1 focus:ring-ignite-flame/30"
              placeholder="Enter amount"
            />
            <p className="text-xs text-ignite-gold mt-1">
              ≈ {formatUsd(fundAmount)}
            </p>
          </div>

          {/* Quick-pick buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1, 5, 10, 25].map((amount) => (
              <motion.button
                key={amount}
                onClick={() => setFundAmount(amount)}
                whileTap={{ scale: 0.95 }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  fundAmount === amount
                    ? "bg-gradient-to-r from-ignite-flame to-ignite-gold text-ignite-void"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {amount}
              </motion.button>
            ))}
          </div>

          {/* Fund button */}
          <motion.button
            onClick={handleFund}
            disabled={fundingInProgress || fundAmount <= 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg font-bold text-ignite-void bg-ignite-teal disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
          >
            {fundingInProgress ? "Funding..." : `Fund ${fundAmount} token${fundAmount !== 1 ? "s" : ""}`}
          </motion.button>

          <AnimatePresence>
            {fundError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-ignite-ember text-center"
              >
                {fundError}
              </motion.p>
            )}
            {showFundSuccess && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-ignite-gold text-center"
              >
                ✓ Fund received!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Backers List */}
        {backers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="px-4 py-6 border-t border-white/5"
          >
            <h2 className="text-sm font-bold text-white mb-4">Backers ({backers.length})</h2>

            <div className="space-y-3">
              {backers.map((backer, index) => (
                <motion.div
                  key={backer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-ignite-cosmic to-ignite-flame flex items-center justify-center text-xs font-bold text-white">
                    {getInitial(backer.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-white truncate">{backer.name}</p>
                      <p className="text-xs text-ignite-gold font-bold flex-shrink-0">
                        {backer.amount}
                      </p>
                    </div>
                    {backer.note && (
                      <p className="text-xs text-white/60 mb-1 line-clamp-1 italic">
                        "{backer.note}"
                      </p>
                    )}
                    <p className="text-xs text-white/40">{timeAgo(backer.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Creator Admin Section */}
        {isCreator && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-6 border-t border-white/5"
          >
            <h2 className="text-sm font-bold text-white mb-4">Creator Tools</h2>

            {/* Share via SMS */}
            <motion.button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: spark.title,
                    text: spark.description,
                    url: window.location.href,
                  });
                } else {
                  onShare(spark);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-ignite-cosmic to-ignite-teal transition-all min-h-[44px] mb-3"
            >
              Share via SMS
            </motion.button>

            {/* Edit description */}
            <motion.button
              disabled
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-bold text-white/40 bg-white/5 transition-all min-h-[44px] mb-4 cursor-not-allowed"
            >
              Edit Description (coming soon)
            </motion.button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 }}
                className="p-3 rounded-lg bg-white/5 border border-white/5"
              >
                <p className="text-xs text-white/60 mb-1">Total Raised</p>
                <p className="text-lg font-bold text-ignite-gold">{spark.raised}</p>
                <p className="text-xs text-white/40 mt-1">{formatUsd(spark.raised)}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-white/5 border border-white/5"
              >
                <p className="text-xs text-white/60 mb-1">Unique Backers</p>
                <p className="text-lg font-bold text-ignite-teal">{spark.backerIds.length}</p>
                <p className="text-xs text-white/40 mt-1">of {IGNITE_THRESHOLD} needed</p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usdToTokens, TOKEN_USD, MAX_GOAL_USD } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, goalUsd: number, category: string) => Promise<void>;
}

const GOAL_PRESETS = [50, 100, 250, 500, 1000, 2500, 5000];

export default function CreateSparkModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalUsd, setGoalUsd] = useState(100);
  const [customGoal, setCustomGoal] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const effectiveGoal = customGoal ? parseInt(customGoal) || 0 : goalUsd;
  const goalTokens = usdToTokens(effectiveGoal);
  const isAlienEligible = effectiveGoal >= 500;

  const handleCreate = async () => {
    if (effectiveGoal < 10 || effectiveGoal > MAX_GOAL_USD) {
      setError(`Goal must be between $10 and $${MAX_GOAL_USD.toLocaleString()}`);
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await onCreate(title, description, effectiveGoal, "community");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle("");
        setDescription("");
        setGoalUsd(100);
        setCustomGoal("");
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-md bg-[#12122a] rounded-t-3xl border-t border-white/10 p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🔥</div>
                <h3 className="text-xl font-bold gradient-text">Spark Created!</h3>
                <p className="text-white/40 text-sm mt-2">Your idea is live. Share it to get it ignited.</p>
              </div>
            ) : (
              <>
                {/* Handle bar */}
                <div className="flex justify-center mb-5">
                  <div className="w-9 h-1 rounded-full bg-white/15" />
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-white">New Spark</h2>
                  <p className="text-white/35 text-xs mt-1">Propose an idea for the community to fund</p>
                </div>

                <div className="mb-4">
                  <label className="text-[11px] text-white/40 font-medium mb-1.5 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI Music Video for Indie Artists"
                    maxLength={80}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 outline-none focus:border-ignite-flame/30 transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[11px] text-white/40 font-medium mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's the idea? Why does it need community funding?"
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 outline-none focus:border-ignite-flame/30 resize-none transition-colors"
                  />
                </div>

                {/* USD Goal Section */}
                <div className="mb-4">
                  <label className="text-[11px] text-white/40 font-medium mb-2 block">
                    Funding Goal (USD)
                  </label>

                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {GOAL_PRESETS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { setGoalUsd(amount); setCustomGoal(""); }}
                        className={`text-[11px] px-3 py-1.5 rounded-full transition-all ${
                          effectiveGoal === amount && !customGoal
                            ? "bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold"
                            : "bg-white/[0.05] text-white/40 active:bg-white/[0.08]"
                        }`}
                      >
                        ${amount >= 1000 ? `${amount / 1000}k` : amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                    <input
                      type="number"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Custom amount"
                      min={10}
                      max={MAX_GOAL_USD}
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 outline-none focus:border-ignite-flame/30 transition-colors"
                    />
                  </div>

                  {/* Token conversion + info */}
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[10px] text-white/25">
                      = {goalTokens.toLocaleString()} tokens @ ${TOKEN_USD}/token
                    </p>
                    <p className="text-[10px] text-white/25">
                      $10 — ${MAX_GOAL_USD.toLocaleString()} max
                    </p>
                  </div>
                </div>

                {/* Alien Matched Badge */}
                <AnimatePresence>
                  {isAlienEligible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-ignite-cosmic/10 to-ignite-teal/10 border border-ignite-teal/20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">🛸</span>
                          <span className="text-xs font-bold text-ignite-teal">Alien Matched</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed">
                          Goals $500+ are eligible for Alien matching. When the community ignites this spark, Alien matches the full funding amount.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
                )}

                <motion.button
                  onClick={handleCreate}
                  disabled={creating || !title || !description || effectiveGoal < 10}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold text-[15px] disabled:opacity-40"
                  whileTap={{ scale: 0.97 }}
                >
                  {creating ? "Creating..." : `Launch Spark — $${effectiveGoal.toLocaleString()}`}
                </motion.button>

                <button onClick={onClose} className="w-full mt-3 py-2 text-white/25 text-sm">
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

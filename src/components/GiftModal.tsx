"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, goal: number, category: string) => Promise<void>;
}

export default function CreateSparkModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState(15);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      await onCreate(title, description, goal, "community");
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setTitle(""); setDescription(""); setGoal(15); onClose(); }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
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

                <div className="mb-6">
                  <label className="text-[11px] text-white/40 font-medium mb-1.5 block">
                    Funding Goal: <span className="text-ignite-gold">{goal} tokens</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    className="w-full accent-[#FF8C42]"
                  />
                  <div className="flex justify-between text-[9px] text-white/15 mt-1">
                    <span>5</span>
                    <span>50</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>
                )}

                <motion.button
                  onClick={handleCreate}
                  disabled={creating || !title || !description}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold text-[15px] disabled:opacity-40"
                  whileTap={{ scale: 0.97 }}
                >
                  {creating ? "Creating..." : "Launch Spark"}
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

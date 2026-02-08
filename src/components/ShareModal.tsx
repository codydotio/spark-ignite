"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Spark } from "@/lib/types";
import { IGNITE_THRESHOLD } from "@/lib/types";

interface Props {
  isOpen: boolean;
  spark: Spark | null;
  creatorName: string;
  onClose: () => void;
}

export default function ShareModal({ isOpen, spark, creatorName, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState(0);

  if (!spark) return null;

  const pct = Math.round((spark.raised / spark.goal) * 100);
  const backersNeeded = Math.max(0, IGNITE_THRESHOLD - spark.backerIds.length);

  const handleSend = async () => {
    if (!phone || phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`,
          sparkId: spark.id,
          sparkTitle: spark.title,
          creatorName,
          raised: spark.raised,
          goal: spark.goal,
          backerCount: spark.backerIds.length,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSent(true);
      setSentCount((c) => c + 1);
      setPhone("");
      setTimeout(() => setSent(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
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
            className="w-full max-w-md bg-[#12122a] rounded-t-3xl border-t border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📲</div>
              <h2 className="text-lg font-bold gradient-text">Share Your Spark</h2>
              <p className="text-white/40 text-xs mt-1">Invite people via SMS to back your project</p>
            </div>

            {/* Preview */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
              <div className="text-xs text-white/30 mb-1">SMS Preview:</div>
              <div className="text-xs text-white/70 leading-relaxed">
                🔥 {creatorName} invited you to back &quot;{spark.title}&quot; on Ignite!
                <br /><br />
                {pct}% funded · {spark.backerIds.length} backers · Needs {backersNeeded} more to ignite
                <br /><br />
                Verify as a real human and fund ideas that matter.
              </div>
            </div>

            {/* Phone input */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-ignite-gold/30"
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={sending || !phone}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-bold text-sm disabled:opacity-40"
                whileTap={{ scale: 0.95 }}
              >
                {sending ? "..." : sent ? "✓" : "Send"}
              </motion.button>
            </div>

            {error && (
              <div className="text-xs text-red-400 mb-2 px-1">{error}</div>
            )}

            {sentCount > 0 && (
              <div className="text-xs text-ignite-teal text-center mb-3">
                {sentCount} invite{sentCount > 1 ? "s" : ""} sent!
              </div>
            )}

            <div className="text-center">
              <button onClick={onClose} className="text-white/30 text-sm py-2">
                Done
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 text-center">
              <span className="text-[9px] text-white/15">
                SMS powered by Twilio · Only verified humans can back sparks
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

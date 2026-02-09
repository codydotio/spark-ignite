"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onVerify: () => void;
  isVerifying: boolean;
  error: string | null;
}

export default function OnboardingScreen({ onVerify, isVerifying, error }: Props) {
  const [started, setStarted] = useState(false);

  return (
    <div className="fixed inset-0 bg-ignite-void flex flex-col safe-top safe-bottom overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FF8C42, transparent 70%)", left: "-10%", top: "15%" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #FF4B6E, transparent 70%)", right: "-15%", bottom: "20%" }}
          animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col h-full px-6"
          >
            {/* Top section — logo + title */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🔥
              </motion.div>

              <h1 className="text-3xl font-bold gradient-text tracking-tight mb-2">Spark Ignite</h1>

              <p className="text-white/25 text-[13px] font-medium mb-8">Proof-of-humanity crowdfunding</p>

              {/* Three feature pills */}
              <div className="w-full max-w-xs space-y-2.5 mb-8">
                {[
                  { icon: "👤", text: "Verified humans propose causes, art & projects" },
                  { icon: "🗳️", text: "Pledges from real people unlock ignition" },
                  { icon: "🛸", text: "Alien ID keeps bots out — real trust only" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-[13px] text-white/50 leading-snug">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pb-10">
              <motion.button
                onClick={() => setStarted(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold text-[16px] shadow-lg shadow-ignite-flame/10"
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Get Started
              </motion.button>
              <p className="text-center text-white/15 text-[11px] mt-3">
                Powered by Alien Protocol
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex flex-col h-full px-6"
          >
            {/* Back button — native iOS style */}
            <div className="pt-4">
              <button
                onClick={() => setStarted(false)}
                className="flex items-center gap-1 text-ignite-flame text-[15px] font-medium py-2 -ml-1 active:opacity-60"
              >
                <span className="text-lg">‹</span> Back
              </button>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
              <motion.div
                className="text-6xl mb-5"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                👽
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Humanity</h2>
              <p className="text-white/40 text-[13px] text-center max-w-[280px] leading-relaxed mb-8">
                Only verified humans can create and back sparks. No bots. No fake accounts. Real people funding real ideas.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 w-full max-w-xs px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/15 text-red-400 text-[13px] text-center"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="pb-10">
              <motion.button
                onClick={onVerify}
                disabled={isVerifying}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-ignite-gold to-ignite-flame text-ignite-void font-bold text-[16px] disabled:opacity-50 shadow-lg shadow-ignite-gold/10"
                whileTap={{ scale: 0.97 }}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-ignite-void/30 border-t-ignite-void rounded-full"
                    />
                    Verifying...
                  </span>
                ) : (
                  "Verify with Alien ID"
                )}
              </motion.button>
              <p className="text-center text-white/15 text-[11px] mt-3">
                Powered by Alien Protocol
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onVerify: () => void;
  isVerifying: boolean;
  error: string | null;
}

export default function OnboardingScreen({ onVerify, isVerifying, error }: Props) {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#0a0a1a" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FF8C42, transparent 70%)", left: "-10%", top: "15%" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #FF4B6E, transparent 70%)", right: "-15%", bottom: "20%" }}
        />
      </div>

      {!started ? (
        <>
          {/* Center content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10, padding: "0 24px" }}>
            <div className="text-6xl mb-4">🔥</div>

            <h1 className="text-3xl font-bold gradient-text tracking-tight mb-2">Spark Ignite</h1>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontWeight: 500, marginBottom: 32 }}>Proof-of-humanity crowdfunding on the Alien Network</p>

            <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "👤", text: "Verified humans propose causes, art & projects" },
                { icon: "🗳️", text: "Pledges from real people unlock ignition" },
                { icon: "🛸", text: "Alien ID keeps bots out — real trust only" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ padding: "0 24px 40px", position: "relative", zIndex: 10 }}>
            <motion.button
              onClick={() => setStarted(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-ignite-flame to-ignite-ember text-white font-semibold shadow-lg shadow-ignite-flame/10"
              style={{ fontSize: 16 }}
              whileTap={{ scale: 0.97 }}
            >
              Login with Alien
            </motion.button>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 11, marginTop: 12 }}>
              Powered by Alien Protocol
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Back button */}
          <div style={{ padding: "16px 24px 0", position: "relative", zIndex: 10 }}>
            <button
              onClick={() => setStarted(false)}
              style={{ display: "flex", alignItems: "center", gap: 4, color: "#FF8C42", fontSize: 15, fontWeight: 500, padding: "8px 0", background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 18 }}>‹</span> Back
            </button>
          </div>

          {/* Center content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10, padding: "0 24px" }}>
            <motion.div
              className="text-6xl mb-5"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              👽
            </motion.div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 8 }}>Verify Your Humanity</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", maxWidth: 280, lineHeight: 1.5, marginBottom: 32 }}>
              Only verified humans can create and back sparks. No bots. No fake accounts. Real people funding real ideas.
            </p>

            {error && (
              <div style={{ marginBottom: 20, width: "100%", maxWidth: 320, padding: "12px 16px", borderRadius: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", fontSize: 13, textAlign: "center" }}>
                {error}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div style={{ padding: "0 24px 40px", position: "relative", zIndex: 10 }}>
            <motion.button
              onClick={onVerify}
              disabled={isVerifying}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-ignite-gold to-ignite-flame font-bold disabled:opacity-50 shadow-lg shadow-ignite-gold/10"
              style={{ fontSize: 16, color: "#0a0a1a" }}
              whileTap={{ scale: 0.97 }}
            >
              {isVerifying ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="inline-block w-4 h-4 border-2 border-ignite-void/30 border-t-ignite-void rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify with Alien ID"
              )}
            </motion.button>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 11, marginTop: 12 }}>
              Powered by Alien Protocol
            </p>
          </div>
        </>
      )}
    </div>
  );
}

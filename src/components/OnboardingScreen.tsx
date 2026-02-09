"use client";

import { motion } from "framer-motion";

interface Props {
  onVerify: () => void;
  isVerifying: boolean;
  error: string | null;
}

export default function OnboardingScreen({ onVerify, isVerifying, error }: Props) {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060B14" }}>
      {/* Subtle blue ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", opacity: 0.06, background: "radial-gradient(circle, #3B82F6, transparent 70%)", left: "-15%", top: "10%" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", opacity: 0.04, background: "radial-gradient(circle, #6366F1, transparent 70%)", right: "-10%", bottom: "15%" }} />
      </div>

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 10, width: "calc(100% - 40px)", maxWidth: 380,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: "40px 28px 32px", display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, background: "linear-gradient(135deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Spark Ignite
        </h1>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>
          Powered by Alien Protocol
        </p>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.6, marginBottom: 32, maxWidth: 300 }}>
          A proof-of-humanity crowdfunding platform where verified humans create sparks to be ignited by the community.
        </p>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
          {[
            { title: "Propose", desc: "Verified humans submit causes, art, and missions." },
            { title: "Ignite", desc: "Pledges unlock ignition with one human, one vote." },
            { title: "Fund", desc: "Tokens flow after consensus — bots don't get a seat." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 4 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{item.desc}</p>
              {i < 2 && <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.06)", margin: "16px auto 0" }} />}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ marginBottom: 16, width: "100%", padding: "12px 16px", borderRadius: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}

        <motion.button
          onClick={onVerify}
          disabled={isVerifying}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 16, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "white",
            fontSize: 16, fontWeight: 600, boxShadow: "0 4px 24px rgba(59,130,246,0.25)",
            opacity: isVerifying ? 0.5 : 1
          }}
          whileTap={{ scale: 0.97 }}
        >
          {isVerifying ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "Login with Alien →"
          )}
        </motion.button>
      </div>

      <p style={{ position: "relative", zIndex: 10, marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        Human-first. Sybil-resistant. Built to ignite real work.
      </p>
    </div>
  );
}

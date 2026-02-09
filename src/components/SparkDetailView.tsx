"use client";

import { useState } from "react";
import type { Spark } from "@/lib/types";
import { CATEGORY_EMOJI, tokensToUsd, formatUsd } from "@/lib/types";

interface Props {
  spark: Spark;
  currentUserId: string;
  onBack: () => void;
  onPledge: (sparkId: string) => Promise<void>;
  onFund: (sparkId: string, amount: number) => Promise<void>;
  onShare: (spark: Spark) => void;
}

export default function SparkDetailView({ spark, currentUserId, onBack, onPledge, onFund, onShare }: Props) {
  const [showSupport, setShowSupport] = useState(false);
  const [fundAmount, setFundAmount] = useState(5);
  const [fundingInProgress, setFundingInProgress] = useState(false);
  const [pledgingInProgress, setPledgingInProgress] = useState(false);

  const isCreator = currentUserId === spark.creatorId;
  const hasPledged = spark.backerIds.includes(currentUserId);
  const fundingPct = Math.min(100, Math.round((spark.raised / spark.goal) * 100));
  const isIgnited = spark.status === "ignited";

  const raisedUsd = formatUsd(tokensToUsd(spark.raised));
  const goalUsd = formatUsd(spark.goalUsd);
  const fundAmountUsd = formatUsd(tokensToUsd(fundAmount));

  const handlePledge = async () => {
    if (pledgingInProgress) return;
    setPledgingInProgress(true);
    try { await onPledge(spark.id); } catch {} finally { setPledgingInProgress(false); }
  };

  const handleFund = async () => {
    if (fundingInProgress || fundAmount <= 0) return;
    setFundingInProgress(true);
    try { await onFund(spark.id, fundAmount); setFundAmount(5); setShowSupport(false); } catch {} finally { setFundingInProgress(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#060B14", display: "flex", flexDirection: "column" }}>
      {/* ─── FIXED HEADER ─── */}
      <div style={{ flexShrink: 0, background: "rgba(6,11,20,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: "none", border: "none", cursor: "pointer", color: "white", fontSize: 18 }}>
            ←
          </button>
          <h1 style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {spark.title}
          </h1>
          {isCreator ? (
            <button onClick={() => onShare(spark)} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, background: "none", border: "none", cursor: "pointer", color: "white", fontSize: 18 }}>
              ↗
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}
        </div>
      </div>

      {/* ─── SCROLLABLE CONTENT (vertically centered) ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", overflowY: "auto" }}>
        {/* Progress ring — large */}
        <div style={{ position: "relative", width: 200, height: 200, marginBottom: 24 }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="100" cy="100" r="90" fill="none"
              stroke="url(#pg)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={565} strokeDashoffset={565 * (1 - fundingPct / 100)}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Raised</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#60A5FA" }}>{raisedUsd}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>of {goalUsd}</p>
          </div>
        </div>

        {isIgnited && (
          <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(59,130,246,0.15)", color: "#60A5FA", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            IGNITED
          </span>
        )}

        {/* Alien matched */}
        {spark.alienMatched && (
          <div style={{ padding: "10px 18px", borderRadius: 14, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🛸</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#60A5FA" }}>
              {isIgnited && spark.matchedAmount > 0 ? `Matched — ${formatUsd(tokensToUsd(spark.matchedAmount))}` : "Alien Match Eligible"}
            </span>
          </div>
        )}

        {/* Category + creator */}
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>
          {CATEGORY_EMOJI[spark.category]} {spark.category} · by {spark.creatorName}
        </p>

        {/* Description */}
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", textAlign: "center", maxWidth: 340, lineHeight: 1.65 }}>
          {spark.description}
        </p>

        {/* Creator share button */}
        {isCreator && (
          <button
            onClick={() => navigator.share ? navigator.share({ title: spark.title, text: spark.description, url: window.location.href }) : onShare(spark)}
            style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600 }}
          >
            Share Spark
          </button>
        )}
      </div>

      {/* ─── FIXED FOOTER ─── */}
      <div style={{ flexShrink: 0, background: "rgba(6,11,20,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px 28px", display: "flex", gap: 10 }}>
        <button
          onClick={handlePledge}
          disabled={pledgingInProgress || hasPledged || isCreator}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 14, border: "none",
            cursor: hasPledged || isCreator ? "default" : "pointer",
            background: hasPledged ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3B82F6, #6366F1)",
            color: hasPledged ? "rgba(255,255,255,0.4)" : "white",
            fontSize: 15, fontWeight: 600, opacity: (pledgingInProgress || isCreator) ? 0.5 : 1
          }}
        >
          {pledgingInProgress ? "..." : hasPledged ? "✓ Pledged" : "Pledge Your Vote"}
        </button>

        <button
          onClick={() => setShowSupport(true)}
          style={{
            flex: 1, padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white", fontSize: 15, fontWeight: 600
          }}
        >
          Support with Alien
        </button>
      </div>

      {/* ─── SUPPORT MODAL ─── */}
      {showSupport && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          {/* Backdrop */}
          <div onClick={() => setShowSupport(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />

          {/* Sheet */}
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, background: "#0F1629", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px" }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 4 }}>Support this Spark</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              Choose how many ALIEN tokens to contribute
            </p>

            {/* Amount chips */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[1, 5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setFundAmount(amt)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 600,
                    background: fundAmount === amt ? "linear-gradient(135deg, #10B981, #059669)" : "rgba(255,255,255,0.05)",
                    color: fundAmount === amt ? "white" : "rgba(255,255,255,0.5)"
                  }}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>👽</span>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 18, fontWeight: 600 }}
              />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>ALIEN</span>
            </div>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
              ≈ {fundAmountUsd} USD
            </p>

            {/* Submit */}
            <button
              onClick={handleFund}
              disabled={fundingInProgress || fundAmount <= 0}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "white", fontSize: 16, fontWeight: 600,
                opacity: fundingInProgress ? 0.5 : 1,
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)"
              }}
            >
              {fundingInProgress ? "Processing..." : `Support with ${fundAmount} ALIEN`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

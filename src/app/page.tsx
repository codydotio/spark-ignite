"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useAlien, useIgniteData } from "@/hooks/useAlien";
import OnboardingScreen from "@/components/OnboardingScreen";
import Dashboard from "@/components/Dashboard";
import CreateSparkModal from "@/components/GiftModal";
import ShareModal from "@/components/ShareModal";
import SparkDetailView from "@/components/SparkDetailView";
import type { Spark } from "@/lib/types";

export default function Home() {
  const { user, stats, isVerifying, error, verify, createSpark, pledgeSpark, fundSpark, logout } = useAlien();
  const { sparks, feedItems, chainData } = useIgniteData();
  const [showCreate, setShowCreate] = useState(false);
  const [shareSpark, setShareSpark] = useState<Spark | null>(null);
  const [activeSpark, setActiveSpark] = useState<Spark | null>(null);

  // Create spark then immediately open its detail view
  const handleCreateSpark = useCallback(async (title: string, description: string, goal: number, category: string) => {
    const spark = await createSpark(title, description, goal, category);
    setTimeout(() => setActiveSpark(spark), 200);
  }, [createSpark]);

  if (!user) {
    return <OnboardingScreen onVerify={verify} isVerifying={isVerifying} error={error} />;
  }

  // Keep activeSpark in sync with latest data from polling
  const freshSpark = activeSpark ? (sparks.find((s) => s.id === activeSpark.id) || activeSpark) : null;

  return (
    <>
      <Dashboard
        sparks={sparks}
        feedItems={feedItems}
        chainData={chainData}
        stats={stats}
        currentUserId={user.id}
        displayName={user.displayName}
        onCreateSpark={() => setShowCreate(true)}
        onTapSpark={(spark) => setActiveSpark(spark)}
        onLogout={logout}
      />

      <CreateSparkModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateSpark}
      />

      <ShareModal
        isOpen={!!shareSpark}
        spark={shareSpark}
        creatorName={user.displayName}
        onClose={() => setShareSpark(null)}
      />

      <AnimatePresence>
        {freshSpark && (
          <SparkDetailView
            spark={freshSpark}
            currentUserId={user.id}
            onBack={() => setActiveSpark(null)}
            onPledge={pledgeSpark}
            onFund={fundSpark}
            onShare={(spark) => setShareSpark(spark)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

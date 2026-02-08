"use client";

import { useState } from "react";
import { useAlien, useIgniteData } from "@/hooks/useAlien";
import OnboardingScreen from "@/components/OnboardingScreen";
import Dashboard from "@/components/Dashboard";
import CreateSparkModal from "@/components/GiftModal";
import ShareModal from "@/components/ShareModal";
import type { Spark } from "@/lib/types";

export default function Home() {
  const { user, stats, isVerifying, error, verify, createSpark, backSpark } = useAlien();
  const { sparks, feedItems, chainData } = useIgniteData();
  const [showCreate, setShowCreate] = useState(false);
  const [shareSpark, setShareSpark] = useState<Spark | null>(null);

  if (!user) {
    return <OnboardingScreen onVerify={verify} isVerifying={isVerifying} error={error} />;
  }

  return (
    <>
      <Dashboard
        sparks={sparks}
        feedItems={feedItems}
        chainData={chainData}
        stats={stats}
        currentUserId={user.id}
        onCreateSpark={() => setShowCreate(true)}
        onBack={backSpark}
        onShare={(spark) => setShareSpark(spark)}
      />
      <CreateSparkModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createSpark}
      />
      <ShareModal
        isOpen={!!shareSpark}
        spark={shareSpark}
        creatorName={user.displayName}
        onClose={() => setShareSpark(null)}
      />
    </>
  );
}

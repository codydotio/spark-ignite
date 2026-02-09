// ============================================================
// IGNITE — Type Definitions
// Alien.org Hackathon @ Frontier Tower, Feb 8 2026
// ============================================================

export interface AlienUser {
  id: string;
  alienId: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
  createdAt: number;
}

export type SparkCategory = "cause" | "art" | "tech" | "community" | "other";

export interface Spark {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  category: SparkCategory;
  goalUsd: number;       // Goal in USD (stablecoin-pegged)
  goal: number;          // Goal in tokens (derived from goalUsd / TOKEN_USD)
  raised: number;        // Tokens raised so far
  backerIds: string[];
  status: "active" | "ignited" | "completed";
  alienMatched: boolean; // Eligible for Alien matching
  matchedAmount: number; // How much Alien has matched (in tokens)
  createdAt: number;
  ignitedAt?: number;
}

export interface Backing {
  id: string;
  sparkId: string;
  sparkTitle: string;
  backerId: string;
  backerName: string;
  amount: number;
  note?: string;
  createdAt: number;
  txHash?: string;
}

export interface FeedItem {
  id: string;
  type: "backing" | "spark_created" | "spark_ignited";
  sparkId: string;
  sparkTitle: string;
  actorName: string;
  amount?: number;
  note?: string;
  createdAt: number;
}

export interface UserStats {
  balance: number;
  sparksCreated: number;
  sparksBacked: number;
  totalContributed: number;
}

export interface ChainNode {
  id: string;
  name: string;
  type: "user" | "spark";
  totalActivity: number;
  raised?: number;
  goal?: number;
  status?: string;
  verified?: boolean;
}

export interface ChainLink {
  source: string;
  target: string;
  amount: number;
  createdAt: number;
}

export interface ChainData {
  nodes: ChainNode[];
  links: ChainLink[];
}

// SSE
export type SSEEventType = "backing" | "spark_created" | "spark_ignited" | "user_joined";

export interface SSEEvent {
  type: SSEEventType;
  data: unknown;
  timestamp: number;
}

// Alien Bridge types
export interface AlienIdentityResult {
  success: boolean;
  alienId: string;
  displayName: string;
  proofOfHuman: boolean;
}

export interface AlienPaymentResult {
  success: boolean;
  txHash: string;
  amount?: number;
  recipient?: string;
}

// AI Agent
export interface AIInsight {
  id: string;
  type: "trending" | "almost_ignited" | "new_spark";
  message: string;
  confidence: number;
  sparkId?: string;
  createdAt: number;
  isAI: true;
}

export interface AIAgentState {
  insights: AIInsight[];
  lastAnalysis: number;
  communityScore: number;
  trendDirection: "rising" | "falling" | "stable";
}

export const IGNITE_THRESHOLD = 3;   // unique backers needed to ignite
export const INITIAL_BALANCE = 500;  // starting tokens (~$250 USD)
export const TOKEN_USD = 0.50;       // 1 token = $0.50 USD (USDC-pegged stable rate)
export const MAX_GOAL_USD = 5000;    // max $5,000 per spark
export const CATEGORY_EMOJI: Record<SparkCategory, string> = {
  cause: "🌍",
  art: "🎨",
  tech: "⚡",
  community: "🤝",
  other: "✨",
};

// Currency helpers
export function tokensToUsd(tokens: number): number {
  return tokens * TOKEN_USD;
}
export function usdToTokens(usd: number): number {
  return Math.round(usd / TOKEN_USD);
}
export function formatUsd(usd: number): string {
  return usd >= 1000 ? `$${(usd / 1000).toFixed(1)}k` : `$${usd.toFixed(0)}`;
}
export function formatTokenUsd(tokens: number): string {
  const usd = tokensToUsd(tokens);
  return `${tokens} tokens (${formatUsd(usd)})`;
}

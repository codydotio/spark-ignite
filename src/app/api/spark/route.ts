import { NextResponse } from "next/server";
import { createSpark, getUserStats, registerUser, getUser } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { creatorId, displayName, title, description, goalUsd, category } = await request.json();

    // Auto-register on cold start
    if (!getUser(creatorId)) {
      registerUser(creatorId, displayName || "Human");
    }

    const result = createSpark(creatorId, title, description, goalUsd, category);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    const stats = getUserStats(creatorId);
    return NextResponse.json({ spark: result, stats });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

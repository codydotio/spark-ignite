import { NextResponse } from "next/server";
import { pledgeSpark, getUserStats, registerUser, getUser, ensureLoaded, persist } from "@/lib/store";

export async function POST(request: Request) {
  try {
    await ensureLoaded();
    const { sparkId, pledgerId, displayName } = await request.json();

    // Auto-register on cold start
    if (!getUser(pledgerId)) {
      registerUser(pledgerId, displayName || "Human");
    }

    const result = pledgeSpark(sparkId, pledgerId);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    const stats = getUserStats(pledgerId);
    await persist();
    return NextResponse.json({ spark: result, stats });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

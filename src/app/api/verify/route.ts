import { NextResponse } from "next/server";
import { registerUser, getUserStats, ensureLoaded, persist } from "@/lib/store";

export async function POST(request: Request) {
  try {
    await ensureLoaded();
    const { alienId, displayName } = await request.json();
    const user = registerUser(alienId, displayName || "Human");
    const stats = getUserStats(user.id);
    await persist();
    return NextResponse.json({ user, stats });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

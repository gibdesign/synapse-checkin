import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export async function GET() {
  try {
    const data = await getLeaderboard();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

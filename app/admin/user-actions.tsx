"use client";

import { useRouter } from "next/navigation";

export function AdminActions({ userId, visible }: { userId: string; visible: boolean }) {
  const router = useRouter();

  async function toggleVisibility() {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, patch: { leaderboardVisible: !visible } }),
    });
    router.refresh();
  }

  return (
    <button onClick={toggleVisibility} className="rounded-full border border-white/10 px-4 py-1 text-sm">
      {visible ? "Hide from leaderboard" : "Show on leaderboard"}
    </button>
  );
}

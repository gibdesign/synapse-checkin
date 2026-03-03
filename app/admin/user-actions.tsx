"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

type User = {
  id: string;
  username: string;
  telegramUsername: string;
  streakCount: number;
  longestStreak: number;
  leaderboardVisible: boolean;
  role: string;
};

export function AdminActions({ user, canDelete = false }: { user: User; canDelete?: boolean }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(user.streakCount);
  const [longest, setLongest] = useState(user.longestStreak);

  async function patch(data: Partial<{ streakCount: number; longestStreak: number; leaderboardVisible: boolean }>) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, patch: data }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisibility() {
    await patch({ leaderboardVisible: !user.leaderboardVisible });
  }

  async function saveStreaks() {
    const streakCount = Math.max(0, Math.floor(Number(streak)));
    const longestStreak = Math.max(streakCount, Math.floor(Number(longest)));
    await patch({ streakCount, longestStreak });
    setStreak(streakCount);
    setLongest(longestStreak);
  }

  async function deleteUser() {
    if (!canDelete || user.role === "ADMIN") return;
    if (!confirm(`Delete ${user.username}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-fire-orange">{user.streakCount}d</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
        >
          Edit
        </button>
        <button
          onClick={toggleVisibility}
          disabled={loading}
          className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5 disabled:opacity-50"
        >
          {user.leaderboardVisible ? "Hide" : "Show"}
        </button>
        {canDelete && user.role !== "ADMIN" && (
          <button
            onClick={deleteUser}
            disabled={loading}
            className="rounded-full border border-fire-red/30 px-3 py-1 text-xs text-fire-red hover:bg-fire-red/10 disabled:opacity-50"
          >
            <Trash2 className="inline h-3 w-3" /> Delete
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
          <label className="flex items-center gap-1 text-xs">
            Streak:
            <input
              type="number"
              min={0}
              value={streak}
              onChange={(e) => setStreak(Number(e.target.value))}
              className="w-14 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-1 text-xs">
            Longest:
            <input
              type="number"
              min={0}
              value={longest}
              onChange={(e) => setLongest(Number(e.target.value))}
              className="w-14 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm"
            />
          </label>
          <button
            onClick={saveStreaks}
            disabled={loading}
            className="flex items-center gap-1 rounded-full bg-fire-orange/20 px-3 py-1 text-xs font-medium text-fire-orange hover:bg-fire-orange/30 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Save
          </button>
        </div>
      )}
    </div>
  );
}

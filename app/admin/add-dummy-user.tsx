"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

export function AddDummyUser({ canCreateCS = false }: { canCreateCS?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("@");
  const [streak, setStreak] = useState(0);
  const [role, setRole] = useState<"USER" | "CS">("USER");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          telegramUsername: telegram.trim().startsWith("@") ? telegram.trim() : `@${telegram.trim()}`,
          streakCount: Math.max(0, Number(streak)),
          role: canCreateCS ? role : "USER",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        return;
      }
      setUsername("");
      setEmail("");
      setTelegram("@");
      setStreak(0);
      setRole("USER");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass mb-6 rounded-2xl border border-white/10 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-400">
        <UserPlus className="h-4 w-4" />
        Add dummy user
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-fire-orange"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-fire-orange"
        />
        <input
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="@telegram"
          required
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-fire-orange"
        />
        <input
          type="number"
          min={0}
          value={streak}
          onChange={(e) => setStreak(Number(e.target.value))}
          placeholder="Streak"
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-fire-orange"
        />
        {canCreateCS && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "USER" | "CS")}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-fire-orange"
          >
            <option value="USER">User</option>
            <option value="CS">CS</option>
          </select>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-fire-orange/20 px-4 py-2 text-sm font-medium text-fire-orange hover:bg-fire-orange/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Add
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-fire-red">{error}</p> : null}
      <p className="mt-2 text-[10px] text-neutral-500">Password: password123</p>
    </form>
  );
}

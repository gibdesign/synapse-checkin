"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { LinkSpinner } from "@/components/link-spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      // Keep loading visible until navigation completes
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-24">
      <div className="mb-6">
        <Link href="/" prefetch={false} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white">
          ← Back to Leaderboard <LinkSpinner />
        </Link>
      </div>
      <h1 className="serif-title text-5xl">Login</h1>
      <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-6 border-fire-orange/20">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled={loading} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fire-orange transition disabled:opacity-60" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fire-orange transition disabled:opacity-60" />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fire-red to-fire-orange px-5 py-4 font-bold text-white transition hover:scale-[1.02] disabled:scale-100 disabled:opacity-70" type="submit">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-fire-red">{error}</p> : null}
    </main>
  );
}

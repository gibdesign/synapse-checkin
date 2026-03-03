"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-24">
      <div className="mb-6">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">← Back to Leaderboard</Link>
      </div>
      <h1 className="serif-title text-5xl">Login</h1>
      <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-6 border-fire-orange/20">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fire-orange transition" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fire-orange transition" />
        <button className="w-full rounded-full bg-gradient-to-r from-fire-red to-fire-orange px-5 py-4 text-white font-bold transition hover:scale-[1.02]" type="submit">Sign in</button>
      </form>
      {error ? <p className="mt-4 text-sm text-fire-red">{error}</p> : null}
    </main>
  );
}

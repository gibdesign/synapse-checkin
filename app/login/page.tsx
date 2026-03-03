"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <h1 className="serif-title text-5xl">Login</h1>
      <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-6">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none" />
        <button className="rounded-full bg-white px-5 py-2 text-black" type="submit">Sign in</button>
      </form>
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    telegramUsername: "@",
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setMessage(json.message || json.error || "Done");
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-24">
      <div className="mb-6">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">← Back to Leaderboard</Link>
      </div>
      <h1 className="serif-title text-5xl">Register</h1>
      <p className="mt-3 text-neutral-400">Telegram username is required for leaderboard visibility.</p>
      <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-6 border-fire-orange/20">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={key === "telegramUsername" ? "Telegram (@username)" : key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-fire-orange transition"
          />
        ))}
        <button className="w-full rounded-full bg-gradient-to-r from-fire-red to-fire-orange px-5 py-4 text-white font-bold transition hover:scale-[1.02]" type="submit">Create account</button>
      </form>
      {message ? <p className="mt-4 text-sm text-fire-yellow">{message}</p> : null}
      <Link href="/login" className="mt-6 block text-center text-sm text-neutral-400 hover:text-white transition">Already have an account? Sign In</Link>
    </main>
  );
}

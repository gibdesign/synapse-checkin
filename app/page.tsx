import Link from "next/link";
import { ShinyBorderButton } from "@/components/ui/shiny-border-button";
import { StatusPill } from "@/components/ui/status-pill";
import { getLeaderboard } from "@/lib/leaderboard";

async function getData() {
  try {
    return await getLeaderboard();
  } catch {
    return [];
  }
}

export default async function Home() {
  const leaderboard = await getData();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#030303] text-white">
      <div className="orb-violet -top-14 left-1/2 h-56 w-56 -translate-x-1/2" />
      <div className="orb-cyan left-10 top-48 h-48 w-48" />
      <header className="glass fixed left-1/2 top-6 z-20 flex w-[95%] max-w-3xl -translate-x-1/2 items-center justify-between rounded-full px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
          <span className="serif-title text-xl">Synapse</span>
        </div>
        <nav className="hidden gap-6 text-xs uppercase tracking-[0.2em] text-neutral-400 md:flex">
          <Link href="/">Leaderboard</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/cs">CS</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-neutral-300">Login</Link>
          <Link href="/register" className="rounded-full bg-white px-4 py-1.5 text-black">Start</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-36">
        <section className="py-20 text-center">
          <h1 className="serif-title text-6xl leading-[0.9] md:text-8xl">
            Manual Verification
            <br />
            <span className="shimmer-text">Competitive Streak Engine</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-neutral-400">
            Public leaderboard. Telegram-visible identity. No uploads. Customer service approval powers every rank change.
          </p>
          <div className="mt-10 flex items-center justify-center gap-5">
            <ShinyBorderButton>Request Check-In</ShinyBorderButton>
            <Link href="/dashboard" className="text-sm text-neutral-300 hover:text-white">Open dashboard</Link>
          </div>
        </section>

        <section className="mb-16 overflow-hidden border-y border-white/5 bg-black/40 py-4">
          <div className="ticker-track flex min-w-max gap-12 pr-12 text-sm">
            {["Live Rank", "Manual Approval", "Telegram Identity", "Streak Engine", "No Uploads", "Audit Logged"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{item}</span>
                <span className="font-mono text-base text-cyan-300">ON</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl p-6 md:p-10">
          <h2 className="serif-title text-4xl">Global Leaderboard</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                <tr>
                  <th className="py-3">Rank</th><th>Username</th><th>Telegram</th><th>Current</th><th>Longest</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.userId} className="border-t border-white/5">
                    <td className="py-4">{row.rank}</td>
                    <td>{row.username}</td>
                    <td>{row.telegramUsername}</td>
                    <td>{row.currentStreak}</td>
                    <td>{row.longestStreak}</td>
                    <td><StatusPill status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaderboard.length === 0 ? <p className="py-6 text-neutral-400">No approved entries yet.</p> : null}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Manual Approval", "Requests remain pending until customer service reviews."],
            ["Telegram Identity", "Public leaderboard shows @username for transparent competition."],
            ["Deterministic Ranking", "Sort by current streak, longest streak, then earliest streak start."],
          ].map(([title, body]) => (
            <article key={title} className="snappy rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-400/40">
              <h3 className="serif-title text-3xl">{title}</h3>
              <p className="mt-3 text-sm text-neutral-400">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-[#080808cc] p-8">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />
            </div>
            <p className="font-mono text-xs text-neutral-400">leaderboard.ts</p>
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-7 text-neutral-300">
{`ORDER BY
current_streak DESC,
longest_streak DESC,
streak_start_date ASC`}
          </pre>
        </section>
      </main>
      <footer className="mt-20 border-t border-white/5 bg-[#050505] px-6 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div>
            <p className="serif-title text-4xl">Synapse</p>
          </div>
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Platform</p><p className="mt-2 text-sm text-neutral-300">Leaderboard</p></div>
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Operations</p><p className="mt-2 text-sm text-neutral-300">Customer Service</p></div>
          <div><p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Governance</p><p className="mt-2 text-sm text-neutral-300">Admin + Audit</p></div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between text-xs text-neutral-500">
          <p>2026 Synapse CheckIn</p>
          <p className="flex items-center gap-2 text-emerald-300"><span className="h-2 w-2 animate-[pulseDot_1.5s_ease-in-out_infinite] rounded-full bg-emerald-300" />All Systems Operational</p>
        </div>
      </footer>
    </div>
  );
}

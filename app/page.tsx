import Link from "next/link";
import { Flame, Trophy, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { getLeaderboard } from "@/lib/leaderboard";
import { getSessionUser } from "@/lib/auth";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";
import { ShinyBorderButton } from "@/components/ui/shiny-border-button";
import { LogoutButton } from "@/components/logout-button";
import { LinkSpinner } from "@/components/link-spinner";

async function getData() {
  try {
    return await getLeaderboard();
  } catch {
    return [];
  }
}

// Tier based on player rank - smooth gradient. Cards use neutral border; only the pill has colored outline.
// 0 streak always shows Cold regardless of rank.
function getTierVisual(rank: number, totalPlayers: number, currentStreak: number) {
  const base = "backdrop-blur-md";
  const neutralCard = `${base} border border-white/10 bg-black/40 shadow-[0_0_14px_-16px_rgba(255,255,255,0.15)]`;
  const neutralBadge = "border-white/20 bg-white/5";
  const coldTier = {
    card: neutralCard,
    flame: "text-sky-200/70 fill-sky-200/70",
    value: "text-sky-200/90",
    badge: neutralBadge,
    tierLabel: "Cold",
    pillClass: "border-sky-200/40 bg-sky-200/10 text-sky-200/90",
  };
  if (totalPlayers <= 0) {
    return {
      card: neutralCard,
      flame: "text-white/80 fill-white/80",
      value: "text-white/90",
      badge: neutralBadge,
      tierLabel: "—",
      pillClass: "border-white/20 bg-white/10 text-white/80",
    };
  }
  if (currentStreak <= 0) {
    return coldTier;
  }
  if (rank <= 3) {
    return {
      card: neutralCard,
      flame: "text-[#ef4444] fill-[#ef4444]",
      value: "text-[#ef4444]",
      badge: neutralBadge,
      tierLabel: "Super Hot",
      pillClass: "border-[#ef4444]/50 bg-[#ef4444]/15 text-[#ef4444]",
    };
  }
  if (rank <= 5) {
    return {
      card: neutralCard,
      flame: "text-[#f97316] fill-[#f97316]",
      value: "text-[#f97316]",
      badge: neutralBadge,
      tierLabel: "Hot",
      pillClass: "border-[#f97316]/50 bg-[#f97316]/15 text-[#f97316]",
    };
  }
  if (rank <= 7) {
    return {
      card: neutralCard,
      flame: "text-[#facc15] fill-[#facc15]",
      value: "text-[#facc15]",
      badge: neutralBadge,
      tierLabel: "Warm",
      pillClass: "border-[#facc15]/45 bg-[#facc15]/12 text-[#facc15]",
    };
  }
  if (rank <= 9) {
    return {
      card: neutralCard,
      flame: "text-white/80 fill-white/80",
      value: "text-white/90",
      badge: neutralBadge,
      tierLabel: "Cool",
      pillClass: "border-white/30 bg-white/10 text-white/90",
    };
  }
  return {
    card: neutralCard,
    flame: "text-sky-200/70 fill-sky-200/70",
    value: "text-sky-200/90",
    badge: neutralBadge,
    tierLabel: "Cold",
    pillClass: "border-sky-200/40 bg-sky-200/10 text-sky-200/90",
  };
}

export default async function Home() {
  const session = await getSessionUser();

  const leaderboard = await getData();
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const totalPlayers = leaderboard.length;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050100] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <EtherealShadow
          color="rgba(249, 115, 22, 0.35)"
          animation={{ scale: 60, speed: 70 }}
          noise={{ opacity: 0.3, scale: 1.2 }}
          sizing="fill"
          className="h-full w-full"
        />
      </div>
      <div className="orb-fire -top-14 left-1/2 z-10 h-64 w-64 -translate-x-1/2 opacity-75" />
      <div className="orb-glow right-10 top-48 z-10 h-56 w-56 opacity-65" />
      <header className="glass fixed left-1/2 top-4 z-30 flex w-[95%] max-w-lg -translate-x-1/2 items-center justify-between rounded-full px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500" />
          <span className="serif-title text-xl">Checker</span>
        </div>
        {session ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard" prefetch={false} className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-black inline-flex items-center gap-1.5">
              Dashboard <LinkSpinner />
            </Link>
            <LogoutButton className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold" />
          </div>
        ) : (
          <Link href="/login" prefetch={false} className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-black inline-flex items-center gap-1.5">
            Open App <LinkSpinner />
          </Link>
        )}
      </header>

      <main className="relative z-20 mx-auto max-w-lg px-5 pb-20 pt-24">
        <section className="glass rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">What is Checker</p>
          <h1 className="serif-title mt-2 text-4xl">Check your current streak.</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Checker is a competitive mini app where your streak is verified daily and ranked publicly.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 items-center">
            {session ? (
              <>
                <ShinyBorderButton href="/dashboard" className="w-full text-center">
                  Go to My Streak
                </ShinyBorderButton>
                <Link href="/dashboard/checkins" prefetch={false} className="rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold inline-flex items-center justify-center gap-1.5">
                  My Check-Ins <LinkSpinner />
                </Link>
              </>
            ) : (
              <>
                <ShinyBorderButton href="/register" variant="plain" className="w-full text-center">
                  Start Streak
                </ShinyBorderButton>
                <Link href="/login" prefetch={false} className="rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold inline-flex items-center justify-center gap-1.5">
                  I Have Account <LinkSpinner />
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="serif-title text-3xl">Top 3 On Fire</h2>
            <Sparkles className="h-4 w-4 text-fire-yellow" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {topThree.map((row) => {
              const tone = getTierVisual(row.rank, totalPlayers, row.currentStreak);
              return (
              <div
                key={row.userId}
                className={`relative min-h-[116px] overflow-hidden rounded-2xl p-3 text-center ${tone.card} transition-transform duration-200 hover:-translate-y-0.5`}
              >
                <div className="relative z-10">
                  <Trophy className={`mx-auto h-4 w-4 ${tone.flame}`} />
                  <p className="mt-1 text-[11px] font-semibold">{row.username}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Flame className={`h-3.5 w-3.5 ${tone.flame}`} />
                    <span className={`text-lg font-bold ${tone.value}`}>{row.currentStreak}</span>
                  </div>
                  <div className="mt-2 flex justify-center">
                    <StatusPill tierLabel={tone.tierLabel} pillClass={tone.pillClass} />
                  </div>
                  <p className="mt-1 text-[9px] uppercase tracking-wider text-neutral-400">Rank #{row.rank}</p>
                  {row.joinedAt ? <p className="mt-0.5 text-[8px] text-neutral-500">Joined {new Date(row.joinedAt).toLocaleDateString()}</p> : null}
                </div>
              </div>
            )})}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400">Live Leaderboard</h3>
          <div className="flex flex-col gap-2">
            {[...topThree, ...rest].map((row) => {
              const tone = getTierVisual(row.rank, totalPlayers, row.currentStreak);
              return (
              <div key={row.userId} className={`min-h-[68px] flex items-center justify-between rounded-2xl p-3 ${tone.card}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold text-white/90 ${tone.badge}`}>
                    {row.rank}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{row.username}</p>
                    <p className="text-[11px] text-neutral-400">{row.telegramUsername}</p>
                    {row.joinedAt ? <p className="text-[10px] text-neutral-500">Joined {new Date(row.joinedAt).toLocaleDateString()}</p> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${tone.value}`}>{row.currentStreak}d</span>
                  <StatusPill tierLabel={tone.tierLabel} pillClass={tone.pillClass} />
                </div>
              </div>
            )})}
            {leaderboard.length === 0 ? <p className="text-center text-sm text-neutral-400">No active streaks yet.</p> : null}
          </div>
        </section>
      </main>

      <footer className="relative z-20 mt-10 border-t border-white/5 bg-[#050100] px-6 py-8">
        <div className="mx-auto flex max-w-lg items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500">
          <p>© 2026 Checker</p>
          <p className="flex items-center gap-2 text-emerald-300">
            <span className="h-2 w-2 animate-[pulseDot_1.5s_ease-in-out_infinite] rounded-full bg-emerald-300" />
            Operational
          </p>
        </div>
      </footer>
    </div>
  );
}

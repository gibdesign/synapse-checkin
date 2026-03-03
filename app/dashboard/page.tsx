import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recomputeUserRank } from "@/lib/streaks";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");
  const rank = await recomputeUserRank(user.id);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-24">
      <h1 className="serif-title text-5xl">User Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Current Streak" value={String(user.streakCount)} />
        <Card label="Longest Streak" value={String(user.longestStreak)} />
        <Card label="Leaderboard Rank" value={rank > 0 ? `#${rank}` : "N/A"} />
      </div>
      <div className="mt-10 flex gap-3">
        <form action="/api/checkins/request" method="post">
          <button className="rounded-full bg-white px-5 py-2 text-black" type="submit">Request Check-In</button>
        </form>
        <Link className="rounded-full border border-white/10 px-5 py-2" href="/dashboard/checkins">My Check-Ins</Link>
      </div>
      <p className="mt-5 text-sm text-neutral-400">Save proof of gameplay. Customer Service may request evidence.</p>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl">{value}</p>
    </div>
  );
}

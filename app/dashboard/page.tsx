import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recomputeUserRank } from "@/lib/streaks";
import { Flame, Clock, Snowflake, ShieldAlert } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const user = await prisma.user.findUnique({ 
    where: { id: session.id },
    include: {
      checkinRequests: {
        where: {
          requestDate: { gte: dayStart }
        }
      }
    }
  });

  if (!user) redirect("/login");
  const rank = await recomputeUserRank(user.id);

  const hasApprovedToday = !!user.lastApprovedDate && user.lastApprovedDate >= dayStart;
  const hasPendingToday = user.checkinRequests.some(r => r.status === "PENDING");
  const hasRejectedToday = user.checkinRequests.some(r => r.status === "REJECTED");

  // Determine gamified status state
  let statusIcon = <Snowflake className="h-24 w-24 text-neutral-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]" />;
  let statusTitle = "Streak is Cooling";
  let statusSub = "Request your check-in to ignite your streak!";
  
  if (hasApprovedToday) {
    statusIcon = <Flame className="h-24 w-24 fill-fire-orange text-fire-orange drop-shadow-[0_0_35px_rgba(249,115,22,0.8)] animate-pulse" />;
    statusTitle = "Streak is Hot!";
    statusSub = "You've successfully checked in today.";
  } else if (hasPendingToday) {
    statusIcon = <Clock className="h-24 w-24 text-fire-yellow drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />;
    statusTitle = "Warming Up";
    statusSub = "Customer Service is reviewing your check-in.";
  } else if (hasRejectedToday) {
    statusIcon = <ShieldAlert className="h-24 w-24 text-fire-red drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]" />;
    statusTitle = "Check-in Rejected";
    statusSub = "Your check-in was declined. Try again.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-12 md:py-24">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link href="/" className="inline-block text-sm text-neutral-400 hover:text-white transition">← Leaderboard</Link>
        <div className="flex items-center gap-2">
          {(session.role === "CS" || session.role === "ADMIN") ? (
            <Link href="/cs" className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">CS</Link>
          ) : null}
          {session.role === "ADMIN" ? (
            <Link href="/admin" className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold">Admin</Link>
          ) : null}
          <LogoutButton className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold" />
        </div>
      </div>
      
      <div className="glass flex flex-col items-center justify-center rounded-3xl p-10 text-center border-fire-orange/20">
        <div className="mb-6 flex items-center justify-center">
          {statusIcon}
        </div>
        <h1 className="serif-title text-4xl">{statusTitle}</h1>
        <p className="mt-2 text-sm text-neutral-400">{statusSub}</p>

        <div className="mt-8 flex items-center gap-2">
          <span className="text-6xl font-bold text-white">{user.streakCount}</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-fire-orange">Day</span>
            <span className="text-xs font-bold uppercase tracking-widest text-fire-orange">Streak</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card label="Longest" value={String(user.longestStreak)} />
        <Card label="Global Rank" value={rank > 0 ? `#${rank}` : "-"} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(!hasApprovedToday && !hasPendingToday) && (
          <form action="/api/checkins/request" method="post" className="w-full">
            <button className="w-full rounded-full bg-gradient-to-r from-fire-red to-fire-orange py-4 text-center font-bold text-white transition hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]" type="submit">
              Request Check-In
            </button>
          </form>
        )}
        <Link className="w-full rounded-full border border-white/10 py-4 text-center font-medium transition hover:bg-white/5" href="/dashboard/checkins">
          View History
        </Link>
      </div>
      
      {(!hasApprovedToday && !hasPendingToday) && (
        <p className="mt-6 text-center text-xs text-neutral-500">
          Save proof of gameplay. Customer Service may request evidence.
        </p>
      )}
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl p-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}


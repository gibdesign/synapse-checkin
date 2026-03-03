import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { recomputeUserRank } from "@/lib/streaks";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { checkinRequests: { where: { status: "APPROVED" }, orderBy: { requestDate: "desc" } } },
  });
  if (!user || !user.leaderboardVisible) notFound();

  const rank = await recomputeUserRank(user.id);
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-24">
      <h1 className="serif-title text-5xl">{user.username}</h1>
      <p className="mt-2 text-neutral-400">{user.telegramUsername}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Current Streak" value={String(user.streakCount)} />
        <Card label="Longest Streak" value={String(user.longestStreak)} />
        <Card label="Current Rank" value={rank > 0 ? `#${rank}` : "N/A"} />
      </div>
      <p className="mt-8 text-sm text-neutral-400">
        Last approved date: {user.lastApprovedDate ? new Date(user.lastApprovedDate).toLocaleDateString() : "None"}
      </p>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl">{value}</p>
    </div>
  );
}

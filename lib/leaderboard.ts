import { unstable_cache } from "next/cache";
import { CheckinStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { LeaderboardEntry } from "@/lib/types";

function toStatus(hasApprovedToday: boolean, hasPending: boolean): LeaderboardEntry["status"] {
  if (hasApprovedToday) return "ACTIVE";
  if (hasPending) return "PENDING";
  return "MISSED";
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!process.env.DATABASE_URL) return [];
  const users = await prisma.user.findMany({
    where: {
      leaderboardVisible: true,
      accountStatus: "ACTIVE",
    },
    select: {
      id: true,
      username: true,
      telegramUsername: true,
      streakCount: true,
      longestStreak: true,
      streakStartDate: true,
      lastApprovedDate: true,
      createdAt: true,
      checkinRequests: {
        where: {
          status: CheckinStatus.PENDING,
        },
        select: { id: true },
      },
    },
    orderBy: [
      { streakCount: "desc" },
      { longestStreak: "desc" },
      { streakStartDate: "asc" },
    ],
  });

  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return users.map((u, idx) => {
    const hasApprovedToday = !!u.lastApprovedDate && u.lastApprovedDate >= dayStart;
    return {
      rank: idx + 1,
      userId: u.id,
      username: u.username,
      telegramUsername: u.telegramUsername,
      currentStreak: u.streakCount,
      longestStreak: u.longestStreak,
      status: toStatus(hasApprovedToday, u.checkinRequests.length > 0),
      streakStartDate: u.streakStartDate?.toISOString() ?? null,
      joinedAt: u.createdAt?.toISOString() ?? null,
    };
  });
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return unstable_cache(fetchLeaderboard, ["leaderboard"], { revalidate: 30, tags: ["leaderboard"] })();
}

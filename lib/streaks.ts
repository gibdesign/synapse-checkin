import { prisma } from "@/lib/prisma";

export async function recomputeUserRank(userId: string) {
  const rankedUsers = await prisma.user.findMany({
    where: { leaderboardVisible: true, accountStatus: "ACTIVE" },
    orderBy: [
      { streakCount: "desc" },
      { longestStreak: "desc" },
      { streakStartDate: "asc" },
    ],
    select: { id: true },
  });
  return rankedUsers.findIndex((u) => u.id === userId) + 1;
}

export async function applyApproval(userId: string, approvedDate: Date) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const day = new Date(approvedDate.getFullYear(), approvedDate.getMonth(), approvedDate.getDate());
  const last = user.lastApprovedDate
    ? new Date(
        user.lastApprovedDate.getFullYear(),
        user.lastApprovedDate.getMonth(),
        user.lastApprovedDate.getDate(),
      )
    : null;

  const diffDays = last ? Math.round((day.getTime() - last.getTime()) / 86400000) : null;
  const nextStreak = diffDays === 1 ? user.streakCount + 1 : user.streakCount > 0 && diffDays === 0 ? user.streakCount : 1;
  const longest = Math.max(user.longestStreak, nextStreak);

  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: nextStreak,
      longestStreak: longest,
      streakStartDate: diffDays === 1 && user.streakStartDate ? user.streakStartDate : day,
      lastApprovedDate: day,
    },
  });
}

export async function resetMissedUsers(reference = new Date()) {
  const dayStart = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  await prisma.user.updateMany({
    where: {
      accountStatus: "ACTIVE",
      OR: [{ lastApprovedDate: null }, { lastApprovedDate: { lt: dayStart } }],
    },
    data: {
      streakCount: 0,
      streakStartDate: null,
    },
  });
}

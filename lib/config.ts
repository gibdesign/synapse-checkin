export const featureFlags = {
  leaderboardMinStreak: Number(process.env.LEADERBOARD_MIN_STREAK ?? "0"),
  weeklyLeaderboardEnabled: process.env.ENABLE_WEEKLY_LEADERBOARD === "true",
  monthlyLeaderboardEnabled: process.env.ENABLE_MONTHLY_LEADERBOARD === "true",
  leaderboardFreeze: process.env.LEADERBOARD_FREEZE === "true",
};

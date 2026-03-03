export type LeaderboardStatus = "ACTIVE" | "PENDING" | "MISSED";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  telegramUsername: string;
  currentStreak: number;
  longestStreak: number;
  status: LeaderboardStatus;
  streakStartDate?: string | null;
};

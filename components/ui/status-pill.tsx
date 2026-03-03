import type { LeaderboardStatus } from "@/lib/types";

const statusMap: Record<LeaderboardStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active Today", className: "text-emerald-300" },
  PENDING: { label: "Pending", className: "text-amber-300" },
  MISSED: { label: "Missed", className: "text-rose-300" },
};

export function StatusPill({ status }: { status: LeaderboardStatus }) {
  const value = statusMap[status];
  return (
    <span className={`rounded-full border border-white/10 px-3 py-1 text-xs ${value.className}`}>
      {value.label}
    </span>
  );
}

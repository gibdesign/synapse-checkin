"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { AdminActions } from "@/app/admin/user-actions";

type User = {
  id: string;
  username: string;
  telegramUsername: string;
  email: string;
  streakCount: number;
  longestStreak: number;
  leaderboardVisible: boolean;
  role: string;
  createdAt?: Date;
};

type SortKey = "username" | "streak" | "email" | "date";

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; asc: boolean };
  onSort: (key: SortKey, asc: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey, sort.key === sortKey ? !sort.asc : true)}
      className="flex items-center gap-0.5 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition"
    >
      {label}
      {sort.key === sortKey ? (
        sort.asc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}

export function SortableUserList({
  users,
  canDelete = false,
}: {
  users: User[];
  canDelete?: boolean;
}) {
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "streak", asc: false });

  const sorted = useMemo(() => {
    const arr = [...users];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sort.key) {
        case "username":
          cmp = a.username.localeCompare(b.username);
          break;
        case "streak":
          cmp = a.streakCount - b.streakCount;
          break;
        case "email":
          cmp = a.email.localeCompare(b.email);
          break;
        case "date":
          cmp =
            (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
          break;
        default:
          return 0;
      }
      return sort.asc ? cmp : -cmp;
    });
    return arr;
  }, [users, sort]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <span className="text-xs text-neutral-500">Sort by:</span>
        <SortHeader label="Name" sortKey="username" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
        <SortHeader label="Streak" sortKey="streak" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
        <SortHeader label="Email" sortKey="email" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
        <SortHeader label="Joined" sortKey="date" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
      </div>
      <div className="space-y-3">
        {sorted.map((u) => (
          <div key={u.id} className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p>
                  {u.username} <span className="text-neutral-400">{u.telegramUsername}</span>
                </p>
                <p className="text-xs text-neutral-500">
                  {u.email} · {u.streakCount}d streak
                  {u.createdAt ? ` · Joined ${new Date(u.createdAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <AdminActions
                user={{
                  id: u.id,
                  username: u.username,
                  telegramUsername: u.telegramUsername,
                  streakCount: u.streakCount,
                  longestStreak: u.longestStreak,
                  leaderboardVisible: u.leaderboardVisible,
                  role: u.role,
                }}
                canDelete={canDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

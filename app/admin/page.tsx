import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddDummyUser } from "@/app/admin/add-dummy-user";
import { LogoutButton } from "@/components/logout-button";
import { LinkSpinner } from "@/components/link-spinner";
import { SortableUserList } from "@/components/sortable-user-list";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white">
            ← Dashboard <LinkSpinner />
          </Link>
          <h1 className="serif-title text-5xl">Admin Dashboard</h1>
        </div>
        <LogoutButton />
      </div>
      <AddDummyUser />
      <div className="mt-8">
        <SortableUserList
          users={users.map((u) => ({
            id: u.id,
            username: u.username,
            telegramUsername: u.telegramUsername,
            email: u.email,
            streakCount: u.streakCount,
            longestStreak: u.longestStreak,
            leaderboardVisible: u.leaderboardVisible,
            role: u.role,
            createdAt: u.createdAt,
          }))}
          canDelete
        />
      </div>
    </main>
  );
}

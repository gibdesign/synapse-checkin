import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/app/cs/review-actions";
import { AddDummyUser } from "@/app/admin/add-dummy-user";
import { LogoutButton } from "@/components/logout-button";
import { LinkSpinner } from "@/components/link-spinner";
import { SortableUserList } from "@/components/sortable-user-list";

export default async function CustomerServicePage() {
  const session = await getSessionUser();
  if (!session || (session.role !== "CS" && session.role !== "ADMIN")) redirect("/");

  const [pending, users] = await Promise.all([
    prisma.checkinRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { requestDate: "desc" },
      include: { user: true },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white">
            ← Dashboard <LinkSpinner />
          </Link>
          <h1 className="serif-title text-4xl">Customer Service Queue</h1>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">Pending check-ins</h2>
        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-neutral-500">No pending requests.</p>
          ) : (
            pending.map((item) => (
              <div key={item.id} className="glass flex flex-wrap items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="font-semibold">{item.user.username} <span className="text-neutral-400">{item.user.telegramUsername}</span></p>
                  <p className="text-sm text-neutral-400">{new Date(item.requestDate).toLocaleString()}</p>
                </div>
                <ReviewActions checkinId={item.id} username={item.user.username} />
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">User management</h2>
        <AddDummyUser />
        <div className="mt-4">
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
            canDeleteRoles={["USER"]}
          />
        </div>
      </section>
    </main>
  );
}

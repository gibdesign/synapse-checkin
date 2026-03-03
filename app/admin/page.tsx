import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminActions } from "@/app/admin/user-actions";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-white">← Dashboard</Link>
          <h1 className="serif-title text-5xl">Admin Dashboard</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 space-y-3">
        {users.map((u) => (
          <div key={u.id} className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>{u.username} <span className="text-neutral-400">{u.telegramUsername}</span></p>
              <AdminActions userId={u.id} visible={u.leaderboardVisible} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

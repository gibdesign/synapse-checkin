import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/app/cs/review-actions";

export default async function CustomerServicePage() {
  const session = await getSessionUser();
  if (!session || (session.role !== "CS" && session.role !== "ADMIN")) redirect("/");

  const pending = await prisma.checkinRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { requestDate: "desc" },
    include: { user: true },
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-24">
      <h1 className="serif-title text-5xl">Customer Service Queue</h1>
      <div className="mt-8 space-y-3">
        {pending.map((item) => (
          <div key={item.id} className="glass flex flex-wrap items-center justify-between rounded-2xl p-4">
            <div>
              <p className="font-semibold">{item.user.username} <span className="text-neutral-400">{item.user.telegramUsername}</span></p>
              <p className="text-sm text-neutral-400">{new Date(item.requestDate).toLocaleString()}</p>
            </div>
            <ReviewActions checkinId={item.id} />
          </div>
        ))}
      </div>
    </main>
  );
}

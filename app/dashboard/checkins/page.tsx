import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SortableCheckinsTable } from "@/components/sortable-checkins-table";
import { LinkSpinner } from "@/components/link-spinner";

export default async function MyCheckinsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const rows = await prisma.checkinRequest.findMany({
    where: { userId: session.id },
    orderBy: { requestDate: "desc" },
    include: { reviewedBy: true },
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white">
          ← Dashboard <LinkSpinner />
        </Link>
        <h1 className="serif-title text-5xl">My Check-Ins</h1>
      </div>
      <SortableCheckinsTable rows={rows} />
    </main>
  );
}

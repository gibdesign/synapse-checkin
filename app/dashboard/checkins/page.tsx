import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      <h1 className="serif-title text-5xl">My Check-Ins</h1>
      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-neutral-400">
            <tr><th className="p-4">Date</th><th>Status</th><th>Reviewed By</th><th>Review Time</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/5">
                <td className="p-4">{new Date(row.requestDate).toLocaleString()}</td>
                <td>{row.status}</td>
                <td>{row.reviewedBy?.username ?? "-"}</td>
                <td>{row.reviewTime ? new Date(row.reviewTime).toLocaleString() : "-"}</td>
                <td>{row.note || row.rejectionReason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

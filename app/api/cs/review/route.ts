import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applyApproval } from "@/lib/streaks";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || (session.role !== "CS" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { checkinId, action, note } = (await req.json()) as {
    checkinId: string;
    action: "APPROVE" | "REJECT";
    note?: string;
  };

  const checkin = await prisma.checkinRequest.findUnique({ where: { id: checkinId } });
  if (!checkin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const approved = action === "APPROVE";
  await prisma.checkinRequest.update({
    where: { id: checkinId },
    data: {
      status: approved ? "APPROVED" : "REJECTED",
      reviewedById: session.id,
      reviewTime: new Date(),
      note: note || null,
      rejectionReason: approved ? null : note || "Rejected by reviewer",
    },
  });

  if (approved) {
    await applyApproval(checkin.userId, new Date());
  }
  revalidateTag("leaderboard", "max");

  await writeAuditLog({
    actorId: session.id,
    action: approved ? "CHECKIN_APPROVE" : "CHECKIN_REJECT",
    targetUserId: checkin.userId,
    newValue: action,
  });

  return NextResponse.json({ ok: true });
}

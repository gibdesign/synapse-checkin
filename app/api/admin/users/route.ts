import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, patch } = (await req.json()) as {
    userId: string;
    patch: Partial<{
      streakCount: number;
      longestStreak: number;
      leaderboardVisible: boolean;
      accountStatus: "ACTIVE" | "SUSPENDED" | "LOCKED";
      telegramUsername: string;
    }>;
  };

  const previous = await prisma.user.findUnique({ where: { id: userId } });
  const updated = await prisma.user.update({ where: { id: userId }, data: patch });

  await writeAuditLog({
    actorId: session.id,
    action: "ADMIN_USER_PATCH",
    targetUserId: userId,
    oldValue: JSON.stringify(previous),
    newValue: JSON.stringify(updated),
  });

  return NextResponse.json({ data: updated });
}

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/auth";

function isStaff(session: { role: string } | null) {
  return session && (session.role === "ADMIN" || session.role === "CS");
}

export async function GET() {
  const session = await getSessionUser();
  if (!isStaff(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!isStaff(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
  revalidateTag("leaderboard", "max");

  await writeAuditLog({
    actorId: session!.id,
    action: "ADMIN_USER_PATCH",
    targetUserId: userId,
    oldValue: JSON.stringify(previous),
    newValue: JSON.stringify(updated),
  });

  return NextResponse.json({ data: updated });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!isStaff(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    username: string;
    email: string;
    telegramUsername: string;
    streakCount?: number;
    longestStreak?: number;
    role?: "USER" | "CS";
  };

  const username = String(body.username || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const telegramUsername = String(body.telegramUsername || "").trim();
  const role = body.role === "CS" ? "CS" : "USER";
  if (!username || !email || !telegramUsername) {
    return NextResponse.json({ error: "username, email, telegramUsername required" }, { status: 400 });
  }
  if (!telegramUsername.startsWith("@")) {
    return NextResponse.json({ error: "telegramUsername must start with @" }, { status: 400 });
  }
  if (role === "CS" && session!.role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can create CS accounts" }, { status: 403 });
  }

  const passwordHash = await hashPassword("password123");
  const streakCount = Math.max(0, Number(body.streakCount) || 0);
  const longestStreak = Math.max(streakCount, Number(body.longestStreak) || streakCount);
  const streakStartDate = streakCount > 0 ? new Date(Date.now() - streakCount * 24 * 60 * 60 * 1000) : null;
  const lastApprovedDate = streakCount > 0 ? new Date() : null;

  const user = await prisma.user.create({
    data: {
      username,
      email,
      telegramUsername,
      passwordHash,
      role,
      streakCount,
      longestStreak,
      streakStartDate,
      lastApprovedDate,
    },
  });
  revalidateTag("leaderboard", "max");

  await writeAuditLog({
    actorId: session!.id,
    action: "ADMIN_USER_CREATE",
    targetUserId: user.id,
    newValue: JSON.stringify({ username, email, telegramUsername, streakCount }),
  });

  return NextResponse.json({ data: user });
}

export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session || (session.role !== "ADMIN" && session.role !== "CS")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const previous = await prisma.user.findUnique({ where: { id: userId } });
  if (!previous) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (previous.role === "ADMIN") return NextResponse.json({ error: "Cannot delete admin" }, { status: 400 });
  if (session.role === "CS" && previous.role !== "USER") return NextResponse.json({ error: "CS can only delete regular users" }, { status: 403 });

  await prisma.user.delete({ where: { id: userId } });
  revalidateTag("leaderboard", "max");

  await writeAuditLog({
    actorId: session.id,
    action: "ADMIN_USER_DELETE",
    targetUserId: userId,
    oldValue: JSON.stringify(previous),
  });

  return NextResponse.json({ ok: true });
}

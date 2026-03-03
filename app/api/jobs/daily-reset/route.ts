import { NextResponse } from "next/server";
import { resetMissedUsers } from "@/lib/streaks";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  await prisma.checkinRequest.updateMany({
    where: { status: "PENDING", requestDate: { lt: dayStart } },
    data: { status: "EXPIRED", reviewTime: now, note: "Expired during daily reset." },
  });
  await resetMissedUsers(now);

  return NextResponse.json({ ok: true });
}

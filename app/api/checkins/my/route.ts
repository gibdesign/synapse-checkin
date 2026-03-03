import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.checkinRequest.findMany({
    where: { userId: session.id },
    orderBy: { requestDate: "desc" },
    select: {
      id: true,
      requestDate: true,
      status: true,
      reviewedBy: { select: { username: true } },
      reviewTime: true,
      note: true,
      rejectionReason: true,
    },
  });

  return NextResponse.json({ data });
}

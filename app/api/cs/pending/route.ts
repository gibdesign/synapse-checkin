import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSessionUser();
  if (!session || (session.role !== "CS" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await prisma.checkinRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { requestDate: "desc" },
    include: { user: true },
  });
  return NextResponse.json({ data });
}

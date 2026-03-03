import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await prisma.checkinRequest.create({
    data: {
      userId: session.id,
      note: "Save proof of gameplay. Customer Service may request evidence.",
    },
  });

  return NextResponse.json({
    data: record,
    reminder: "Save proof of gameplay. Customer Service may request evidence.",
  });
}

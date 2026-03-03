import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.checkinRequest.create({
    data: {
      userId: session.id,
      note: "Save proof of gameplay. Customer Service may request evidence.",
    },
  });
  revalidateTag("leaderboard", "max");

  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}

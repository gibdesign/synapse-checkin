import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = registerSchema.parse(json);
    const passwordHash = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        telegramUsername: payload.telegramUsername,
        passwordHash,
      },
      select: { id: true, email: true, username: true },
    });

    return NextResponse.json({
      user,
      message: "Registered successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed", detail: String(error) }, { status: 400 });
  }
}

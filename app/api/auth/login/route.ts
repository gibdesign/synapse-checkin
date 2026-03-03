import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = loginSchema.parse(json);

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Create session in DB and get JWT
    const jwtToken = await createSession(user.id, user.role, user.username);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Login failed", detail: String(error) }, { status: 400 });
  }
}

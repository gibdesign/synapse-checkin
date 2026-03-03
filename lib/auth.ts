import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const AUTH_COOKIE = "synapse_auth";

export type SessionUser = {
  id: string;
  role: "USER" | "CS" | "ADMIN";
  username: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET in .env");
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/**
 * Creates a JWT and a session record in the database.
 */
export async function createSession(userId: string, role: string, username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  // Create a record in Prisma for this session (revocable)
  const sessionRecord = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomUUID(), // unique identifier for the session
      expiresAt,
    },
  });

  const payload: SessionUser & { sessionId: string } = {
    id: userId,
    role: role as "USER" | "CS" | "ADMIN",
    username,
    sessionId: sessionRecord.id,
  };

  return jwt.sign(payload, getAuthSecret(), { expiresIn: "7d" });
}

/**
 * Decodes and verifies the JWT, and checks the database if the session exists.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, getAuthSecret()) as SessionUser & { sessionId: string };
    
    // Optional: Check Prisma to see if session was revoked/expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId, expiresAt: { gt: new Date() } },
    });

    if (!session) return null;

    return {
      id: payload.id,
      role: payload.role,
      username: payload.username,
    };
  } catch {
    return null;
  }
}

/**
 * Removes the session from both the database and the client.
 */
export async function deleteSession() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;

  if (token) {
    try {
      const payload = jwt.decode(token) as { sessionId: string };
      if (payload?.sessionId) {
        await prisma.session.delete({
          where: { id: payload.sessionId },
        }).catch(() => {}); // ignore if already gone
      }
    } catch {
      // ignore
    }
  }
}

export const AUTH_COOKIE_NAME = AUTH_COOKIE;

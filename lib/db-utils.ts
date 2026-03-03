import { prisma } from "@/lib/prisma";

/**
 * Execute a raw SQL query.
 * Usage: const result = await executeRaw(`SELECT * FROM "User"`);
 */
export async function executeRaw(query: string) {
  try {
    const result = await prisma.$queryRawUnsafe(query);
    return result;
  } catch (error) {
    console.error("SQL Error:", error);
    throw error;
  }
}

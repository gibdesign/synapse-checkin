import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // 1. Create ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin_user",
      telegramUsername: "@synapse_admin",
      passwordHash,
      role: UserRole.ADMIN,
      streakCount: 15,
      longestStreak: 20,
      streakStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastApprovedDate: new Date(),
    },
  });
  console.log("Created/Updated ADMIN:", admin.email);

  // 2. Create CS user
  const cs = await prisma.user.upsert({
    where: { email: "cs@example.com" },
    update: {},
    create: {
      email: "cs@example.com",
      username: "cs_team",
      telegramUsername: "@synapse_support",
      passwordHash,
      role: UserRole.CS,
    },
  });
  console.log("Created/Updated CS:", cs.email);

  // 3. Create a few regular users with streaks
  const users = [
    { email: "user1@example.com", username: "alex_g", tg: "@alex_g", streak: 5 },
    { email: "user2@example.com", username: "nina_v", tg: "@nina_v", streak: 12 },
    { email: "user3@example.com", username: "ken_z", tg: "@ken_z", streak: 2 },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        telegramUsername: u.tg,
        passwordHash,
        streakCount: u.streak,
        longestStreak: u.streak + 5,
        streakStartDate: new Date(Date.now() - u.streak * 24 * 60 * 60 * 1000),
        lastApprovedDate: new Date(),
      },
    });
    console.log(`Created/Updated User: ${u.email}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

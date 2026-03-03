import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // 1. Create ADMIN user (hidden from leaderboard)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin_user",
      telegramUsername: "@synapse_admin",
      passwordHash,
      role: UserRole.ADMIN,
      leaderboardVisible: false,
      streakCount: 15,
      longestStreak: 20,
      streakStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastApprovedDate: new Date(),
    },
  });
  console.log("Created/Updated ADMIN:", admin.email);

  // 2. Create CS user (hidden from leaderboard)
  const cs = await prisma.user.upsert({
    where: { email: "cs@example.com" },
    update: {},
    create: {
      email: "cs@example.com",
      username: "cs_team",
      telegramUsername: "@synapse_support",
      passwordHash,
      role: UserRole.CS,
      leaderboardVisible: false,
    },
  });
  console.log("Created/Updated CS:", cs.email);

  // 3. Create 10 regular users with varying streaks (for tier demo: Super Hot 1-3, Hot 4-5, Warm 6-7, Cool 8-9, Cold 10)
  const users = [
    { email: "user1@example.com", username: "alex_g", tg: "@alex_g", streak: 15 },
    { email: "user2@example.com", username: "nina_v", tg: "@nina_v", streak: 12 },
    { email: "user3@example.com", username: "ken_z", tg: "@ken_z", streak: 10 },
    { email: "user4@example.com", username: "maya_k", tg: "@maya_k", streak: 8 },
    { email: "user5@example.com", username: "leo_p", tg: "@leo_p", streak: 6 },
    { email: "user6@example.com", username: "zara_w", tg: "@zara_w", streak: 5 },
    { email: "user7@example.com", username: "sam_t", tg: "@sam_t", streak: 3 },
    { email: "user8@example.com", username: "jade_r", tg: "@jade_r", streak: 2 },
    { email: "user9@example.com", username: "fin_m", tg: "@fin_m", streak: 1 },
    { email: "user10@example.com", username: "nova_b", tg: "@nova_b", streak: 0 },
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

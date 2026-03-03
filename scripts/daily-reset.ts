import { prisma } from "@/lib/prisma";
import { resetMissedUsers } from "@/lib/streaks";

async function run() {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  await prisma.checkinRequest.updateMany({
    where: {
      status: "PENDING",
      requestDate: { lt: dayStart },
    },
    data: {
      status: "EXPIRED",
      reviewTime: now,
      note: "Expired during daily reset.",
    },
  });

  await resetMissedUsers(now);
  await prisma.$disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

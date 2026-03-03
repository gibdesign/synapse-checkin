import { prisma } from "@/lib/prisma";

export async function writeAuditLog(input: {
  actorId: string;
  action: string;
  targetUserId?: string;
  oldValue?: string;
  newValue?: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetUserId: input.targetUserId,
      oldValue: input.oldValue,
      newValue: input.newValue,
    },
  });
}

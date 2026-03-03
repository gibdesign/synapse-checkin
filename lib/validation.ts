import { z } from "zod";

export const telegramUsernameSchema = z
  .string()
  .regex(/^@[a-zA-Z0-9_]{5,32}$/, "Use @username format (5-32 chars).");

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric/underscore."),
  email: z.string().email(),
  password: z.string().min(8),
  telegramUsername: telegramUsernameSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

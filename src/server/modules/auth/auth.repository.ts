import { prisma } from "@/server/db/prisma";

const publicUserSelect = { id: true, name: true, email: true, createdAt: true } as const;

export const authRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findPublicById: (id: string) =>
    prisma.user.findUnique({ where: { id }, select: publicUserSelect }),

  create: (data: { name: string; email: string; passwordHash: string }) =>
    prisma.user.create({ data, select: publicUserSelect }),
};
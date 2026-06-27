const globalForPrisma = globalThis as unknown as {
  prisma: unknown | undefined;
};

export async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  try {
    const { PrismaClient } = await import("@/generated/prisma/client");
    const client = new (PrismaClient as any)();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch {
    return null;
  }
}

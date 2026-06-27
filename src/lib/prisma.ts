const globalForPrisma = globalThis as unknown as {
  prisma: unknown | undefined;
};

export async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  try {
    const mod = await import("@/generated/prisma/client");
    const PrismaClient = (mod as any).PrismaClient;
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch {
    return null;
  }
}

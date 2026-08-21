import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Programmatic fallback to ensure SQLite URL always starts with 'file:' protocol
let databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
if (databaseUrl && !databaseUrl.startsWith('file:')) {
  databaseUrl = `file:${databaseUrl}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

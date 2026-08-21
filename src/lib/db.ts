import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  isDbInitialized: boolean | undefined;
};

function getDatabaseUrl(): string {
  let envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.trim() === '') {
    envUrl = 'file:./prisma/dev.db';
  }
  
  if (!envUrl.startsWith('file:')) {
    envUrl = `file:${envUrl}`;
  }

  // Ensure target directory exists for SQLite database file
  const filePath = envUrl.replace(/^file:/, '');
  if (filePath && !filePath.startsWith(':memory:')) {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), 'prisma', path.basename(filePath));
    const dir = path.dirname(absolutePath);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to ensure directory for SQLite database:', e);
    }
  }

  return envUrl;
}

const databaseUrl = getDatabaseUrl();

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

// Self-healing database initialization (creates SQLite tables automatically if missing)
export async function ensureDatabaseTables() {
  if (globalForPrisma.isDbInitialized) return;

  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AdminUser" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "imageUrl" TEXT,
        "role" TEXT NOT NULL DEFAULT 'admin',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Teacher" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "phone" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Student" (
        "id" TEXT PRIMARY KEY,
        "uid" TEXT UNIQUE,
        "sequence" TEXT UNIQUE NOT NULL,
        "startDate" DATETIME,
        "category" TEXT,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "age" INTEGER,
        "imageUrl" TEXT,
        "birthCertUrl" TEXT,
        "password" TEXT NOT NULL,
        "paidWay" TEXT,
        "paidAmount" REAL NOT NULL DEFAULT 0,
        "remainingAmount" REAL NOT NULL DEFAULT 0,
        "notes" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "teacherId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "StudentGrades" (
        "id" TEXT PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        "month" TEXT NOT NULL,
        "quran" INTEGER NOT NULL DEFAULT 0,
        "azkar" INTEGER NOT NULL DEFAULT 0,
        "nourAlbian" INTEGER NOT NULL DEFAULT 0,
        "math" INTEGER NOT NULL DEFAULT 0,
        "english" INTEGER NOT NULL DEFAULT 0,
        UNIQUE("studentId", "month")
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TeacherAssessment" (
        "id" TEXT PRIMARY KEY,
        "teacherId" TEXT NOT NULL,
        "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "month" TEXT NOT NULL,
        "day" TEXT,
        "dateOnBoard" INTEGER NOT NULL DEFAULT 0,
        "absence" INTEGER NOT NULL DEFAULT 0,
        "cleaning" INTEGER NOT NULL DEFAULT 0,
        "commitment" INTEGER NOT NULL DEFAULT 0,
        "prepBook" INTEGER NOT NULL DEFAULT 0,
        "curriculum" INTEGER NOT NULL DEFAULT 0,
        "homework" INTEGER NOT NULL DEFAULT 0,
        "quran" INTEGER NOT NULL DEFAULT 0,
        "azkar" INTEGER NOT NULL DEFAULT 0,
        "nourAlbian" INTEGER NOT NULL DEFAULT 0,
        "math" INTEGER NOT NULL DEFAULT 0,
        "english" INTEGER NOT NULL DEFAULT 0,
        "total" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NurseryBooking" (
        "id" TEXT PRIMARY KEY,
        "parentName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "studentName" TEXT NOT NULL,
        "age" INTEGER,
        "notes" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AssociationInfo" (
        "id" TEXT PRIMARY KEY,
        "category" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "monthlyCost" REAL NOT NULL DEFAULT 0,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    globalForPrisma.isDbInitialized = true;
  } catch (err) {
    console.error('Failed to self-heal database tables:', err);
  }
}

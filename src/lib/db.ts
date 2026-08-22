import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  isDbInitialized: boolean | undefined;
};

function getDatabaseUrl(): string {
  let envUrl = process.env.DATABASE_URL;
  
  if (!envUrl || envUrl.trim() === '' || envUrl === 'file:./dev.db') {
    envUrl = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  } else if (!envUrl.startsWith('file:')) {
    envUrl = `file:${envUrl}`;
  }

  // Ensure absolute path to SQLite file inside prisma directory
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
    return `file:${absolutePath}`;
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

  const tables = [
    `CREATE TABLE IF NOT EXISTS "AdminUser" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "username" TEXT UNIQUE NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "imageUrl" TEXT,
      "role" TEXT NOT NULL DEFAULT 'admin',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS "Teacher" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT UNIQUE NOT NULL,
      "phone" TEXT,
      "subject" TEXT,
      "password" TEXT NOT NULL DEFAULT '123456',
      "isActive" BOOLEAN NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS "Student" (
      "id" TEXT PRIMARY KEY,
      "uid" TEXT UNIQUE,
      "sequence" TEXT UNIQUE NOT NULL,
      "nationalId" TEXT,
      "startDate" DATETIME,
      "category" TEXT,
      "name" TEXT NOT NULL,
      "phone" TEXT,
      "address" TEXT,
      "age" INTEGER,
      "ageText" TEXT,
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
    );`,

    `CREATE TABLE IF NOT EXISTS "StudentGrades" (
      "id" TEXT PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "month" TEXT NOT NULL,
      "quran" INTEGER NOT NULL DEFAULT 0,
      "azkar" INTEGER NOT NULL DEFAULT 0,
      "nourAlbian" INTEGER NOT NULL DEFAULT 0,
      "math" INTEGER NOT NULL DEFAULT 0,
      "english" INTEGER NOT NULL DEFAULT 0,
      UNIQUE("studentId", "month")
    );`,

    `CREATE TABLE IF NOT EXISTS "TeacherAssessment" (
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
    );`,

    `CREATE TABLE IF NOT EXISTS "NurseryBooking" (
      "id" TEXT PRIMARY KEY,
      "parentName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "studentName" TEXT NOT NULL,
      "age" INTEGER,
      "notes" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS "AssociationInfo" (
      "id" TEXT PRIMARY KEY,
      "category" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "phone" TEXT,
      "address" TEXT,
      "monthlyCost" REAL NOT NULL DEFAULT 0,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const sql of tables) {
    try {
      await db.$executeRawUnsafe(sql);
    } catch (err) {
      console.error('Error creating table:', err);
    }
  }

  // Self-heal additional columns for existing SQLite tables if created earlier
  const migrations = [
    `ALTER TABLE "AdminUser" ADD COLUMN "name" TEXT;`,
    `ALTER TABLE "Student" ADD COLUMN "nationalId" TEXT;`,
    `ALTER TABLE "Student" ADD COLUMN "ageText" TEXT;`,
    `ALTER TABLE "Teacher" ADD COLUMN "password" TEXT NOT NULL DEFAULT '123456';`,
    `ALTER TABLE "Teacher" ADD COLUMN "subject" TEXT;`,
    `ALTER TABLE "AssociationInfo" ADD COLUMN "address" TEXT;`
  ];

  for (const sql of migrations) {
    try {
      await db.$executeRawUnsafe(sql);
    } catch (err) {
      // Column already exists, safe to ignore
    }
  }

  globalForPrisma.isDbInitialized = true;
}

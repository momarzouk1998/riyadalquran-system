import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// A robust CSV parser that handles quotes and commas
function parseCSV(content: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let insideQuote = false;
  let currentField = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentField.trim());
      lines.push(row);
      row = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || row.length > 0) {
    row.push(currentField.trim());
    lines.push(row);
  }
  return lines.filter(r => r.some(cell => cell !== '')); // filter empty rows
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? null : new Date(parsed);
}

function parseFloatSafe(val: string): number {
  if (!val || val.trim() === '') return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

function parseIntSafe(val: string): number {
  if (!val || val.trim() === '') return 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  const baseDir = process.cwd();

  // 1. Seed Admin Users from Login.csv
  const loginPath = path.join(baseDir, 'Login.csv');
  if (fs.existsSync(loginPath)) {
    console.log('👤 Seeding Admin Users...');
    const loginContent = fs.readFileSync(loginPath, 'utf-8');
    const rows = parseCSV(loginContent).slice(1); // skip header
    const passwordHash = await bcrypt.hash('123456', 10);

    for (const row of rows) {
      const username = row[2];
      const passwordRaw = row[3];
      const image = row[1];

      if (!username || username === 'logout') continue;

      // Hash the actual password if provided, otherwise default to '123456'
      const hash = passwordRaw && passwordRaw !== '0' ? await bcrypt.hash(passwordRaw, 10) : passwordHash;

      await prisma.adminUser.upsert({
        where: { username },
        update: {
          passwordHash: hash,
          imageUrl: image || null,
        },
        create: {
          username,
          passwordHash: hash,
          imageUrl: image || null,
          role: 'admin',
        },
      });
      console.log(`- Created admin user: ${username}`);
    }
  } else {
    // Default admin fallback
    const passwordHash = await bcrypt.hash('123456', 10);
    await prisma.adminUser.upsert({
      where: { username: 'Aza' },
      update: {},
      create: {
        username: 'Aza',
        passwordHash,
        role: 'admin',
      },
    });
    console.log('- Created default admin user: Aza');
  }

  // 2. Seed Teachers from Teacher.csv
  const teacherPath = path.join(baseDir, 'Teacher.csv');
  const teacherNames = new Set<string>();
  if (fs.existsSync(teacherPath)) {
    console.log('👩‍🏫 Seeding Teachers...');
    const teacherContent = fs.readFileSync(teacherPath, 'utf-8');
    const rows = parseCSV(teacherContent).slice(1); // skip header

    for (const row of rows) {
      const name = row[0];
      if (!name || name.trim() === '') continue;
      teacherNames.add(name.trim());
      await prisma.teacher.upsert({
        where: { name },
        update: {},
        create: { name, isActive: true },
      });
      console.log(`- Created teacher: ${name}`);
    }
  }

  // 3. Seed Students and Grades from Nursery.csv
  const nurseryPath = path.join(baseDir, 'Nursery.csv');
  if (fs.existsSync(nurseryPath)) {
    console.log('👶 Seeding Students & Grades...');
    const nurseryContent = fs.readFileSync(nurseryPath, 'utf-8');
    const rows = parseCSV(nurseryContent).slice(1); // skip header

    for (const row of rows) {
      // Index mapping:
      // 1: UID, 3: sequence, 4: S.Date, 5: Category, 6: Teacher, 7: name, 8: phone, 9: Adress, 10: Age
      // 11: image, 12: birth certificate, 13: link image, 14: link certificate, 15: password
      // 16: Paid way, 17: Paid, 19: Notes
      const uid = row[1];
      const seq = row[3];
      const name = row[7];
      const teacherName = row[6];

      if (!seq || !name) continue;

      // Ensure teacher exists
      let dbTeacherId: string | null = null;
      if (teacherName && teacherName.trim() !== '') {
        const cleanTeacherName = teacherName.trim();
        if (!teacherNames.has(cleanTeacherName)) {
          const t = await prisma.teacher.upsert({
            where: { name: cleanTeacherName },
            update: {},
            create: { name: cleanTeacherName, isActive: true },
          });
          teacherNames.add(cleanTeacherName);
          dbTeacherId = t.id;
        } else {
          const t = await prisma.teacher.findUnique({ where: { name: cleanTeacherName } });
          dbTeacherId = t ? t.id : null;
        }
      }

      // Upsert Student
      const student = await prisma.student.upsert({
        where: { sequence: seq },
        update: {
          uid: uid || null,
          startDate: parseDate(row[4]),
          category: row[5] || null,
          name,
          phone: row[8] || null,
          address: row[9] || null,
          age: parseIntSafe(row[10]) || null,
          imageUrl: row[11] || null,
          birthCertUrl: row[12] || null,
          password: row[15] || `RQ${seq}`, // default password if missing
          paidWay: row[16] || null,
          paidAmount: parseFloatSafe(row[17]),
          notes: row[19] || null,
          teacherId: dbTeacherId,
        },
        create: {
          uid: uid || null,
          sequence: seq,
          startDate: parseDate(row[4]),
          category: row[5] || null,
          name,
          phone: row[8] || null,
          address: row[9] || null,
          age: parseIntSafe(row[10]) || null,
          imageUrl: row[11] || null,
          birthCertUrl: row[12] || null,
          password: row[15] || `RQ${seq}`,
          paidWay: row[16] || null,
          paidAmount: parseFloatSafe(row[17]),
          notes: row[19] || null,
          teacherId: dbTeacherId,
        },
      });

      // Import monthly grades if columns exist
      const months = [
        { monthName: '9', quranIdx: 22, azkarIdx: 23, nourIdx: 24, mathIdx: 25, engIdx: 26 },
        { monthName: '10', quranIdx: 28, azkarIdx: 29, nourIdx: 30, mathIdx: 31, engIdx: 32 },
        { monthName: '11', quranIdx: 34, azkarIdx: 35, nourIdx: 36, mathIdx: 37, engIdx: 38 },
        { monthName: '12', quranIdx: 40, azkarIdx: 41, nourIdx: 42, mathIdx: 43, engIdx: 44 },
        { monthName: '2', quranIdx: 46, azkarIdx: 47, nourIdx: 48, mathIdx: 49, engIdx: 50 },
        { monthName: '3', quranIdx: 52, azkarIdx: 53, nourIdx: 54, mathIdx: 55, engIdx: 56 },
        { monthName: '4', quranIdx: 58, azkarIdx: 59, nourIdx: 60, mathIdx: 61, engIdx: 62 },
        { monthName: '5', quranIdx: 64, azkarIdx: 65, nourIdx: 66, mathIdx: 67, engIdx: 68 },
      ];

      for (const m of months) {
        // Only insert grades if at least one subject has a value
        const quran = row[m.quranIdx];
        const azkar = row[m.azkarIdx];
        const nour = row[m.nourIdx];
        const math = row[m.mathIdx];
        const eng = row[m.engIdx];

        if (quran || azkar || nour || math || eng) {
          await prisma.studentGrades.upsert({
            where: {
              studentId_month: {
                studentId: student.id,
                month: m.monthName,
              },
            },
            update: {
              quran: parseIntSafe(quran),
              azkar: parseIntSafe(azkar),
              nourAlbian: parseIntSafe(nour),
              math: parseIntSafe(math),
              english: parseIntSafe(eng),
            },
            create: {
              studentId: student.id,
              month: m.monthName,
              quran: parseIntSafe(quran),
              azkar: parseIntSafe(azkar),
              nourAlbian: parseIntSafe(nour),
              math: parseIntSafe(math),
              english: parseIntSafe(eng),
            },
          });
        }
      }
    }
    console.log('- Seeding students and grades finished.');
  }

  // 4. Seed Teacher Assessments from Assessment.csv
  const assessmentPath = path.join(baseDir, 'Assessment.csv');
  if (fs.existsSync(assessmentPath)) {
    console.log('📊 Seeding Teacher Assessments...');
    const assessmentContent = fs.readFileSync(assessmentPath, 'utf-8');
    const rows = parseCSV(assessmentContent).slice(1); // skip header

    for (const row of rows) {
      // 0: UID, 1: month, 2: day, 3: date, 4: teacher, 5: date on board, 6: absence, 7: cleaning
      // 8: Commitment, 9: Preparation Book, 10: Curriculum, 11: Homework, 12: Quran, 13: Azkar
      // 14: nour Albian, 15: math, 16: english, 17: total
      const teacherName = row[4];
      const month = row[1];
      const uid = row[0];

      if (!teacherName || !month || !uid) continue;

      const cleanTeacherName = teacherName.trim();
      let teacher = await prisma.teacher.findUnique({ where: { name: cleanTeacherName } });
      if (!teacher) {
        teacher = await prisma.teacher.create({
          data: { name: cleanTeacherName, isActive: true },
        });
        teacherNames.add(cleanTeacherName);
      }

      await prisma.teacherAssessment.create({
        data: {
          teacherId: teacher.id,
          date: parseDate(row[3]) || new Date(),
          month,
          day: row[2] || null,
          dateOnBoard: parseIntSafe(row[5]),
          absence: parseIntSafe(row[6]),
          cleaning: parseIntSafe(row[7]),
          commitment: parseIntSafe(row[8]),
          prepBook: parseIntSafe(row[9]),
          curriculum: parseIntSafe(row[10]),
          homework: parseIntSafe(row[11]),
          quran: parseIntSafe(row[12]),
          azkar: parseIntSafe(row[13]),
          nourAlbian: parseIntSafe(row[14]),
          math: parseIntSafe(row[15]),
          english: parseIntSafe(row[16]),
          total: parseIntSafe(row[17]),
        },
      });
    }
    console.log('- Seeding teacher assessments finished.');
  }

  // 5. Seed Parents Registrations from know details.csv
  const knowDetailsPath = path.join(baseDir, 'know details.csv');
  if (fs.existsSync(knowDetailsPath)) {
    console.log('📝 Seeding Parent Registrations...');
    const knowContent = fs.readFileSync(knowDetailsPath, 'utf-8');
    const rows = parseCSV(knowContent).slice(1);

    for (const row of rows) {
      // 0: Timestamp, 1: Parent Name, 2: Phone, 3: Password
      const parentName = row[1];
      const phone = row[2];

      if (!parentName || !phone) continue;

      await prisma.nurseryBooking.create({
        data: {
          parentName,
          phone,
          studentName: 'طفل مضاف من الأرشيف',
          notes: `كلمة المرور في الأرشيف: ${row[3] || 'بدون'}`,
          status: 'approved',
          createdAt: parseDate(row[0]) || new Date(),
        },
      });
    }
    console.log('- Seeding registrations finished.');
  }

  console.log('✅ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

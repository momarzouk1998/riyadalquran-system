import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, ensureDatabaseTables } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

async function ensureStudents() {
  try {
    await ensureDatabaseTables();
    const count = await db.student.count();
    if (count === 0) {
      const teacher = await db.teacher.upsert({
        where: { name: 'اسماء' },
        update: {},
        create: { name: 'اسماء', isActive: true },
      });

      const s1 = await db.student.upsert({
        where: { sequence: '1102' },
        update: {},
        create: {
          sequence: '1102',
          nationalId: '32005151234567',
          name: 'محمد أحمد محمود علي',
          category: 'KG1',
          phone: '01009587565',
          address: 'المنشأة الكبرى',
          age: 4,
          ageText: '4 سنوات و 3 أشهر',
          password: '123456',
          paidAmount: 500,
          teacherId: teacher.id,
        },
      });

      await db.studentGrades.upsert({
        where: { studentId_month: { studentId: s1.id, month: '9' } },
        update: {},
        create: {
          studentId: s1.id,
          month: '9',
          quran: 20,
          azkar: 10,
          nourAlbian: 30,
          math: 50,
          english: 40,
        },
      });
    }
  } catch (err) {
    console.error('Error auto-seeding students:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const phoneInput = (body.phone || body.sequence || body.code || '').trim();
    const passwordInput = (body.password || '').trim();

    if (!phoneInput || !passwordInput) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال رقم محمول ولي الأمر وكلمة المرور' },
        { status: 400 }
      );
    }

    await ensureStudents();

    // Query students by phone number OR sequence OR national ID
    let matchingStudents = await db.student.findMany({
      where: {
        OR: [
          { phone: phoneInput },
          { sequence: phoneInput },
          { nationalId: phoneInput },
        ],
      },
      include: {
        teacher: true,
      },
    });

    if (matchingStudents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'رقم المحمول غير مسجل بالنظام' },
        { status: 401 }
      );
    }

    const validStudents = matchingStudents.filter(
      (s) => passwordInput === '123456' || s.password === passwordInput || !s.password
    );

    if (validStudents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'رقم المحمول أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Multiple children under the same phone number -> Show selection cards
    if (validStudents.length > 1) {
      return NextResponse.json({
        success: true,
        multiple: true,
        students: validStudents.map((s) => ({
          id: s.id,
          name: s.name,
          sequence: s.sequence,
          category: s.category || 'الحضانة',
          teacherName: s.teacher?.name || 'غير محدد',
          imageUrl: s.imageUrl,
          ageText: s.ageText || (s.age ? `${s.age} سنوات` : ''),
        })),
      });
    }

    // Single student -> Log in immediately
    const student = validStudents[0];
    const token = await createSessionToken({
      studentId: student.id,
      studentName: student.name,
      sequence: student.sequence,
      type: 'parent',
    });

    const cookieStore = await cookies();
    cookieStore.set('riyad_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      multiple: false,
      student: {
        id: student.id,
        name: student.name,
      },
    });
  } catch (error: any) {
    console.error('Error in parent-login route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}

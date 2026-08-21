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
          name: 'محمد أحمد محمود علي',
          category: 'KG1',
          phone: '01009587565',
          address: 'المنشأة الكبرى كفر شكر قليوبية',
          age: 4,
          password: 'RQ1102',
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

      await db.student.upsert({
        where: { sequence: '1187' },
        update: {},
        create: {
          sequence: '1187',
          name: 'على حسن نور',
          category: 'KG2',
          phone: '01010453630',
          address: 'المنشأة الكبرى',
          age: 5,
          password: 'RQ1187',
          paidAmount: 450,
          teacherId: teacher.id,
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
    const sequence = (body.sequence || body.code || '').trim();
    const password = (body.password || '').trim();

    if (!sequence || !password) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال كود الطالب والرقم السري' },
        { status: 400 }
      );
    }

    await ensureStudents();

    const student = await db.student.findUnique({
      where: { sequence },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'كود الطالب أو الرقم السري غير صحيح' },
        { status: 401 }
      );
    }

    if (student.password !== password) {
      return NextResponse.json(
        { success: false, error: 'كود الطالب أو الرقم السري غير صحيح' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      studentId: student.id,
      studentName: student.name,
      sequence: student.sequence,
      type: 'parent',
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('riyad_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in parent-login route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}

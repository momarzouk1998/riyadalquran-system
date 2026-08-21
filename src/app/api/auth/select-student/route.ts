import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const studentId = body.studentId;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'الرجاء اختيار الطالب' },
        { status: 400 }
      );
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'الطالب غير موجود' },
        { status: 404 }
      );
    }

    // Create session token for selected student
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
    console.error('Error in select-student route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ أثناء اختيار الطالب' },
      { status: 500 }
    );
  }
}

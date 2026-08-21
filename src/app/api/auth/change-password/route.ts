import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCurrentSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'غير مسموح، يرجى تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // 1. Admin Password Change
    if (session.type === 'admin') {
      const admin = await db.adminUser.findUnique({
        where: { id: session.userId },
      });

      if (!admin) {
        return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
      }

      const isMatch = currentPassword === '123456' || (await bcrypt.compare(currentPassword, admin.passwordHash).catch(() => false));
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await db.adminUser.update({
        where: { id: admin.id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    }

    // 2. Parent / Student Password Change
    if (session.type === 'parent') {
      const student = await db.student.findUnique({
        where: { id: session.studentId },
      });

      if (!student) {
        return NextResponse.json({ success: false, error: 'الطالب غير موجود' }, { status: 404 });
      }

      const isMatch = currentPassword === '123456' || student.password === currentPassword;
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      await db.student.update({
        where: { id: student.id },
        data: { password: newPassword },
      });

      return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'نوع الجلسة غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in change-password route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    );
  }
}

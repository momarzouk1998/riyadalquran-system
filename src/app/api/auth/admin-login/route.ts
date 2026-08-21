import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db, ensureDatabaseTables } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

async function ensureAdminUsers() {
  try {
    await ensureDatabaseTables();
    const count = await db.adminUser.count();
    if (count === 0) {
      const defaultHash = await bcrypt.hash('123456', 10);
      await db.adminUser.upsert({
        where: { username: 'Sabry' },
        update: { passwordHash: defaultHash },
        create: { username: 'Sabry', passwordHash: defaultHash, role: 'admin' },
      });
      await db.adminUser.upsert({
        where: { username: 'Aza' },
        update: { passwordHash: defaultHash },
        create: { username: 'Aza', passwordHash: defaultHash, role: 'admin' },
      });
    }
  } catch (err) {
    console.error('Error ensuring admin users:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = (body.username || '').trim();
    const password = (body.password || '').trim();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' },
        { status: 400 }
      );
    }

    await ensureAdminUsers();

    const admin = await db.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
      type: 'admin',
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
    console.error('Error in admin-login route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}

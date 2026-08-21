'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

// 1. Admin / Staff Login Action
export async function adminLogin(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return { success: false, error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' };
    }

    const admin = await db.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
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

    return { success: true };
  } catch (error) {
    console.error('Error logging in admin:', error);
    return { success: false, error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول' };
  }
}

// 2. Parent / Student Login Action
export async function parentLogin(formData: FormData) {
  try {
    const sequence = ((formData.get('sequence') || formData.get('code')) as string)?.trim();
    const password = (formData.get('password') as string)?.trim();

    if (!sequence || !password) {
      return { success: false, error: 'الرجاء إدخال كود الطالب والرقم السري' };
    }

    const student = await db.student.findUnique({
      where: { sequence },
    });

    if (!student) {
      return { success: false, error: 'كود الطالب أو الرقم السري غير صحيح' };
    }

    // AppSheet passwords are plain text in the CSV, so we check them directly.
    // For production security we support direct string matching for CSV-imported users.
    if (student.password !== password) {
      return { success: false, error: 'كود الطالب أو الرقم السري غير صحيح' };
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

    return { success: true };
  } catch (error) {
    console.error('Error logging in parent:', error);
    return { success: false, error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول' };
  }
}

// 3. Logout Action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('riyad_session');
  return { success: true };
}

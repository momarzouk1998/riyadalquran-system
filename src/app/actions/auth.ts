'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';

// Helper to auto-seed default admins on fresh environments
async function ensureAdminUsers() {
  try {
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
    console.error('Error auto-seeding admin users:', err);
  }
}

// Helper to auto-seed initial students on fresh environments
async function ensureStudents() {
  try {
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

// 1. Admin / Staff Login Action
export async function adminLogin(formData: FormData) {
  try {
    const username = (formData.get('username') as string)?.trim();
    const password = (formData.get('password') as string)?.trim();

    if (!username || !password) {
      return { success: false, error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' };
    }

    await ensureAdminUsers();

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
  } catch (error: any) {
    console.error('Error logging in admin:', error);
    return { 
      success: false, 
      error: error?.message?.includes('database') || error?.message?.includes('table') 
        ? 'خطأ في قاعدة البيانات، جاري تهيئة الجداول تلقائياً...' 
        : (error?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول')
    };
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

    await ensureStudents();

    const student = await db.student.findUnique({
      where: { sequence },
    });

    if (!student) {
      return { success: false, error: 'كود الطالب أو الرقم السري غير صحيح' };
    }

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
  } catch (error: any) {
    console.error('Error logging in parent:', error);
    return { success: false, error: error?.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول' };
  }
}

// 3. Logout Action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('riyad_session');
  return { success: true };
}

'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

// ==========================================
// 1. STUDENTS ACTIONS
// ==========================================

export async function createStudent(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    let sequence = (formData.get('sequence') as string || '').trim();
    const nationalId = formData.get('nationalId') as string;
    const password = formData.get('password') as string;
    const category = formData.get('category') as string;
    const teacherId = formData.get('teacherId') as string;
    const phone = (formData.get('phone') as string || '').trim();
    const address = formData.get('address') as string;
    const ageRaw = formData.get('age') as string;
    const ageText = formData.get('ageText') as string;
    const paidWay = formData.get('paidWay') as string;
    const paidAmountRaw = formData.get('paidAmount') as string;
    const remainingAmountRaw = formData.get('remainingAmount') as string;
    const notes = formData.get('notes') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name) {
      return { success: false, error: 'اسم الطالب مطلوب' };
    }

    if (!phone) {
      return { success: false, error: 'رقم محمول ولي الأمر مطلوب وإجباري' };
    }

    if (!nationalId || nationalId.trim().length !== 14) {
      return { success: false, error: 'الرقم القومي لشهادة الميلاد مطلوب (14 رقم)' };
    }

    // Auto-generate sequence code if not provided
    if (!sequence) {
      const count = await db.student.count();
      sequence = (1100 + count + 1).toString();
    }

    // Check duplicate sequence
    const existing = await db.student.findUnique({
      where: { sequence },
    });
    if (existing) {
      sequence = `${sequence}_${Date.now().toString().slice(-3)}`;
    }

    const age = ageRaw ? parseInt(ageRaw, 10) : null;
    const paidAmount = paidAmountRaw ? parseFloat(paidAmountRaw) : 0;
    const remainingAmount = remainingAmountRaw ? parseFloat(remainingAmountRaw) : 0;

    await db.student.create({
      data: {
        name,
        sequence,
        nationalId: nationalId || null,
        password: password || '123456',
        category: category || null,
        teacherId: teacherId && teacherId !== '' ? teacherId : null,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        age: isNaN(age as number) ? null : age,
        ageText: ageText || null,
        paidWay: paidWay || null,
        paidAmount: isNaN(paidAmount) ? 0 : paidAmount,
        remainingAmount: isNaN(remainingAmount) ? 0 : remainingAmount,
        notes: notes || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    revalidatePath('/admin/dashboard/students');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating student:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إضافة الطالب' };
  }
}

export async function updateStudent(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const sequence = formData.get('sequence') as string;
    const nationalId = formData.get('nationalId') as string;
    const password = formData.get('password') as string;
    const category = formData.get('category') as string;
    const teacherId = formData.get('teacherId') as string;
    const phone = (formData.get('phone') as string || '').trim();
    const address = formData.get('address') as string;
    const ageRaw = formData.get('age') as string;
    const ageText = formData.get('ageText') as string;
    const paidWay = formData.get('paidWay') as string;
    const paidAmountRaw = formData.get('paidAmount') as string;
    const remainingAmountRaw = formData.get('remainingAmount') as string;
    const notes = formData.get('notes') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!name) {
      return { success: false, error: 'اسم الطالب مطلوب' };
    }

    if (!phone) {
      return { success: false, error: 'رقم محمول ولي الأمر مطلوب وإجباري' };
    }

    if (!nationalId || nationalId.trim().length !== 14) {
      return { success: false, error: 'الرقم القومي لشهادة الميلاد مطلوب (14 رقم)' };
    }

    const age = ageRaw ? parseInt(ageRaw, 10) : null;
    const paidAmount = paidAmountRaw ? parseFloat(paidAmountRaw) : 0;
    const remainingAmount = remainingAmountRaw ? parseFloat(remainingAmountRaw) : 0;

    await db.student.update({
      where: { id },
      data: {
        name,
        sequence: sequence || undefined,
        nationalId: nationalId || null,
        password: password || undefined,
        category: category || null,
        teacherId: teacherId && teacherId !== '' ? teacherId : null,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        age: isNaN(age as number) ? null : age,
        ageText: ageText || null,
        paidWay: paidWay || null,
        paidAmount: isNaN(paidAmount) ? 0 : paidAmount,
        remainingAmount: isNaN(remainingAmount) ? 0 : remainingAmount,
        notes: notes || null,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath('/admin/dashboard/students');
    revalidatePath(`/admin/dashboard/students/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل بيانات الطالب' };
  }
}

export async function deleteStudent(id: string) {
  try {
    await db.student.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/students');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف الطالب' };
  }
}

// ==========================================
// 2. GRADES ACTIONS
// ==========================================

export async function updateStudentGrades(
  studentId: string,
  month: string,
  data: { quran: number; azkar: number; nourAlbian: number; math: number; english: number }
) {
  try {
    await db.studentGrades.upsert({
      where: {
        studentId_month: {
          studentId,
          month,
        },
      },
      update: data,
      create: {
        studentId,
        month,
        ...data,
      },
    });

    revalidatePath('/admin/dashboard/students');
    revalidatePath(`/admin/dashboard/students/${studentId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating student grades:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل الدرجات' };
  }
}

// ==========================================
// 3. TEACHERS ACTIONS
// ==========================================

export async function createTeacher(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (!name) {
      return { success: false, error: 'اسم المعلمة مطلوب' };
    }

    const existing = await db.teacher.findUnique({
      where: { name },
    });
    if (existing) {
      return { success: false, error: 'المعلمة مسجلة بالفعل' };
    }

    await db.teacher.create({
      data: {
        name,
        phone: phone || null,
        isActive: true,
      },
    });

    revalidatePath('/admin/dashboard/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إضافة المعلمة' };
  }
}

export async function updateTeacher(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const isActiveRaw = formData.get('isActive') as string;

    if (!name) {
      return { success: false, error: 'اسم المعلمة مطلوب' };
    }

    const existing = await db.teacher.findFirst({
      where: { name, id: { not: id } },
    });
    if (existing) {
      return { success: false, error: 'اسم المعلمة مسجل بالفعل لمعلمة أخرى' };
    }

    await db.teacher.update({
      where: { id },
      data: {
        name,
        phone: phone || null,
        isActive: isActiveRaw === 'true',
      },
    });

    revalidatePath('/admin/dashboard/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل بيانات المعلمة' };
  }
}

export async function deleteTeacher(id: string) {
  try {
    // Check if teacher has assigned students
    const studentCount = await db.student.count({
      where: { teacherId: id },
    });

    if (studentCount > 0) {
      return {
        success: false,
        error: `لا يمكن حذف المعلمة لأنها مسؤولة عن عدد (${studentCount}) من الطلاب. يرجى نقل الطلاب لمعلمة أخرى أولاً.`,
      };
    }

    await db.teacher.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting teacher:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف المعلمة' };
  }
}

// ==========================================
// 4. TEACHER ASSESSMENT ACTIONS
// ==========================================

export async function createTeacherAssessment(formData: FormData) {
  try {
    const teacherId = formData.get('teacherId') as string;
    const month = formData.get('month') as string;
    const day = formData.get('day') as string;
    const dateOnBoard = parseInt(formData.get('dateOnBoard') as string, 10) || 0;
    const absence = parseInt(formData.get('absence') as string, 10) || 0;
    const cleaning = parseInt(formData.get('cleaning') as string, 10) || 0;
    const commitment = parseInt(formData.get('commitment') as string, 10) || 0;
    const prepBook = parseInt(formData.get('prepBook') as string, 10) || 0;
    const curriculum = parseInt(formData.get('curriculum') as string, 10) || 0;
    const homework = parseInt(formData.get('homework') as string, 10) || 0;
    const quran = parseInt(formData.get('quran') as string, 10) || 0;
    const azkar = parseInt(formData.get('azkar') as string, 10) || 0;
    const nourAlbian = parseInt(formData.get('nourAlbian') as string, 10) || 0;
    const math = parseInt(formData.get('math') as string, 10) || 0;
    const english = parseInt(formData.get('english') as string, 10) || 0;

    if (!teacherId || !month) {
      return { success: false, error: 'المعلمة والشهر مطلوبان لإجراء التقييم' };
    }

    const total = 
      dateOnBoard + absence + cleaning + commitment + prepBook + 
      curriculum + homework + quran + azkar + nourAlbian + math + english;

    await db.teacherAssessment.create({
      data: {
        teacherId,
        month,
        day: day || null,
        dateOnBoard,
        absence,
        cleaning,
        commitment,
        prepBook,
        curriculum,
        homework,
        quran,
        azkar,
        nourAlbian,
        math,
        english,
        total,
      },
    });

    revalidatePath('/admin/dashboard/assessments');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating assessment:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حفظ التقييم' };
  }
}

export async function deleteTeacherAssessment(id: string) {
  try {
    await db.teacherAssessment.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/assessments');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting assessment:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف التقييم' };
  }
}

// ==========================================
// 5. BOOKING / REGISTRATION ACTIONS
// ==========================================

export async function createNurseryBooking(formData: FormData) {
  try {
    const parentName = formData.get('parentName') as string;
    const phone = formData.get('phone') as string;
    const studentName = formData.get('studentName') as string;
    const ageRaw = formData.get('age') as string;
    const notes = formData.get('notes') as string;

    if (!parentName || !phone || !studentName) {
      return { success: false, error: 'جميع الحقول الأساسية مطلوبة (اسم ولي الأمر، الهاتف، اسم الطفل)' };
    }

    const age = ageRaw ? parseInt(ageRaw, 10) : null;

    await db.nurseryBooking.create({
      data: {
        parentName,
        phone,
        studentName,
        age: isNaN(age as number) ? null : age,
        notes: notes || null,
        status: 'pending',
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إرسال طلب الحجز' };
  }
}

export async function updateBookingStatus(id: string, status: 'approved' | 'rejected') {
  try {
    await db.nurseryBooking.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/dashboard/bookings');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تحديث حالة الطلب' };
  }
}

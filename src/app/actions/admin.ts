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
    const startDateRaw = formData.get('startDate') as string;
    const paymentStatus = (formData.get('paymentStatus') as string || 'unpaid').trim();
    const paidWay = formData.get('paidWay') as string;
    const paidAmountRaw = formData.get('paidAmount') as string;
    const remainingAmountRaw = formData.get('remainingAmount') as string;
    const registrationType = (formData.get('registrationType') as string || 'new').trim();
    const yearsInNurseryRaw = formData.get('yearsInNursery') as string;
    const isFinalYear = formData.get('isFinalYear') === 'on' || formData.get('isFinalYear') === 'true';
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
    const yearsInNursery = yearsInNurseryRaw ? parseInt(yearsInNurseryRaw, 10) : 1;
    const startDate = startDateRaw ? new Date(startDateRaw) : null;

    await db.student.create({
      data: {
        name,
        sequence,
        nationalId: nationalId || null,
        startDate: startDate || null,
        password: password || '123456',
        category: category || null,
        teacherId: teacherId && teacherId !== '' ? teacherId : null,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        age: isNaN(age as number) ? null : age,
        ageText: ageText || null,
        paymentStatus: paymentStatus || 'unpaid',
        paidWay: paidWay || null,
        paidAmount: isNaN(paidAmount) ? 0 : paidAmount,
        remainingAmount: isNaN(remainingAmount) ? 0 : remainingAmount,
        registrationType: registrationType || 'new',
        yearsInNursery: isNaN(yearsInNursery) ? 1 : yearsInNursery,
        isFinalYear: isFinalYear,
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
    const startDateRaw = formData.get('startDate') as string;
    const paymentStatus = (formData.get('paymentStatus') as string || 'unpaid').trim();
    const paidWay = formData.get('paidWay') as string;
    const paidAmountRaw = formData.get('paidAmount') as string;
    const remainingAmountRaw = formData.get('remainingAmount') as string;
    const registrationType = (formData.get('registrationType') as string || 'new').trim();
    const yearsInNurseryRaw = formData.get('yearsInNursery') as string;
    const isFinalYear = formData.get('isFinalYear') === 'on' || formData.get('isFinalYear') === 'true';
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
    const yearsInNursery = yearsInNurseryRaw ? parseInt(yearsInNurseryRaw, 10) : 1;
    const startDate = startDateRaw ? new Date(startDateRaw) : null;

    await db.student.update({
      where: { id },
      data: {
        name,
        sequence: sequence || undefined,
        nationalId: nationalId || null,
        startDate: startDate || null,
        password: password || undefined,
        category: category || null,
        teacherId: teacherId && teacherId !== '' ? teacherId : null,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        age: isNaN(age as number) ? null : age,
        ageText: ageText || null,
        paymentStatus: paymentStatus || 'unpaid',
        paidWay: paidWay || null,
        paidAmount: isNaN(paidAmount) ? 0 : paidAmount,
        remainingAmount: isNaN(remainingAmount) ? 0 : remainingAmount,
        registrationType: registrationType || 'new',
        yearsInNursery: isNaN(yearsInNursery) ? 1 : yearsInNursery,
        isFinalYear: isFinalYear,
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
    revalidatePath('/teacher/dashboard');
    revalidatePath('/parent/dashboard');
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
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const subject = (formData.get('subject') as string || 'قرآن ونور بيان (عربي)').trim();
    const password = (formData.get('password') as string || '123456').trim();

    if (!name) {
      return { success: false, error: 'اسم المعلمة مطلوب' };
    }

    const existing = await db.teacher.findUnique({
      where: { name },
    });
    if (existing) {
      return { success: false, error: 'اسم المعلمة مسجل بالفعل' };
    }

    await db.teacher.create({
      data: {
        name,
        phone: phone || null,
        subject: subject || 'قرآن ونور بيان (عربي)',
        password: password || '123456',
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
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const subject = (formData.get('subject') as string || '').trim();
    const password = (formData.get('password') as string || '').trim();
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
        subject: subject || null,
        password: password || undefined,
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

// ==========================================
// 6. ADMIN USER MANAGEMENT ACTIONS
// ==========================================

export async function createAdminUser(formData: FormData) {
  try {
    const name = (formData.get('name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();
    const password = (formData.get('password') as string || '').trim();
    const role = (formData.get('role') as string || 'مشرف').trim();

    if (!name || !username || !password) {
      return { success: false, error: 'اسم المدير، رقم المحمول/اسم الدخول، وكلمة المرور مطلوبة' };
    }

    const existing = await db.adminUser.findUnique({
      where: { username },
    });
    if (existing) {
      return { success: false, error: 'رقم المحمول/اسم الدخول مسجل بالفعل لمدير آخر' };
    }

    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    await db.adminUser.create({
      data: {
        name,
        username,
        passwordHash,
        role: role || 'مشرف',
      },
    });

    revalidatePath('/admin/dashboard/admins');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إضافة الحساب الإداري' };
  }
}

export async function updateAdminUser(id: string, formData: FormData) {
  try {
    const name = (formData.get('name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();
    const password = (formData.get('password') as string || '').trim();
    const role = (formData.get('role') as string || 'مشرف').trim();

    if (!name || !username) {
      return { success: false, error: 'اسم المدير ورقم المحمول/اسم الدخول مطلوبان' };
    }

    const existing = await db.adminUser.findFirst({
      where: { username, id: { not: id } },
    });
    if (existing) {
      return { success: false, error: 'رقم المحمول/اسم الدخول مسجل بالفعل لمدير آخر' };
    }

    const dataToUpdate: any = {
      name,
      username,
      role: role || 'مشرف',
    };

    if (password) {
      const bcrypt = await import('bcryptjs');
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    await db.adminUser.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/admin/dashboard/admins');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل الحساب الإداري' };
  }
}

export async function deleteAdminUser(id: string) {
  try {
    await db.adminUser.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/admins');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف الحساب الإداري' };
  }
}

// ==========================================
// 7. CHARITY ASSOCIATION (POOR / ORPHANS / SICK) ACTIONS
// ==========================================

export async function createAssociationCase(formData: FormData) {
  try {
    const category = (formData.get('category') as string || 'poor').trim(); // "poor" | "orphans" | "sick"
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const address = (formData.get('address') as string || 'المنشأة الكبرى').trim();
    const monthlyCostRaw = formData.get('monthlyCost') as string;
    const notes = (formData.get('notes') as string || '').trim();

    if (!name) {
      return { success: false, error: 'اسم الحالة / عائل الأسرة مطلوب' };
    }

    const monthlyCost = monthlyCostRaw ? parseFloat(monthlyCostRaw) : 0;

    await db.associationInfo.create({
      data: {
        category,
        name,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        monthlyCost: isNaN(monthlyCost) ? 0 : monthlyCost,
        notes: notes || null,
      },
    });

    revalidatePath('/admin/dashboard/poor');
    revalidatePath('/admin/dashboard/orphans');
    revalidatePath('/admin/dashboard/medical');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating association case:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إضافة الحالة' };
  }
}

export async function updateAssociationCase(id: string, formData: FormData) {
  try {
    const category = (formData.get('category') as string || 'poor').trim();
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const address = (formData.get('address') as string || 'المنشأة الكبرى').trim();
    const monthlyCostRaw = formData.get('monthlyCost') as string;
    const notes = (formData.get('notes') as string || '').trim();

    if (!name) {
      return { success: false, error: 'اسم الحالة مطلوب' };
    }

    const monthlyCost = monthlyCostRaw ? parseFloat(monthlyCostRaw) : 0;

    await db.associationInfo.update({
      where: { id },
      data: {
        category,
        name,
        phone: phone || null,
        address: address || 'المنشأة الكبرى',
        monthlyCost: isNaN(monthlyCost) ? 0 : monthlyCost,
        notes: notes || null,
      },
    });

    revalidatePath('/admin/dashboard/poor');
    revalidatePath('/admin/dashboard/orphans');
    revalidatePath('/admin/dashboard/medical');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating association case:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل بيانات الحالة' };
  }
}

export async function deleteAssociationCase(id: string) {
  try {
    await db.associationInfo.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/poor');
    revalidatePath('/admin/dashboard/orphans');
    revalidatePath('/admin/dashboard/medical');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting association case:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف الحالة' };
  }
}

// ==========================================
// 8. PUBLIC REGISTRATION REQUESTS ACTIONS
// ==========================================

export async function submitRegistrationRequest(formData: FormData) {
  try {
    const type = (formData.get('type') as string || '').trim();
    const name = (formData.get('name') as string || '').trim();
    const nationalId = (formData.get('nationalId') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const address = (formData.get('address') as string || '').trim();

    if (!type || !name || !nationalId || !phone) {
      return { success: false, error: 'الاسم والرقم القومي والهاتف مطلوبان' };
    }
    if (nationalId.length !== 14 || !/^\d{14}$/.test(nationalId)) {
      return { success: false, error: 'الرقم القومي يجب أن يكون 14 رقماً' };
    }

    const childName      = (formData.get('childName') as string || null) || null;
    const childAgeRaw    = formData.get('childAge') as string;
    const childAge       = childAgeRaw ? parseInt(childAgeRaw, 10) : null;
    const childNationalId = (formData.get('childNationalId') as string || null) || null;
    const startDateRaw   = formData.get('startDate') as string;
    const startDate      = startDateRaw ? new Date(startDateRaw) : null;
    const paymentStatus  = (formData.get('paymentStatus') as string || 'unpaid').trim();
    const registrationType = (formData.get('registrationType') as string || 'new').trim();
    const yearsInNurseryRaw = formData.get('yearsInNursery') as string;
    const yearsInNursery = yearsInNurseryRaw ? parseInt(yearsInNurseryRaw, 10) : 1;
    const isFinalYear    = formData.get('isFinalYear') === 'on' || formData.get('isFinalYear') === 'true';
    const familySizeRaw  = formData.get('familySize') as string;
    const familySize     = familySizeRaw ? parseInt(familySizeRaw, 10) : null;
    const monthlyIncomeRaw = formData.get('monthlyIncome') as string;
    const monthlyIncome  = monthlyIncomeRaw ? parseFloat(monthlyIncomeRaw) : null;
    const needDetails    = (formData.get('needDetails') as string || null) || null;
    const notes          = (formData.get('notes') as string || null) || null;
    const diagnosis      = (formData.get('diagnosis') as string || null) || null;
    const hospital       = (formData.get('hospital') as string || null) || null;
    const guardianName   = (formData.get('guardianName') as string || null) || null;
    const orphanCountRaw = formData.get('orphanCount') as string;
    const orphanCount    = orphanCountRaw ? parseInt(orphanCountRaw, 10) : null;

    await db.registrationRequest.create({
      data: {
        type,
        name,
        nationalId,
        phone,
        address: address || null,
        childName,
        childAge: isNaN(childAge as number) ? null : childAge,
        childNationalId,
        startDate: startDate || null,
        paymentStatus: paymentStatus || 'unpaid',
        registrationType: registrationType || 'new',
        yearsInNursery: isNaN(yearsInNursery) ? 1 : yearsInNursery,
        isFinalYear: isFinalYear,
        familySize: isNaN(familySize as number) ? null : familySize,
        monthlyIncome: isNaN(monthlyIncome as number) ? null : monthlyIncome,
        needDetails,
        notes,
        diagnosis,
        hospital,
        guardianName,
        orphanCount: isNaN(orphanCount as number) ? null : orphanCount,
        status: 'pending',
      },
    });

    revalidatePath('/admin/dashboard/requests');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting registration request:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء إرسال الطلب' };
  }
}

export async function updateRegistrationRequestStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  try {
    await db.registrationRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/dashboard/requests');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ' };
  }
}

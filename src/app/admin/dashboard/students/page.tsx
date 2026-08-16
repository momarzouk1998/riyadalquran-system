import React from 'react';
import { db } from '@/lib/db';
import { StudentsClientView } from './StudentsClientView';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  // Fetch students, teachers, and grades to display
  const students = await db.student.findMany({
    orderBy: { sequence: 'asc' },
    include: {
      teacher: true,
      grades: true,
    },
  });

  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          إدارة طلاب حضانة رياض القرآن
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          عرض وتعديل بيانات الطلاب، إدخال الدرجات الشهرية، ومتابعة الرسوم المالية.
        </p>
      </div>

      {/* Interactive client-side table with modal filters */}
      <StudentsClientView initialStudents={students} teachers={teachers} />
    </div>
  );
}

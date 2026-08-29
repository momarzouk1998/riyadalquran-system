import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { TeachersClientView } from './TeachersClientView';

export const dynamic = 'force-dynamic';

export default async function AdminTeachersPage() {
  await ensureDatabaseTables();
  
  const teachers = await db.teacher.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { students: true },
      },
    },
  });

  const serializedTeachers = JSON.parse(JSON.stringify(teachers));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          إدارة معلمات الحضانة
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          عرض معلمات الفصول، إضافة معلمات جدد، ومتابعة الفصول والطلاب المسجلين معهن.
        </p>
      </div>

      <TeachersClientView initialTeachers={serializedTeachers} />
    </div>
  );
}

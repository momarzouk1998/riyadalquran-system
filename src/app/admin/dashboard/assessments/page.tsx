import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { AssessmentsClientView } from './AssessmentsClientView';

export const dynamic = 'force-dynamic';

export default async function AdminAssessmentsPage() {
  await ensureDatabaseTables();

  const assessments = await db.teacherAssessment.findMany({
    orderBy: { date: 'desc' },
    include: {
      teacher: true,
    },
  });

  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  const serializedAssessments = JSON.parse(JSON.stringify(assessments));
  const serializedTeachers = JSON.parse(JSON.stringify(teachers));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          تقييم أداء المعلمات
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          رصد تقييمات المعلمات الشهرية، وقياس الالتزام، النظافة، دفتر التحضير، ومستويات أداء الفصول.
        </p>
      </div>

      <AssessmentsClientView initialAssessments={serializedAssessments} teachers={serializedTeachers} />
    </div>
  );
}

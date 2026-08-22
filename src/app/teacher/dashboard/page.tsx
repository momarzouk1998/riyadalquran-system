import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentTeacher } from '@/lib/auth';
import { ensureDatabaseTables } from '@/lib/db';
import { TeacherDashboardClientView } from './TeacherDashboardClientView';

export const dynamic = 'force-dynamic';

export default async function TeacherDashboardPage() {
  await ensureDatabaseTables();
  const teacher = await getCurrentTeacher();

  if (!teacher) {
    redirect('/teacher/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-cairo py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <TeacherDashboardClientView teacher={teacher} />
      </div>
    </div>
  );
}

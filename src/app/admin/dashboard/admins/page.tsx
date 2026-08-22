import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { db, ensureDatabaseTables } from '@/lib/db';
import { AdminsClientView } from './AdminsClientView';

export const dynamic = 'force-dynamic';

export default async function AdminManagementPage() {
  await ensureDatabaseTables();
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect('/admin/login');
  }

  const admins = await db.adminUser.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6 font-cairo">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          إدارة حسابات المديرين والمشرفين
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          عرض وإضافة حسابات مديري النظام، تحديد الأدوار، وإدارة صلاحيات الدخول.
        </p>
      </div>

      <AdminsClientView initialAdmins={admins} currentAdminUsername={currentAdmin.username} />
    </div>
  );
}

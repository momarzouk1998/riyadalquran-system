import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <Sidebar adminName={admin.username} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-full p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

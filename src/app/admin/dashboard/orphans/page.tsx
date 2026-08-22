import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { CharityCasesClientView } from '@/components/CharityCasesClientView';

export const dynamic = 'force-dynamic';

export default async function AdminOrphansPage() {
  await ensureDatabaseTables();

  const cases = await db.associationInfo.findMany({
    where: { category: 'orphans' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CharityCasesClientView
      initialCases={cases}
      category="orphans"
      title="كفالة الأيتام والرعاية الاجتماعية"
      subtitle="إدارة بيانات الأيتام المسجلين بالجمعية، تخصيص الكفالات الشهرية، ومتابعة الاحتياجات المعيشية والتعليمية بالمنشأة الكبرى."
      categoryLabel="حالة يتيم"
    />
  );
}

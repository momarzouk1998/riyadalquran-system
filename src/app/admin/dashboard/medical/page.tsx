import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { CharityCasesClientView } from '@/components/CharityCasesClientView';

export const dynamic = 'force-dynamic';

export default async function AdminMedicalPage() {
  await ensureDatabaseTables();

  const cases = await db.associationInfo.findMany({
    where: { category: 'sick' },
    orderBy: { createdAt: 'desc' },
  });

  const serializedCases = JSON.parse(JSON.stringify(cases));

  return (
    <CharityCasesClientView
      initialCases={serializedCases}
      category="sick"
      title="المساعدات الطبية والحالات المرضية"
      subtitle="إعانة الحالات المرضية والصحية المسجلة بالجمعية، دعم العلاج الشهري، وتوفير الأجهزة والمستلزمات الطبية بالحالات الحارجة."
      categoryLabel="حالة مرضية"
    />
  );
}

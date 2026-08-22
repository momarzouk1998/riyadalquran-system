import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { CharityCasesClientView } from '@/components/CharityCasesClientView';

export const dynamic = 'force-dynamic';

export default async function AdminPoorPage() {
  await ensureDatabaseTables();

  const cases = await db.associationInfo.findMany({
    where: { category: 'poor' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CharityCasesClientView
      initialCases={cases}
      category="poor"
      title="رعاية الحالات الفقيرة والمساعدات الاجتماعية"
      subtitle="إدارة ودعم الأسر غير القادرة، ترميم البيوت الهالكة، توزيع ملابس العيد والبطاطين، والمستلزمات المدرسية بالمنشأة الكبرى والقرى المجاورة."
      categoryLabel="حالة فقيرة"
    />
  );
}

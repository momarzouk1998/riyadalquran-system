import React from 'react';
import { db, ensureDatabaseTables } from '@/lib/db';
import { RequestsClientView } from './RequestsClientView';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  await ensureDatabaseTables();

  const requests = await db.registrationRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedRequests = JSON.parse(JSON.stringify(requests));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          طلبات التسجيل والدعم الاجتماعي
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          مراجعة وقبول أو رفض طلبات التسجيل الواردة من الموقع العام — حالات فقيرة، أيتام، مرضية، وحضانة.
        </p>
      </div>
      <RequestsClientView initialRequests={serializedRequests} />
    </div>
  );
}

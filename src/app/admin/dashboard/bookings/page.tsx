import React from 'react';
import { db } from '@/lib/db';
import { BookingsClientView } from './BookingsClientView';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await db.nurseryBooking.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          طلبات حجز وتصاريح الحضانة
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          عرض ومراجعة طلبات الالتحاق الجديدة المقدمة من الموقع العام من قبل أولياء الأمور.
        </p>
      </div>

      <BookingsClientView initialBookings={bookings} />
    </div>
  );
}

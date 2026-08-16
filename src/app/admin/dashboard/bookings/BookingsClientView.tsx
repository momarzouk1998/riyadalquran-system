'use client';

import React, { useState, useTransition } from 'react';
import { Check, X, Phone, Calendar, Clock, MessageSquare } from 'lucide-react';
import { updateBookingStatus } from '@/app/actions/admin';

interface Booking {
  id: string;
  parentName: string;
  phone: string;
  studentName: string;
  age: number | null;
  notes: string | null;
  status: string;
  createdAt: Date;
}

interface BookingsClientViewProps {
  initialBookings: Booking[];
}

export function BookingsClientView({ initialBookings }: BookingsClientViewProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (res.success) {
        setBookings(
          bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert(res.error || 'حدث خطأ أثناء تحديث حالة الطلب');
      }
    });
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === 'ALL' || b.status === statusFilter
  );

  return (
    <div className="space-y-4">
      {/* Status Filter Tab Buttons */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            statusFilter === 'ALL' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            statusFilter === 'pending' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
          }`}
        >
          المعلقة
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            statusFilter === 'approved' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
          }`}
        >
          المقبولة
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            statusFilter === 'rejected' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
          }`}
        >
          المرفوضة
        </button>
      </div>

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 text-xs font-bold">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">تاريخ التقديم</th>
                <th className="px-6 py-3 whitespace-nowrap">اسم ولي الأمر</th>
                <th className="px-6 py-3 whitespace-nowrap">رقم الهاتف</th>
                <th className="px-6 py-3 whitespace-nowrap">اسم الطفل</th>
                <th className="px-6 py-3 whitespace-nowrap">عمر الطفل</th>
                <th className="px-6 py-3 whitespace-nowrap">الحالة</th>
                <th className="px-6 py-3 whitespace-nowrap">ملاحظات</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">القرار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    لا توجد طلبات حجز مطابقة حالياً.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                      {b.parentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium" dir="ltr">
                      <div className="flex items-center justify-end gap-1.5">
                        <a href={`tel:${b.phone}`} className="hover:underline hover:text-brand-primary">
                          {b.phone}
                        </a>
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {b.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.age ? `${b.age} سنوات` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        b.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : b.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {b.status === 'approved' ? 'مقبول' : b.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={b.notes || ''}>
                      {b.notes || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(b.id, 'approved')}
                            disabled={isPending}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                            title="قبول الطلب"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(b.id, 'rejected')}
                            disabled={isPending}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                            title="رفض الطلب"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

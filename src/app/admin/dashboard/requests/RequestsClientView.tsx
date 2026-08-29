'use client';

import React, { useState, useTransition } from 'react';
import { Check, X, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { updateRegistrationRequestStatus } from '@/app/actions/admin';

interface Request {
  id: string;
  type: string;
  status: string;
  name: string;
  nationalId: string;
  phone: string;
  address: string | null;
  childName: string | null;
  childAge: number | null;
  childNationalId: string | null;
  startDate?: Date | string | null;
  paymentStatus?: string | null;
  registrationType?: string | null;
  yearsInNursery?: number | null;
  isFinalYear?: boolean | null;
  familySize: number | null;
  monthlyIncome: number | null;
  needDetails: string | null;
  notes: string | null;
  diagnosis: string | null;
  hospital: string | null;
  guardianName: string | null;
  orphanCount: number | null;
  createdAt: Date;
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  poor:    { label: 'حالة فقيرة',      color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  nursery: { label: 'طالب حضانة',      color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  orphan:  { label: 'حالة يتيمة',      color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200' },
  medical: { label: 'حالة مرضية',      color: 'text-cyan-700',    bg: 'bg-cyan-50 border-cyan-200' },
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'قيد المراجعة', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'مقبول',         cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'مرفوض',         cls: 'bg-red-50 text-red-700 border-red-200' },
};

export function RequestsClientView({ initialRequests }: { initialRequests: Request[] }) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    startTransition(async () => {
      const res = await updateRegistrationRequestStatus(id, newStatus);
      if (res.success) {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        alert(res.error || 'حدث خطأ');
      }
    });
  };

  const filtered = requests.filter((r) => {
    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Type filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['ALL', 'poor', 'nursery', 'orphan', 'medical'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              {t === 'ALL' ? 'الكل' : TYPE_LABELS[t]?.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['ALL', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === s ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              {s === 'ALL' ? 'كل الحالات' : STATUS_LABELS[s]?.label}
              {s === 'pending' && pendingCount > 0 && (
                <span className="mr-1.5 bg-amber-400 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 text-sm">
          لا توجد طلبات مطابقة.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const typeMeta = TYPE_LABELS[r.type] ?? { label: r.type, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };
            const statusMeta = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;
            const isExpanded = expandedId === r.id;

            return (
              <div key={r.id} className={`card border rounded-2xl overflow-hidden transition-all ${r.status === 'pending' ? 'border-amber-200' : 'border-slate-100'}`}>
                {/* Row Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-black ${typeMeta.bg} ${typeMeta.color}`}>
                    {typeMeta.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-sm truncate">{r.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium" dir="ltr">{r.phone}</p>
                  </div>
                  <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusMeta.cls}`}>
                    {statusMeta.label}
                  </span>
                  <p className="hidden md:block text-[11px] text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  {/* Actions */}
                  {r.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStatusChange(r.id, 'approved')}
                        disabled={isPending}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                        title="قبول"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(r.id, 'rejected')}
                        disabled={isPending}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="رفض"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                      <Detail label="الرقم القومي" value={r.nationalId} dir="ltr" />
                      <Detail label="الهاتف" value={<a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3"/>{r.phone}</a>} />
                      {r.address     && <Detail label="العنوان"           value={r.address} />}
                      {r.familySize  && <Detail label="عدد أفراد الأسرة" value={`${r.familySize} أفراد`} />}
                      {r.monthlyIncome !== null && r.monthlyIncome !== undefined && (
                        <Detail label={r.type === 'medical' ? 'تكلفة العلاج' : 'الدخل الشهري'} value={`${r.monthlyIncome} ج.م`} />
                      )}
                      {r.needDetails  && <Detail label="الاحتياج"         value={r.needDetails} />}
                      {r.diagnosis    && <Detail label="التشخيص"           value={r.diagnosis} />}
                      {r.hospital     && <Detail label="المستشفى"          value={r.hospital} />}
                      {r.childName    && <Detail label="اسم الطفل"         value={r.childName} />}
                      {r.childAge     && <Detail label="عمر الطفل"         value={`${r.childAge} سنوات`} />}
                      {r.childNationalId && <Detail label="ر.ق. الطفل"     value={r.childNationalId} dir="ltr" />}
                      {r.startDate    && <Detail label="تاريخ بدء الدخول" value={new Date(r.startDate).toISOString().split('T')[0]} dir="ltr" />}
                      {r.registrationType && (
                        <Detail 
                          label="نوع القيد بالحضانة" 
                          value={`${r.registrationType === 'renewal' ? 'تجديد اشتراك' : 'تسجيل جديد'} (السنة ${r.yearsInNursery || 1})`} 
                        />
                      )}
                      {r.isFinalYear && (
                        <Detail label="مرحلة التخرج" value="🎓 آخر سنة بالحضانة" />
                      )}
                      {r.guardianName && <Detail label="الوصي"             value={r.guardianName} />}
                      {r.orphanCount  && <Detail label="عدد الأيتام"       value={`${r.orphanCount}`} />}
                      {r.notes        && <Detail label="ملاحظات" value={r.notes} fullWidth />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  dir,
  fullWidth,
}: {
  label: string;
  value: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="text-slate-400 font-semibold mb-0.5">{label}</p>
      <p className={`font-bold text-slate-700 ${dir === 'ltr' ? 'font-mono' : ''}`} dir={dir}>
        {value}
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  HeartHandshake, ArrowRight, CheckCircle, Loader2,
  User, Phone, MapPin, Users, AlertCircle, Fingerprint,
} from 'lucide-react';
import { submitRegistrationRequest } from '@/app/actions/admin';
import { calculateAgeFromNationalId } from '@/components/StudentForm';

export default function RegisterOrphanPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  // الرقم القومي + السن التلقائي
  const [nationalId, setNationalId]     = useState('');
  const [ageText, setAgeText]           = useState('');
  const [ageYears, setAgeYears]         = useState<number | null>(null);

  const handleNidChange = (val: string) => {
    setNationalId(val);
    const { ageYears: y, ageText: t } = calculateAgeFromNationalId(val);
    setAgeYears(y);
    setAgeText(t);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!nationalId || nationalId.length !== 14) {
      setError('الرقم القومي إجباري ويجب أن يكون 14 رقماً');
      return;
    }
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set('type', 'orphan');
    fd.set('nationalId', nationalId);
    fd.set('ageText', ageText);
    fd.set('age', ageYears !== null ? String(ageYears) : '');
    const res = await submitRegistrationRequest(fd);
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error || 'حدث خطأ أثناء إرسال الطلب');
  }

  const input = 'w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 outline-none transition-all text-xs font-bold';

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-12 font-cairo" dir="rtl">
      <div className="w-full max-w-xl space-y-6">

        {/* ── Logo + Title ── */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-3xl shadow-xl border border-slate-100">
              <Image src="/logo.png" alt="رياض القرآن" width={64} height={64} className="object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-950">تسجيل حالة يتيمة</h1>
            <p className="text-slate-500 text-xs mt-1">جمعية رياض القرآن — كفالة الأيتام والرعاية الاجتماعية</p>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

          {/* badge */}
          <div className="flex items-center gap-2 bg-pink-50 border-b border-pink-100 px-6 py-3.5 text-xs text-pink-800">
            <HeartHandshake className="w-4 h-4 text-pink-500 shrink-0" />
            <span className="font-semibold">للحصول على كفالة الجمعية الشهرية والدعم الاجتماعي</span>
          </div>

          <div className="p-7">
            {done ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-black text-slate-800">تم إرسال الطلب بنجاح</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                  سيتم مراجعة طلبك من قِبل لجنة الكفالة والتواصل معك في أقرب وقت.
                </p>
                <Link href="/" className="inline-block mt-4 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors shadow-md">
                  العودة للرئيسية
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* ─ القسم 1: بيانات ولي الأمر ─ */}
                <SectionTitle icon={<User className="w-4 h-4 text-primary" />} label="١. بيانات ولي الأمر / الوصي" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label required>اسم الولي أو وصي الأسرة</Label>
                    <input name="name" required placeholder="الاسم الثلاثي الكامل" className={input} />
                  </div>

                  {/* الرقم القومي + السن التلقائي */}
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                      <div>
                        <Label required icon={<Fingerprint className="w-3.5 h-3.5 text-primary" />}>
                          الرقم القومي (14 رقم)
                        </Label>
                        <input
                          type="text"
                          required
                          maxLength={14}
                          value={nationalId}
                          onChange={(e) => handleNidChange(e.target.value)}
                          placeholder="30005xxxxxxxxx"
                          dir="ltr"
                          className="w-full py-3 px-4 bg-white border border-slate-300 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-xs font-mono font-bold text-center tracking-widest"
                        />
                      </div>
                      <div>
                        <Label>السن المحسوب تلقائياً</Label>
                        <input
                          readOnly
                          value={ageText || 'يُحسب بعد إدخال الرقم القومي'}
                          className="w-full py-3 px-4 bg-emerald-100/80 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label required icon={<Phone className="w-3.5 h-3.5 text-slate-400" />}>رقم الهاتف</Label>
                    <input name="phone" required type="tel" placeholder="01xxxxxxxxx" dir="ltr" className={`${input} text-center font-mono`} />
                  </div>

                  <div>
                    <Label>اسم الوصي / القريب المسؤول</Label>
                    <input name="guardianName" placeholder="إن وُجد" className={input} />
                  </div>

                  <div className="sm:col-span-2">
                    <Label icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}>العنوان بالتفصيل</Label>
                    <input name="address" placeholder="القرية / الشارع / المنزل" className={input} />
                  </div>
                </div>

                {/* ─ القسم 2: تفاصيل الأسرة ─ */}
                <SectionTitle icon={<Users className="w-4 h-4 text-primary" />} label="٢. تفاصيل الأسرة اليتيمة" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>عدد الأيتام في الأسرة</Label>
                    <input name="orphanCount" type="number" min={1} max={20} placeholder="مثال: 3" className={input} />
                  </div>
                  <div>
                    <Label>عدد أفراد الأسرة الكلي</Label>
                    <input name="familySize" type="number" min={1} max={30} placeholder="مثال: 6" className={input} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>نوع الاحتياج</Label>
                    <input name="needDetails" placeholder="كفالة شهرية — تعليم — ملابس — مستلزمات..." className={input} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>ملاحظات إضافية</Label>
                    <textarea name="notes" rows={3} placeholder="أي تفاصيل تريد إضافتها للجنة..." className={`${input} resize-none`} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-emerald-800 text-white py-4 rounded-2xl font-black text-sm transition-colors disabled:opacity-60 shadow-lg shadow-primary/20 mt-2"
                >
                  {pending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> جارٍ الإرسال...</>
                    : <><HeartHandshake className="w-4 h-4" /> إرسال طلب الكفالة</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── helpers ── */
function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black text-emerald-900 border-b border-slate-100 pb-2 pt-1">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Label({ children, required, icon }: { children: React.ReactNode; required?: boolean; icon?: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
      {icon}
      <span>{children}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Baby, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { submitRegistrationRequest } from '@/app/actions/admin';
import { StudentForm, calculateAgeFromNationalId } from '@/components/StudentForm';

export default function RegisterNurseryPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // state للرقم القومي والسن (نفس نمط StudentsClientView)
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [computedAgeText, setComputedAgeText] = useState('');
  const [computedAgeYears, setComputedAgeYears] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!nationalIdInput || nationalIdInput.trim().length !== 14) {
      setError('الرقم القومي إجباري ويجب أن يكون 14 رقماً');
      return;
    }

    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set('type', 'nursery');
    fd.set('nationalId', nationalIdInput);
    fd.set('ageText', computedAgeText);
    fd.set('age', computedAgeYears !== null ? String(computedAgeYears) : '');

    const res = await submitRegistrationRequest(fd);
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error || 'حدث خطأ أثناء إرسال الطلب');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex flex-col" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-primary text-white py-4 px-6 flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0">
          <Image src="/logo.png" alt="رياض القرآن" width={36} height={36} className="object-contain" />
        </div>
        <div>
          <h1 className="font-black text-base leading-tight">جمعية رياض القرآن الكريم</h1>
          <p className="text-xs text-yellow-200">المنشأة الكبرى — مشهرة برقم 1300</p>
        </div>
        <Link
          href="/"
          className="mr-auto flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          الرئيسية
        </Link>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-l from-primary to-emerald-700 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Baby className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">تسجيل طالب حضانة (أول مرة)</h2>
            </div>
            <p className="text-sm text-green-100 leading-relaxed">
              أدخل بيانات ولي الأمر والطفل بدقة. سيتم التواصل معك لتأكيد موعد الالتحاق وإتمام إجراءات القبول.
            </p>
          </div>

          <div className="p-8">
            {done ? (
              /* ── رسالة النجاح ── */
              <div className="text-center py-10 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-black text-gray-800">تم إرسال طلب التسجيل بنجاح</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                  سيتواصل معك فريق الحضانة في أقرب وقت لتحديد موعد المقابلة وإتمام إجراءات القبول.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors shadow-md"
                >
                  العودة للرئيسية
                </Link>
              </div>
            ) : (
              /* ── الفورم ── */
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* نستخدم StudentForm بـ mode=page — يُخفي القسم المالي تلقائياً */}
                <StudentForm
                  mode="page"
                  teachers={[]}
                  isPending={pending}
                  formError={error || null}
                  nationalIdValue={nationalIdInput}
                  computedAgeText={computedAgeText}
                  onNationalIdChange={(val, ageYears, ageText) => {
                    setNationalIdInput(val);
                    setComputedAgeText(ageText);
                    setComputedAgeYears(ageYears);
                  }}
                />

                {/* ── زر الإرسال ── */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-black text-sm hover:bg-green-800 transition-colors disabled:opacity-60 shadow-md"
                  >
                    {pending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Baby className="w-4 h-4" />
                    }
                    {pending ? 'جارٍ الإرسال...' : 'إرسال طلب التسجيل'}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { submitRegistrationRequest } from '@/app/actions/admin';

export default function RegisterOrphanPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    fd.set('type', 'orphan');
    const res = await submitRegistrationRequest(fd);
    setPending(false);
    if (res.success) setDone(true);
    else setError(res.error || 'حدث خطأ');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-green-50 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center">
          <Image src="/logo.png" alt="رياض القرآن" width={36} height={36} className="object-contain" />
        </div>
        <div>
          <h1 className="font-black text-base leading-tight">جمعية رياض القرآن الكريم</h1>
          <p className="text-xs text-yellow-200">المنشأة الكبرى — مشهرة برقم 1300</p>
        </div>
        <Link href="/" className="mr-auto flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
          الرئيسية
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Title */}
          <div className="bg-gradient-to-l from-rose-700 to-primary px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black">تسجيل حالة يتيمة</h2>
            </div>
            <p className="text-sm text-rose-100 leading-relaxed">
              لتسجيل أسرة أو حالة يتيمة للحصول على كفالة الجمعية الشهرية والدعم الاجتماعي.
            </p>
          </div>

          <div className="p-8">
            {done ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-black text-gray-800">تم إرسال الطلب بنجاح</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  سيتم مراجعة طلبك من قِبل لجنة الكفالة وإخطارك بالقرار.
                </p>
                <Link href="/" className="inline-block mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors">
                  العودة للرئيسية
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">اسم الولي / وصي الأسرة <span className="text-red-500">*</span></label>
                    <input name="name" required placeholder="الاسم الثلاثي" className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">الرقم القومي <span className="text-red-500">*</span></label>
                    <input name="nationalId" required placeholder="14 رقم" maxLength={14} pattern="\d{14}" className="form-input-modern" dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input name="phone" required type="tel" placeholder="01xxxxxxxxx" className="form-input-modern" dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">اسم الوصي / القريب المسؤول</label>
                    <input name="guardianName" placeholder="اسم المسؤول عن الأسرة" className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">عدد الأيتام في الأسرة</label>
                    <input name="orphanCount" type="number" min={1} max={20} placeholder="مثال: 3" className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">عدد أفراد الأسرة الكلي</label>
                    <input name="familySize" type="number" min={1} max={30} placeholder="مثال: 6" className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-bold text-gray-700">العنوان بالتفصيل</label>
                    <input name="address" placeholder="القرية / الشارع / المنزل" className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-bold text-gray-700">تفاصيل الاحتياج</label>
                    <input name="needDetails" placeholder="مثال: كفالة شهرية، تعليم، ملابس..." className="form-input-modern" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-bold text-gray-700">ملاحظات إضافية</label>
                    <textarea name="notes" rows={3} placeholder="أي تفاصيل أخرى تريد إضافتها..." className="form-input-modern resize-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-black text-sm hover:bg-green-800 transition-colors disabled:opacity-60 shadow-md"
                >
                  {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-4 h-4" />}
                  {pending ? 'جارٍ الإرسال...' : 'إرسال طلب الكفالة'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, ArrowRight, Phone, Lock, UserCheck, GraduationCap, ChevronLeft, Users } from 'lucide-react';

interface StudentCard {
  id: string;
  name: string;
  sequence: string;
  category: string;
  teacherName: string;
  imageUrl: string | null;
  ageText: string | null;
}

export default function ParentLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [multipleStudents, setMultipleStudents] = useState<StudentCard[] | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch('/api/auth/parent-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: (formData.get('phone') as string)?.trim(),
          password: (formData.get('password') as string)?.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (data.multiple && Array.isArray(data.students)) {
          setMultipleStudents(data.students);
          setLoading(false);
        } else {
          window.location.href = '/parent/dashboard';
        }
      } else {
        setError(data.error || 'رقم المحمول أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    } catch {
      setError('تعذر الاتصال بالسيرفر، يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  const handleSelectStudent = async (studentId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/select-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        window.location.href = '/parent/dashboard';
      } else {
        setError(data.error || 'فشل اختيار الطالب');
        setLoading(false);
      }
    } catch {
      setError('تعذر الدخول، حاول مرة أخرى');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-cairo bg-slate-50" dir="rtl">
      <div className="w-full max-w-md space-y-6">

        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-3xl shadow-xl border border-slate-100">
              <Image src="/logo.png" alt="رياض القرآن" width={70} height={70} className="object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-950">بوابة أولياء الأمور والطفل</h1>
            <p className="text-slate-500 text-xs mt-1">الدخول برقم المحمول المسجل لمتابعة التقرير والمحفظة</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800">
            <Users className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">بوابة متابعة الطفل والدرجات الشهرية</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* اختيار الطالب */}
          {multipleStudents ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-700 border-b border-slate-100 pb-3">
                <UserCheck className="w-4 h-4 text-primary" />
                <span>تم العثور على {multipleStudents.length} طلاب — اختر طفلك:</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {multipleStudents.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleSelectStudent(child.id)}
                    disabled={loading}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-primary hover:bg-emerald-50/50 transition-all cursor-pointer text-right group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
                      {child.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={child.imageUrl} alt={child.name} className="w-full h-full object-cover" />
                        : <GraduationCap className="w-6 h-6 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 text-sm group-hover:text-primary transition-colors">{child.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {child.category} • {child.ageText || ''} • {child.teacherName}
                      </p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-primary shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setMultipleStudents(null); setError(null); }}
                className="w-full text-xs text-slate-400 hover:text-slate-600 font-semibold pt-2 transition-colors"
              >
                ← الرجوع لإدخال رقم آخر
              </button>
            </div>
          ) : (
            /* فورم اللوجن */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">رقم محمول ولي الأمر * (إجباري)</label>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    required
                    className="w-full py-3.5 px-4 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 outline-none transition-all text-xs font-mono font-bold text-center"
                    placeholder="مثال: 01009587565"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    defaultValue="123456"
                    className="w-full py-3.5 px-4 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 outline-none transition-all text-xs font-mono text-center"
                    placeholder="••••••"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  كلمة المرور الافتراضية للنظام هي: <strong className="text-primary font-mono">123456</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-emerald-800 text-white rounded-2xl font-black shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" /><span>دخول لوحة متابعة الطفل</span></>
                }
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
            العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, ArrowRight, UserCheck, Lock, GraduationCap } from 'lucide-react';

export default function TeacherLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: (formData.get('username') as string)?.trim(),
          password: (formData.get('password') as string)?.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        window.location.href = '/teacher/dashboard';
      } else {
        setError(data.error || 'اسم المعلمة أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    } catch {
      setError('تعذر الاتصال بالسيرفر، يرجى المحاولة مرة أخرى');
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
            <h1 className="text-2xl font-black text-emerald-950">بوابة المعلمات</h1>
            <p className="text-slate-500 text-xs mt-1">جمعية رياض القرآن الكريم — رصد الدرجات وإدارة الفصل</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-2xl px-4 py-3 text-xs text-amber-800">
            <GraduationCap className="w-4 h-4 text-secondary shrink-0" />
            <span className="font-semibold">صفحة رصد الدرجات وإدارة فصلك الدراسي</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">اسم المعلمة أو رقم المحمول *</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full py-3.5 px-4 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 outline-none transition-all text-xs font-bold text-center"
                  placeholder="مثال: اسماء"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
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
                : <><LogIn className="w-4 h-4" /><span>دخول لوحة التقييم السريع للفصل</span></>
              }
            </button>
          </form>
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

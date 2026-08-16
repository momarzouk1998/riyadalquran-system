'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { adminLogin } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await adminLogin(formData);
    if (res.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(res.error || 'حدث خطأ غير متوقع');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 font-cairo"
      style={{ backgroundColor: '#fafaf7' }}
    >
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-700/10 rounded-full blur-xl scale-150" />
              <Image
                src="/RiyadAlquran Logo.png"
                alt="رياض القرآن"
                width={80}
                height={80}
                className="object-contain relative z-10"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-900">لوحة الإدارة</h1>
            <p className="text-slate-500 text-sm mt-1">جمعية رياض القرآن الكريم — مشرفو النظام فقط</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-5">

          {/* Security badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">منطقة محمية — للمسؤولين والمشرفين فقط</span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-800">فشل تسجيل الدخول</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">اسم المستخدم</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all text-sm"
                  placeholder="ادخل اسم المستخدم"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">كلمة المرور</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all text-sm font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-green py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'دخول لوحة الإدارة'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
            العودة للموقع الرئيسي
          </a>
        </div>
      </div>
    </div>
  );
}

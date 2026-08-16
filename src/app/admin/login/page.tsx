'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brand-primary/5 via-white to-brand-secondary/5 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl">
            🕌
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">
            بوابة الإدارة والمشرفين
          </h1>
          <p className="text-sm text-slate-500">
            جمعية رياض القرآن الكريم بالمنشأة الكبرى
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">فشل تسجيل الدخول</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 mr-1">
              اسم المستخدم
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                name="username"
                required
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all text-sm"
                placeholder="ادخل اسم المستخدم (مثال: Aza)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 mr-1">
              كلمة المرور
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all text-sm"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-semibold shadow-md shadow-brand-primary/15 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-brand-primary hover:underline font-semibold"
          >
            العودة للموقع الرئيسي
          </a>
        </div>
      </div>
    </div>
  );
}

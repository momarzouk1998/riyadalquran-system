'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, User, AlertCircle } from 'lucide-react';
import { parentLogin } from '@/app/actions/auth';

export default function ParentLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await parentLogin(formData);

    if (res.success) {
      router.push('/parent/dashboard');
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
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-secondary/15 flex items-center justify-center text-3xl">
            📖
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">
            بوابة أولياء الأمور
          </h1>
          <p className="text-sm text-slate-500">
            متابعة درجات وسداد طلاب حضانة رياض القرآن
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span>💡</span> تعليمات الدخول:
          </p>
          <p className="text-amber-800">
            كود الطالب هو الرقم الخاص بطفلكم (مثال: <span className="font-semibold select-all">1102</span>) والرقم السري يبدأ بـ RQ يليه الكود (مثال: <span className="font-semibold select-all">RQ1102</span>).
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
              كود الطالب
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                name="sequence"
                required
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all text-sm text-center font-bold tracking-widest"
                placeholder="مثال: 1102"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 mr-1">
              رقم المرور الخاص بالطالب
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <Key className="w-5 h-5" />
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all text-sm text-center font-mono font-bold tracking-widest"
                placeholder="مثال: RQ1102"
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
              'دخول لوحة المتابعة'
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

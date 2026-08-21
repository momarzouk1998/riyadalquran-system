'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, Phone, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const phone = formData.get('phone') as string;
      const password = formData.get('password') as string;

      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'رقم الهاتف أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('تعذر الاتصال بالسيرفر، يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-cairo bg-slate-50">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-3xl shadow-xl border border-slate-100">
              <Image
                src="/logo.png"
                alt="رياض القرآن"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-950">لوحة الإدارة والمشرفين</h1>
            <p className="text-slate-500 text-xs mt-1">جمعية رياض القرآن الكريم — الدخول برقم الهاتف المسجل</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">منطقة محمية للمسؤولين والمشرفين فقط</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">رقم الهاتف أو اسم المستخدم</label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  required
                  className="w-full py-3.5 px-4 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all text-xs font-bold"
                  placeholder="ادخل رقم الهاتف أو اسم المستخدم"
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
                  className="w-full py-3.5 px-4 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all text-xs font-mono"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">كلمة المرور الافتراضية للنظام هي: <strong className="text-emerald-700 font-mono">123456</strong></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black shadow-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'دخول لوحة الإدارة'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
            العودة للموقع الرئيسي
          </a>
        </div>
      </div>
    </div>
  );
}

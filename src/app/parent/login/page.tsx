'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, Sparkles, User, Lock } from 'lucide-react';
import { parentLogin } from '@/app/actions/auth';

export default function ParentLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await parentLogin(formData);
      if (res.success) {
        router.push('/parent/dashboard');
        router.refresh();
      } else {
        setError(res.error || 'فشل تسجيل الدخول، يرجى التأكد من البيانات');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-cairo">
      
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Return Link */}
      <Link 
        href="/" 
        className="absolute top-6 right-6 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md transition-all border border-white/10"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للموقع الرئيسي</span>
      </Link>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="relative inline-block p-3 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl glow-emerald">
            <Image 
              src="/logo.png" 
              alt="رياض القرآن" 
              width={80} 
              height={80} 
              className="object-contain rounded-2xl" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">بوابة أولياء الأمور</h1>
            <p className="text-xs text-emerald-200 mt-1">تابع درجات طفلك ومستواه بالرياض أونلاين</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-dark p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6">
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 rounded-2xl p-4 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-emerald-100 mb-2">كود الطالب المفصل</label>
              <div className="relative">
                <input
                  type="text"
                  name="code"
                  required
                  className="w-full py-3.5 px-4 pr-11 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs font-bold focus:outline-none focus:border-amber-400 transition-all text-center tracking-widest"
                  placeholder="مثال: 1102"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-100 mb-2">كلمة المرور / كود ولي الأمر</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full py-3.5 px-4 pr-11 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs font-bold focus:outline-none focus:border-amber-400 transition-all text-center tracking-widest"
                  placeholder="مثال: RQ1102"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
              </div>
              <p className="text-[10px] text-emerald-300/70 mt-1 text-center">الرقم السري الافتراضي هو RQ متبوعاً بكود الطالب</p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl font-black shadow-xl shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isPending ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>دخول لوحة متابعة الطالب</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

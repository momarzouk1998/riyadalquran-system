'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, CreditCard, Award, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StudentGradesChart } from "@/components/StudentGradesChart";

export function NurserySuite() {
  const [activeTab, setActiveTab] = useState<'chart' | 'finance' | 'teachers'>('chart');

  // Demo grades for Nursery live interactive simulator
  const demoGrades = [
    { month: '9', quran: 90, azkar: 85, nourAlbian: 92, math: 88, english: 85 },
    { month: '10', quran: 95, azkar: 90, nourAlbian: 96, math: 92, english: 90 },
    { month: '11', quran: 98, azkar: 95, nourAlbian: 98, math: 95, english: 94 },
    { month: '12', quran: 100, azkar: 98, nourAlbian: 100, math: 98, english: 96 },
  ];

  return (
    <section id="nursery-platform" className="bg-slate-900 text-white py-24 px-4 relative overflow-hidden font-tajawal">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="badge-gold bg-amber-400/20 text-amber-300 border-amber-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تاب الحضانة والتعليم الشغل العالي</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            منظومة الحضانة: متابعة إلكترونية فورية لولي الأمر
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            نظام تفاعلي يتيح لولي الأمر معرفة نتائج طفله في كافة المواد أولاً بأول والاطلاع على التقرير المالي بشفافية كاملة.
          </p>

          {/* Interactive Showcase Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="bg-white/10 p-1.5 rounded-2xl flex items-center gap-2 max-w-xl w-full border border-white/15 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'chart' 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>الرسم البياني للتطور</span>
              </button>

              <button
                onClick={() => setActiveTab('finance')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'finance' 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>الشفافية المالية</span>
              </button>

              <button
                onClick={() => setActiveTab('teachers')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'teachers' 
                    ? 'bg-secondary text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>تقييم المعلمات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Live Demo Window */}
        <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200">
          
          {activeTab === 'chart' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">معاينة حية: لوحة متابعة درجات الطفل شهرياً</h3>
                  <p className="text-xs text-slate-500">يتتبع ولي الأمر مستوى طفله في: القرآن، الأذكار، نور البيان، الحساب، والإنجليزية</p>
                </div>
                <div className="badge-gold">معدل التقييم الأخير: 98% 🌟</div>
              </div>

              <StudentGradesChart grades={demoGrades} />
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6 animate-fade-in py-4">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">معاينة حية: الموقف المالي المعروض بوضوح</h3>
                <p className="text-xs text-slate-500">عرض مالي دقيق ونظيف للمدفوع والمتبقي دون كتابة رمز العملة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center space-y-2">
                  <p className="text-xs text-emerald-700 font-bold">المبلغ المدفوع</p>
                  <p className="text-4xl font-black text-emerald-700">150</p>
                  <span className="text-[10px] text-emerald-600 font-semibold block">سداد كاش معتمد</span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-bold">المبلغ المتبقي</p>
                  <p className="text-4xl font-black text-slate-800">0</p>
                  <span className="text-[10px] text-emerald-600 font-semibold block">الحساب خالص بالكامل ✓</span>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center space-y-2">
                  <p className="text-xs text-amber-800 font-bold">طريقة السداد</p>
                  <p className="text-xl font-bold text-amber-900">نقدي بالجمعية</p>
                  <span className="text-[10px] text-amber-700 block">إيصال استلام رسمي</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-6 animate-fade-in py-2">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 text-base">معايير تقييم جودة المعلمات بالفصول</h3>
                <p className="text-xs text-slate-500">تقييمات شهرية تشمل الشرح على السبورة، النظافة، دفتر التحضير، والالتزام بالمنهج</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-3xl">✍️</span>
                  <h4 className="font-bold text-sm text-slate-900">الشرح على السبورة</h4>
                  <p className="text-[10px] text-slate-500">توصيل المعلومات بوضوح</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-3xl">📓</span>
                  <h4 className="font-bold text-sm text-slate-900">دفتر التحضير</h4>
                  <p className="text-[10px] text-slate-500">التزود بالخطط التعليمية</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-3xl">🧹</span>
                  <h4 className="font-bold text-sm text-slate-900">نظافة وترتيب الفصل</h4>
                  <p className="text-[10px] text-slate-500">بيئة مبهجة وصحية للطفل</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-3xl">⏰</span>
                  <h4 className="font-bold text-sm text-slate-900">الانضباط والمواعيد</h4>
                  <p className="text-[10px] text-slate-500">الالتزام التام بالدوام</p>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="text-center pt-2">
          <Link 
            href="/parent/login"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all"
          >
            <span>تسجيل الدخول لبوابة أولياء الأمور والدرجات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

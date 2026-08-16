'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Heart, Calendar, Phone, Award, BookOpen, Send, CheckCircle2, 
  MapPin, LogIn, ArrowLeft, ShieldCheck, Gift, Activity, Waves
} from 'lucide-react';
import { createNurseryBooking } from '@/app/actions/admin';

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createNurseryBooking(formData);
      if (res.success) {
        setSuccess(true);
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-cairo">
      
      {/* 1. Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-brand-primary flex items-center gap-2">
            <span className="text-2xl">🕌</span> جمعية رياض القرآن
          </span>
          <div className="flex items-center gap-3">
            <Link 
              href="/parent/login" 
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>بوابة أولياء الأمور</span>
            </Link>
            <Link 
              href="/admin/login" 
              className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              <span>الإدارة</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary via-brand-primary to-brand-dark text-white py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Islamic geometric pattern simulation */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <span>✨</span> المشهرة برقم 1300
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wide">
            جمعية ونظام رياض القرآن الكريم بالمنشأة الكبرى
          </h1>
          <p className="text-sm md:text-base text-brand-light max-w-2xl mx-auto leading-relaxed font-light">
            نزرع في قلوب أطفالكم حب القرآن ونسلحهم بنور العلم ومنهج نور البيان. جمعية خيرية متكاملة تقدم كفالات الأيتام والرعاية الصحية وحفر آبار المياه.
          </p>
          
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#booking-form"
              className="bg-brand-secondary hover:bg-opacity-90 text-slate-900 py-3 px-8 rounded-xl font-bold text-xs shadow-lg transition-all"
            >
              حجز مقعد بالحضانة
            </a>
            <Link 
              href="/parent/login"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-8 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>لوحة متابعة الطفل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Association General Services & Stats */}
      <section className="max-w-6xl w-full mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">أنشطة وخدمات الجمعية الخيرية</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            تأسست الجمعية لخدمة كفر شكر وقليوبية وتقديم المساعدات الإنسانية والتعليمية للفئات المستحقة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">كفالة الأيتام</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                ندعم ونخدم 21 أسرة يتيمة برواتب شهرية ثابتة وتوفير ملابس العيد والحقائب المدرسية لجميع الأطفال الأيتام سنوياً.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">المساعدات الطبية والغذائية</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                مساعدات لـ 21 حالة مرضية شهرياً، مع توفير الكراتين الغذائية بالتعاون مع بنك الطعام المصري لـ 121 حالة مستفيدة.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">تحلية المياه والآبار</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                تمتلك الجمعية وتدير محطة متكاملة لتحلية مياه الشرب النقية تعمل على مدار الساعة بجودة تصفية ممتازة لخدمة أهالي القرية.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">دورات التجويد والقرآن</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                إقامة دورات صيفية مكثفة لتحفيظ القرآن والتجويد للأطفال والنساء بالتعاون مع كبار الدكاترة والمتخصصين لتنمية مهارات الصوت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Nursery Features (برنامج الحضانة) */}
      <section className="bg-white border-y border-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="badge bg-brand-light text-brand-primary border-brand-primary/10">مستويات الحضانة (KG)</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
              لماذا تعتبر حضانة رياض القرآن الخيار الأفضل لطفلك؟
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              نوفر في رياض القرآن بيئة تعليمية إسلامية آمنة ومحفزة للأطفال في مراحل التأسيس الأولى، ونعتمد على خطط دراسية متكاملة.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">منهج نور البيان والتأسيس اللغوي</h4>
                  <p className="text-[10px] text-slate-500 mt-1">تأسيس ممتاز في القراءة والكتابة والنطق الصحيح للغة العربية والحساب والإنجليزية.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">القرآن الكريم والأذكار اليومية</h4>
                  <p className="text-[10px] text-slate-500 mt-1">متابعة يومية دقيقة لحفظ سور القرآن الكريم والأدعية والأحاديث النبوية البسيطة للأطفال.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">✓</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">متابعة إلكترونية لدرجات طفلك</h4>
                  <p className="text-[10px] text-slate-500 mt-1">يستطيع ولي الأمر تسجيل الدخول ومتابعة درجات ابنه شهرياً والاطلاع على التقرير المالي ورسوم الدفع مباشرة.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Visual Grid of Topics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <span className="text-3xl">📖</span>
              <h4 className="font-bold text-slate-800 text-xs mt-3">تحفيظ القرآن</h4>
              <p className="text-[10px] text-slate-400 mt-1">تلقين وتجويد بالصوت</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <span className="text-3xl">✨</span>
              <h4 className="font-bold text-slate-800 text-xs mt-3">الأذكار النبوية</h4>
              <p className="text-[10px] text-slate-400 mt-1">أدعية الصباح والمساء</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <span className="text-3xl">✏️</span>
              <h4 className="font-bold text-slate-800 text-xs mt-3">نور البيان</h4>
              <p className="text-[10px] text-slate-400 mt-1">قراءة بالتشكيل الصحيح</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <span className="text-3xl">🔢</span>
              <h4 className="font-bold text-slate-800 text-xs mt-3">تأسيس الحساب</h4>
              <p className="text-[10px] text-slate-400 mt-1">مهارات الأرقام والرياضيات</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Nursery Booking Form Form Section */}
      <section id="booking-form" className="max-w-3xl w-full mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">حجز مقعد جديد في الحضانة</h2>
          <p className="text-xs text-slate-500">
            يرجى ملء الاستمارة وسنقوم بالاتصال بكم لتحديد موعد اختبار طفلك وإكمال إجراءات التسجيل.
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="card p-8 border-emerald-100 bg-emerald-50 text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">تم إرسال طلب الحجز بنجاح!</h3>
              <p className="text-xs text-slate-500">
                لقد استلمنا طلب تسجيل طفلك وسيقوم فريق الجمعية بالاتصال بكم على رقم الهاتف المقدم قريباً جداً.
              </p>
            </div>
          </div>
        ) : (
          <div className="card p-6 md:p-8 bg-white border border-slate-200">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم ولي الأمر بالكامل</label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    className="form-input text-xs"
                    placeholder="ادخل اسم ولي الأمر"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">رقم الهاتف للاتصال (المحمول)</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="form-input text-xs text-center"
                    placeholder="مثال: 010xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم الطفل بالكامل</label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    className="form-input text-xs"
                    placeholder="ادخل اسم الطفل"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">عمر الطفل (سنوات)</label>
                  <input
                    type="number"
                    name="age"
                    min={2}
                    max={8}
                    required
                    className="form-input text-xs text-center"
                    placeholder="مثال: 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">ملاحظات أو رغبات خاصة</label>
                <textarea
                  name="notes"
                  className="form-input text-xs h-24"
                  placeholder="اكتب هنا أي تفاصيل أو متطلبات خاصة بالطفل..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold shadow-md shadow-brand-primary/10 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال طلب الحجز والتسجيل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* 6. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-auto border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="font-bold text-base text-white flex items-center gap-2">
              🕌 رياض القرآن
            </span>
            <p className="leading-relaxed">
              جمعية رياض القرآن الكريم بالمنشأة الكبرى، كفر شكر، قليوبية. مشهرة برقم 1300 لتقديم المساعدات والخدمات التعليمية المتكاملة.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">تواصل معنا ودعمنا</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span>📞</span> هاتف الجمعية: 0132545455
              </p>
              <p className="flex items-center gap-2">
                <span>💳</span> حساب البنك الزراعي المصري: 1300
              </p>
              <p className="flex items-center gap-2">
                <span>💸</span> فودافون كاش: 01010453630
              </p>
              <p className="flex items-center gap-2">
                <span>⚡</span> انستا باي: 01281660541
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">العناوين والوصول</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>المنشأة الكبرى، مركز كفر شكر، محافظة القليوبية، جمهورية مصر العربية.</span>
            </p>
            <div className="pt-2">
              <Link href="/admin/login" className="text-slate-500 hover:text-white transition-colors">
                تسجيل دخول الإدارة والمشرفين
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-8 pt-6 text-center text-[10px]">
          &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم. جميع الحقوق محفوظة لـ OpenAppo.
        </div>
      </footer>

    </div>
  );
}

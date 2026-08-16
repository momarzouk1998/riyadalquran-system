'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Heart, Calendar, Phone, Award, BookOpen, Send, CheckCircle2, 
  MapPin, LogIn, ArrowLeft, ShieldCheck, Gift, Activity, Waves,
  Copy, Check, CreditCard, Smartphone, Sparkles
} from 'lucide-react';
import { createNurseryBooking } from '@/app/actions/admin';

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createNurseryBooking(formData);
      if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    });
  };

  const donationMethods = [
    {
      key: 'bank',
      title: 'البنك الزراعي المصري',
      account: '1300',
      desc: 'حساب الجمعية الرسمي المشهر برقم 1300',
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'حساب بنكي',
    },
    {
      key: 'instapay',
      title: 'انستا باي (InstaPay)',
      account: '01281660541',
      desc: 'تحويل فوري مباشر عبر تطبيق انستا باي',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'تحويل فوري',
    },
    {
      key: 'vodafone',
      title: 'فودافون كاش (Vodafone Cash)',
      account: '01010453630',
      desc: 'محفظة فودافون كاش الرسمية للجمعية',
      icon: Smartphone,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'محفظة إلكترونية',
    },
  ];

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
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-brand-primary text-white hover:bg-brand-dark text-xs font-bold transition-all shadow-md shadow-brand-primary/10"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>بوابة أولياء الأمور (الحضانة)</span>
            </Link>
            <Link 
              href="/admin/login" 
              className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              <span>لوحة الإدارة</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary via-brand-primary to-brand-dark text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
            <span>✨</span> المشهرة برقم 1300 بالمنشأة الكبرى - كفر شكر
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wide">
            جمعية ونظام رياض القرآن الكريم
          </h1>
          <p className="text-sm md:text-base text-brand-light max-w-2xl mx-auto leading-relaxed font-light">
            نجمع بين العمل الخيري المتكامل (كفالة الأيتام، رعاية المرضى، تحلية المياه) وبين التأسيس التعليمي المتطور للأطفال بأحدث المناهج ودعم أولياء الأمور.
          </p>
          
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#donations"
              className="bg-brand-secondary hover:bg-opacity-90 text-slate-900 py-3.5 px-8 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span>طرق التبرع لدعم أنشطة الجمعية</span>
            </a>
            <Link 
              href="/parent/login"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 px-8 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>تاب الحضانة ومتابعة الطفل</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PROMINENT DONATION SECTION (طرق التبرع والدعم الفوري) */}
      <section id="donations" className="max-w-6xl w-full mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-primary tracking-wider uppercase">ساهم معنا في الخير</span>
              <h2 className="text-xl font-black text-slate-800 mt-1">حسابات التبرع والدعم المالي المباشر</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              جميع التبرعات تعود لخدمة كفالة الأيتام، علاج الحالات المرضية، وتشغيل محطة تحلية المياه بالقرية.
            </p>
          </div>

          {/* Donation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationMethods.map((m) => {
              const Icon = m.icon;
              const isCopied = copiedKey === m.key;
              return (
                <div key={m.key} className={`rounded-2xl border p-5 space-y-4 transition-all hover:shadow-md ${m.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="badge bg-white/80 font-bold border-slate-200">{m.badge}</span>
                    <Icon className="w-5 h-5 opacity-80" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                    <p className="text-[11px] text-slate-600 mt-1">{m.desc}</p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-base font-black tracking-widest text-slate-900" dir="ltr">
                      {m.account}
                    </span>
                    <button
                      onClick={() => handleCopy(m.account, m.key)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Association General Services & Stats */}
      <section className="max-w-6xl w-full mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">إنجازات وأرقام عمل الجمعية</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            تخدم الجمعية مئات الأسر بالمنشأة الكبرى والقرى المجاورة بكفر شكر وقليوبية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 space-y-4 border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">كفالة اليتيم (21 أسرة)</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                رواتب شهرية بقيمة 2,700 شهرياً، مع كسوة العيد والحقائب المدرسية الكاملة سنوياً لأطفال الأيتام.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4 border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">رعاية 21 حالة مرضية</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                علاج شهري ومساعدات طارئة، مع توزيع طرود بنك الطعام المصري لـ 121 حالة شهرياً و62 حالة في الأعياد.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4 border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">محطة تحلية مياه الشرب</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                محطة تحلية مياه نقية تعمل بصورة دورية وبجودة ممتازة لتوفير المياه الصالحة للشرب لأهالي المنشأة الكبرى.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4 border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">دورات تحفيظ ومقامات القرآن</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                دورات صيفية وتحفيظ أحكام التجويد وإعداد القراء بالمشاركة مع كبار الدكاترة لتنمية مهارات الصوت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. High Standard Nursery Section (تاب الحضانة الشغل العالي) */}
      <section className="bg-white border-y border-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="badge bg-brand-light text-brand-primary border-brand-primary/10">نظام وقسم الحضانة والتأسيس</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
              تاب الحضانة: نظام متابعة تعليمي وتربوي متطور
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              نقدم تجربة فريدة لأولياء الأمور تجمع بين التأسيس الأكاديمي والقرآني المتميز وبين المتابعة الإلكترونية الفورية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="card p-6 space-y-4 border-brand-primary/20 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-base">متابعة درجات الاختبارات بالرسوم البيانية</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                يدخل ولي الأمر برقمه السري ليعرض رسماً بيانياً تفاعلياً (منحنيات وأعمدة) يوضح مستوى طفله في المواد: القرآن، الأذكار، نور البيان، الحساب، والإنجليزية عبر الأشهر.
              </p>
            </div>

            <div className="card p-6 space-y-4 border-brand-primary/20 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-base">التقرير المالي والرسوم بدون تعقيد</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                شفافية كاملة لولي الأمر للاطلاع على المبالغ المدفوعة والمتبقية وطريقة السداد وملاحظات الحساب الخاصة بكل طفل.
              </p>
            </div>

            <div className="card p-6 space-y-4 border-brand-primary/20 bg-slate-50/50">
              <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-base">تقييم أداء المعلمات والجودة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                نظام إداري لمتابعة أداء معلمات الحضانة، الشرح على السبورة، دفتر التحضير، النظافة، والالتزام بالمنهج لضمان أعلى جودة تعليمية.
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link 
              href="/parent/login"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <span>تسجيل الدخول لبوابة الحضانة والدرجات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Nursery Booking Form Section */}
      <section id="booking-form" className="max-w-3xl w-full mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">حجز مقعد جديد في الحضانة</h2>
          <p className="text-xs text-slate-500">
            يرجى ملء الاستمارة وسنقوم بالاتصال بكم لتحديد موعد اختبار طفلك وإكمال إجراءات التسجيل.
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="card p-8 border-emerald-100 bg-emerald-50 text-center space-y-4">
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

      {/* 7. Footer */}
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
            <h4 className="font-bold text-white text-xs">حسابات التبرع والدعم الرسمي</h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-center gap-2">
                <span>💳</span> البنك الزراعي المصري: <strong className="text-white">1300</strong>
              </p>
              <p className="flex items-center gap-2">
                <span>💸</span> فودافون كاش: <strong className="text-white font-mono">01010453630</strong>
              </p>
              <p className="flex items-center gap-2">
                <span>⚡</span> انستا باي: <strong className="text-white font-mono">01281660541</strong>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> هاتف الجمعية: <strong className="text-white font-mono">0132545455</strong>
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">العنوان واللوحات</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>المنشأة الكبرى، مركز كفر شكر، محافظة القليوبية، مصر.</span>
            </p>
            <div className="pt-2 flex gap-4">
              <Link href="/parent/login" className="text-brand-secondary hover:underline">
                بوابة ولي الأمر
              </Link>
              <Link href="/admin/login" className="text-slate-500 hover:text-white transition-colors">
                تسجيل دخول الإدارة
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

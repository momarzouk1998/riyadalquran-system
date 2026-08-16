'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, Send, CheckCircle2, MapPin, LogIn, ArrowLeft,
  ShieldCheck, Gift, Activity, Copy, Check, CreditCard,
  Smartphone, Sparkles, Users, BarChart3, Star, X, Phone,
  BookOpen, Baby, Award
} from 'lucide-react';
import { createNurseryBooking } from '@/app/actions/admin';
import { StudentGradesChart } from '@/components/StudentGradesChart';
import { CircularProgress } from '@/components/CircularProgress';

/* ─────────────────────────────────────────────── */
/*  DATA                                           */
/* ─────────────────────────────────────────────── */

const PAYMENT_METHODS = {
  bank: {
    name: 'البنك الزراعي المصري',
    account: '1300',
    type: 'حساب بنكي رسمي',
    desc: 'حساب الجمعية المشهر رقم 1300',
    icon: CreditCard,
    bg: 'bg-emerald-900',
    accent: 'border-emerald-500',
  },
  instapay: {
    name: 'InstaPay — انستا باي',
    account: '01281660541',
    type: 'تحويل فوري مباشر',
    desc: 'تحويل فوري بدون عمولة',
    icon: Sparkles,
    bg: 'bg-indigo-900',
    accent: 'border-indigo-500',
  },
  vodafone: {
    name: 'Vodafone Cash',
    account: '01010453630',
    type: 'محفظة إلكترونية',
    desc: 'محفظة فودافون كاش الرسمية',
    icon: Smartphone,
    bg: 'bg-rose-900',
    accent: 'border-rose-500',
  },
} as const;

type PaymentKey = keyof typeof PAYMENT_METHODS;

const PROJECTS = [
  {
    id: 'orphans',
    categoryKey: 'orphans',
    category: 'كفالة اليتيم',
    title: 'كفالة الأيتام وملابس العيد',
    desc: '٢١ أسرة يتيمة تتلقى رواتب شهرية ثابتة، ملابس العيد، والحقيبة المدرسية كل عام.',
    pct: 85,
    raised: '22,950',
    target: '27,000',
    emoji: '🎁',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    progressVariant: 'green' as const,
    amounts: [50, 100, 250, 500],
  },
  {
    id: 'food',
    categoryKey: 'food',
    category: 'إطعام وسلال',
    title: 'سلال بنك الطعام الشهرية',
    desc: 'سلال غذائية لـ ١٢١ حالة شهرياً بالتعاون مع بنك الطعام المصري، و٦٢ حالة في الأعياد.',
    pct: 90,
    raised: '12,420',
    target: '13,800',
    emoji: '🍲',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    progressVariant: 'gold' as const,
    amounts: [50, 100, 200, 300],
  },
  {
    id: 'medical',
    categoryKey: 'medical',
    category: 'رعاية مرضى',
    title: 'دعم الحالات المرضية شهرياً',
    desc: 'مساعدات طبية لـ ٢١ حالة مرضية بتكلفة ٣٠٠ جنيه للفرد، إجمالي ٦٣٠٠ شهرياً.',
    pct: 68,
    raised: '4,284',
    target: '6,300',
    emoji: '🩺',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    progressVariant: 'green' as const,
    amounts: [100, 300, 500, 1000],
  },
  {
    id: 'water',
    categoryKey: 'water',
    category: 'سقيا الماء',
    title: 'محطة تحلية مياه الشرب',
    desc: 'صيانة وتشغيل محطة التحلية الدائمة بالمنشأة الكبرى لتوفير مياه نقية مجانية للأهالي.',
    pct: 100,
    raised: '15,000',
    target: '15,000',
    emoji: '💧',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    progressVariant: 'complete' as const,
    amounts: [50, 100, 200, 500],
  },
];

const CATEGORY_TABS = [
  { id: 'all',     label: 'جميع المشاريع',   count: PROJECTS.length },
  { id: 'orphans', label: 'كفالة الأيتام',   count: 1 },
  { id: 'food',    label: 'الإطعام والسلال', count: 1 },
  { id: 'medical', label: 'المساعدات الطبية', count: 1 },
  { id: 'water',   label: 'سقيا الماء',      count: 1 },
];

const DEMO_GRADES = [
  { month: '9',  quran: 90, azkar: 85, nourAlbian: 92, math: 88, english: 85 },
  { month: '10', quran: 95, azkar: 90, nourAlbian: 96, math: 92, english: 90 },
  { month: '11', quran: 98, azkar: 95, nourAlbian: 98, math: 95, english: 94 },
  { month: '12', quran:100, azkar: 98, nourAlbian:100, math: 98, english: 96 },
];

/* ─────────────────────────────────────────────── */
/*  PAGE                                           */
/* ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError,   setBookingError]   = useState<string | null>(null);
  const [copiedKey,      setCopiedKey]      = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePayment,  setActivePayment]  = useState<PaymentKey>('bank');
  const [nurseryTab,     setNurseryTab]     = useState<'chart' | 'finance' | 'teachers'>('chart');
  const [modalOpen,      setModalOpen]      = useState(false);
  const [modalProject,   setModalProject]   = useState<(typeof PROJECTS)[0] | null>(null);
  const [modalAmount,    setModalAmount]    = useState(100);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const openModal = (project: (typeof PROJECTS)[0], amount = 100) => {
    setModalProject(project);
    setModalAmount(amount);
    setModalOpen(true);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createNurseryBooking(fd);
      if (res.success) { setBookingSuccess(true); (e.target as HTMLFormElement).reset(); }
      else setBookingError(res.error || 'حدث خطأ');
    });
  };

  const filtered = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.categoryKey === activeCategory);

  const pm = PAYMENT_METHODS[activePayment];

  return (
    <div className="min-h-screen flex flex-col font-cairo" style={{ backgroundColor: '#f8faf9' }}>

      {/* ── NAVBAR ── */}
      <header className="glass-panel border-b border-slate-200/70 sticky top-0 z-50 shadow-sm">
        {/* Governance ribbon */}
        <div className="bg-emerald-950 text-emerald-200 text-[11px] py-1.5 px-4 text-center font-bold">
          <span className="flex items-center justify-center gap-2 flex-wrap">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>منصة الجمعيات الرقمية المعتمدة · المشهرة برقم 1300 · كفر شكر · قليوبية</span>
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 h-18 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-emerald-200/60 bg-white flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="شعار رياض القرآن"
                width={44} height={44}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-base text-slate-900 block leading-tight">رياض القرآن الكريم</span>
              <span className="text-[10px] text-emerald-700 font-bold block">منصة الجمعية والحضانة الرقمية</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            <a href="#store"    className="py-2 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-1.5"><Gift className="w-3.5 h-3.5"/>متجر التبرعات</a>
            <a href="#nursery"  className="py-2 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5"/>تاب الحضانة</a>
            <Link href="/nursery" className="py-2 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-1.5"><Baby className="w-3.5 h-3.5"/>الفصول</Link>
            <a href="#booking"  className="py-2 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors">التسجيل</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal(PROJECTS[0])}
              className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              تبرع سريع
            </button>
            <Link href="/parent/login" className="flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20">
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بوابة الأهالي</span>
              <span className="sm:hidden">دخول</span>
            </Link>
            <Link href="/admin/login" className="hidden sm:flex items-center py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold transition-colors">الإدارة</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white overflow-hidden min-h-[88vh] flex items-center">
        {/* glows */}
        <div className="absolute top-1/4 right-1/4 w-[28rem] h-[28rem] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 pattern-islamic opacity-100" />

        <div className="max-w-5xl mx-auto px-4 pt-12 pb-20 text-center space-y-8 relative z-10 w-full">
          {/* Logo */}
          <div className="flex justify-center animate-fade-in-up">
            <div className="relative p-3 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl glow-emerald">
              <Image
                src="/logo.png"
                alt="جمعية رياض القرآن الكريم"
                width={120} height={120}
                className="object-contain rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center animate-fade-in-up animate-delay-100">
            <div className="badge-gold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              منصة التبرعات الرقمية · المشهرة برقم ١٣٠٠ لسنة ٢٠٠٨
            </div>
          </div>

          {/* Title */}
          <div className="animate-fade-in-up animate-delay-200 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-wide">
              جمعية ونظام رياض القرآن الكريم
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
              نجمع بين العمل الخيري المتكامل — كفالة الأيتام، رعاية المرضى، محطة تحلية المياه —
              وبين حضانة قرآنية رقمية راقية تتيح لأولياء الأمور متابعة أطفالهم لحظة بلحظة.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up animate-delay-300">
            {[
              { n: '٢١ أسرة', l: 'كفالة يتيم شهرية' },
              { n: '١٢١ حالة', l: 'سلال طعام شهرياً' },
              { n: '١٣٠٠', l: 'رقم الإشهار الرسمي' },
              { n: '٣ فصول', l: 'مستويات الحضانة' },
            ].map(s => (
              <div key={s.l} className="glass-dark rounded-2xl py-4 px-3 text-center border border-white/10">
                <div className="stat-number text-2xl">{s.n}</div>
                <div className="text-emerald-200 text-[10px] font-semibold mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up animate-delay-400">
            <a href="#store" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 py-3.5 px-7 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-1 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-slate-950" />
              متجر التبرعات والمشاريع
            </a>
            <Link href="/parent/login" className="glass-dark border border-emerald-500/30 text-white py-3.5 px-7 rounded-2xl font-bold text-sm shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2">
              بوابة متابعة الطفل
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DONATION STORE — Al-Nouri style ── */}
      <section id="store" className="max-w-7xl w-full mx-auto px-4 py-20 space-y-10">

        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="badge-emerald mx-auto w-fit">
            <Gift className="w-3.5 h-3.5" />
            متجر التبرعات الرقمي
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">أبواب الخير المتاحة</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            اختر القسم وتابع نسبة الإنجاز لكل مشروع، ثم تبرع مباشرة عبر وسائل السداد الرسمية.
          </p>

          {/* Category tabs — Al-Nouri */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`py-2.5 px-5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20 scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {tab.label}
                {activeCategory === tab.id && <span className="mr-1.5 bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Payment method selector banner */}
        <div className={`rounded-2xl p-5 md:p-6 border text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${pm.bg} ${pm.accent}`}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              {React.createElement(pm.icon, { className: 'w-6 h-6 text-white' })}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/60 font-semibold">{pm.type}</p>
              <h3 className="font-black text-base text-white">{pm.name}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {(Object.keys(PAYMENT_METHODS) as PaymentKey[]).map(k => (
                  <button key={k} onClick={() => setActivePayment(k)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${activePayment === k ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                    {k === 'bank' ? 'البنك الزراعي' : k === 'instapay' ? 'انستا باي' : 'فودافون كاش'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 w-full md:w-auto">
            <span className="font-mono text-xl font-black text-amber-300 tracking-widest flex-1 text-center" dir="ltr">
              {pm.account}
            </span>
            <button
              onClick={() => handleCopy(pm.account, 'banner')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              {copiedKey === 'banner' ? <><Check className="w-4 h-4"/><span>تم</span></> : <><Copy className="w-4 h-4"/><span>نسخ</span></>}
            </button>
          </div>
        </div>

        {/* Project cards — Al-Nouri with circular progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="card-modern p-5 flex flex-col gap-5">

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`badge ${p.badgeColor} mb-2`}>{p.category}</span>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h3>
                </div>
                <span className="text-3xl shrink-0">{p.emoji}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed -mt-2">{p.desc}</p>

              {/* Circular progress — Al-Nouri signature */}
              <div className="flex items-center gap-4 py-2 border-t border-slate-100">
                <CircularProgress percent={p.pct} size={80} variant={p.progressVariant} />
                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex justify-between text-slate-500">
                    <span>تم تجميع</span>
                    <strong className="text-slate-800">{p.raised}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>الهدف</span>
                    <strong className="text-slate-800">{p.target}</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar-fill"
                      style={{
                        width: `${p.pct}%`,
                        background: p.progressVariant === 'gold' ? '#d4a843' : p.progressVariant === 'complete' ? '#22c55e' : '#0e6b47',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick amounts */}
              <div>
                <span className="block text-[10px] font-bold text-slate-400 mb-2">اختر مبلغ التبرع (جنيه)</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {p.amounts.map(amt => (
                    <button key={amt} onClick={() => openModal(p, amt)}
                      className="py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-black transition-all cursor-pointer text-center">
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openModal(p)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-auto"
              >
                <Heart className="w-4 h-4 fill-white" />
                تبرع الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ── NURSERY SHOWCASE ── */}
      <section id="nursery" className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-islamic opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="badge-gold mx-auto w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              تاب الحضانة الرقمي — نظام متكامل
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              متابعة طفلك بشفافية فورية
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              درجات الاختبارات الشهرية، مقارنة بمتوسط الفصل، الموقف المالي، وتقييم المعلمة — كل ذلك في بوابة واحدة.
            </p>

            {/* Tab switcher */}
            <div className="flex justify-center pt-2">
              <div className="bg-white/8 border border-white/10 backdrop-blur-xl p-1.5 rounded-2xl flex items-center gap-1 flex-wrap justify-center">
                {[
                  { id: 'chart',    label: 'الرسم البياني', icon: BarChart3 },
                  { id: 'finance',  label: 'الشفافية المالية', icon: CreditCard },
                  { id: 'teachers', label: 'معايير الجودة', icon: Award },
                ] .map(t => (
                  <button key={t.id} onClick={() => setNurseryTab(t.id as typeof nurseryTab)}
                    className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${nurseryTab === t.id ? 'bg-amber-400 text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white'}`}>
                    {React.createElement(t.icon, { className: 'w-4 h-4' })}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo window */}
          <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
            {nurseryTab === 'chart' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">معاينة حية: درجات الطفل شهرياً</h3>
                    <p className="text-xs text-slate-500 mt-0.5">القرآن، الأذكار، نور البيان، الحساب، الإنجليزية</p>
                  </div>
                  <div className="badge-gold">معدل آخر اختبار: ٩٨% 🌟</div>
                </div>
                <StudentGradesChart grades={DEMO_GRADES} />
              </div>
            )}

            {nurseryTab === 'finance' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900">الموقف المالي بشفافية كاملة</h3>
                  <p className="text-xs text-slate-500 mt-0.5">المدفوع، المتبقي، طريقة السداد — واضح دون تعقيد</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center space-y-2">
                    <p className="text-xs font-bold text-emerald-700">المبلغ المدفوع</p>
                    <p className="text-4xl font-black text-emerald-700">١٥٠</p>
                    <span className="text-[10px] text-emerald-600 block">سداد كاش معتمد</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-500">المبلغ المتبقي</p>
                    <p className="text-4xl font-black text-slate-800">٠</p>
                    <span className="text-[10px] text-emerald-600 block">الحساب خالص ✓</span>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center space-y-2">
                    <p className="text-xs font-bold text-amber-800">طريقة السداد</p>
                    <p className="text-base font-bold text-amber-900">نقدي بالجمعية</p>
                    <span className="text-[10px] text-amber-700 block">إيصال استلام رسمي</span>
                  </div>
                </div>
              </div>
            )}

            {nurseryTab === 'teachers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900">معايير تقييم جودة المعلمات</h3>
                  <p className="text-xs text-slate-500 mt-0.5">تقييم شهري شامل لضمان أعلى مستوى تعليمي</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { emoji: '✍️', title: 'الشرح على السبورة', desc: 'توصيل واضح وفعّال' },
                    { emoji: '📓', title: 'دفتر التحضير',       desc: 'خطط تعليمية مرتبة' },
                    { emoji: '🧹', title: 'نظافة الفصل',        desc: 'بيئة صحية مبهجة' },
                    { emoji: '⏰', title: 'الانضباط',           desc: 'التزام تام بالمواعيد' },
                  ].map(item => (
                    <div key={item.title} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-2">
                      <span className="text-3xl">{item.emoji}</span>
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/parent/login" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-amber-400/20 transition-all hover:-translate-y-0.5">
              <LogIn className="w-4 h-4" /> دخول بوابة الأهالي
            </Link>
            <Link href="/nursery" className="inline-flex items-center gap-2 glass-dark border border-white/15 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5">
              <Baby className="w-4 h-4" /> عرض الفصول والمعلمات
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ── */}
      <section id="booking" className="max-w-2xl w-full mx-auto px-4 py-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="badge-gold mx-auto w-fit"><Send className="w-3.5 h-3.5 text-amber-500"/>استمارة التسجيل</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">حجز مقعد في الحضانة</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">عبّئ البيانات وسنتواصل معك خلال ٢٤ ساعة لتحديد موعد القبول.</p>
        </div>

        {bookingSuccess ? (
          <div className="card p-10 text-center space-y-4 border-emerald-100 bg-emerald-50 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">تم إرسال الطلب بنجاح!</h3>
              <p className="text-xs text-slate-500 mt-1">سيتواصل معكم فريق الجمعية على رقمكم قريباً.</p>
            </div>
            <button onClick={() => setBookingSuccess(false)} className="text-xs text-emerald-700 font-bold hover:underline">تقديم طلب آخر</button>
          </div>
        ) : (
          <div className="card-modern p-6 md:p-8 bg-white">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs mb-4">{bookingError}</div>
            )}
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم ولي الأمر</label>
                  <input type="text" name="parentName" required className="form-input-modern" placeholder="الاسم بالكامل" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم الهاتف</label>
                  <input type="text" name="phone" required className="form-input-modern text-center" placeholder="010xxxxxxxx" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم الطفل</label>
                  <input type="text" name="studentName" required className="form-input-modern" placeholder="الاسم رباعي" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">العمر (سنوات)</label>
                  <input type="number" name="age" min={2} max={8} required className="form-input-modern text-center" placeholder="٢ — ٦" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">ملاحظات</label>
                <textarea name="notes" className="form-input-modern h-24" placeholder="أي تفاصيل إضافية..." />
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {isPending ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4"/><span>إرسال طلب التسجيل</span></>}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg">
                <Image src="/logo.png" alt="" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <span className="font-black text-base text-white block leading-tight">رياض القرآن الكريم</span>
                <span className="text-[10px] text-emerald-400 font-bold block">المشهرة برقم ١٣٠٠</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              جمعية خيرية متكاملة — كفالة، رعاية، تعليم، تحلية مياه — بالمنشأة الكبرى، كفر شكر، قليوبية.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white">حسابات التبرع</h4>
            {(Object.values(PAYMENT_METHODS)).map(m => (
              <p key={m.name} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                <span className="text-slate-300">{m.name}</span>
                <strong className="text-amber-400 font-mono" dir="ltr">{m.account}</strong>
              </p>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white">تواصل معنا</h4>
            <p className="flex items-center gap-2 text-[11px]"><Phone className="w-3.5 h-3.5 text-emerald-500"/><span dir="ltr">0132545455</span></p>
            <p className="flex items-start gap-2 text-[11px]"><MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/>المنشأة الكبرى، كفر شكر، القليوبية</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white">البوابات</h4>
            <div className="space-y-1.5 text-[11px]">
              <Link href="/nursery"       className="block text-emerald-400 hover:text-white transition-colors">• الفصول والمعلمات</Link>
              <Link href="/parent/login"  className="block text-emerald-400 hover:text-white transition-colors">• بوابة أولياء الأمور</Link>
              <Link href="/admin/login"   className="block text-slate-500 hover:text-white transition-colors">• لوحة الإدارة</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-900 py-4 text-center text-[10px] text-slate-600">
          &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم — جميع الحقوق محفوظة لـ OpenAppo
        </div>
      </footer>

      {/* ── DONATION MODAL ── */}
      {modalOpen && modalProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-slate-100 pb-4">
              <span className="text-4xl">{modalProject.emoji}</span>
              <h3 className="font-black text-lg text-slate-900 mt-2">{modalProject.title}</h3>
              <p className="text-xs text-slate-500 mt-1">اختر مبلغ التبرع وطريقة السداد</p>
            </div>

            {/* Circular progress in modal */}
            <div className="flex items-center justify-center gap-6 py-2">
              <CircularProgress percent={modalProject.pct} size={80} variant={modalProject.progressVariant} />
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between gap-8">
                  <span className="text-slate-400">تم تجميع</span>
                  <strong className="text-slate-800">{modalProject.raised}</strong>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-slate-400">الهدف</span>
                  <strong className="text-slate-800">{modalProject.target}</strong>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">مبلغ التبرع (جنيه)</label>
              <div className="grid grid-cols-4 gap-2">
                {[50,100,250,500].map(amt => (
                  <button key={amt} onClick={() => setModalAmount(amt)}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${modalAmount === amt ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Method */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">حساب التحويل</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PAYMENT_METHODS) as PaymentKey[]).map(k => (
                  <button key={k} onClick={() => setActivePayment(k)}
                    className={`py-2.5 px-2 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${activePayment === k ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {k === 'bank' ? '💳 البنك' : k === 'instapay' ? '⚡ انستا باي' : '📱 فودافون'}
                  </button>
                ))}
              </div>
            </div>

            {/* Account display */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold">{PAYMENT_METHODS[activePayment].name}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                <span className="font-mono text-lg font-black text-amber-300 tracking-widest" dir="ltr">
                  {PAYMENT_METHODS[activePayment].account}
                </span>
                <button onClick={() => handleCopy(PAYMENT_METHODS[activePayment].account, 'modal')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer">
                  {copiedKey === 'modal' ? <><Check className="w-3.5 h-3.5"/>تم</> : <><Copy className="w-3.5 h-3.5"/>نسخ</>}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">حول مبلغ ({modalAmount}) مباشرةً</p>
            </div>

            <button onClick={() => setModalOpen(false)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm cursor-pointer transition-colors">
              تم التحويل ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

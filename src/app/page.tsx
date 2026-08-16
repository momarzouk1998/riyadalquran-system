'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Calendar, Phone, Award, BookOpen, Send, CheckCircle2, 
  MapPin, LogIn, ArrowLeft, ShieldCheck, Gift, Activity, Waves,
  Copy, Check, CreditCard, Smartphone, Sparkles, ChevronLeft,
  Users, BarChart3, Star, CheckCircle, Eye, ArrowUpRight, Calculator,
  TrendingUp, Shield, Layers, HelpCircle, Filter, ShoppingBag, X,
  Share2, ArrowRight
} from 'lucide-react';
import { createNurseryBooking } from '@/app/actions/admin';
import { StudentGradesChart } from '@/components/StudentGradesChart';

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Category Filter Tabs (Al-Nouri Style)
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Instant Donation Modal State (Al-Nouri Checkout Style)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [modalProject, setModalProject] = useState<any | null>(null);
  const [modalAmount, setModalAmount] = useState<number>(100);

  // Active Payment Method in Modal
  const [activePaymentMethod, setActivePaymentMethod] = useState<'bank' | 'instapay' | 'vodafone'>('bank');

  // Nursery Showcase Tab State
  const [activeNurseryTab, setActiveNurseryTab] = useState<'chart' | 'finance' | 'teachers'>('chart');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const openDonationModal = (project: any, amount?: number) => {
    setModalProject(project);
    if (amount) setModalAmount(amount);
    setIsDonationModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createNurseryBooking(formData);
      if (res.success) {
        setBookingSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setBookingError(res.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    });
  };

  // Al-Nouri Category Filter Tabs
  const categoryTabs = [
    { id: 'all', label: '🌟 جميع المشاريع', count: 4 },
    { id: 'orphans', label: '🎁 كفالات الأيتام', count: 1 },
    { id: 'food', label: '🍲 السلال والإطعام', count: 1 },
    { id: 'social', label: '🧱 الترميم والزواج', count: 1 },
    { id: 'water', label: '💧 سقيا الماء والآبار', count: 1 },
  ];

  // E-Donation Store Projects (Al-Nouri Masterpiece Style)
  const projects = [
    {
      id: 'orphans-1',
      categoryKey: 'orphans',
      title: 'مشروع كفالة اليتيم والكسوة المدرسية',
      category: 'كفالات شهرية',
      desc: 'كفالة 21 أسرة يتيمة برواتب شهرية وتوفير ملابس العيد والحقائب المدرسية الكاملة سنوياً.',
      targetPercent: 85,
      raised: '22,950',
      target: '27,000',
      imageEmoji: '🎁',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      amounts: [50, 100, 250, 500],
    },
    {
      id: 'food-1',
      categoryKey: 'food',
      title: 'مشروع طرود وإطعام بنك الطعام المصري',
      category: 'إطعام وسلال',
      desc: 'توفير السلال والكراتين الغذائية لـ 121 حالة مستفيدة شهرياً و62 حالة في الأعياد والمواسم.',
      targetPercent: 90,
      raised: '12,420',
      target: '13,800',
      imageEmoji: '🍲',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      amounts: [50, 100, 200, 300],
    },
    {
      id: 'social-1',
      categoryKey: 'social',
      title: 'مشروع ترميم البيوت وتيسير الزواج',
      category: 'مساعدات اجتماعية',
      desc: 'إعادة بناء وتسقيف منازل الأسر غير القادرة وتيسير زواج الفتيات اليتيمات بالمنشأة الكبرى.',
      targetPercent: 65,
      raised: '13,000',
      target: '20,000',
      imageEmoji: '🧱',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      amounts: [100, 250, 500, 1000],
    },
    {
      id: 'water-1',
      categoryKey: 'water',
      title: 'محطة تحلية مياه الشرب النظيفة',
      category: 'سقيا ماء',
      desc: 'تشغيل وصيانة محطة التحلية الدائمة بالقرية لتوفير مياه صحية نقية مجاناً لجميع الأهالي.',
      targetPercent: 100,
      raised: '15,000',
      target: '15,000',
      imageEmoji: '💧',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      amounts: [50, 100, 200, 500],
    },
  ];

  // Filter projects by active category tab
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.categoryKey === activeCategory);

  const donationMethods = {
    bank: {
      name: 'البنك الزراعي المصري',
      account: '1300',
      type: 'حساب بنكي رسمي',
      desc: 'حساب الجمعية المشهر رقم 1300',
      icon: CreditCard,
    },
    instapay: {
      name: 'انستا باي (InstaPay)',
      account: '01281660541',
      type: 'تحويل فوري مباشر',
      desc: 'تحويل فوري عبر تطبيق InstaPay',
      icon: Sparkles,
    },
    vodafone: {
      name: 'فودافون كاش (Vodafone Cash)',
      account: '01010453630',
      type: 'محفظة إلكترونية',
      desc: 'محفظة فودافون كاش الرسمية للجمعية',
      icon: Smartphone,
    },
  };

  // Demo grades for Nursery live interactive simulator
  const demoGrades = [
    { month: '9', quran: 90, azkar: 85, nourAlbian: 92, math: 88, english: 85 },
    { month: '10', quran: 95, azkar: 90, nourAlbian: 96, math: 92, english: 90 },
    { month: '11', quran: 98, azkar: 95, nourAlbian: 98, math: 95, english: 94 },
    { month: '12', quran: 100, azkar: 98, nourAlbian: 100, math: 98, english: 96 },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-tajawal text-slate-800">
      
      {/* 1. Al-Nouri Style Institutional Header & Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200/60 backdrop-blur-2xl">
        
        {/* Top Governance Ribbon */}
        <div className="bg-emerald-950 text-emerald-200 text-[11px] py-1.5 px-4 text-center font-bold flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            منصة الجمعيات الرقمية المعتمدة • المشهرة برقم 1300 بالمنشأة الكبرى
          </span>
          <span className="hidden sm:inline text-emerald-600">|</span>
          <span className="hidden sm:inline text-emerald-300">ترخيص وزارة التضامن الاجتماعي • كفر شكر • القليوبية</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-900/10 border border-emerald-500/30 group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-1">
              <Image 
                src="/logo.png" 
                alt="شعار رياض القرآن" 
                width={48} 
                height={48} 
                className="object-contain" 
                priority
              />
            </div>
            <div>
              <span className="font-black text-xl text-slate-900 tracking-wide block leading-tight">
                رياض القرآن
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                منصة الجمعيات الخيرية والحضانة
              </span>
            </div>
          </Link>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="#store"
              className="hidden md:flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all"
            >
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>متجر المشاريع</span>
            </a>

            <a
              href="#nursery-platform"
              className="hidden md:flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>تاب الحضانة</span>
            </a>

            <button
              onClick={() => openDonationModal(projects[0], 100)}
              className="hidden sm:flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>التبرع السريع</span>
            </button>

            <Link 
              href="/parent/login" 
              className="flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30"
            >
              <LogIn className="w-4 h-4" />
              <span>بوابة الأبوين والطفل</span>
            </Link>

            <Link 
              href="/admin/login" 
              className="hidden sm:flex items-center gap-1.5 py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100/60 text-xs font-bold transition-all"
            >
              <span>الإدارة</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Hero Section: Rich Emerald & Gold Mesh Ambient */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white flex items-center justify-center overflow-hidden min-h-[92vh]">
        
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Logo Frame */}
          <div className="inline-flex flex-col items-center">
            <div className="relative p-3 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl glow-emerald mb-4">
              <Image 
                src="/logo.png" 
                alt="جمعية رياض القرآن الكريم" 
                width={110} 
                height={110} 
                className="object-contain rounded-2xl" 
                priority
              />
            </div>
            
            <div className="badge-gold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>منصة التبرعات الرقمية والحوكمة الكاملة • المشهرة برقم 1300</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-wide">
            منصـة ومشاريع <br className="hidden sm:block" />
            <span className="text-gradient-gold">رياض القرآن الكريم التكافلية</span>
          </h1>

          <p className="text-sm md:text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-light">
            موقع مؤسسي حديث يدمج متجر التبرعات التفاعلي والشفافية التامة، مع منظومة تعليمية رقمية راقية لأطفال الحضانة تضمن المتابعة المستمرة للأبوين.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#store"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 py-4 px-8 rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>تصفح متجر المشاريع وتبرع الآن</span>
            </a>

            <Link 
              href="/parent/login"
              className="glass-dark hover:bg-emerald-900/80 text-white border border-emerald-500/30 py-4 px-8 rounded-2xl font-bold text-xs md:text-sm shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>دخول بوابة متابعة الطفل بالرياض</span>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Live Governance Stat Cards */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="glass-dark p-5 rounded-2xl text-center space-y-1.5 border border-emerald-500/20">
              <span className="text-xs text-emerald-300 font-bold block">كفالة أيتام</span>
              <p className="text-3xl font-black text-amber-400">21 أسرة</p>
              <p className="text-[10px] text-emerald-200">رواتب وكسوة سنوية</p>
            </div>
            <div className="glass-dark p-5 rounded-2xl text-center space-y-1.5 border border-emerald-500/20">
              <span className="text-xs text-emerald-300 font-bold block">بنك الطعام</span>
              <p className="text-3xl font-black text-amber-400">121 حالة</p>
              <p className="text-[10px] text-emerald-200">سلال غذائية شهرياً</p>
            </div>
            <div className="glass-dark p-5 rounded-2xl text-center space-y-1.5 border border-emerald-500/20">
              <span className="text-xs text-emerald-300 font-bold block">محطة المياه</span>
              <p className="text-3xl font-black text-amber-400">100%</p>
              <p className="text-[10px] text-emerald-200">تحلية وتصفية نقية</p>
            </div>
            <div className="glass-dark p-5 rounded-2xl text-center space-y-1.5 border border-emerald-500/20">
              <span className="text-xs text-emerald-300 font-bold block">رقم الإشهار</span>
              <p className="text-3xl font-black text-amber-400">1300</p>
              <p className="text-[10px] text-emerald-200">البنك الزراعي المصري</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. E-Donation Store (Al-Nouri Masterpiece Category Filter Tabs Strip) */}
      <section id="store" className="max-w-7xl w-full mx-auto px-4 py-20 space-y-10">
        
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="badge-emerald">
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>متجر التبرعات الرقمي والمشاريع الخيرية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">أبواب الخير والمشاريع المتاحة</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            اختر القسم وتتبع نسبة إنجاز وتجميع التبرع لكل مشروع وساهم مباشرة عبر وسائل السداد الرسمية للجمعية.
          </p>

          {/* AL-NOURI STYLE CATEGORY FILTER TABS STRIP */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
                  activeCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Donation Method Quick Banner */}
        <div className="card-modern p-6 bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-lg shadow-amber-400/20">
              {React.createElement(donationMethods[activePaymentMethod].icon, { className: "w-7 h-7" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300 font-bold">{donationMethods[activePaymentMethod].type}</span>
                <div className="flex gap-1">
                  <button onClick={() => setActivePaymentMethod('bank')} className={`text-[10px] px-2 py-0.5 rounded-lg border ${activePaymentMethod === 'bank' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white'}`}>البنك الزراعي</button>
                  <button onClick={() => setActivePaymentMethod('instapay')} className={`text-[10px] px-2 py-0.5 rounded-lg border ${activePaymentMethod === 'instapay' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white'}`}>انستا باي</button>
                  <button onClick={() => setActivePaymentMethod('vodafone')} className={`text-[10px] px-2 py-0.5 rounded-lg border ${activePaymentMethod === 'vodafone' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white'}`}>فودافون كاش</button>
                </div>
              </div>
              <h3 className="text-lg font-black mt-1">{donationMethods[activePaymentMethod].name}</h3>
              <p className="text-xs text-emerald-200">{donationMethods[activePaymentMethod].desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 w-full md:w-auto justify-between">
            <span className="font-mono text-xl font-black text-amber-300 tracking-widest px-2" dir="ltr">
              {donationMethods[activePaymentMethod].account}
            </span>
            <button
              onClick={() => handleCopy(donationMethods[activePaymentMethod].account, activePaymentMethod)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copiedKey === activePaymentMethod ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الرقم</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Projects Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((p) => {
            return (
              <div key={p.id} className="card-modern p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`badge ${p.badgeColor}`}>{p.category}</span>
                    <span className="text-3xl">{p.imageEmoji}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  
                  {/* Raised Amount vs Target */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">تم تجميع: <strong className="text-slate-900">{p.raised}</strong></span>
                    <span className="text-slate-500">الهدف: <strong className="text-slate-900">{p.target}</strong></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">نسبة الاكتمال</span>
                      <span className="text-emerald-700">{p.targetPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full progress-bar-fill" 
                        style={{ width: `${p.targetPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Donation Amounts */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 mb-2">اختر مبلغ التبرع:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {p.amounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => openDonationModal(p, amt)}
                          className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-black transition-all cursor-pointer text-center"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openDonationModal(p)}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>تبرع الآن للمشروع</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 4. High-End Nursery Suite Showcase (منظومة تاب الحضانة الرقمية الفاخرة) */}
      <section id="nursery-platform" className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="badge-gold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>تاب الحضانة الرقمي • الشغل العالي المتكامل</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              منظومة الحضانة: متابعة إلكترونية فورية لكل طفل
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              نظام تفاعلي يتيح لولي الأمر معرفة نتائج طفله في كافة المواد أولاً بأول والاطلاع على التقرير المالي بشفافية كاملة.
            </p>

            {/* Interactive Showcase Tabs */}
            <div className="pt-4 flex justify-center">
              <div className="bg-white/10 p-1.5 rounded-2xl flex items-center gap-2 max-w-xl w-full border border-white/15 backdrop-blur-xl">
                <button
                  onClick={() => setActiveNurseryTab('chart')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeNurseryTab === 'chart' 
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>الرسم البياني للتطور</span>
                </button>

                <button
                  onClick={() => setActiveNurseryTab('finance')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeNurseryTab === 'finance' 
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>الشفافية المالية</span>
                </button>

                <button
                  onClick={() => setActiveNurseryTab('teachers')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeNurseryTab === 'teachers' 
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' 
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
            
            {activeNurseryTab === 'chart' && (
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

            {activeNurseryTab === 'finance' && (
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

            {activeNurseryTab === 'teachers' && (
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
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all"
            >
              <span>تسجيل الدخول لبوابة أولياء الأمور والدرجات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Nursery Seat Registration Booking Form */}
      <section id="booking-form" className="max-w-3xl w-full mx-auto px-4 py-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="badge-emerald">
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>استمارة التسجيل المباشر</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">حجز مقعد جديد في الحضانة</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            يرجى تعبئة البيانات وسيقوم فريق الجمعية بالاتصال بكم لتحديد موعد الاختبار واستكمال التسجيل.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {bookingSuccess ? (
          <div className="card-modern p-8 bg-emerald-50 border-emerald-200 text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-700/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">تم إرسال طلب الحجز بنجاح!</h3>
              <p className="text-xs text-slate-600">
                شكرًا لثقتكم برياض القرآن. سيتواصل معكم مسؤولو الجمعية على رقم المحمول المقدم في أقرب وقت.
              </p>
            </div>
          </div>
        ) : (
          <div className="card-modern p-6 sm:p-10 bg-white border border-slate-200 shadow-2xl">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs mb-6">
                {bookingError}
              </div>
            )}
            
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسم ولي الأمر بالكامل</label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    className="form-input-modern"
                    placeholder="ادخل اسم ولي الأمر"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">رقم المحمول للاتصال</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="form-input-modern text-center font-bold"
                    placeholder="010xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسم الطفل بالكامل</label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    className="form-input-modern"
                    placeholder="ادخل اسم الطفل"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">عمر الطفل (سنوات)</label>
                  <input
                    type="number"
                    name="age"
                    min={2}
                    max={8}
                    required
                    className="form-input-modern text-center font-bold"
                    placeholder="مثال: 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ملاحظات أو متطلبات خاصة</label>
                <textarea
                  name="notes"
                  className="form-input-modern h-28"
                  placeholder="أي ملاحظات تود إشعار الجمعية بها..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black shadow-xl shadow-emerald-700/25 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

      {/* 6. INSTANT DONATION CHECKOUT MODAL (Al-Nouri Checkout Experience) */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setIsDonationModalOpen(false)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <div className="badge-emerald mx-auto">
                <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>إتمام التبرع المباشر</span>
              </div>
              <h3 className="font-black text-xl text-slate-900">
                {modalProject?.title || 'التبرع السريع'}
              </h3>
              <p className="text-xs text-slate-500">اختر طريقة السداد لتحويل مبلغ التبرع مباشرة</p>
            </div>

            {/* Select Amount Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">مبلغ التبرع المحدد:</label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setModalAmount(amt)}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      modalAmount === amt
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">اختر حساب التحويل:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActivePaymentMethod('bank')}
                  className={`py-3 px-2 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    activePaymentMethod === 'bank' ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  💳 البنك الزراعي
                </button>
                <button
                  onClick={() => setActivePaymentMethod('instapay')}
                  className={`py-3 px-2 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    activePaymentMethod === 'instapay' ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  ⚡ انستا باي
                </button>
                <button
                  onClick={() => setActivePaymentMethod('vodafone')}
                  className={`py-3 px-2 rounded-2xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    activePaymentMethod === 'vodafone' ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  📱 فودافون كاش
                </button>
              </div>
            </div>

            {/* Account Card & Copy Action */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold">{donationMethods[activePaymentMethod].name}</span>
                <span className="text-slate-400">{donationMethods[activePaymentMethod].type}</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                <span className="font-mono text-xl font-black text-amber-300 tracking-widest" dir="ltr">
                  {donationMethods[activePaymentMethod].account}
                </span>
                <button
                  onClick={() => handleCopy(donationMethods[activePaymentMethod].account, `modal-${activePaymentMethod}`)}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === `modal-${activePaymentMethod}` ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">حول مبلغ ({modalAmount}) برقم الحساب أو المحفظة مباشرةً</p>
            </div>

            <button
              onClick={() => setIsDonationModalOpen(false)}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              تم التحويل والإنهاء
            </button>

          </div>
        </div>
      )}

      {/* 7. Institutional Al-Nouri Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 mt-auto border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg">
                <Image src="/logo.png" alt="رياض القرآن" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <span className="font-black text-lg text-white block leading-tight">رياض القرآن</span>
                <span className="text-[10px] text-emerald-400 font-bold block">منصة الجمعيات الرقمية</span>
              </div>
            </div>
            <p className="leading-relaxed text-slate-400">
              جمعية رياض القرآن الكريم بالمنشأة الكبرى، كفر شكر، قليوبية. مشهرة برقم 1300 لتقديم الخدمات الاجتماعية والتعليمية عالية المستوى.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">حسابات التبرع والدعم الرسمية</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span>البنك الزراعي المصري:</span>
                <strong className="text-amber-400 font-mono">1300</strong>
              </p>
              <p className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span>فودافون كاش:</span>
                <strong className="text-amber-400 font-mono" dir="ltr">01010453630</strong>
              </p>
              <p className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span>انستا باي InstaPay:</span>
                <strong className="text-amber-400 font-mono" dir="ltr">01281660541</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">التواصل والعنوان</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span dir="ltr">0132545455</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>المنشأة الكبرى، كفر شكر، القليوبية، مصر.</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">البوابات الرقمية</h4>
            <div className="space-y-2">
              <Link href="/parent/login" className="block text-emerald-400 hover:underline">
                • بوابة أولياء الأمور (الحضانة)
              </Link>
              <Link href="/admin/login" className="block text-slate-400 hover:text-white transition-colors">
                • لوحة تحكم الإدارة والمشرفين
              </Link>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-8 text-center text-[11px] text-slate-500">
          &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم. جميع الحقوق محفوظة لـ OpenAppo.
        </div>
      </footer>

    </div>
  );
}

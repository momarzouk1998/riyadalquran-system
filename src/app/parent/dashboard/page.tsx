import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentStudent } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import { db } from '@/lib/db';
import { resolveImageUrl } from '@/lib/cloudflare';
import { StudentGradesChart } from '@/components/StudentGradesChart';
import { ParentHeaderActions } from '@/components/ParentHeaderActions';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, Calendar, BookOpen, CreditCard, LogOut, Phone, MapPin,
  Award, TrendingUp, TrendingDown, Minus, Star, Users,
  CheckCircle2, AlertCircle, ChevronRight, Home, Wallet, Sparkles, HeartHandshake
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const MONTH_NAMES: Record<string, string> = {
  '9':  'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر',
  '2':  'فبراير',
  '3':  'مارس',
  '4':  'أبريل',
  '5':  'مايو',
};
const MONTH_ORDER = ['9','10','11','12','2','3','4','5'];

function gradeLabel(score: number) {
  if (score >= 85) return { text: 'ممتاز 🌟', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
  if (score >= 70) return { text: 'جيد جداً 👍', color: 'bg-blue-100 text-blue-900 border-blue-300' };
  if (score >= 50) return { text: 'مستوى متوسط 📚', color: 'bg-amber-100 text-amber-900 border-amber-300' };
  return { text: 'تحتاج متابعة ✏️', color: 'bg-rose-100 text-rose-900 border-rose-300' };
}

function trendIcon(curr: number, prev: number | undefined) {
  if (prev === undefined) return null;
  const diff = curr - prev;
  if (diff > 3)  return <TrendingUp   className="w-4 h-4 text-emerald-600 shrink-0" />;
  if (diff < -3) return <TrendingDown  className="w-4 h-4 text-rose-600 shrink-0" />;
  return <Minus className="w-4 h-4 text-slate-400 shrink-0" />;
}

export default async function ParentDashboardPage() {
  const student = await getCurrentStudent();
  if (!student) redirect('/parent/login');

  // ── Fetch classmates for class average ──
  const classmates = student.teacherId
    ? await db.student.findMany({
        where: { teacherId: student.teacherId, isActive: true, id: { not: student.id } },
        include: { grades: true },
      })
    : [];

  const classAverageByMonth: Record<string, number> = {};
  for (const month of MONTH_ORDER) {
    const scores = classmates
      .flatMap((c) => c.grades.filter((g) => g.month === month))
      .map((g) => (g.quran + g.azkar + g.nourAlbian + g.math + g.english) / 5);
    if (scores.length > 0) {
      classAverageByMonth[month] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  }

  // Sort grades chronologically
  const sortedGrades = [...student.grades].sort(
    (a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
  );

  const latestGrade = sortedGrades.length > 0 ? sortedGrades[sortedGrades.length - 1] : null;
  const prevGrade   = sortedGrades.length > 1 ? sortedGrades[sortedGrades.length - 2] : null;

  const latestAvg = latestGrade
    ? Math.round((latestGrade.quran + latestGrade.azkar + latestGrade.nourAlbian + latestGrade.math + latestGrade.english) / 5)
    : null;
  const prevAvg = prevGrade
    ? Math.round((prevGrade.quran + prevGrade.azkar + prevGrade.nourAlbian + prevGrade.math + prevGrade.english) / 5)
    : null;

  const classAvgLatest = latestGrade ? classAverageByMonth[latestGrade.month] : null;

  const imageUrl = resolveImageUrl(student.imageUrl, 'avatar') ?? resolveImageUrl(student.imageUrl, 'public');

  const handleSignOut = async () => {
    'use server';
    await logout();
    redirect('/parent/login');
  };

  const SUBJECTS = [
    { key: 'quran',      label: 'القرآن الكريم',      emoji: '📖', desc: 'الحفظ والتلاوة' },
    { key: 'azkar',      label: 'الأذكار والأحاديث',   emoji: '🤲', desc: 'التربية الإيمانية' },
    { key: 'nourAlbian', label: 'نور البيان',           emoji: '📝', desc: 'القراءة والهجاء' },
    { key: 'math',       label: 'الحساب والرياضيات',   emoji: '🔢', desc: 'الأرقام والعمليات' },
    { key: 'english',    label: 'اللغة الإنجليزية',    emoji: '🔤', desc: 'الحروف والكلمات' },
  ] as const;

  // Financial Wallet Computations
  const paidAmount = student.paidAmount || 0;
  const remainingAmount = student.remainingAmount || 0;
  const requiredAmount = paidAmount + remainingAmount;

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-slate-50">

      {/* ── TOP HEADER ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center overflow-hidden p-1 shadow-sm">
              <Image
                src="/logo.png"
                alt="رياض القرآن"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-sm text-emerald-950 block leading-tight">بوابة اولياء الأمور والطفل</span>
              <span className="text-[10px] text-amber-700 font-bold block">جمعية رياض القرآن الكريم</span>
            </div>
          </div>

          <ParentHeaderActions
            studentName={student.name}
            sequence={student.sequence}
            handleSignOut={handleSignOut}
          />
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">

        {/* ── ROW 1: Student Profile & Financial Wallet ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-100 shadow-md bg-emerald-50 flex items-center justify-center">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-5xl">👶</span>
                )}
              </div>
              {latestAvg !== null && latestAvg >= 85 && (
                <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{student.name}</h2>
              <span className="inline-block mt-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-900 rounded-xl text-xs font-black border border-emerald-200">
                كود الطالب: {student.sequence}
              </span>
            </div>

            <div className="w-full space-y-3 border-t border-slate-100 pt-4 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <BookOpen className="w-4 h-4 text-emerald-700" /> المستوى
                </span>
                <span className="font-black text-emerald-900">{student.category || 'KG1'}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <User className="w-4 h-4 text-emerald-700" /> المعلمة المسؤولة
                </span>
                <span className="font-black text-slate-900">{student.teacher?.name || 'غير محدد'}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-emerald-700" /> العمر
                </span>
                <span className="font-black text-slate-900">{student.age ? `${student.age} سنوات` : 'غير محدد'}</span>
              </div>

              {student.phone && (
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Phone className="w-4 h-4 text-emerald-700" /> رقم المحمول
                  </span>
                  <span className="font-mono font-black text-slate-900">{student.phone}</span>
                </div>
              )}

              {student.address && (
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl">
                  <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-700" /> العنوان
                  </span>
                  <span className="font-semibold text-slate-800 text-left truncate max-w-[150px]">{student.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Wallet Card (المحفظة المالية لولي الأمر) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-2xl">
                    <Wallet className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">المحفظة المالية للطفل</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">متابعة المصروفات والمدفوعات بالإدارة</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 py-1 px-3 rounded-xl font-bold">
                  سداد الإدارة
                </span>
              </div>

              {/* 3 Columns Wallet Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                
                {/* 1. Required Fees */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">المصروفات المقررة</span>
                  <p className="text-2xl font-black text-slate-900">
                    {requiredAmount === 0 ? '0' : requiredAmount.toLocaleString('ar-EG')}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block">جنيه مصري</span>
                </div>

                {/* 2. Paid Amount */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 block">المبلغ المسدد بالإدارة</span>
                  <p className="text-2xl font-black text-emerald-700">
                    {paidAmount.toLocaleString('ar-EG')}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold block">جنيه مصري</span>
                </div>

                {/* 3. Wallet Balance Status */}
                <div className={`rounded-2xl p-4 text-center space-y-1 border ${
                  remainingAmount > 0 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : remainingAmount < 0 
                    ? 'bg-blue-50 border-blue-200 text-blue-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <span className="text-[11px] font-bold block">
                    {remainingAmount > 0 ? 'المتبقي مستحق السداد' : remainingAmount < 0 ? 'رصيد دائن في المحفظة' : 'رصيد الحساب'}
                  </span>
                  <p className="text-2xl font-black">
                    {Math.abs(remainingAmount).toLocaleString('ar-EG')}
                  </p>
                  <span className="text-[10px] font-bold block">جنيه مصري</span>
                </div>

              </div>

              {/* Status Banner */}
              <div className="mt-5">
                {requiredAmount === 0 ? (
                  <div className="bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-300 rounded-2xl p-4 flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-amber-950">إعفاء خيري كامل — رعاية الجمعية 🎁</h4>
                      <p className="text-[11px] text-amber-900/80 font-bold mt-0.5">الطفل متمتع برعاية ودعم جمعية رياض القرآن بدون أي رسوم مالية.</p>
                    </div>
                  </div>
                ) : remainingAmount > 0 ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-rose-950">مستحق السداد: {remainingAmount} جنيه مصري ⚠️</h4>
                      <p className="text-[11px] text-rose-800 font-bold mt-0.5">يرجى التوجه إلى إدارة الحضانة لسداد الرسوم المتبقية أو التواصل معنا.</p>
                    </div>
                  </div>
                ) : remainingAmount < 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-blue-950">يوجد رصيد فائض بمحفظتك (+{Math.abs(remainingAmount)} ج.م) 💙</h4>
                      <p className="text-[11px] text-blue-800 font-bold mt-0.5">تم تسديد مبلغ إضافي ومسجل كرصيد مسبق للأشهر القادمة.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-emerald-950">الرسوم مسددة بالكامل — خالص الحساب ✨</h4>
                      <p className="text-[11px] text-emerald-800 font-bold mt-0.5">نشكركم على التزامكم وسداد كافة المستحقات المقررة.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Wallet Details Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <span>طريقة الدفع المسجلة:</span>
                <span className="px-3 py-1 bg-slate-100 rounded-xl text-slate-800 font-black">
                  {student.paidWay || 'كاش بالإدارة'}
                </span>
              </div>
              {student.notes && (
                <div className="text-slate-600 font-semibold text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 max-w-md">
                  <span className="font-bold text-emerald-900">ملاحظة الحساب: </span>{student.notes}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── ROW 2: Subject Performance Breakdown (تقرير المواد المفصل) ── */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">تقرير درجات اختبارات المواد</h3>
                <p className="text-[11px] text-slate-400 font-semibold">
                  {latestGrade ? `نتائج شهر ${MONTH_NAMES[latestGrade.month] || latestGrade.month} (من 100 لكل مادة)` : 'لا توجد درجات مسجلة حتى الآن'}
                </p>
              </div>
            </div>

            {latestAvg !== null && (
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">معدل التقييم العام</span>
                  <span className="text-xl font-black text-emerald-800">{latestAvg}%</span>
                </div>
                <span className={`px-3 py-1.5 rounded-2xl text-xs font-black border ${gradeLabel(latestAvg).color}`}>
                  {gradeLabel(latestAvg).text}
                </span>
              </div>
            )}
          </div>

          {/* Subject Cards */}
          {latestGrade ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
              {SUBJECTS.map(({ key, label, emoji, desc }) => {
                const score = (latestGrade[key as keyof typeof latestGrade] as number) || 0;
                const status = gradeLabel(score);
                return (
                  <div 
                    key={key} 
                    className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-5 space-y-4 transition-all shadow-sm hover:shadow-md text-center group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{emoji}</span>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${status.color}`}>
                        {score >= 85 ? 'ممتاز' : score >= 70 ? 'جيد جداً' : score >= 50 ? 'متوسط' : 'متابعة'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm leading-tight">{label}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{desc}</p>
                    </div>

                    <div className="pt-1">
                      <div className="text-3xl font-black text-slate-950">
                        {score}
                        <span className="text-xs font-bold text-slate-400 mr-1">/100</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-semibold">
              سيتم رصد درجات الاختبارات فور انتهاء التقييم الشهري للمعلمة.
            </div>
          )}

        </div>

        {/* ── ROW 3: Visual Performance Progress Chart ── */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
                <Sparkles className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-sm font-black text-slate-900">منحنى تطور الأداء والدرجات</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">مقارنة بمتوسط الفصل</span>
          </div>

          <StudentGradesChart grades={student.grades} classAverages={classAverageByMonth} />
        </div>

        {/* ── ROW 4: Full Chronological Grades Table ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-900">سجل الاختبارات والتقييمات التراكمي</h3>
              <p className="text-[11px] text-slate-400 font-bold">عرض درجات الطالب في كافة الأشهر الدراسية</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl">
              إجمالي الأشهر: {sortedGrades.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs" dir="rtl">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-black">
                <tr>
                  <th className="px-5 py-4 whitespace-nowrap">الشهر الدراسية</th>
                  {SUBJECTS.map((s) => (
                    <th key={s.key} className="px-4 py-4 whitespace-nowrap text-center">{s.label}</th>
                  ))}
                  <th className="px-4 py-4 whitespace-nowrap text-center">معدل الطالب</th>
                  <th className="px-4 py-4 whitespace-nowrap text-center">متوسط الفصل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-bold">
                {sortedGrades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400 font-semibold">
                      لا توجد درجات شهرية مسجلة حتى الآن.
                    </td>
                  </tr>
                ) : (
                  sortedGrades.map((grade, idx) => {
                    const avg = Math.round(
                      (grade.quran + grade.azkar + grade.nourAlbian + grade.math + grade.english) / 5
                    );
                    const prevG = idx > 0 ? sortedGrades[idx - 1] : null;
                    const prevA = prevG
                      ? Math.round((prevG.quran + prevG.azkar + prevG.nourAlbian + prevG.math + prevG.english) / 5)
                      : undefined;
                    const classAvg = classAverageByMonth[grade.month];

                    return (
                      <tr key={grade.id} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap font-black text-slate-900">
                          {MONTH_NAMES[grade.month] ?? `شهر ${grade.month}`}
                        </td>
                        {SUBJECTS.map(({ key }) => {
                          const v = (grade[key as keyof typeof grade] as number) || 0;
                          return (
                            <td key={key} className="px-4 py-4 whitespace-nowrap text-center">
                              <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${gradeLabel(v).color}`}>
                                {v}
                              </span>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-white font-black text-xs">
                            {trendIcon(avg, prevA)}
                            <span>{avg}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center font-black text-slate-600">
                          {classAvg !== undefined ? (
                            <span className={avg > classAvg ? 'text-emerald-700' : avg < classAvg ? 'text-rose-600' : 'text-slate-600'}>
                              {classAvg}%
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="object-contain" />
            <span>جمعية رياض القرآن الكريم — نظام متابعة الحضانة الإلكترونية</span>
          </div>
          <Link href="/" className="text-emerald-700 hover:underline font-black">
            الموقع الرئيسي للجمعية
          </Link>
        </div>
      </footer>
    </div>
  );
}

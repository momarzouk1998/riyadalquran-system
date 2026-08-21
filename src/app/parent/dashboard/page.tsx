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
  CheckCircle2, AlertCircle, ChevronRight, Home
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

function gradeClass(score: number) {
  if (score >= 85) return 'grade-excellent';
  if (score >= 60) return 'grade-good';
  return 'grade-weak';
}

function trendIcon(curr: number, prev: number | undefined) {
  if (prev === undefined) return null;
  const diff = curr - prev;
  if (diff > 3)  return <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />;
  if (diff < -3) return <TrendingDown  className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

export default async function ParentDashboardPage() {
  const student = await getCurrentStudent();
  if (!student) redirect('/parent/login');

  // ── Fetch class average for comparison ──
  const classmates = student.teacherId
    ? await db.student.findMany({
        where: { teacherId: student.teacherId, isActive: true, id: { not: student.id } },
        include: { grades: true },
      })
    : [];

  // Build per-month class averages
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
    { key: 'quran',      label: 'القرآن الكريم',      emoji: '📖' },
    { key: 'azkar',      label: 'الأذكار والأحاديث',   emoji: '🤲' },
    { key: 'nourAlbian', label: 'نور البيان',           emoji: '📝' },
    { key: 'math',       label: 'الحساب',              emoji: '🔢' },
    { key: 'english',    label: 'الإنجليزي',           emoji: '🔤' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col font-cairo" style={{ backgroundColor: '#fafaf7' }}>

      {/* ── TOP NAV ── */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="رياض القرآن"
              width={36}
              height={36}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-black text-sm text-emerald-900 block leading-none">بوابة أولياء الأمور</span>
              <span className="text-[10px] text-amber-700 font-semibold">رياض القرآن الكريم</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> الرئيسية
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">{student.name.split(' ')[0]}</span>
          </div>

          <ParentHeaderActions
            studentName={student.name}
            sequence={student.sequence}
            handleSignOut={handleSignOut}
          />
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 space-y-6">

        {/* ── ROW 1: Profile + Finance + Quick metrics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Profile card */}
          <div className="card p-6 flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-emerald-50 flex items-center justify-center">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-4xl">👶</span>
                )}
              </div>
              {latestAvg !== null && latestAvg >= 85 && (
                <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-black text-emerald-900">{student.name}</h2>
              <span className="badge badge-green mt-1">كود: {student.sequence}</span>
            </div>

            {/* Info rows */}
            <div className="w-full space-y-2.5 border-t border-slate-100 pt-4 text-xs">
              {[
                { icon: BookOpen, label: 'المستوى',        value: student.category || 'غير محدد' },
                { icon: User,     label: 'المعلمة',        value: student.teacher?.name || 'غير محدد' },
                { icon: Calendar, label: 'العمر',          value: student.age ? `${student.age} سنوات` : 'غير محدد' },
                ...(student.phone ? [{ icon: Phone, label: 'هاتف ولي الأمر', value: student.phone }] : []),
                ...(student.address ? [{ icon: MapPin, label: 'العنوان', value: student.address }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 flex items-center gap-1 shrink-0">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </span>
                  <span className="font-semibold text-slate-800 text-left truncate max-w-[140px]">{value}</span>
                </div>
              ))}
              {student.startDate && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> الالتحاق
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(student.startDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Finance + class info */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Finance card */}
            <div className="card p-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                الموقف المالي
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">المدفوع</p>
                  <p className="text-xl font-black text-emerald-700">{student.paidAmount.toLocaleString('ar-EG')}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">جنيه</p>
                </div>
                <div className={`rounded-xl p-3 text-center border ${student.remainingAmount > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-[10px] text-slate-500 font-bold mb-1">المتبقي</p>
                  <p className={`text-xl font-black ${student.remainingAmount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {student.remainingAmount.toLocaleString('ar-EG')}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">جنيه</p>
                </div>
              </div>

              {student.remainingAmount > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>يوجد رصيد متبقي. يرجى التواصل مع الجمعية لسداد الرسوم.</span>
                </div>
              )}
              {student.remainingAmount === 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>الرسوم مسددة بالكامل — شكراً لكم!</span>
                </div>
              )}

              <div className="text-xs space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">طريقة السداد</span>
                  <span className="font-semibold text-slate-700">{student.paidWay || 'غير محدد'}</span>
                </div>
                {student.notes && (
                  <div className="text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed mt-1">
                    <span className="font-bold text-slate-600">ملاحظة: </span>{student.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Performance snapshot */}
            <div className="card p-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Award className="w-4 h-4 text-amber-500" />
                لمحة الأداء
              </h3>

              {latestGrade && latestAvg !== null ? (
                <div className="space-y-4">
                  {/* Big average */}
                  <div className="text-center py-2">
                    <div className={`text-4xl font-black ${latestAvg >= 85 ? 'text-emerald-600' : latestAvg >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {latestAvg}%
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      معدل {MONTH_NAMES[latestGrade.month]}
                    </p>
                  </div>

                  {/* vs class avg */}
                  {classAvgLatest !== null && (
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>متوسط الفصل</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-700">{classAvgLatest}%</span>
                        {latestAvg > classAvgLatest ? (
                          <span className="badge badge-green text-[9px]">أعلى من الفصل</span>
                        ) : latestAvg < classAvgLatest ? (
                          <span className="bg-red-50 text-red-700 border-red-200 badge text-[9px]">أقل من الفصل</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border-slate-200 badge text-[9px]">مساوٍ للفصل</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trend vs prev month */}
                  {prevAvg !== null && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 rounded-xl p-3">
                      <span className="text-slate-500">مقارنة بـ {MONTH_NAMES[prevGrade!.month]}</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        {trendIcon(latestAvg, prevAvg)}
                        <span className={latestAvg > prevAvg ? 'text-emerald-600' : latestAvg < prevAvg ? 'text-red-600' : 'text-slate-500'}>
                          {latestAvg > prevAvg ? `+${latestAvg - prevAvg}` : latestAvg - prevAvg} نقطة
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status label */}
                  <div className={`rounded-xl py-2 px-3 text-center text-xs font-bold ${
                    latestAvg >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    latestAvg >= 70 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    latestAvg >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {latestAvg >= 85 ? '🌟 ممتاز ومتميز' :
                     latestAvg >= 70 ? '👍 جيد جداً' :
                     latestAvg >= 50 ? '📚 يحتاج مراجعة' :
                     '⚠️ يحتاج اهتمام خاص'}
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-slate-300 text-sm">
                  لا توجد درجات مسجلة بعد
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ROW 2: Latest month subject breakdown ── */}
        {latestGrade && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-900">
                درجات {MONTH_NAMES[latestGrade.month]} — مادة بمادة
              </h3>
              <span className="badge badge-gold">آخر اختبار</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {SUBJECTS.map(({ key, label, emoji }) => {
                const score = latestGrade[key as keyof typeof latestGrade] as number;
                const pct   = Math.min(100, Math.max(0, score));
                return (
                  <div key={key} className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100 text-center">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold leading-tight">{label}</p>
                      <p className={`text-2xl font-black mt-1 ${score >= 85 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {score}
                      </p>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${score >= 85 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`grade-pill text-[9px] ${gradeClass(score)}`}>
                      {score >= 85 ? 'ممتاز' : score >= 60 ? 'جيد' : 'ضعيف'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ROW 3: Chart ── */}
        <div className="card p-6">
          <StudentGradesChart grades={student.grades} classAverages={classAverageByMonth} />
        </div>

        {/* ── ROW 4: Full grades table ── */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-900">سجل الدرجات الكامل</h3>
            <p className="text-xs text-slate-400">الدرجة العظمى 100 لكل مادة</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs" dir="rtl">
              <thead className="table-header border-b border-slate-100 text-slate-500 font-bold">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">الشهر</th>
                  {SUBJECTS.map((s) => (
                    <th key={s.key} className="px-3 py-3 whitespace-nowrap">{s.label}</th>
                  ))}
                  <th className="px-3 py-3 whitespace-nowrap text-center">المعدل</th>
                  <th className="px-3 py-3 whitespace-nowrap text-center">متوسط الفصل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {sortedGrades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-300">
                      لا توجد درجات مسجلة حتى الآن
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
                      <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                          {MONTH_NAMES[grade.month] ?? `شهر ${grade.month}`}
                        </td>
                        {SUBJECTS.map(({ key }) => {
                          const v = grade[key as keyof typeof grade] as number;
                          return (
                            <td key={key} className="px-3 py-3.5 whitespace-nowrap">
                              <span className={`grade-pill ${gradeClass(v)}`}>{v}</span>
                            </td>
                          );
                        })}
                        <td className="px-3 py-3.5 whitespace-nowrap text-center">
                          <div className="inline-flex items-center gap-1">
                            {trendIcon(avg, prevA)}
                            <span className={`grade-pill ${gradeClass(avg)}`}>{avg}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap text-center text-slate-500 font-semibold">
                          {classAvg !== undefined ? (
                            <span className={avg > classAvg ? 'text-emerald-600' : avg < classAvg ? 'text-red-500' : 'text-slate-500'}>
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
      <footer className="mt-auto border-t border-emerald-100 bg-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="object-contain" />
            <span>رياض القرآن الكريم — بوابة أولياء الأمور</span>
          </div>
          <Link href="/" className="text-emerald-600 hover:underline font-semibold">
            الموقع الرئيسي
          </Link>
        </div>
      </footer>
    </div>
  );
}

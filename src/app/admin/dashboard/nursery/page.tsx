import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { resolveImageUrl } from '@/lib/cloudflare';
import {
  Users, BookOpen, Baby, TrendingUp, AlertCircle,
  ExternalLink, Edit, Phone, CreditCard, Award
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  'تمهيدي': { label: 'تمهيدي',       color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  'KG1':    { label: 'KG1',          color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  'KG2':    { label: 'KG2',          color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200',dot: 'bg-emerald-500'},
  'خاتمة': { label: 'خاتمة القرآن', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
};

function gradeColor(avg: number) {
  if (avg >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (avg >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

export default async function AdminNurseryPage() {
  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      students: {
        where: { isActive: true },
        orderBy: { sequence: 'asc' },
        include: { grades: true },
      },
    },
  });

  // Aggregate stats
  const allStudents = teachers.flatMap((t) => t.students);
  const totalStudents = allStudents.length;
  const withDebt = allStudents.filter((s) => s.remainingAmount > 0).length;
  const categoryCounts = allStudents.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category || 'غير محدد';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Overall average across all students with grades
  const allAvgs = allStudents
    .map((s) => {
      if (!s.grades.length) return null;
      const latest = [...s.grades].sort((a, b) => {
        const ord = ['9','10','11','12','2','3','4','5'];
        return ord.indexOf(b.month) - ord.indexOf(a.month);
      })[0];
      return Math.round((latest.quran + latest.azkar + latest.nourAlbian + latest.math + latest.english) / 5);
    })
    .filter((v): v is number => v !== null);
  const overallAvg = allAvgs.length
    ? Math.round(allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length)
    : null;

  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-emerald-900">تاب الحضانة — نظرة إدارية</h1>
          <p className="text-slate-500 text-sm mt-1">
            الفصول مرتبة حسب المعلمة مع بيانات الطلاب والأداء والمالية
          </p>
        </div>
        <Link
          href="/nursery"
          target="_blank"
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          عرض الصفحة العامة للأهالي
        </Link>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{totalStudents}</p>
            <p className="text-xs text-slate-500 font-semibold">طالب نشط</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{teachers.length}</p>
            <p className="text-xs text-slate-500 font-semibold">معلمة بالخدمة</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${withDebt > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-2xl font-black ${withDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{withDebt}</p>
            <p className="text-xs text-slate-500 font-semibold">رصيد متبقٍ</p>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{overallAvg ?? '—'}{overallAvg ? '%' : ''}</p>
            <p className="text-xs text-slate-500 font-semibold">متوسط الأداء العام</p>
          </div>
        </div>
      </div>

      {/* ── LEVELS BAR ── */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-slate-700 mb-4">توزيع الطلاب حسب المستوى</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const count = categoryCounts[key] ?? 0;
            const pct   = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
            return (
              <div key={key} className={`rounded-xl border ${meta.border} ${meta.bg} p-4 space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
                  <span className={`text-lg font-black ${meta.color}`}>{count}</span>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full ${meta.dot} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className={`text-[10px] ${meta.color} font-semibold`}>{pct}% من الإجمالي</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CLASSROOM CARDS ── */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-700">الفصول الدراسية</h2>

        {teachers.length === 0 ? (
          <div className="card p-12 text-center text-slate-400 space-y-3">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">لا توجد معلمات مسجلة بعد</p>
            <Link href="/admin/dashboard/teachers" className="text-xs text-emerald-700 font-bold hover:underline">
              إضافة معلمة جديدة
            </Link>
          </div>
        ) : (
          teachers.map((teacher) => {
            const byCategory = teacher.students.reduce<Record<string, typeof teacher.students>>((acc, s) => {
              const cat = s.category || 'غير محدد';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(s);
              return acc;
            }, {});

            // Teacher-level stats
            const teacherAvgs = teacher.students
              .map((s) => {
                if (!s.grades.length) return null;
                const latest = [...s.grades].sort((a, b) => {
                  const ord = ['9','10','11','12','2','3','4','5'];
                  return ord.indexOf(b.month) - ord.indexOf(a.month);
                })[0];
                return Math.round((latest.quran + latest.azkar + latest.nourAlbian + latest.math + latest.english) / 5);
              })
              .filter((v): v is number => v !== null);
            const teacherAvg = teacherAvgs.length
              ? Math.round(teacherAvgs.reduce((a, b) => a + b, 0) / teacherAvgs.length)
              : null;
            const teacherDebt = teacher.students.filter((s) => s.remainingAmount > 0).length;

            return (
              <div key={teacher.id} className="classroom-card overflow-hidden">
                {/* Teacher header */}
                <div className="bg-gradient-to-l from-emerald-800 to-emerald-950 px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shrink-0">
                        👩‍🏫
                      </div>
                      <div>
                        <h3 className="font-black text-white text-base">{teacher.name}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          {teacher.phone && (
                            <span className="flex items-center gap-1 text-emerald-300 text-xs">
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{teacher.phone}</span>
                            </span>
                          )}
                          <Link
                            href={`/admin/dashboard/teachers`}
                            className="flex items-center gap-1 text-emerald-300 hover:text-white text-xs transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            تعديل
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Teacher quick stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xl font-black text-amber-300">{teacher.students.length}</div>
                        <div className="text-emerald-300 text-[10px]">طالب</div>
                      </div>
                      {teacherAvg !== null && (
                        <div className="text-center">
                          <div className={`text-xl font-black ${teacherAvg >= 75 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {teacherAvg}%
                          </div>
                          <div className="text-emerald-300 text-[10px]">متوسط الأداء</div>
                        </div>
                      )}
                      {teacherDebt > 0 && (
                        <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-1.5 text-xs text-red-300 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {teacherDebt} رصيد متبقٍ
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Students by category */}
                <div className="p-5 space-y-6">
                  {teacher.students.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-6">
                      لا يوجد طلاب مسجلون في هذا الفصل
                    </p>
                  ) : (
                    Object.entries(byCategory).map(([category, students]) => {
                      const meta = CATEGORY_META[category];
                      return (
                        <div key={category} className="space-y-3">
                          {/* Category header */}
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${meta?.dot ?? 'bg-slate-400'}`} />
                            <span className={`badge ${meta ? `${meta.bg} ${meta.color} ${meta.border}` : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {meta?.label ?? category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{students.length} طالب</span>
                          </div>

                          {/* Student table */}
                          <div className="rounded-xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-right text-xs" dir="rtl">
                              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                                <tr>
                                  <th className="px-4 py-2.5 whitespace-nowrap">الطالب</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap">الكود</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap">العمر</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap">الهاتف</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap text-center">آخر أداء</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap text-center">المدفوع</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap text-center">المتبقي</th>
                                  <th className="px-3 py-2.5 whitespace-nowrap text-center">إجراء</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50 text-slate-700">
                                {students.map((student) => {
                                  const imgUrl = resolveImageUrl(student.imageUrl, 'thumbnail');
                                  const latestGrade = student.grades.length
                                    ? [...student.grades].sort((a, b) => {
                                        const ord = ['9','10','11','12','2','3','4','5'];
                                        return ord.indexOf(b.month) - ord.indexOf(a.month);
                                      })[0]
                                    : null;
                                  const avg = latestGrade
                                    ? Math.round((latestGrade.quran + latestGrade.azkar + latestGrade.nourAlbian + latestGrade.math + latestGrade.english) / 5)
                                    : null;

                                  return (
                                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                                      {/* Name + avatar */}
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base shrink-0">
                                            {imgUrl ? (
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img
                                                src={imgUrl}
                                                alt={student.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                              />
                                            ) : '👶'}
                                          </div>
                                          <span className="font-semibold text-slate-800 max-w-[120px] truncate">
                                            {student.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap font-mono text-slate-600">
                                        {student.sequence}
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                                        {student.age ? `${student.age} سنوات` : '—'}
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap text-slate-500" dir="ltr">
                                        {student.phone ?? '—'}
                                      </td>
                                      {/* Latest grade avg */}
                                      <td className="px-3 py-3 whitespace-nowrap text-center">
                                        {avg !== null ? (
                                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${gradeColor(avg)}`}>
                                            {avg}%
                                          </span>
                                        ) : (
                                          <span className="text-slate-300 text-[11px]">—</span>
                                        )}
                                      </td>
                                      {/* Finance */}
                                      <td className="px-3 py-3 whitespace-nowrap text-center font-bold text-emerald-600">
                                        {student.paidAmount.toLocaleString('ar-EG')}
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap text-center">
                                        {student.remainingAmount > 0 ? (
                                          <span className="font-bold text-red-600 flex items-center justify-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {student.remainingAmount.toLocaleString('ar-EG')}
                                          </span>
                                        ) : (
                                          <span className="text-emerald-500 font-bold text-[11px]">✓ مسدد</span>
                                        )}
                                      </td>
                                      {/* Actions */}
                                      <td className="px-3 py-3 whitespace-nowrap text-center">
                                        <Link
                                          href="/admin/dashboard/students"
                                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-bold transition-colors"
                                        >
                                          <Edit className="w-3 h-3" />
                                          تعديل
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Classroom footer */}
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 flex items-center justify-between">
                  <p className="text-[10px] text-slate-400">
                    إجمالي الرسوم المحصلة:{' '}
                    <strong className="text-emerald-700">
                      {teacher.students.reduce((s, st) => s + st.paidAmount, 0).toLocaleString('ar-EG')} جنيه
                    </strong>
                    {' — '}
                    المتبقي:{' '}
                    <strong className={teacher.students.some(s => s.remainingAmount > 0) ? 'text-red-600' : 'text-slate-400'}>
                      {teacher.students.reduce((s, st) => s + st.remainingAmount, 0).toLocaleString('ar-EG')} جنيه
                    </strong>
                  </p>
                  <Link
                    href="/admin/dashboard/students"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    إدارة الطلاب
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

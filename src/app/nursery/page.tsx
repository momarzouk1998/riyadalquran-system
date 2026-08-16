import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  Users, ArrowRight, BookOpen, Baby, GraduationCap,
  LogIn, MapPin, Phone, Star, ChevronLeft
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Category display config
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'تمهيدي': { label: 'تمهيدي', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  'KG1':    { label: 'KG1 — الأول', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  'KG2':    { label: 'KG2 — الثاني', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'خاتمة': { label: 'خاتمة القرآن', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export default async function NurseryPage() {
  // Fetch all active teachers with their students
  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      students: {
        where: { isActive: true },
        orderBy: { sequence: 'asc' },
        select: {
          id: true,
          name: true,
          sequence: true,
          category: true,
          age: true,
          imageUrl: true,
          remainingAmount: true,
        },
      },
    },
  });

  // Aggregate stats
  const totalStudents = teachers.reduce((sum, t) => sum + t.students.length, 0);
  const categoryCounts = teachers
    .flatMap((t) => t.students)
    .reduce<Record<string, number>>((acc, s) => {
      const cat = s.category || 'غير محدد';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  return (
    <div className="min-h-screen flex flex-col font-cairo" style={{ backgroundColor: '#fafaf7' }}>

      {/* ── NAV ── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/RiyadAlquran Logo.png"
              alt="رياض القرآن"
              width={38}
              height={38}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-black text-sm text-emerald-900 leading-none block">رياض القرآن الكريم</span>
              <span className="text-[10px] text-amber-700 font-semibold">تاب الحضانة</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/parent/login"
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>بوابة الأهالي</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              الرئيسية
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-gradient pattern-islamic relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: '#fafaf7', borderRadius: '100% 100% 0 0 / 48px 48px 0 0' }}
        />
        <div className="max-w-5xl mx-auto px-4 pt-12 pb-20 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-amber-200 text-xs font-semibold">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            حضانة رياض القرآن الكريم — المنشأة الكبرى
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            فصولنا ومعلماتنا
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
            تعرف على الفصول الدراسية ومعلماتنا المتخصصات،
            وسجّل طفلك أو ادخل لبوابتك كولي أمر لمتابعة مسيرته.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl">{totalStudents}</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">طالب مسجّل</div>
            </div>
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl">{teachers.length}</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">معلمة متخصصة</div>
            </div>
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl">{Object.keys(categoryCounts).length}</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">مستوى دراسي</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEVELS OVERVIEW ── */}
      <section className="max-w-6xl w-full mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <div key={key} className={`rounded-2xl border ${meta.border} ${meta.bg} p-4 text-center space-y-1`}>
              <div className={`text-xl font-black ${meta.color}`}>
                {categoryCounts[key] ?? 0}
              </div>
              <div className={`text-xs font-bold ${meta.color}`}>{meta.label}</div>
              <div className="text-[10px] text-slate-500">طالب</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEACHER CLASSROOMS ── */}
      <section className="max-w-6xl w-full mx-auto px-4 pb-16 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-emerald-900">الفصول والمعلمات</h2>
            <p className="text-slate-500 text-xs mt-0.5">كل فصل مرتب حسب المعلمة المسؤولة</p>
          </div>
          <Link
            href="/parent/login"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <span>دخول بوابة الأهالي</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {teachers.length === 0 ? (
          <div className="card p-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">لا توجد بيانات فصول مسجلة حتى الآن.</p>
          </div>
        ) : (
          teachers.map((teacher) => {
            // Group students by category within this teacher's class
            const byCategory = teacher.students.reduce<Record<string, typeof teacher.students>>((acc, s) => {
              const cat = s.category || 'غير محدد';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(s);
              return acc;
            }, {});

            return (
              <div key={teacher.id} className="classroom-card">
                {/* Teacher Header */}
                <div className="bg-gradient-to-l from-emerald-700 to-emerald-900 px-6 py-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Teacher avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl shrink-0">
                      👩‍🏫
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">{teacher.name}</h3>
                      <p className="text-emerald-200 text-xs mt-0.5">
                        {teacher.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{teacher.phone}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-amber-300">{teacher.students.length}</div>
                    <div className="text-emerald-200 text-[10px] font-semibold">طالب</div>
                  </div>
                </div>

                {/* Students by category */}
                <div className="p-5 space-y-5">
                  {teacher.students.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">لا يوجد طلاب في هذا الفصل</p>
                  ) : (
                    Object.entries(byCategory).map(([category, students]) => {
                      const meta = CATEGORY_META[category];
                      return (
                        <div key={category} className="space-y-3">
                          {/* Category label */}
                          <div className="flex items-center gap-2">
                            <span className={`badge ${meta ? `${meta.bg} ${meta.color} ${meta.border}` : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {meta?.label || category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{students.length} طالب</span>
                          </div>

                          {/* Student cards */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {students.map((student) => (
                              <div
                                key={student.id}
                                className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center space-y-2 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group"
                              >
                                {/* Avatar */}
                                <div className="relative mx-auto w-12 h-12">
                                  {student.imageUrl ? (
                                    <img
                                      src={student.imageUrl}
                                      alt={student.name}
                                      className="student-avatar w-12 h-12 mx-auto"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="student-avatar w-12 h-12 mx-auto flex items-center justify-center text-xl bg-emerald-100 text-emerald-700 border-emerald-200">
                                      👶
                                    </div>
                                  )}
                                </div>

                                {/* Name */}
                                <div>
                                  <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                                    {student.name.split(' ').slice(0, 2).join(' ')}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">#{student.sequence}</p>
                                </div>

                                {/* Age badge */}
                                {student.age && (
                                  <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                                    {student.age} سنوات
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer action */}
                <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center justify-end">
                  <Link
                    href="/parent/login"
                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    متابعة درجات طفلك
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── CTA REGISTER BAND ── */}
      <section className="bg-gradient-to-l from-emerald-800 to-emerald-950 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-black text-white">سجّل طفلك معنا اليوم</h2>
          <p className="text-emerald-200 text-sm">
            أماكن محدودة في كل فصل — أرسل طلب التسجيل الآن ويتواصل معك فريقنا خلال ٢٤ ساعة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/#booking-form" className="btn-gold text-sm flex items-center gap-2">
              <Baby className="w-4 h-4" />
              احجز مقعد طفلك
            </Link>
            <Link href="/parent/login" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-5 rounded-xl font-bold text-sm transition-all">
              <LogIn className="w-4 h-4" />
              بوابة أولياء الأمور
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER MINI ── */}
      <footer className="bg-emerald-950 text-emerald-400 py-6 px-4 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Image src="/RiyadAlquran Logo.png" alt="" width={28} height={28} className="object-contain" />
            <span className="text-white font-bold">رياض القرآن الكريم</span>
            <span className="text-emerald-500">— المشهرة برقم ١٣٠٠</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-500">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href="/parent/login" className="hover:text-white transition-colors">بوابة الأهالي</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">الإدارة</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

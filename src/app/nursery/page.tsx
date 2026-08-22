import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  Users, ArrowRight, BookOpen, Baby, GraduationCap, UserCheck,
  LogIn, MapPin, Phone, Star, ChevronLeft, Award, Sparkles, CheckCircle2, HeartHandshake, ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Category display config
const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'تمهيدي': { label: 'تمهيدي (2.5 - 3.5 سنة)', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  'KG1':    { label: 'KG1 — المستوى الأول', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  'KG2':    { label: 'KG2 — المستوى الثاني (نور البيان)', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'خاتمة': { label: 'ختم المصحف والتجويد', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
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
          ageText: true,
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
              src="/logo.png"
              alt="رياض القرآن"
              width={38}
              height={38}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-black text-sm text-emerald-900 leading-none block">رياض القرآن الكريم</span>
              <span className="text-[10px] text-amber-700 font-semibold">بوابة حضانة الأطفال</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/teacher/login"
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/20"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>دخول المعلمات</span>
            </Link>
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
            حضانة رياض القرآن الكريم — المنشأة الكبرى (5 فصول تعليمية)
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            بناء جيل القرآن وتأسيس المناهج التعليمية
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            منهاج إسلامي وتربوي شامل بطريقة نور البيان والفتح الرباني. نأخذ بيد طفلك من مسك القلم والتلوين وحتى ختم القرآن الكريم تلاوة وتجويداً قبل المدرسة.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl font-black text-white">5 فصول</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">طاقة 30 طالب للفصل</div>
            </div>
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl font-black text-amber-300">{totalStudents}</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">طالب مسجّل</div>
            </div>
            <div className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="stat-number text-2xl font-black text-white">{teachers.length}</div>
              <div className="text-emerald-100 text-[11px] mt-0.5 font-semibold">معلمة ومحفظة متأهلة</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMIC CURRICULUM & STAGES SECTION ── */}
      <section className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
            المنظومة الأكاديمية والتربوية
          </span>
          <h2 className="text-2xl font-black text-slate-900">المستويات والمناهج الدراسية بالحضانة</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">تدرج تعليمي مدروس يراعي سن الطفل ومراحل نموه الذهني والعقلي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Level 1: KG1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl font-bold border border-purple-200 shrink-0">
                👶
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">المستوى الأول — التأسيس والتهيئة (KG1)</h3>
                <p className="text-xs text-purple-700 font-bold mt-0.5">من سن سنتين ونصف إلى 3 سنوات ونصف</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>تدريب الطفل على مسك القلم والتحكم في عضلات اليد.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>تلوين الحروف والأرقام والتعرف التفاعلي على الأشكال.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>ساعة قرآن يومية مع محفظة متخصصة، وأذكار يومية مبسطة.</span>
              </li>
            </ul>
          </div>

          {/* Level 2: KG2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold border border-emerald-200 shrink-0">
                📖
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">المستوى الثاني — نور البيان والختمة (KG2)</h3>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">من سن 3 سنوات ونصف وحتى دخول المدرسة</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تعلم القراءة بطريقة <strong>نور البيان</strong> (فتح، كسر، ضم، تنوين، مدود).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>دراسة كتاب <strong>فتح الرحمن</strong> ثم الانتقال لكتاب <strong>الفتح الرباني</strong>.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>دراسة أحكام النون والميم الساكنة والتجويد والتلاوة المباشرة من المصحف الشريف.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>حساب ذهني يوم الخميس</strong>، سيرة نبوية، فقه، أذكار وقصص الأنبياء.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Supervision & Qualification Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 text-white space-y-3 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span>التأهيل الأكاديمي والرقابة الإشرافية المتخصصة</span>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            جميع معلمات الحضانة حاصلات على دورات تأهيلية معتمدة في منهج نور البيان، اللغة الإنجليزية، ووسائل التعليم الإلكتروني والكمبيوتر، مع تطبيق نظام التقييم وتطوير الأداء الدوري، وتحت إشراف ومتابعة أكاديمية مستمرة من نخبة من كبار المشايخ والمتخصصين.
          </p>
        </div>

        {/* Nursery Fees & Tuition Pricing Card */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 rounded-3xl p-6 border border-amber-300/40 text-center space-y-4">
          <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-3.5 py-1 rounded-full border border-amber-300 inline-block">
            خيارات سداد المصروفات والاشتراكات
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">الاشتراك الشهري</span>
              <p className="text-2xl font-black text-slate-900">250 ج.م <span className="text-xs text-slate-500 font-normal">/ شهرياً</span></p>
            </div>
            <div className="bg-emerald-900 text-white p-5 rounded-2xl border border-emerald-700 shadow-md space-y-1 relative overflow-hidden">
              <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full">خصم ترم كامل ✨</span>
              <span className="text-xs font-bold text-emerald-200">الاشتراك بالترم (5 أشهر)</span>
              <p className="text-2xl font-black text-amber-300">1000 ج.م <span className="text-xs text-emerald-200 font-normal">/ للترم (شهر مجاني)</span></p>
            </div>
          </div>
        </div>

      </section>

      {/* ── TEACHER CLASSROOMS LIST ── */}
      <section className="max-w-6xl w-full mx-auto px-4 pb-16 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-emerald-900">فصول الحضانة الخمسة ومعلماتها</h2>
            <p className="text-slate-500 text-xs mt-0.5">قائمة الطلاب المسجلين بكل فصل تحت إشراف معلمة الفصل</p>
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
                    <div className="text-emerald-200 text-[10px] font-semibold">طالب بالفصل</div>
                  </div>
                </div>

                {/* Students by category */}
                <div className="p-5 space-y-5">
                  {teacher.students.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4">لا يوجد طلاب في هذا الفصل حالياً</p>
                  ) : (
                    Object.entries(byCategory).map(([category, students]) => {
                      const meta = CATEGORY_META[category];
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`badge ${meta ? `${meta.bg} ${meta.color} ${meta.border}` : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {meta?.label || category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{students.length} طالب</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {students.map((student) => (
                              <div
                                key={student.id}
                                className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-center space-y-2 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group"
                              >
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

                                <div>
                                  <p className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                                    {student.name.split(' ').slice(0, 2).join(' ')}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">#{student.sequence}</p>
                                </div>

                                {student.ageText ? (
                                  <span className="text-[9px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full block truncate">
                                    {student.ageText}
                                  </span>
                                ) : student.age ? (
                                  <span className="text-[9px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full block">
                                    {student.age} سنوات
                                  </span>
                                ) : null}
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

      {/* ── FOOTER MINI ── */}
      <footer className="bg-emerald-950 text-emerald-400 py-6 px-4 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={28} height={28} className="object-contain" />
            <span className="text-white font-bold">رياض القرآن الكريم</span>
            <span className="text-emerald-500">— المشهرة برقم ١٣٠٠</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-500 font-bold">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href="/teacher/login" className="hover:text-amber-300 transition-colors text-amber-400">بوابة المعلمات</Link>
            <Link href="/parent/login" className="hover:text-white transition-colors">بوابة الأهالي</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">الإدارة</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

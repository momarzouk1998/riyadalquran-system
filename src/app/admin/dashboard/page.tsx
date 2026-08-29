import React from 'react';
import Link from 'next/link';
import { db, ensureDatabaseTables } from '@/lib/db';
import { 
  Users, UserCheck, BookOpen, Clock, Heart, 
  HelpCircle, Activity, ArrowLeft 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await ensureDatabaseTables();

  // Fetch stats from Database
  const studentCount = await db.student.count();
  const teacherCount = await db.teacher.count();
  const pendingBookingCount = await db.nurseryBooking.count({
    where: { status: 'pending' },
  });
  const pendingRequestCount = await db.registrationRequest.count({
    where: { status: 'pending' },
  });

  const cards = [
    {
      title: 'إدارة الطلبة',
      desc: 'قائمة الطلاب، فصولهم، بيانات الاتصال، وإدخال درجاتهم.',
      emoji: '👶',
      link: '/admin/dashboard/students',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50',
    },
    {
      title: 'إدارة المعلمات',
      desc: 'قائمة معلمات الحضانة المسؤولة عن الفصول الدراسية.',
      emoji: '👩‍🏫',
      link: '/admin/dashboard/teachers',
      color: 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/50',
    },
    {
      title: 'تقييم المعلمات',
      desc: 'تقارير أداء المعلمات ودفاتر التحضير والالتزام.',
      emoji: '📊',
      link: '/admin/dashboard/assessments',
      color: 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100/50',
    },
    {
      title: 'طلبات حجز الحضانة',
      desc: `لديك (${pendingBookingCount}) طلبات معلقة بانتظار المراجعة.`,
      emoji: '📝',
      link: '/admin/dashboard/bookings',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100/50',
    },
    {
      title: 'كفالة الأيتام',
      desc: 'متابعة بيانات العائلات والأيتام المسجلين بالجمعية.',
      emoji: '🤝',
      link: '/admin/dashboard/orphans',
      color: 'bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100/50',
    },
    {
      title: 'الحالات المرضية',
      desc: 'إعانة الحالات الطبية والصحية ودعم العلاج الشهري.',
      emoji: '🩺',
      link: '/admin/dashboard/medical',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-100 hover:bg-cyan-100/50',
    },
    {
      title: 'إدارة المديرين والمشرفين',
      desc: 'إضافة حسابات مديرين جُدد، تغيير الصلاحيات وكلمات المرور.',
      emoji: '👑',
      link: '/admin/dashboard/admins',
      color: 'bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100/50',
    },
    {
      title: 'الحالات الفقيرة',
      desc: 'مساعدات الأسر غير القادرة وتوزيع الملابس والمستلزمات.',
      emoji: '💸',
      link: '/admin/dashboard/poor',
      color: 'bg-teal-50 text-teal-800 border-teal-100 hover:bg-teal-100/50',
    },
    {
      title: 'طلبات التسجيل الجديدة',
      desc: `لديك (${pendingRequestCount}) طلب معلق — فقيرة، أيتام، مرضية، وحضانة.`,
      emoji: '📋',
      link: '/admin/dashboard/requests',
      color: 'bg-lime-50 text-lime-800 border-lime-200 hover:bg-lime-100/50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          لوحة الإدارة والتحكم الرئيسية
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          متابعة أنشطة جمعية وحضانة رياض القرآن بالمنشأة الكبرى
        </p>
      </div>

      {/* Quick Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">إجمالي طلاب الحضانة</p>
            <p className="text-3xl font-black text-slate-800">{studentCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">المعلمات بالخدمة</p>
            <p className="text-3xl font-black text-slate-800">{teacherCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">طلبات الحجز المعلقة</p>
            <p className="text-3xl font-black text-slate-800">{pendingBookingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">طلبات التسجيل المعلقة</p>
            <p className="text-3xl font-black text-slate-800">{pendingRequestCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/* Grid of Section Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-700">أقسام ولوحات العمليات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link 
              key={card.title} 
              href={card.link}
              className={`card border p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${card.color}`}
            >
              <div className="space-y-3">
                <div className="text-3xl">{card.emoji}</div>
                <div>
                  <h3 className="font-bold text-slate-800">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold mt-6 select-none justify-end">
                <span>عرض التفاصيل</span>
                <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

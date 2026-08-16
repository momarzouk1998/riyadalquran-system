import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentStudent } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import { StudentGradesChart } from '@/components/StudentGradesChart';
import { 
  User, Calendar, BookOpen, CreditCard, LogOut, Phone, MapPin, 
  Award, TrendingUp, AlertCircle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ParentDashboardPage() {
  const student = await getCurrentStudent();

  if (!student) {
    redirect('/parent/login');
  }

  // Calculate average of the latest month grades
  const latestGrade = student.grades.length > 0 
    ? [...student.grades].sort((a, b) => {
        const order = ['9', '10', '11', '12', '2', '3', '4', '5'];
        return order.indexOf(b.month) - order.indexOf(a.month);
      })[0]
    : null;

  const latestAverage = latestGrade
    ? Math.round((latestGrade.quran + latestGrade.azkar + latestGrade.nourAlbian + latestGrade.math + latestGrade.english) / 5)
    : null;

  const handleSignOut = async () => {
    'use server';
    await logout();
    redirect('/parent/login');
  };

  const monthNames: Record<string, string> = {
    '9': 'شهر 9 (سبتمبر)',
    '10': 'شهر 10 (أكتوبر)',
    '11': 'شهر 11 (نوفمبر)',
    '12': 'شهر 12 (ديسمبر)',
    '2': 'شهر 2 (فبراير)',
    '3': 'شهر 3 (مارس)',
    '4': 'شهر 4 (أبريل)',
    '5': 'شهر 5 (مايو)',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-12">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-brand-primary flex items-center gap-2">
            <span>🕌</span> بوابة أولياء الأمور
          </span>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-colors text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column: Student Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-brand-primary/10 border-4 border-white shadow-md flex items-center justify-center text-5xl relative overflow-hidden">
              {student.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={student.imageUrl} 
                  alt={student.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    // Fallback to emoji if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                '👶'
              )}
            </div>
            
            <h2 className="text-lg font-bold text-slate-800 mt-4">{student.name}</h2>
            <div className="badge bg-brand-light text-brand-primary border-brand-primary/10 mt-1">
              كود الطالب: {student.sequence}
            </div>

            <div className="w-full border-t border-slate-100 mt-6 pt-4 space-y-3.5 text-right text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-slate-400" /> المستوى الدراسـي</span>
                <span className="font-semibold text-slate-800">{student.category || 'غير محدد'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> المعلمة المسؤولة</span>
                <span className="font-semibold text-slate-800">{student.teacher?.name || 'غير محدد'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> السـن</span>
                <span className="font-semibold text-slate-800">{student.age ? `${student.age} سنوات` : 'غير محدد'}</span>
              </div>
              {student.startDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> تاريخ الالتحاق</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(student.startDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
              {student.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> هاتف ولي الأمر</span>
                  <span className="font-semibold text-slate-800" dir="ltr">{student.phone}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> العنوان</span>
                  <span className="font-semibold text-slate-800 text-left max-w-[150px] truncate">{student.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Finance Card */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
              <CreditCard className="w-4 h-4 text-brand-primary" />
              <span>الموقف المالي للرسوم الدراسية</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-[10px] text-slate-500 font-semibold mb-1">المدفوع</p>
                <p className="text-lg font-black text-emerald-600">{student.paidAmount}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-[10px] text-slate-500 font-semibold mb-1">المتبقي</p>
                <p className="text-lg font-black text-rose-600">{student.remainingAmount}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">طريقة السداد:</span>
                <span className="font-bold text-slate-700">{student.paidWay || 'غير محدد'}</span>
              </div>
              {student.notes && (
                <div className="border-t border-slate-100 pt-2 text-slate-500">
                  <span className="font-semibold text-slate-700">ملاحظات الحساب: </span>
                  {student.notes}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Left Column: Grades and Performance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Metrics */}
          {latestGrade && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-4 flex items-center gap-4 bg-gradient-to-br from-brand-primary/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">معدل آخر اختبار ({monthNames[latestGrade.month]})</p>
                  <p className="text-xl font-bold text-slate-800">{latestAverage} / 100</p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-4 bg-gradient-to-br from-brand-secondary/10 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">حالة التقدم الدراسي</p>
                  <p className="text-base font-bold text-brand-primary">
                    {latestAverage && latestAverage >= 85 ? 'ممتاز ومتميز 🌟' : latestAverage && latestAverage >= 70 ? 'جيد جداً ومستمر بالتطور 👍' : 'يحتاج لمزيد من المراجعة والمتابعة'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recharts chart component */}
          <div className="card p-6">
            <StudentGradesChart grades={student.grades} />
          </div>

          {/* Grades Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">تفاصيل درجات الاختبارات</h3>
              <p className="text-xs text-slate-400">الدرجة العظمى لكل مادة: 100</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right table-auto" dir="rtl">
                <thead className="table-header border-b border-slate-100 text-slate-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">الاختبار</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">القرآن الكريم</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">الأذكار والأحاديث</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">نور البيان</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">الحساب</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold">الإنجليزي</th>
                    <th className="px-4 py-3 whitespace-nowrap font-bold text-center">المعدل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {student.grades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        لا توجد درجات مسجلة بعد.
                      </td>
                    </tr>
                  ) : (
                    student.grades.map((grade) => {
                      const avg = Math.round((grade.quran + grade.azkar + grade.nourAlbian + grade.math + grade.english) / 5);
                      return (
                        <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                            {monthNames[grade.month] || `شهر ${grade.month}`}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${grade.quran >= 85 ? 'text-emerald-600' : grade.quran < 50 ? 'text-red-500 font-bold' : ''}`}>
                              {grade.quran}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${grade.azkar >= 85 ? 'text-emerald-600' : grade.azkar < 50 ? 'text-red-500 font-bold' : ''}`}>
                              {grade.azkar}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${grade.nourAlbian >= 85 ? 'text-emerald-600' : grade.nourAlbian < 50 ? 'text-red-500 font-bold' : ''}`}>
                              {grade.nourAlbian}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${grade.math >= 85 ? 'text-emerald-600' : grade.math < 50 ? 'text-red-500 font-bold' : ''}`}>
                              {grade.math}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${grade.english >= 85 ? 'text-emerald-600' : grade.english < 50 ? 'text-red-500 font-bold' : ''}`}>
                              {grade.english}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center justify-center w-8 py-0.5 rounded text-[10px] font-bold ${
                              avg >= 85 ? 'bg-emerald-50 text-emerald-700' : avg >= 65 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {avg}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

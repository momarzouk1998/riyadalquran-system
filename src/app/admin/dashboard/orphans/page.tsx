import React from 'react';
import { Heart, Gift, Users, Award } from 'lucide-react';

export default function AdminOrphansPage() {
  const orphans = [
    { name: 'عائلة أحمد محمد علي', phone: '01009284438', orphansCount: 3, monthlyCost: 450, notes: 'كفالة مدرسية وغذائية كاملة' },
    { name: 'عائلة محمود عبد الرحمن', phone: '01281660541', orphansCount: 2, monthlyCost: 300, notes: 'دعم المعيشة وملابس العيد' },
    { name: 'عائلة حسنين سليم سليم', phone: '01010453630', orphansCount: 4, monthlyCost: 600, notes: 'كفالة نقدية شهرية مستمرة' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          قسم كفالة ورعاية الأيتام
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          رعاية كفالة اليتيم تخدم حالياً 21 أسرة بتكلفة شهرية 2700.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">الأسر المستفيدة</p>
            <p className="text-3xl font-black text-slate-800">21</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">إجمالي الكفالة الشهرية</p>
            <p className="text-3xl font-black text-slate-800">2,700</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">نسبة التغطية النقدية</p>
            <p className="text-3xl font-black text-slate-800">100%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Orphans List (OpenAppo style table) */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">بيانات كفالة الأسر (أرشيف النشاط)</h3>
          <span className="badge bg-slate-50 text-slate-600 border-slate-200">21 أسرة نشطة</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto text-xs" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">اسم الأسرة / عائل الأسرة</th>
                <th className="px-6 py-3 whitespace-nowrap">رقم الهاتف للاتصال</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">عدد الأطفال الأيتام</th>
                <th className="px-6 py-3 whitespace-nowrap">الكفالة الشهرية المقدرة</th>
                <th className="px-6 py-3 whitespace-nowrap">ملاحظات الكفالة ورسائل الدعم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orphans.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{o.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap" dir="ltr">{o.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-800">{o.orphansCount} أطفال</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600">{o.monthlyCost}</td>
                  <td className="px-6 py-4">{o.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

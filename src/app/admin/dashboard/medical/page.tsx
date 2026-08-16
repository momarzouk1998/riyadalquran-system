import React from 'react';
import { Activity, ShieldAlert, HeartHandshake, Smile } from 'lucide-react';

export default function AdminMedicalPage() {
  const medicalCases = [
    { name: 'جمعة حسن مصطفى', phone: '01009284438', condition: 'علاج شهري لأمراض مزمنة', cost: 300, foodBank: 'نعم - مستفيد شهري' },
    { name: 'فاطمة محمود إبراهيم', phone: '01281660541', condition: 'توفير أدوية وجهاز تنفس', cost: 300, foodBank: 'نعم - مستفيد شهري' },
    { name: 'عبد الحميد شفيق سليم', phone: '01010453630', condition: 'فحوصات طبية وتوفير دواء السكري', cost: 300, foodBank: 'موسمي فقط' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          المساعدات الطبية والحالات المرضية
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          تقدم الجمعية مساعدات مرضية لـ 21 حالة مرضية بتكلفة 300 للفرد وبإجمالي شهري 6300.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">الحالات المرضية</p>
            <p className="text-3xl font-black text-slate-800">21</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">إجمالي تكلفة المساعدات</p>
            <p className="text-3xl font-black text-slate-800">6,300</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">مستفيدي بنك الطعام</p>
            <p className="text-3xl font-black text-slate-800">121</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Smile className="w-6 h-6" />
          </div>
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">تكلفة بنك الطعام</p>
            <p className="text-3xl font-black text-slate-800">13,800</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Food bank details alert */}
      <div className="bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="font-bold">شراكة بنك الطعام المصري:</p>
          <p className="text-cyan-800 mt-1">
            تتعاون الجمعية بشكل دوري مع بنك الطعام المصري لتوفير كراتين ووجبات غذائية متكاملة لـ 121 حالة مستفيدة بشكل شهري ثابت، بالإضافة إلى 62 حالة مستفيدة في المواسم والأعياد (توزيع لحوم ومواد تموينية).
          </p>
        </div>
      </div>

      {/* Cases List */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">كشف المساعدات الطبية والغذائية</h3>
          <span className="badge bg-slate-50 text-slate-600 border-slate-200">21 حالة معتمدة</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto text-xs" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">اسم المستفيد</th>
                <th className="px-6 py-3 whitespace-nowrap">رقم الهاتف للاتصال</th>
                <th className="px-6 py-3 whitespace-nowrap">الحالة الطبية / الوصف</th>
                <th className="px-6 py-3 whitespace-nowrap">المساعدة النقدية الشهرية</th>
                <th className="px-6 py-3 whitespace-nowrap">بنك الطعام المصري</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {medicalCases.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{m.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap" dir="ltr">{m.phone}</td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{m.condition}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600">{m.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge bg-blue-50 text-blue-700 border-blue-100">{m.foodBank}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

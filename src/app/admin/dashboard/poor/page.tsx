import React from 'react';
import { Home, Gift, FileText, Settings } from 'lucide-react';

export default function AdminPoorPage() {
  const activities = [
    { title: 'تيسير زواج الفتيات', desc: 'تجهيز وتيسير زواج الفتيات اليتيمات وغير القادرات بالمنشأة الكبرى.', status: 'نشط', emoji: '👰' },
    { title: 'توزيع الملابس المستعملة', desc: 'فرز وتجهيز وتوزيع الملابس المستعملة والمستوردة للأسر المستحقة.', status: 'نشط', emoji: '👕' },
    { title: 'ترميم المنازل الهالكة', desc: 'إعادة بناء وتسقيف البيوت وتجهيز السباكة للبيوت الهالكة وغير القابلة للمعيشة.', status: 'حسب توفر التبرعات', emoji: '🧱' },
    { title: 'توزيع ملابس العيد', desc: 'توفير ملابس العيد الجديدة للأطفال الأيتام والأسر غير القادرة سنوياً.', status: 'موسمي', emoji: '🎁' },
    { title: 'المستلزمات والأدوات المدرسية', desc: 'توفير الحقائب والأقلام والكراريس للطلاب مع بداية كل عام دراسي.', status: 'موسمي', emoji: '🎒' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-wide">
          رعاية الحالات الفقيرة والمساعدات العامة
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          إدارة ودعم الأنشطة الاجتماعية والمساعدات الموسمية وترميم البيوت وتيسير الزواج.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div key={act.title} className="card p-6 flex flex-col justify-between border-slate-100 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="text-3xl">{act.emoji}</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{act.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{act.desc}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-3">
              <span className="text-[10px] text-slate-400">حالة النشاط</span>
              <span className="badge bg-amber-50 text-amber-700 border-amber-100">{act.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

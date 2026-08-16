'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Search, Trash2, X, AlertCircle } from 'lucide-react';
import { createTeacherAssessment, deleteTeacherAssessment } from '@/app/actions/admin';

interface Teacher {
  id: string;
  name: string;
}

interface Assessment {
  id: string;
  teacherId: string;
  teacher: Teacher;
  date: Date;
  month: string;
  day: string | null;
  dateOnBoard: number;
  absence: number;
  cleaning: number;
  commitment: number;
  prepBook: number;
  curriculum: number;
  homework: number;
  quran: number;
  azkar: number;
  nourAlbian: number;
  math: number;
  english: number;
  total: number;
}

interface AssessmentsClientViewProps {
  initialAssessments: Assessment[];
  teachers: Teacher[];
}

export function AssessmentsClientView({ initialAssessments, teachers }: AssessmentsClientViewProps) {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [teacherFilter, setTeacherFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredAssessments = assessments.filter((a) =>
    teacherFilter === 'ALL' || a.teacherId === teacherFilter
  );

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;

    startTransition(async () => {
      const res = await deleteTeacherAssessment(id);
      if (res.success) {
        setAssessments(assessments.filter((a) => a.id !== id));
      } else {
        alert(res.error || 'حدث خطأ أثناء الحذف');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createTeacherAssessment(formData);
      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ ما');
      }
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Filters and Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 font-bold">تصفية حسب المعلمة:</label>
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="form-input py-1.5 text-xs bg-white w-48"
          >
            <option value="ALL">جميع المعلمات</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-md shadow-brand-primary/10 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>رصد تقييم جديد</span>
        </button>
      </div>

      {/* Assessments Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto text-xs" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-3 py-3 whitespace-nowrap">المعلمة</th>
                <th className="px-3 py-3 whitespace-nowrap">التاريخ</th>
                <th className="px-3 py-3 whitespace-nowrap">الشهر</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">السبورة</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">الغياب</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">النظافة</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">الالتزام</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">التحضير</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">المنهج</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">الواجب</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">تحفيظ القرآن</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">التحفيظ الكلي</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">الحساب</th>
                <th className="px-3 py-3 whitespace-nowrap text-center font-bold">المجموع</th>
                <th className="px-3 py-3 whitespace-nowrap text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-3 py-8 text-center text-slate-400">
                    لا توجد تقييمات مسجلة لهذه المعلمة.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-3 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      {a.teacher.name}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-500">
                      {new Date(a.date).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap font-semibold">
                      {a.month}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.dateOnBoard}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.absence}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.cleaning}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.commitment}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.prepBook}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.curriculum}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.homework}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.quran}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.azkar}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">{a.math}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center font-bold text-slate-900 bg-slate-50/50">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-black ${
                        a.total >= 80 ? 'bg-emerald-50 text-emerald-700' : a.total >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {a.total}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-800 p-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW ASSESSMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">رصد تقييم شهري جديد لمعلمة</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">اختر المعلمة</label>
                  <select name="teacherId" required className="form-input text-xs">
                    <option value="">اختر معملة...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">الشهر المستهدف</label>
                  <input
                    type="text"
                    name="month"
                    required
                    placeholder="مثال: 9 2023"
                    className="form-input text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">اليوم (اختياري)</label>
                  <input
                    type="text"
                    name="day"
                    placeholder="مثال: السبت"
                    className="form-input text-xs text-center"
                  />
                </div>
              </div>

              {/* Assessment metrics */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 mb-2">عناصر التقييم والأداء (الدرجة من 10)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">الشرح على السبورة:</span>
                    <input type="number" min={0} max={10} name="dateOnBoard" defaultValue={5} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">الالتزام بالحضور والانصراف:</span>
                    <input type="number" min={0} max={10} name="commitment" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">النظافة والترتيب بالفصل:</span>
                    <input type="number" min={0} max={10} name="cleaning" defaultValue={7} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">دفتر التحضير والمتابعة:</span>
                    <input type="number" min={0} max={10} name="prepBook" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">الالتزام بالخطة والمنهج:</span>
                    <input type="number" min={0} max={10} name="curriculum" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">متابعة وتصحيح الواجبات:</span>
                    <input type="number" min={0} max={10} name="homework" defaultValue={7} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">أداء تحفيظ القرآن الكريم:</span>
                    <input type="number" min={0} max={10} name="quran" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">أداء تحفيظ الأذكار والأحاديث:</span>
                    <input type="number" min={0} max={10} name="azkar" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">أداء منهج نور البيان:</span>
                    <input type="number" min={0} max={10} name="nourAlbian" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">أداء مادة الحساب:</span>
                    <input type="number" min={0} max={10} name="math" defaultValue={8} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">أداء مادة اللغة الإنجليزية:</span>
                    <input type="number" min={0} max={10} name="english" defaultValue={7} className="form-input text-xs text-center w-20" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-700">الغياب والالتزام (عكسي):</span>
                    <input type="number" min={0} max={10} name="absence" defaultValue={5} className="form-input text-xs text-center w-20" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-md shadow-brand-primary/10 hover:bg-brand-dark flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'جاري رصد التقييم...' : 'حفظ التقييم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Search, Edit, Trash2, X, Phone, UserCheck, Check, AlertCircle, BookOpen, Key } from 'lucide-react';
import { createTeacher, updateTeacher, deleteTeacher } from '@/app/actions/admin';

interface Teacher {
  id: string;
  name: string;
  phone: string | null;
  subject: string | null;
  password?: string;
  isActive: boolean;
  _count: {
    students: number;
  };
}

interface TeachersClientViewProps {
  initialTeachers: Teacher[];
}

export function TeachersClientView({ initialTeachers }: TeachersClientViewProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.phone && t.phone.includes(searchTerm)) ||
    (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedTeacher(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المعلمة (${name})؟`)) return;

    startTransition(async () => {
      const res = await deleteTeacher(id);
      if (res.success) {
        setTeachers(teachers.filter((t) => t.id !== id));
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
      let res;
      if (modalMode === 'create') {
        res = await createTeacher(formData);
      } else {
        res = await updateTeacher(selectedTeacher!.id, formData);
      }

      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ ما أثناء حفظ البيانات');
      }
    });
  };

  return (
    <div className="space-y-4 font-cairo">
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4 text-emerald-700" />
          </span>
          <input
            type="text"
            placeholder="البحث باسم المعلمة، التخصص، أو رقم المحمول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-bold"
          />
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معلمة جديدة</span>
        </button>
      </div>

      {/* Teachers Table */}
      <div className="card overflow-hidden border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-xs font-black">
              <tr>
                <th className="px-6 py-3.5 whitespace-nowrap">اسم المعلمة</th>
                <th className="px-6 py-3.5 whitespace-nowrap">التخصص المنهجي</th>
                <th className="px-6 py-3.5 whitespace-nowrap">رقم المحمول</th>
                <th className="px-6 py-3.5 whitespace-nowrap">كلمة المرور</th>
                <th className="px-6 py-3.5 whitespace-nowrap">عدد طلاب الفصل</th>
                <th className="px-6 py-3.5 whitespace-nowrap">الحالة بالعمل</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center">التعديل والحذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    لا يوجد معلمات يطابقن البحث.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900">
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-xl text-[11px] font-black bg-amber-100/80 text-amber-950 border border-amber-300">
                        {teacher.subject || 'قرآن ونور بيان (عربي)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-700">
                      {teacher.phone || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-black text-emerald-900">
                      {teacher.password || '123456'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-black text-emerald-800">
                      {teacher._count.students} طلاب
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-black border ${
                        teacher.isActive 
                          ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300' 
                          : 'bg-rose-100/80 text-rose-900 border-rose-300'
                      }`}>
                        {teacher.isActive ? 'نشطة بالعمل' : 'غير نشطة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-xl transition-colors"
                          title="تعديل بيانات المعلمة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                          className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-xl transition-colors"
                          title="حذف المعلمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE/EDIT MODAL FOR TEACHERS ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 flex flex-col overflow-hidden animate-fade-in">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-800/80 rounded-2xl border border-white/10">
                  <UserCheck className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {modalMode === 'create' ? 'إضافة معلمة جديدة' : 'تعديل بيانات المعلمة والتخصص'}
                  </h3>
                  <p className="text-[11px] text-emerald-200 mt-0.5">تحديد تخصص المعلمة وكلمة مرور بوابة المعلمات</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-emerald-200 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المعلمة ثنائي أو ثلاثي *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedTeacher?.name || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-bold"
                  placeholder="مثال: أستاذة أسماء"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تخصص المعلمة والمنهاج *</label>
                <select
                  name="subject"
                  defaultValue={selectedTeacher?.subject || 'قرآن ونور بيان (عربي)'}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold text-emerald-950"
                >
                  <option value="قرآن ونور بيان (عربي)">📖 قرآن ونور بيان (عربي)</option>
                  <option value="لغة إنجليزية">🔤 لغة إنجليزية</option>
                  <option value="حساب وحساب ذهني">🔢 حساب وحساب ذهني</option>
                  <option value="محفظة قرآن متخصصة">🤲 محفظة قرآن كريم متخصصة</option>
                  <option value="معلمة فصل شاملة">🏫 معلمة فصل شاملة (KG1 / KG2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم المحمول والواتساب</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={selectedTeacher?.phone || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-mono font-bold text-center"
                  placeholder="010xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة مرور دخول البوابة</label>
                <input
                  type="text"
                  name="password"
                  defaultValue={selectedTeacher?.password || '123456'}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-mono text-center font-bold"
                  placeholder="الافتراضي: 123456"
                />
              </div>

              {modalMode === 'edit' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الحالة بالعمل</label>
                  <select
                    name="isActive"
                    defaultValue={selectedTeacher?.isActive ? 'true' : 'false'}
                    className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
                  >
                    <option value="true">نشطة بالعمل الحالي</option>
                    <option value="false">غير نشطة</option>
                  </select>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حفظ البيانات</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

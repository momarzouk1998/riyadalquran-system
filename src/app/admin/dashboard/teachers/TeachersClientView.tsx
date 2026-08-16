'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Search, Edit, Trash2, X, Phone } from 'lucide-react';
import { createTeacher, updateTeacher, deleteTeacher } from '@/app/actions/admin';

interface Teacher {
  id: string;
  name: string;
  phone: string | null;
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
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        setFormError(res.error || 'حدث خطأ ما');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="البحث باسم المعلمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-xs"
          />
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-md shadow-brand-primary/10 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة معلمة جديدة</span>
        </button>
      </div>

      {/* Teachers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 text-xs font-bold">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">اسم المعلمة</th>
                <th className="px-6 py-3 whitespace-nowrap">رقم الهاتف</th>
                <th className="px-6 py-3 whitespace-nowrap">عدد الطلاب بالحقيبة</th>
                <th className="px-6 py-3 whitespace-nowrap">الحالة في الحضانة</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    لا يوجد معلمات حالياً.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" dir="ltr">
                      {teacher.phone || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {teacher._count.students} طلاب
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        teacher.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {teacher.isActive ? 'نشطة بالعمل' : 'غير نشطة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {modalMode === 'create' ? 'إضافة معلمة جديدة' : 'تعديل بيانات المعلمة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم المعلمة ثنائي/ثلاثي</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedTeacher?.name || ''}
                  className="form-input text-xs"
                  placeholder="مثال: أسماء"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={selectedTeacher?.phone || ''}
                  className="form-input text-xs"
                  placeholder="مثال: 010xxxxxxxx"
                />
              </div>

              {modalMode === 'edit' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">الحالة في العمل</label>
                  <select
                    name="isActive"
                    defaultValue={selectedTeacher?.isActive ? 'true' : 'false'}
                    className="form-input text-xs"
                  >
                    <option value="true">نشطة بالعمل</option>
                    <option value="false">غير نشطة</option>
                  </select>
                </div>
              )}

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
                  {isPending ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

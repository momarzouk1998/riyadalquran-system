'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Search, Edit, Trash2, Calendar, Phone, MapPin, 
  BookOpen, DollarSign, Award, X, Check, Eye 
} from 'lucide-react';
import { 
  createStudent, updateStudent, deleteStudent, updateStudentGrades 
} from '@/app/actions/admin';

interface Teacher {
  id: string;
  name: string;
}

interface Grade {
  id: string;
  studentId: string;
  month: string;
  quran: number;
  azkar: number;
  nourAlbian: number;
  math: number;
  english: number;
}

interface Student {
  id: string;
  uid: string | null;
  sequence: string;
  startDate: Date | null;
  category: string | null;
  name: string;
  phone: string | null;
  address: string | null;
  age: number | null;
  imageUrl: string | null;
  birthCertUrl: string | null;
  password: string;
  paidWay: string | null;
  paidAmount: number;
  remainingAmount: number;
  notes: string | null;
  isActive: boolean;
  teacherId: string | null;
  teacher: Teacher | null;
  grades: Grade[];
}

interface StudentsClientViewProps {
  initialStudents: Student[];
  teachers: Teacher[];
}

export function StudentsClientView({ initialStudents, teachers }: StudentsClientViewProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Selected Student state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('9');
  
  const [isPending, startTransition] = useTransition();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formError, setFormError] = useState<string | null>(null);

  // Grades input state
  const [gradeInput, setGradeInput] = useState({
    quran: 0,
    azkar: 0,
    nourAlbian: 0,
    math: 0,
    english: 0,
  });

  // Filter students based on search and category
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.sequence.includes(searchTerm);
    
    const matchesCategory = 
      categoryFilter === 'ALL' || student.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedStudent(null);
    setFormError(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setFormError(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenGradesModal = (student: Student) => {
    setSelectedStudent(student);
    setFormError(null);
    
    // Default or existing grades for selected month
    const existing = student.grades.find((g) => g.month === selectedMonth);
    setGradeInput({
      quran: existing?.quran || 0,
      azkar: existing?.azkar || 0,
      nourAlbian: existing?.nourAlbian || 0,
      math: existing?.math || 0,
      english: existing?.english || 0,
    });
    
    setIsGradesModalOpen(true);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (selectedStudent) {
      const existing = selectedStudent.grades.find((g) => g.month === month);
      setGradeInput({
        quran: existing?.quran || 0,
        azkar: existing?.azkar || 0,
        nourAlbian: existing?.nourAlbian || 0,
        math: existing?.math || 0,
        english: existing?.english || 0,
      });
    }
  };

  const handleOpenDetailsModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الطالب (${name})؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    
    startTransition(async () => {
      const res = await deleteStudent(id);
      if (res.success) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        alert(res.error || 'حدث خطأ أثناء الحذف');
      }
    });
  };

  const handleStudentFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res;
      if (modalMode === 'create') {
        res = await createStudent(formData);
      } else {
        res = await updateStudent(selectedStudent!.id, formData);
      }

      if (res.success) {
        // Refresh local state by refetching page data or reload (simple refresh here)
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ ما');
      }
    });
  };

  const handleGradesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    startTransition(async () => {
      const res = await updateStudentGrades(selectedStudent.id, selectedMonth, gradeInput);
      if (res.success) {
        // Update local state
        const updatedStudents = students.map((s) => {
          if (s.id === selectedStudent.id) {
            const updatedGrades = [...s.grades];
            const idx = updatedGrades.findIndex((g) => g.month === selectedMonth);
            if (idx > -1) {
              updatedGrades[idx] = { ...updatedGrades[idx], ...gradeInput };
            } else {
              updatedGrades.push({
                id: Math.random().toString(),
                studentId: s.id,
                month: selectedMonth,
                ...gradeInput,
              });
            }
            return { ...s, grades: updatedGrades };
          }
          return s;
        });
        setStudents(updatedStudents);
        setIsGradesModalOpen(false);
      } else {
        setFormError(res.error || 'حدث خطأ أثناء حفظ الدرجات');
      }
    });
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
    <div className="space-y-4">
      {/* Top action buttons & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Search & Level Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="البحث باسم الطالب أو الكود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'ALL' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setCategoryFilter('KG1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'KG1' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              KG1
            </button>
            <button
              onClick={() => setCategoryFilter('KG2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === 'KG2' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500'
              }`}
            >
              KG2
            </button>
          </div>
        </div>

        {/* Add Student Button */}
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-md shadow-brand-primary/10 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="table-header border-b border-slate-100 text-slate-500 text-xs font-bold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">كود الطالب</th>
                <th className="px-4 py-3 whitespace-nowrap">الاسم بالكامل</th>
                <th className="px-4 py-3 whitespace-nowrap">المستوى</th>
                <th className="px-4 py-3 whitespace-nowrap">المعلمة</th>
                <th className="px-4 py-3 whitespace-nowrap">الهاتف</th>
                <th className="px-4 py-3 whitespace-nowrap">المدفوع</th>
                <th className="px-4 py-3 whitespace-nowrap">المتبقي</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">العمليات والدرجات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    لا يوجد طلاب يطابقون خيارات البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenDetailsModal(student)}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      {student.sequence}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-800">
                      {student.name}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="badge bg-slate-50 text-slate-700 border-slate-200">
                        {student.category || 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {student.teacher?.name || 'غير محدد'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap" dir="ltr">
                      {student.phone || '—'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-emerald-600">
                      {student.paidAmount}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-rose-600">
                      {student.remainingAmount}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenGradesModal(student)}
                          className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50 transition-colors text-[10px] font-bold"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>رصد الدرجات</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="text-red-600 hover:text-red-800 p-1"
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

      {/* 1. STUDENT ADD/EDIT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {modalMode === 'create' ? 'إضافة طالب جديد' : 'تعديل بيانات الطالب'}
              </h3>
              <button 
                onClick={() => setIsStudentModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم الطالب رباعي</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedStudent?.name || ''}
                    className="form-input text-xs"
                    placeholder="ادخل الاسم"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">كود الطالب (الرقم التسلسلي)</label>
                  <input
                    type="text"
                    name="sequence"
                    required
                    defaultValue={selectedStudent?.sequence || ''}
                    className="form-input text-xs text-center font-bold"
                    placeholder="مثال: 1102"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">كلمة المرور للدخول</label>
                  <input
                    type="text"
                    name="password"
                    defaultValue={selectedStudent?.password || ''}
                    className="form-input text-xs text-center font-mono"
                    placeholder="تلقائي: RQ[كود]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">المستوى</label>
                  <select
                    name="category"
                    defaultValue={selectedStudent?.category || 'KG1'}
                    className="form-input text-xs"
                  >
                    <option value="KG1">KG1</option>
                    <option value="KG2">KG2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">المعلمة المسؤولة</label>
                  <select
                    name="teacherId"
                    defaultValue={selectedStudent?.teacherId || ''}
                    className="form-input text-xs"
                  >
                    <option value="">غير محدد</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">رقم هاتف ولي الأمر</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedStudent?.phone || ''}
                    className="form-input text-xs"
                    placeholder="مثال: 010xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">العمر</label>
                  <input
                    type="number"
                    name="age"
                    defaultValue={selectedStudent?.age || ''}
                    className="form-input text-xs text-center"
                    placeholder="سنوات"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">طريقة الدفع</label>
                  <input
                    type="text"
                    name="paidWay"
                    defaultValue={selectedStudent?.paidWay || ''}
                    className="form-input text-xs"
                    placeholder="كاش / فودافون كاش"
                  />
                </div>
              </div>

              {/* Finance details (No Currency label!) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">المبلغ المدفوع</label>
                  <input
                    type="number"
                    step="any"
                    name="paidAmount"
                    defaultValue={selectedStudent?.paidAmount || 0}
                    className="form-input text-xs text-center font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">المبلغ المتبقي</label>
                  <input
                    type="number"
                    step="any"
                    name="remainingAmount"
                    defaultValue={selectedStudent?.remainingAmount || 0}
                    className="form-input text-xs text-center font-bold text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">رابط صورة الطالب (على Cloudflare)</label>
                <input
                  type="text"
                  name="imageUrl"
                  defaultValue={selectedStudent?.imageUrl || ''}
                  className="form-input text-xs text-left"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">ملاحظات إضافية</label>
                <textarea
                  name="notes"
                  defaultValue={selectedStudent?.notes || ''}
                  className="form-input text-xs h-20"
                  placeholder="ملاحظات وسجلات الطالب"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
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

      {/* 2. STUDENT GRADES MODAL */}
      {isGradesModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-right">
                <h3 className="font-bold text-slate-800 text-sm">رصد درجات الطالب</h3>
                <p className="text-[10px] text-slate-500">{selectedStudent.name}</p>
              </div>
              <button 
                onClick={() => setIsGradesModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradesSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">اختر شهر الاختبار</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="form-input text-xs"
                >
                  {Object.entries(monthNames).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700 flex-1">القرآن الكريم (من 100)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput.quran}
                    onChange={(e) => setGradeInput({ ...gradeInput, quran: parseInt(e.target.value) || 0 })}
                    className="form-input text-xs text-center font-bold w-24"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700 flex-1">الأذكار والأحاديث (من 100)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput.azkar}
                    onChange={(e) => setGradeInput({ ...gradeInput, azkar: parseInt(e.target.value) || 0 })}
                    className="form-input text-xs text-center font-bold w-24"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700 flex-1">نور البيان (من 100)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput.nourAlbian}
                    onChange={(e) => setGradeInput({ ...gradeInput, nourAlbian: parseInt(e.target.value) || 0 })}
                    className="form-input text-xs text-center font-bold w-24"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700 flex-1">الحساب (من 100)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput.math}
                    onChange={(e) => setGradeInput({ ...gradeInput, math: parseInt(e.target.value) || 0 })}
                    className="form-input text-xs text-center font-bold w-24"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-slate-700 flex-1">اللغة الإنجليزية (من 100)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeInput.english}
                    onChange={(e) => setGradeInput({ ...gradeInput, english: parseInt(e.target.value) || 0 })}
                    className="form-input text-xs text-center font-bold w-24"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradesModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-md shadow-brand-primary/10 hover:bg-brand-dark flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'جاري الحفظ...' : 'حفظ الدرجات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. STUDENT DETAILS MODAL */}
      {isDetailsModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="text-right">
                <h3 className="font-bold text-slate-800 text-sm">بيانات الطالب التفصيلية</h3>
                <p className="text-[10px] text-slate-500">كود: {selectedStudent.sequence}</p>
              </div>
              <button 
                onClick={() => setIsDetailsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Profile Card snippet */}
              <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl font-bold border border-slate-100 overflow-hidden shrink-0">
                  {selectedStudent.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={selectedStudent.imageUrl} 
                      alt={selectedStudent.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    '👶'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedStudent.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">المستوى: {selectedStudent.category || 'غير محدد'}</p>
                </div>
              </div>

              {/* Data Fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block">كلمة المرور</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-50 py-1 px-2 rounded">{selectedStudent.password}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">المعلمة</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.teacher?.name || 'غير محدد'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">هاتف ولي الأمر</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.phone || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">العمر</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.age ? `${selectedStudent.age} سنوات` : '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">المبلغ المدفوع</span>
                  <span className="font-bold text-emerald-600">{selectedStudent.paidAmount}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block">المبلغ المتبقي</span>
                  <span className="font-bold text-rose-600">{selectedStudent.remainingAmount}</span>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400 block">العنوان</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.address || 'غير مسجل'}</span>
                </div>
                {selectedStudent.notes && (
                  <div className="col-span-2 space-y-1 border-t border-slate-50 pt-2">
                    <span className="text-slate-400 block">ملاحظات الحساب والتعليمات</span>
                    <p className="text-slate-700 bg-slate-50/50 p-2.5 rounded-lg leading-relaxed">{selectedStudent.notes}</p>
                  </div>
                )}
              </div>

              {/* Monthly Grades Summary in Details */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h5 className="text-xs font-bold text-slate-800">بيانات درجات الاختبارات</h5>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-[10px]">
                    <thead className="bg-slate-50 text-slate-500 font-bold">
                      <tr>
                        <th className="px-3 py-2">الاختبار</th>
                        <th className="px-3 py-2">القرآن</th>
                        <th className="px-3 py-2">الأذكار</th>
                        <th className="px-3 py-2">نور البيان</th>
                        <th className="px-3 py-2">الحساب</th>
                        <th className="px-3 py-2">الإنجليزي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedStudent.grades.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-4 text-center text-slate-400">لا توجد درجات مسجلة</td>
                        </tr>
                      ) : (
                        selectedStudent.grades.map(g => (
                          <tr key={g.id}>
                            <td className="px-3 py-2 font-bold">{monthNames[g.month] || `شهر ${g.month}`}</td>
                            <td className="px-3 py-2">{g.quran}</td>
                            <td className="px-3 py-2">{g.azkar}</td>
                            <td className="px-3 py-2">{g.nourAlbian}</td>
                            <td className="px-3 py-2">{g.math}</td>
                            <td className="px-3 py-2">{g.english}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

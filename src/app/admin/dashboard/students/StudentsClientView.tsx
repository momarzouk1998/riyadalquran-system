'use client';

import React, { useState, useTransition } from 'react';
import {
  Plus, Search, Edit, Trash2,
  Award, X, Check, User,
} from 'lucide-react';
import {
  createStudent, updateStudent, deleteStudent, updateStudentGrades,
} from '@/app/actions/admin';
import { StudentForm, calculateAgeFromNationalId } from '@/components/StudentForm';
import type { StudentFormData } from '@/components/StudentForm';

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
  nationalId: string | null;
  startDate: Date | null;
  category: string | null;
  name: string;
  phone: string | null;
  address: string | null;
  age: number | null;
  ageText: string | null;
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

  // Interactive Form National ID & Age State
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [computedAgeText, setComputedAgeText] = useState('');
  const [computedAgeYears, setComputedAgeYears] = useState<number | null>(null);

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
      student.sequence.includes(searchTerm) ||
      (student.nationalId && student.nationalId.includes(searchTerm)) ||
      (student.phone && student.phone.includes(searchTerm));
    
    const matchesCategory = 
      categoryFilter === 'ALL' || student.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleNationalIdChange = (val: string) => {
    setNationalIdInput(val);
    const { ageYears, ageText } = calculateAgeFromNationalId(val);
    setComputedAgeText(ageText);
    setComputedAgeYears(ageYears);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedStudent(null);
    setNationalIdInput('');
    setComputedAgeText('');
    setComputedAgeYears(null);
    setFormError(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    const nid = student.nationalId || '';
    setNationalIdInput(nid);
    if (nid) {
      const { ageYears, ageText } = calculateAgeFromNationalId(nid);
      setComputedAgeText(student.ageText || ageText);
      setComputedAgeYears(student.age ?? ageYears);
    } else {
      setComputedAgeText(student.ageText || '');
      setComputedAgeYears(student.age || null);
    }
    setFormError(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenGradesModal = (student: Student) => {
    setSelectedStudent(student);
    setFormError(null);
    
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

    if (!nationalIdInput || nationalIdInput.trim().length !== 14) {
      setFormError('الرقم القومي من شهادة الميلاد إجباري ويجب أن يتكون من 14 رقم بالكامل');
      return;
    }

    const formData = new FormData(e.currentTarget);
    // نضمن أن القيم المحسوبة موجودة في الـ FormData
    formData.set('nationalId', nationalIdInput);
    formData.set('ageText', computedAgeText);
    formData.set('age', computedAgeYears !== null ? String(computedAgeYears) : '');

    startTransition(async () => {
      const res = modalMode === 'create'
        ? await createStudent(formData)
        : await updateStudent(selectedStudent!.id, formData);

      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ ما أثناء حفظ بيانات الطالب');
      }
    });
  };

  const handleGradesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    startTransition(async () => {
      const res = await updateStudentGrades(selectedStudent.id, selectedMonth, gradeInput);
      if (res.success) {
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
    <div className="space-y-4 font-cairo">
      {/* Top action buttons & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Search & Level Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              <Search className="w-4 h-4 text-emerald-700" />
            </span>
            <input
              type="text"
              placeholder="البحث باسم الطالب، كود التسجيل، أو الرقم القومي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-bold"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'ALL' ? 'bg-emerald-800 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setCategoryFilter('KG1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'KG1' ? 'bg-emerald-800 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              KG1
            </button>
            <button
              onClick={() => setCategoryFilter('KG2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'KG2' ? 'bg-emerald-800 text-white shadow-md' : 'text-slate-600'
              }`}
            >
              KG2
            </button>
          </div>
        </div>

        {/* Add Student Button */}
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-xs font-black">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">كود الطالب *</th>
                <th className="px-4 py-3.5 whitespace-nowrap">الاسم بالكامل</th>
                <th className="px-4 py-3.5 whitespace-nowrap">الرقم القومي</th>
                <th className="px-4 py-3.5 whitespace-nowrap">السن المحسوب</th>
                <th className="px-4 py-3.5 whitespace-nowrap">المستوى</th>
                <th className="px-4 py-3.5 whitespace-nowrap">المعلمة</th>
                <th className="px-4 py-3.5 whitespace-nowrap">المدفوع</th>
                <th className="px-4 py-3.5 whitespace-nowrap">المتبقي</th>
                <th className="px-4 py-3.5 whitespace-nowrap text-center">العمليات والدرجات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 font-semibold">
                    لا يوجد طلاب يطابقون خيارات البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                    onClick={() => handleOpenDetailsModal(student)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap font-black text-emerald-950">
                      {student.sequence}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono font-bold text-slate-600">
                      {student.nationalId || '—'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-emerald-900">
                      {student.ageText || (student.age ? `${student.age} سنوات` : '—')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                        {student.category || 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-semibold">
                      {student.teacher?.name || 'غير محدد'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-black text-emerald-600">
                      {student.paidAmount} ج.م
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-black text-rose-600">
                      {student.remainingAmount} ج.م
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenGradesModal(student)}
                          className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-amber-400/15 text-amber-900 hover:bg-amber-400/25 border border-amber-300 transition-colors text-[10px] font-black"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>رصد الدرجات</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-xl transition-colors"
                          title="تعديل البيانات"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-xl transition-colors"
                          title="حذف الطالب"
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

      {/* ── 1. REDESIGNED STUDENT ADD/EDIT MODAL ── */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-fade-in">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-800/80 rounded-2xl border border-white/10">
                  <User className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {modalMode === 'create' ? 'إضافة طالب جديد للحضانة' : 'تعديل بيانات الطالب المسجل'}
                  </h3>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    ادخل البيانات المطلوبة مع إجبارية كود الطالب والرقم القومي
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentFormSubmit} className="flex-1 overflow-y-auto p-6">
              <StudentForm
                mode="modal"
                teachers={teachers}
                isPending={isPending}
                formError={formError}
                nationalIdValue={nationalIdInput}
                computedAgeText={computedAgeText}
                onNationalIdChange={(val, ageYears, ageText) => {
                  setNationalIdInput(val);
                  setComputedAgeText(ageText);
                  setComputedAgeYears(ageYears);
                }}
                defaultValues={
                  selectedStudent
                    ? {
                        id: selectedStudent.id,
                        name: selectedStudent.name,
                        nationalId: selectedStudent.nationalId ?? '',
                        phone: selectedStudent.phone ?? '',
                        address: selectedStudent.address ?? 'المنشأة الكبرى',
                        category: selectedStudent.category ?? 'KG1',
                        teacherId: selectedStudent.teacherId ?? '',
                        password: selectedStudent.password,
                        paidWay: selectedStudent.paidWay ?? 'كاش',
                        paidAmount: selectedStudent.paidAmount,
                        remainingAmount: selectedStudent.remainingAmount,
                        imageUrl: selectedStudent.imageUrl ?? '',
                        notes: selectedStudent.notes ?? '',
                        age: selectedStudent.age,
                        ageText: selectedStudent.ageText ?? '',
                      }
                    : {}
                }
              />

              {/* Form Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>حفظ البيانات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. STUDENT GRADES MODAL */}
      {isGradesModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="text-right">
                <h3 className="font-black text-white text-sm">رصد درجات اختبارات الطالب</h3>
                <p className="text-[11px] text-amber-300 font-bold">{selectedStudent.name} (كود: {selectedStudent.sequence})</p>
              </div>
              <button 
                onClick={() => setIsGradesModalOpen(false)} 
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradesSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3 text-xs font-bold">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">شهر الاختبار المسجل</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-600"
                >
                  {Object.entries(monthNames).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'القرآن الكريم (من 100)', key: 'quran' },
                  { label: 'الأذكار والأحاديث (من 100)', key: 'azkar' },
                  { label: 'نور البيان (من 100)', key: 'nourAlbian' },
                  { label: 'الحساب (من 100)', key: 'math' },
                  { label: 'اللغة الإنجليزية (من 100)', key: 'english' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between gap-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex-1">{label}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradeInput[key as keyof typeof gradeInput]}
                      onChange={(e) => setGradeInput({ ...gradeInput, [key]: parseInt(e.target.value) || 0 })}
                      className="w-20 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-black text-emerald-800 outline-none focus:border-emerald-600"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGradesModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-700/20 hover:bg-emerald-800 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[88vh] overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="text-right">
                <h3 className="font-black text-white text-sm">بيانات الطالب التفصيلية</h3>
                <p className="text-[11px] text-amber-300 font-bold">كود: {selectedStudent.sequence}</p>
              </div>
              <button 
                onClick={() => setIsDetailsModalOpen(false)} 
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Profile Card snippet */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl font-bold border-2 border-emerald-200 overflow-hidden shrink-0 shadow-inner">
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
                  <h4 className="font-black text-slate-900 text-base">{selectedStudent.name}</h4>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">المستوى: {selectedStudent.category || 'غير محدد'}</p>
                </div>
              </div>

              {/* Data Fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">الرقم القومي لشهادة الميلاد</span>
                  <span className="font-mono font-black text-slate-900 bg-slate-100 py-1.5 px-3 rounded-xl block text-center">{selectedStudent.nationalId || 'غير مسجل'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">السن المحسوب</span>
                  <span className="font-bold text-emerald-900 bg-emerald-50 py-1.5 px-3 rounded-xl block text-center">{selectedStudent.ageText || (selectedStudent.age ? `${selectedStudent.age} سنوات` : '—')}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">كلمة المرور</span>
                  <span className="font-mono font-black text-emerald-900 bg-emerald-50 py-1.5 px-3 rounded-xl block text-center">{selectedStudent.password}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">المعلمة المسؤولة</span>
                  <span className="font-bold text-slate-800 py-1.5 px-3 bg-slate-50 rounded-xl block text-center">{selectedStudent.teacher?.name || 'غير محدد'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">هاتف ولي الأمر</span>
                  <span className="font-mono font-bold text-slate-800 py-1.5 px-3 bg-slate-50 rounded-xl block text-center">{selectedStudent.phone || '—'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">العنوان المسجل</span>
                  <span className="font-bold text-slate-800 py-1.5 px-3 bg-slate-50 rounded-xl block text-center">{selectedStudent.address || 'المنشأة الكبرى'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">المبلغ المدفوع</span>
                  <span className="font-black text-emerald-600 py-1.5 px-3 bg-emerald-50 rounded-xl block text-center">{selectedStudent.paidAmount} ج.م</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">المبلغ المتبقي</span>
                  <span className="font-black text-rose-600 py-1.5 px-3 bg-rose-50 rounded-xl block text-center">{selectedStudent.remainingAmount} ج.م</span>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
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

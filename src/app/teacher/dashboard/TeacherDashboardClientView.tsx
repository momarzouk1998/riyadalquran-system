'use client';

import React, { useState, useTransition } from 'react';
import { 
  UserCheck, Search, Award, Save, Check, Lock, LogOut, 
  Sparkles, Calendar, BookOpen, AlertCircle, RefreshCw, Key
} from 'lucide-react';
import { updateStudentGrades } from '@/app/actions/admin';
import { ParentProfileModal } from '@/components/ParentProfileModal';

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
  sequence: string;
  name: string;
  category: string | null;
  ageText: string | null;
  age: number | null;
  imageUrl: string | null;
  grades: Grade[];
}

interface Teacher {
  id: string;
  name: string;
  phone: string | null;
  students: Student[];
}

interface TeacherDashboardClientViewProps {
  teacher: Teacher;
}

const MONTHS: Record<string, string> = {
  '9': 'شهر 9 (سبتمبر)',
  '10': 'شهر 10 (أكتوبر)',
  '11': 'شهر 11 (نوفمبر)',
  '12': 'شهر 12 (ديسمبر)',
  '2': 'شهر 2 (فبراير)',
  '3': 'شهر 3 (مارس)',
  '4': 'شهر 4 (أبريل)',
  '5': 'شهر 5 (مايو)',
};

export function TeacherDashboardClientView({ teacher }: TeacherDashboardClientViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('9');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Local state to store live edits for all students in the selected month
  const [gradesMap, setGradesMap] = useState<Record<string, { quran: number; azkar: number; nourAlbian: number; math: number; english: number }>>(() => {
    const initialMap: Record<string, { quran: number; azkar: number; nourAlbian: number; math: number; english: number }> = {};
    teacher.students.forEach((student) => {
      const g = student.grades.find((grade) => grade.month === '9');
      initialMap[student.id] = {
        quran: g?.quran || 0,
        azkar: g?.azkar || 0,
        nourAlbian: g?.nourAlbian || 0,
        math: g?.math || 0,
        english: g?.english || 0,
      };
    });
    return initialMap;
  });

  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setSavedStatus({});
    const newMap: Record<string, { quran: number; azkar: number; nourAlbian: number; math: number; english: number }> = {};
    teacher.students.forEach((student) => {
      const g = student.grades.find((grade) => grade.month === month);
      newMap[student.id] = {
        quran: g?.quran || 0,
        azkar: g?.azkar || 0,
        nourAlbian: g?.nourAlbian || 0,
        math: g?.math || 0,
        english: g?.english || 0,
      };
    });
    setGradesMap(newMap);
  };

  const handleGradeInputChange = (studentId: string, field: 'quran' | 'azkar' | 'nourAlbian' | 'math' | 'english', val: number) => {
    const clampedVal = Math.min(100, Math.max(0, val || 0));
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: clampedVal,
      },
    }));
    setSavedStatus((prev) => ({ ...prev, [studentId]: false }));
  };

  const handleSaveStudent = async (studentId: string) => {
    const studentGrades = gradesMap[studentId];
    if (!studentGrades) return;

    startTransition(async () => {
      const res = await updateStudentGrades(studentId, selectedMonth, studentGrades);
      if (res.success) {
        setSavedStatus((prev) => ({ ...prev, [studentId]: true }));
        setTimeout(() => {
          setSavedStatus((prev) => ({ ...prev, [studentId]: false }));
        }, 3000);
      } else {
        alert(res.error || 'حدث خطأ أثناء حفظ درجات الطالب');
      }
    });
  };

  const handleSaveAll = async () => {
    startTransition(async () => {
      let hasError = false;
      const newStatus: Record<string, boolean> = {};

      for (const student of filteredStudents) {
        const studentGrades = gradesMap[student.id];
        if (studentGrades) {
          const res = await updateStudentGrades(student.id, selectedMonth, studentGrades);
          if (res.success) {
            newStatus[student.id] = true;
          } else {
            hasError = true;
          }
        }
      }

      setSavedStatus(newStatus);
      if (!hasError) {
        alert('تم حفظ درجات جميع الطلاب في الفصل بنجاح ✨');
      }
    });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    window.location.href = '/teacher/login';
  };

  const filteredStudents = teacher.students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sequence.includes(searchTerm);
    return matchesSearch;
  });

  const getBadge = (avg: number) => {
    if (avg >= 90) return { text: 'ممتاز 🌟', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    if (avg >= 75) return { text: 'جيد جداً 👍', color: 'bg-blue-100 text-blue-950 border-blue-300' };
    if (avg >= 50) return { text: 'مستوى متوسط 📚', color: 'bg-amber-100 text-amber-950 border-amber-300' };
    return { text: 'تحتاج متابعة ✏️', color: 'bg-rose-100 text-rose-950 border-rose-300' };
  };

  return (
    <div className="space-y-6 font-cairo">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">أهلاً بكِ أبلة: {teacher.name} 👋</h1>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full">
                معلمة فصل
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              لوحة التقييم السريع المباشرة • عدد الطلاب المسجلين بفصلك: <strong className="text-amber-300 font-bold">{teacher.students.length} طالب</strong>
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/15 cursor-pointer"
          >
            <Key className="w-4 h-4 text-amber-300" />
            <span>تغيير كلمة المرور</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/80 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-600/20"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* ── CONTROLS BAR: Month & Search & Bulk Save ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Month Selector */}
        <div className="flex items-center gap-3 flex-1">
          <label className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>شهر الاختبار المسجل:</span>
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-black text-emerald-950 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
          >
            {Object.entries(MONTHS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4 text-emerald-700" />
          </span>
          <input
            type="text"
            placeholder="البحث باسم الطالب في الفصل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
          />
        </div>

        {/* Bulk Save Button */}
        <button
          onClick={handleSaveAll}
          disabled={isPending || filteredStudents.length === 0}
          className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Save className="w-4 h-4 text-amber-300" />
          )}
          <span>حفظ درجات كافة الطلاب دفعة واحدة</span>
        </button>

      </div>

      {/* ── SINGLE-PAGE DIRECT GRADING MATRIX ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-800 text-xs font-black">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">كود الطالب</th>
                <th className="px-4 py-4 whitespace-nowrap">اسم الطالب</th>
                <th className="px-4 py-4 whitespace-nowrap text-center text-emerald-900 bg-emerald-50/60 border-x border-emerald-100">📖 القرآن (100)</th>
                <th className="px-4 py-4 whitespace-nowrap text-center text-emerald-900 bg-emerald-50/60 border-x border-emerald-100">🤲 الأذكار (100)</th>
                <th className="px-4 py-4 whitespace-nowrap text-center text-emerald-900 bg-emerald-50/60 border-x border-emerald-100">📝 نور البيان (100)</th>
                <th className="px-4 py-4 whitespace-nowrap text-center text-emerald-900 bg-emerald-50/60 border-x border-emerald-100">🔢 الحساب (100)</th>
                <th className="px-4 py-4 whitespace-nowrap text-center text-emerald-900 bg-emerald-50/60 border-x border-emerald-100">🔤 الإنجليزي (100)</th>
                <th className="px-4 py-4 whitespace-nowrap text-center">المعدل العام</th>
                <th className="px-4 py-4 whitespace-nowrap text-center">حفظ الدرجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 font-semibold">
                    لا يوجد طلاب مسجلين في هذا الفصل.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const sGrades = gradesMap[student.id] || { quran: 0, azkar: 0, nourAlbian: 0, math: 0, english: 0 };
                  const avg = Math.round((sGrades.quran + sGrades.azkar + sGrades.nourAlbian + sGrades.math + sGrades.english) / 5);
                  const badge = getBadge(avg);
                  const isSaved = savedStatus[student.id];

                  return (
                    <tr key={student.id} className="hover:bg-emerald-50/30 transition-colors">
                      
                      {/* Code */}
                      <td className="px-4 py-4 whitespace-nowrap font-black text-emerald-950">
                        {student.sequence}
                      </td>

                      {/* Name & Details */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-sm border border-emerald-200 shrink-0">
                            {student.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              '👶'
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-xs">{student.name}</p>
                            <p className="text-[10px] text-slate-500">{student.ageText || (student.age ? `${student.age} سنوات` : 'المستوى الأول')}</p>
                          </div>
                        </div>
                      </td>

                      {/* Grade Inputs */}
                      <td className="px-3 py-3 text-center bg-emerald-50/20 border-x border-emerald-100">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sGrades.quran}
                          onChange={(e) => handleGradeInputChange(student.id, 'quran', parseInt(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-black text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-emerald-50/20 border-x border-emerald-100">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sGrades.azkar}
                          onChange={(e) => handleGradeInputChange(student.id, 'azkar', parseInt(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-black text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-emerald-50/20 border-x border-emerald-100">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sGrades.nourAlbian}
                          onChange={(e) => handleGradeInputChange(student.id, 'nourAlbian', parseInt(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-black text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-emerald-50/20 border-x border-emerald-100">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sGrades.math}
                          onChange={(e) => handleGradeInputChange(student.id, 'math', parseInt(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-black text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                      </td>

                      <td className="px-3 py-3 text-center bg-emerald-50/20 border-x border-emerald-100">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sGrades.english}
                          onChange={(e) => handleGradeInputChange(student.id, 'english', parseInt(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 bg-white border border-slate-200 rounded-xl text-center font-black text-emerald-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                      </td>

                      {/* Average & Badge */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black border ${badge.color}`}>
                          {badge.text} ({avg}%)
                        </span>
                      </td>

                      {/* Individual Save Button */}
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleSaveStudent(student.id)}
                          disabled={isPending}
                          className={`py-1.5 px-3 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                            isSaved 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>تم الحفظ!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5 text-emerald-700" />
                              <span>حفظ</span>
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Profile Modal */}
      <ParentProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        studentName={teacher.name}
        sequence="معلمة"
      />

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface Grade {
  month: string;
  quran: number;
  azkar: number;
  nourAlbian: number;
  math: number;
  english: number;
}

interface StudentGradesChartProps {
  grades: Grade[];
}

export function StudentGradesChart({ grades }: StudentGradesChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

  // Format data for chart display. Convert months like '9', '10' to full Arabic month names
  const monthNames: Record<string, string> = {
    '9': 'سبتمبر (شهر 9)',
    '10': 'أكتوبر (شهر 10)',
    '11': 'نوفمبر (شهر 11)',
    '12': 'ديسمبر (شهر 12)',
    '2': 'فبراير (شهر 2)',
    '3': 'مارس (شهر 3)',
    '4': 'أبريل (شهر 4)',
    '5': 'مايو (شهر 5)',
  };

  const sortedGrades = [...grades].sort((a, b) => {
    const order = ['9', '10', '11', '12', '2', '3', '4', '5'];
    return order.indexOf(a.month) - order.indexOf(b.month);
  });

  const chartData = sortedGrades.map((g) => ({
    name: monthNames[g.month] || `شهر ${g.month}`,
    'القرآن الكريم': g.quran,
    'الأذكار والأحاديث': g.azkar,
    'نور البيان': g.nourAlbian,
    'الحساب': g.math,
    'الإنجليزي': g.english,
    'المعدل': Math.round((g.quran + g.azkar + g.nourAlbian + g.math + g.english) / 5),
  }));

  if (grades.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
        <p className="text-sm">لا توجد درجات مسجلة لهذا الطالب حتى الآن</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart type toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">الرسم البياني لتطور الدرجات</h3>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            أعمدة بيانية
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              chartType === 'line'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            خطوط بيانية
          </button>
        </div>
      </div>

      {/* Recharts Wrapper */}
      <div className="w-full h-80 bg-white p-4 rounded-xl border border-slate-100 shadow-sm" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  fontFamily: 'Cairo', 
                  fontSize: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'Cairo', fontSize: '11px' }} />
              <Line type="monotone" dataKey="القرآن الكريم" stroke="#137d54" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="الأذكار والأحاديث" stroke="#c5a880" strokeWidth={2.5} />
              <Line type="monotone" dataKey="نور البيان" stroke="#38bdf8" strokeWidth={2} />
              <Line type="monotone" dataKey="الحساب" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="الإنجليزي" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  fontFamily: 'Cairo', 
                  fontSize: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'Cairo', fontSize: '11px' }} />
              <Bar dataKey="القرآن الكريم" fill="#137d54" radius={[4, 4, 0, 0]} />
              <Bar dataKey="الأذكار والأحاديث" fill="#c5a880" radius={[4, 4, 0, 0]} />
              <Bar dataKey="نور البيان" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="الحساب" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="الإنجليزي" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

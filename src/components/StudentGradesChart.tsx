'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ReferenceLine,
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
  /** Optional per-month class average for comparison overlay */
  classAverages?: Record<string, number>;
}

const MONTH_NAMES: Record<string, string> = {
  '9':  'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر',
  '2':  'فبراير',
  '3':  'مارس',
  '4':  'أبريل',
  '5':  'مايو',
};
const MONTH_ORDER = ['9','10','11','12','2','3','4','5'];

const SUBJECT_COLORS = {
  'القرآن':    '#0e6b47',
  'الأذكار':   '#b8973e',
  'نور البيان':'#38bdf8',
  'الحساب':    '#ec4899',
  'الإنجليزي': '#f59e0b',
  'المعدل':    '#6366f1',
};

// Custom tooltip styled for Arabic RTL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-right text-xs space-y-1.5"
      style={{ fontFamily: 'Cairo, sans-serif', minWidth: 160 }}
    >
      <p className="font-black text-emerald-900 border-b border-slate-100 pb-1.5 mb-1.5">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="text-slate-600">{entry.name}</span>
          <span className="font-bold" style={{ color: entry.color }}>{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function StudentGradesChart({ grades, classAverages = {} }: StudentGradesChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [showSubjects, setShowSubjects] = useState(false);

  const sorted = [...grades].sort(
    (a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
  );

  const chartData = sorted.map((g) => {
    const avg = Math.round((g.quran + g.azkar + g.nourAlbian + g.math + g.english) / 5);
    const base: Record<string, string | number> = {
      name: MONTH_NAMES[g.month] ?? `شهر ${g.month}`,
      'المعدل': avg,
    };
    if (showSubjects) {
      base['القرآن']     = g.quran;
      base['الأذكار']    = g.azkar;
      base['نور البيان'] = g.nourAlbian;
      base['الحساب']     = g.math;
      base['الإنجليزي']  = g.english;
    }
    if (classAverages[g.month] !== undefined) {
      base['متوسط الفصل'] = classAverages[g.month];
    }
    return base;
  });

  if (grades.length === 0) {
    return (
      <div className="h-52 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 space-y-2">
        <span className="text-3xl">📊</span>
        <p className="text-sm font-semibold">لا توجد درجات مسجلة حتى الآن</p>
        <p className="text-xs">ستظهر الرسوم البيانية بعد رصد أول اختبار</p>
      </div>
    );
  }

  const activeKeys = showSubjects
    ? ['القرآن', 'الأذكار', 'نور البيان', 'الحساب', 'الإنجليزي', ...(Object.keys(classAverages).length ? ['متوسط الفصل'] : [])]
    : ['المعدل', ...(Object.keys(classAverages).length ? ['متوسط الفصل'] : [])];

  const legendStyle: React.CSSProperties = {
    fontFamily: 'Cairo, sans-serif',
    fontSize: '11px',
    direction: 'rtl',
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-emerald-900">الرسم البياني لتطور الأداء</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Subject toggle */}
          <button
            onClick={() => setShowSubjects(!showSubjects)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              showSubjects
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}
          >
            {showSubjects ? 'إخفاء المواد' : 'عرض المواد'}
          </button>

          {/* Chart type */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                chartType === 'bar' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              أعمدة
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                chartType === 'line' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              خطوط
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-72 bg-white rounded-2xl border border-slate-100 p-2" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f1" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Cairo' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} iconType="circle" />
              {activeKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={SUBJECT_COLORS[key as keyof typeof SUBJECT_COLORS] ?? '#94a3b8'}
                  strokeWidth={key === 'المعدل' ? 3 : key === 'متوسط الفصل' ? 2 : 1.5}
                  strokeDasharray={key === 'متوسط الفصل' ? '5 3' : undefined}
                  dot={{ r: key === 'المعدل' ? 5 : 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f1" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Cairo' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={legendStyle} iconType="circle" />
              {/* Class average as reference line overlay in bar mode */}
              {!showSubjects && sorted.map((g) =>
                classAverages[g.month] !== undefined ? (
                  <ReferenceLine
                    key={g.month}
                    y={classAverages[g.month]}
                    stroke="#94a3b8"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                ) : null
              )}
              {activeKeys
                .filter((k) => k !== 'متوسط الفصل')
                .map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={SUBJECT_COLORS[key as keyof typeof SUBJECT_COLORS] ?? '#94a3b8'}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={48}
                  />
                ))}
              {/* Show class avg as a separate bar if subjects are visible */}
              {showSubjects && activeKeys.includes('متوسط الفصل') && (
                <Bar
                  dataKey="متوسط الفصل"
                  fill="#94a3b8"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                  opacity={0.5}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend note for class avg */}
      {Object.keys(classAverages).length > 0 && (
        <p className="text-[10px] text-slate-400 text-center">
          ── الخط المنقط يمثل متوسط أداء فصل طفلك في نفس الاختبار
        </p>
      )}
    </div>
  );
}

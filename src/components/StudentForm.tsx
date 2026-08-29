'use client';

import React, { useState } from 'react';
import {
  User, BookOpen, CreditCard, Fingerprint, AlertCircle, Calendar, GraduationCap, RefreshCw, CheckCircle2
} from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';

export interface StudentFormData {
  id?: string;
  name?: string;
  nationalId?: string;
  startDate?: string | Date | null;
  phone?: string;
  address?: string;
  category?: string;
  teacherId?: string;
  password?: string;
  paymentStatus?: string;
  paidWay?: string;
  paidAmount?: number;
  remainingAmount?: number;
  registrationType?: string;
  yearsInNursery?: number;
  isFinalYear?: boolean;
  imageUrl?: string;
  notes?: string;
  age?: number | null;
  ageText?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface StudentFormProps {
  /** بيانات الطالب الحالية (للتعديل) — فارغة للإضافة */
  defaultValues?: StudentFormData;
  teachers?: Teacher[];
  /** وضع العرض: modal (داخلي) أو page (خارجي) */
  mode?: 'modal' | 'page';
  isPending?: boolean;
  formError?: string | null;
  onNationalIdChange?: (val: string, ageYears: number | null, ageText: string) => void;
  /** القيم المحسوبة من الخارج (للتزامن مع الـ modal state) */
  nationalIdValue?: string;
  computedAgeText?: string;
}

export function calculateAgeFromNationalId(nidInput: string) {
  const nid = (nidInput || '').trim();
  if (nid.length !== 14 || !/^\d{14}$/.test(nid)) {
    return { ageYears: null, ageText: '' };
  }
  const centuryDigit = parseInt(nid[0], 10);
  const yearTwoDigits = parseInt(nid.substring(1, 3), 10);
  const month = parseInt(nid.substring(3, 5), 10);
  const day = parseInt(nid.substring(5, 7), 10);
  const fullYear = (centuryDigit === 3 ? 2000 : 1900) + yearTwoDigits;
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { ageYears: null, ageText: '' };
  }
  const birthDate = new Date(fullYear, month - 1, day);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (today.getDate() - birthDate.getDate() < 0) months -= 1;
  if (months < 0) { years -= 1; months += 12; }
  let ageText = '';
  if (years > 0)
    ageText += `${years} ${years === 1 ? 'سنة' : years === 2 ? 'سنتان' : years <= 10 ? 'سنوات' : 'سنة'}`;
  if (months > 0) {
    if (ageText) ageText += ' و ';
    ageText += `${months} ${months === 1 ? 'شهر' : months === 2 ? 'شهران' : months <= 10 ? 'أشهر' : 'شهر'}`;
  }
  if (!ageText) ageText = 'أقل من شهر';
  return { ageYears: years, ageText };
}

function formatDateForInput(dateVal: string | Date | null | undefined): string {
  if (!dateVal) return '';
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0];
  }
  if (typeof dateVal === 'string') {
    return dateVal.split('T')[0];
  }
  return '';
}

/**
 * StudentForm — مكوّن فورم الطالب المشترك
 * يعمل داخل مودال الإدارة (mode="modal") أو كصفحة عامة (mode="page")
 */
export function StudentForm({
  defaultValues = {},
  teachers = [],
  mode = 'modal',
  isPending = false,
  formError,
  onNationalIdChange,
  nationalIdValue,
  computedAgeText,
}: StudentFormProps) {
  // إذا لم يُمرَّر تحكم خارجي نستخدم state داخلي
  const [internalNid, setInternalNid] = useState(defaultValues.nationalId || '');
  const [internalAgeText, setInternalAgeText] = useState(defaultValues.ageText || '');

  // حالة نوع القيد والتجديد
  const [regType, setRegType] = useState<string>(defaultValues.registrationType || 'new');
  const [isFinal, setIsFinal] = useState<boolean>(defaultValues.isFinalYear || false);
  const [payStatus, setPayStatus] = useState<string>(defaultValues.paymentStatus || 'unpaid');

  const nid = nationalIdValue !== undefined ? nationalIdValue : internalNid;
  const ageText = computedAgeText !== undefined ? computedAgeText : internalAgeText;

  const handleNidChange = (val: string) => {
    const { ageYears, ageText: computed } = calculateAgeFromNationalId(val);
    if (onNationalIdChange) {
      onNationalIdChange(val, ageYears, computed);
    } else {
      setInternalNid(val);
      setInternalAgeText(computed);
    }
  };

  const inputCls =
    'w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-bold';

  return (
    <div className="space-y-6">
      {/* ── خطأ عام ── */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ══ القسم 1: البيانات الأساسية ══ */}
      <div className="space-y-4">
        <SectionHeader icon={<User className="w-4 h-4 text-emerald-700" />} label="١. البيانات الأساسية للطالب" />

        {/* اسم الطالب */}
        <div>
          <Label required>اسم الطالب رباعي</Label>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaultValues.name || ''}
            className={inputCls}
            placeholder="ادخل الاسم الكامل للطالب"
          />
        </div>

        {/* الرقم القومي + السن المحسوب */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
          <div>
            <Label required icon={<Fingerprint className="w-3.5 h-3.5 text-emerald-700" />}>
              الرقم القومي (من شهادة الميلاد — 14 رقم)
            </Label>
            <input
              type="text"
              name="nationalId"
              required
              maxLength={14}
              value={nid}
              onChange={(e) => handleNidChange(e.target.value)}
              className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-xs font-mono font-bold text-center tracking-widest text-slate-900"
              placeholder="30005151234567"
              dir="ltr"
            />
          </div>
          <div>
            <Label>السن المحسوب تلقائياً من شهادة الميلاد</Label>
            <input
              type="text"
              readOnly
              value={ageText || 'سيتم حسابه عند إدخال 14 رقم'}
              className="w-full py-2.5 px-3.5 bg-emerald-100/80 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 text-center outline-none"
            />
          </div>
        </div>

        {/* الهاتف + العنوان */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>رقم محمول ولي الأمر</Label>
            <input
              type="text"
              name="phone"
              required
              defaultValue={defaultValues.phone || ''}
              className={`${inputCls} font-mono text-center`}
              placeholder="010xxxxxxxx"
              dir="ltr"
            />
          </div>
          <div>
            <Label>العنوان المسجل (افتراضي: المنشأة الكبرى)</Label>
            <input
              type="text"
              name="address"
              defaultValue={defaultValues.address || 'المنشأة الكبرى'}
              className={inputCls}
              placeholder="المنشأة الكبرى"
            />
          </div>
        </div>
      </div>

      {/* ══ القسم 2: القيد وتاريخ الدخول والتسكين ══ */}
      <div className="space-y-4">
        <SectionHeader icon={<BookOpen className="w-4 h-4 text-emerald-700" />} label="٢. بيانات القيد وتاريخ دخول الحضانة" />

        {/* تاريخ بدء دخول الحضانة + نوع القيد */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required icon={<Calendar className="w-3.5 h-3.5 text-emerald-700" />}>
              تاريخ بدء دخول الحضانة (تاريخ الالتحاق)
            </Label>
            <input
              type="date"
              name="startDate"
              defaultValue={formatDateForInput(defaultValues.startDate)}
              className={inputCls}
            />
          </div>

          <div>
            <Label icon={<RefreshCw className="w-3.5 h-3.5 text-emerald-700" />}>
              نوع القيد (تسجيل جديد أم تجديد اشتراك)
            </Label>
            <select
              name="registrationType"
              value={regType}
              onChange={(e) => setRegType(e.target.value)}
              className={inputCls}
            >
              <option value="new">تسجيل جديد (أول مرة في الحضانة)</option>
              <option value="renewal">تجديد اشتراك طالب مستمر</option>
            </select>
          </div>
        </div>

        {/* عدد السنوات بالحضانة + آخر سنة (مرحلة تخرج) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div>
            <Label>عدد سنوات قيد الطالب في الحضانة (كم سنة معنا؟)</Label>
            <select
              name="yearsInNursery"
              defaultValue={defaultValues.yearsInNursery || (regType === 'renewal' ? 2 : 1)}
              className={inputCls}
            >
              <option value="1">السنة الأولى (أول سنة بالحضانة)</option>
              <option value="2">السنة الثانية (مستمر للعام الثاني)</option>
              <option value="3">السنة الثالثة (مستمر للعام الثالث)</option>
              <option value="4">السنة الرابعة (٤ سنوات بالحضانة)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl cursor-pointer hover:bg-amber-100/50 transition-colors">
              <input
                type="checkbox"
                name="isFinalYear"
                checked={isFinal}
                onChange={(e) => setIsFinal(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600 accent-emerald-700"
              />
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>آخر سنة للطالب في الحضانة (مرحلة التخرج للمدرسة)</span>
              </div>
            </label>
          </div>
        </div>

        {/* المستوى الدراسي والمعلمة وكلمة المرور */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* المستوى الدراسي */}
          <div>
            <Label>المستوى الدراسي</Label>
            <select
              name="category"
              defaultValue={defaultValues.category || 'KG1'}
              className={inputCls}
            >
              <option value="KG1">KG1 (المستوى الأول)</option>
              <option value="KG2">KG2 (المستوى الثاني)</option>
            </select>
          </div>

          {/* المعلمة — تظهر فقط إذا كانت متاحة */}
          {teachers.length > 0 && (
            <div>
              <Label>المعلمة المسؤولة</Label>
              <select
                name="teacherId"
                defaultValue={defaultValues.teacherId || ''}
                className={inputCls}
              >
                <option value="">غير محدد</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* كلمة السر */}
          <div>
            <Label>كلمة السر للدخول</Label>
            <input
              type="text"
              name="password"
              defaultValue={defaultValues.password || '123456'}
              className={`${inputCls} text-center font-mono`}
              placeholder="الافتراضي: 123456"
            />
          </div>
        </div>
      </div>

      {/* ══ القسم 3: الموقف المالي وسداد المصروفات ══ */}
      {mode === 'modal' && (
        <div className="space-y-4">
          <SectionHeader icon={<CreditCard className="w-4 h-4 text-emerald-700" />} label="٣. الموقف المالي وسداد المصروفات" />

          {/* بند تم سداد المصروفات */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <Label required icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}>
              حالة سداد المصروفات الدراسية
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
              {[
                { id: 'paid', label: 'تم السداد بالكامل ✅', activeCls: 'bg-emerald-700 text-white border-emerald-800' },
                { id: 'partial', label: 'سداد جزئي ⏳', activeCls: 'bg-amber-600 text-white border-amber-700' },
                { id: 'unpaid', label: 'لم يسدد (مستحق) ❌', activeCls: 'bg-rose-600 text-white border-rose-700' },
                { id: 'exempt', label: 'معفى (كفالة أيتام) 🤍', activeCls: 'bg-blue-600 text-white border-blue-700' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-center py-2 px-2.5 rounded-xl border text-xs font-black cursor-pointer transition-all text-center ${
                    payStatus === item.id
                      ? item.activeCls + ' shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentStatus"
                    value={item.id}
                    checked={payStatus === item.id}
                    onChange={(e) => setPayStatus(e.target.value)}
                    className="sr-only"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>طريقة الدفع</Label>
              <input
                type="text"
                name="paidWay"
                defaultValue={defaultValues.paidWay || 'كاش'}
                className={inputCls}
                placeholder="كاش / فودافون كاش / انستاباي"
              />
            </div>
            <div>
              <Label>المبلغ المدفوع (ج.م)</Label>
              <input
                type="number"
                step="any"
                name="paidAmount"
                defaultValue={defaultValues.paidAmount ?? 0}
                className="w-full py-2.5 px-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs text-center font-black text-emerald-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
            <div>
              <Label>المبلغ المتبقي (ج.م)</Label>
              <input
                type="number"
                step="any"
                name="remainingAmount"
                defaultValue={defaultValues.remainingAmount ?? 0}
                className="w-full py-2.5 px-3.5 bg-rose-50/50 border border-rose-200 rounded-2xl text-xs text-center font-black text-rose-600 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ القسم 4: الصورة والملاحظات ══ */}
      <div className="space-y-4">
        {/* صورة الطالب */}
        <div>
          <Label>صورة الطالب الشخصية (رابط Cloudflare)</Label>
          <ImageUploader
            currentValue={defaultValues.imageUrl}
            inputName="imageUrl"
            studentId={defaultValues.id}
            label="صورة الطالب"
          />
        </div>

        {/* ملاحظات */}
        <div>
          <Label>ملاحظات وسجلات إضافية</Label>
          <textarea
            name="notes"
            defaultValue={defaultValues.notes || ''}
            rows={3}
            className={`${inputCls} resize-none h-auto`}
            placeholder="ملاحظات ولي الأمر أو السلوك أو أي معلومات إضافية..."
          />
        </div>
      </div>
    </div>
  );
}

/* ── مساعدات صغيرة ── */

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black text-emerald-900 border-b border-slate-100 pb-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Label({
  children,
  required,
  icon,
}: {
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
      {icon}
      <span>{children}</span>
      {required && <span className="text-red-500 mr-0.5">*</span>}
    </label>
  );
}

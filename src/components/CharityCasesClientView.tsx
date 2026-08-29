'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Search, Edit, Trash2, X, Phone, MapPin, DollarSign, 
  Check, AlertCircle, Heart, FileText, Sparkles
} from 'lucide-react';
import { 
  createAssociationCase, updateAssociationCase, deleteAssociationCase 
} from '@/app/actions/admin';

interface CaseItem {
  id: string;
  category: string;
  name: string;
  phone: string | null;
  address: string | null;
  monthlyCost: number;
  notes: string | null;
  createdAt: Date;
}

interface CharityCasesClientViewProps {
  initialCases: CaseItem[];
  category: 'poor' | 'orphans' | 'sick';
  title: string;
  subtitle: string;
  categoryLabel: string;
}

export function CharityCasesClientView({
  initialCases,
  category,
  title,
  subtitle,
  categoryLabel,
}: CharityCasesClientViewProps) {
  const [cases, setCases] = useState<CaseItem[]>(initialCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredCases = cases.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedCase(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CaseItem) => {
    setModalMode('edit');
    setSelectedCase(item);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الحالة (${name})؟`)) return;

    startTransition(async () => {
      const res = await deleteAssociationCase(id);
      if (res.success) {
        setCases(cases.filter((c) => c.id !== id));
      } else {
        alert(res.error || 'حدث خطأ أثناء الحذف');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('category', category);

    startTransition(async () => {
      let res;
      if (modalMode === 'create') {
        res = await createAssociationCase(formData);
      } else {
        res = await updateAssociationCase(selectedCase!.id, formData);
      }

      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ ما أثناء حفظ بيانات الحالة');
      }
    });
  };

  const totalMonthlyCost = filteredCases.reduce((sum, c) => sum + c.monthlyCost, 0);

  return (
    <div className="space-y-6 font-cairo">
      
      {/* Title Header & Stats */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-wide">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي الحالات المسجلة</span>
            <span className="text-xl font-black text-emerald-950">{filteredCases.length} حالة</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">إجمالي المساعدات الشهرية</span>
            <span className="text-xl font-black text-amber-600">{totalMonthlyCost} ج.م</span>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4 text-emerald-700" />
          </span>
          <input
            type="text"
            placeholder="البحث باسم الحالة، المكان والقرية، أو رقم المحمول..."
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
          <span>إضافة {categoryLabel} جديدة</span>
        </button>
      </div>

      {/* Cases Table */}
      <div className="card overflow-hidden border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-800 text-xs font-black">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">اسم الحالة / عائل الأسرة</th>
                <th className="px-5 py-4 whitespace-nowrap">العنوان والمكان بالتفصيل</th>
                <th className="px-5 py-4 whitespace-nowrap">رقم الهاتف</th>
                <th className="px-5 py-4 whitespace-nowrap">قيمة المساعدة الشهرية</th>
                <th className="px-5 py-4 whitespace-nowrap">تفاصيل الحالة والاحتياجات</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">التعديل والحذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-bold">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-semibold">
                    لا توجد حالات مسجلة تطابق البحث الحالي.
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-black text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{item.address || 'المنشأة الكبرى'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-700">
                      {item.phone || '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-black text-amber-700">
                      {item.monthlyCost} ج.م
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-slate-600" title={item.notes || ''}>
                      {item.notes || '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-xl transition-colors"
                          title="تعديل بيانات الحالة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-xl transition-colors"
                          title="حذف الحالة"
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

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col overflow-hidden animate-fade-in">
            
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-800/80 rounded-2xl border border-white/10">
                  <Heart className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {modalMode === 'create' ? `إضافة ${categoryLabel} جديدة` : `تعديل بيانات ${categoryLabel}`}
                  </h3>
                  <p className="text-[11px] text-emerald-200 mt-0.5">ادخل العنوان والمكان بالتفصيل والمبلغ الشهري</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الحالة / عائل الأسرة *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedCase?.name || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
                  placeholder="ادخل الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان والمكان بالتفصيل (القرية والشارع) *</label>
                <input
                  type="text"
                  name="address"
                  required
                  defaultValue={selectedCase?.address || 'المنشأة الكبرى'}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
                  placeholder="مثال: المنشأة الكبرى - شارع المدارس - بجوار المسجد الكبير"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم المحمول للتواصل</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedCase?.phone || ''}
                    className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-mono font-bold text-center"
                    placeholder="010xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المساعدة الشهرية المقررة (ج.م)</label>
                  <input
                    type="number"
                    step="any"
                    name="monthlyCost"
                    defaultValue={selectedCase?.monthlyCost || 0}
                    className="w-full py-2.5 px-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-center font-black text-amber-900 outline-none"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تفاصيل الحالة واحتياجات المساعدة</label>
                <textarea
                  name="notes"
                  defaultValue={selectedCase?.notes || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs h-24"
                  placeholder="مثال: ملابس وأدوات مدرسية للأطفال، مساعدة علاجية، مواد غذائية..."
                />
              </div>

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
                      <span>حفظ بيانات الحالة</span>
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

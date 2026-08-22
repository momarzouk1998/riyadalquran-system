'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, Shield, Trash2, Edit, Key, UserCheck, X, Check, 
  AlertCircle, ShieldCheck, Crown
} from 'lucide-react';
import { createAdminUser, updateAdminUser, deleteAdminUser } from '@/app/actions/admin';

interface AdminUserItem {
  id: string;
  name: string | null;
  username: string;
  role: string;
  createdAt: Date;
}

interface AdminsClientViewProps {
  initialAdmins: AdminUserItem[];
  currentAdminUsername: string;
}

export function AdminsClientView({ initialAdmins, currentAdminUsername }: AdminsClientViewProps) {
  const [admins, setAdmins] = useState<AdminUserItem[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedAdmin(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminUserItem) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();

    if (!name || !username) {
      setFormError('يرجى إدخال اسم المدير ورقم المحمول/اسم الدخول');
      return;
    }

    startTransition(async () => {
      let res;
      if (modalMode === 'create') {
        res = await createAdminUser(formData);
      } else {
        res = await updateAdminUser(selectedAdmin!.id, formData);
      }

      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error || 'حدث خطأ أثناء حفظ بيانات الحساب');
      }
    });
  };

  const handleDelete = async (id: string, username: string) => {
    if (username === currentAdminUsername) {
      alert('لا يمكنك حذف حسابك الحالي أثناء الجلسة النشطة!');
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف الحساب الإداري (${username})؟`)) return;

    startTransition(async () => {
      const res = await deleteAdminUser(id);
      if (res.success) {
        setAdmins(admins.filter((a) => a.id !== id));
      } else {
        alert(res.error || 'حدث خطأ أثناء حذف الحساب');
      }
    });
  };

  return (
    <div className="space-y-6 font-cairo">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>خاص بالمديرين والمدير العام</span>
          </span>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدير / مشرف جديد</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="card overflow-hidden border border-slate-200/80 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto" dir="rtl">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-800 text-xs font-black">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">اسم المدير</th>
                <th className="px-5 py-4 whitespace-nowrap">رقم المحمول / اسم الدخول</th>
                <th className="px-5 py-4 whitespace-nowrap">الدور / الصلاحية</th>
                <th className="px-5 py-4 whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="px-5 py-4 whitespace-nowrap text-center">التعديل والحذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-semibold">
                    لا توجد حسابات إدارية مسجلة.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-black text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shrink-0">
                        👑
                      </div>
                      <span>{admin.name || admin.username}</span>
                      {admin.username === currentAdminUsername && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          أنت (الجلسة الحالية)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-slate-700">
                      {admin.username}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-black border ${
                        admin.role === 'مدير عام' || admin.role === 'admin'
                          ? 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-blue-100 text-blue-950 border-blue-300'
                      }`}>
                        {admin.role || 'مدير'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-500">
                      {new Date(admin.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(admin)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-xl transition-colors"
                          title="تعديل بيانات الحساب"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id, admin.username)}
                          disabled={admin.username === currentAdminUsername}
                          className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="حذف الحساب"
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

      {/* ── CREATE/EDIT ADMIN MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-white text-sm">
                  {modalMode === 'create' ? 'إضافة مدير / مشرف جديد' : 'تعديل بيانات الحساب الإداري'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المدير ثنائي أو ثلاثي *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedAdmin?.name || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
                  placeholder="مثال: محمد مرزوق"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم المحمول / اسم الدخول *</label>
                <input
                  type="text"
                  name="username"
                  required
                  defaultValue={selectedAdmin?.username || ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-mono font-bold text-center"
                  placeholder="مثال: 01008977105"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {modalMode === 'create' ? 'كلمة المرور *' : 'تغيير كلمة المرور (اتركه فارغاً للإبقاء على الحالية)'}
                </label>
                <input
                  type="text"
                  name="password"
                  required={modalMode === 'create'}
                  defaultValue={modalMode === 'create' ? '123456' : ''}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-mono text-center font-bold"
                  placeholder={modalMode === 'create' ? 'الافتراضي: 123456' : 'ادخل كلمة مرور جديدة...'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الدور / الصلاحية</label>
                <select
                  name="role"
                  defaultValue={selectedAdmin?.role || 'مدير عام'}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-600 focus:bg-white outline-none text-xs font-bold"
                >
                  <option value="مدير عام">👑 مدير عام (صلاحيات كاملة)</option>
                  <option value="مشرف">🛡️ مشرف لوحة التحكّم</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-700/20 hover:bg-emerald-800 flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

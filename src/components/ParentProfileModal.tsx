'use client';

import React, { useState } from 'react';
import { KeyRound, X, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface ParentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  sequence: string;
}

export function ParentProfileModal({ isOpen, onClose, studentName, sequence }: ParentProfileModalProps) {
  const [currentPassword, setCurrentPassword] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 4 أحرف على الأقل' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء تغيير كلمة المرور' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'تعذر الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-cairo">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800/80 rounded-xl">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">تغيير كلمة المرور</h3>
              <p className="text-[10px] text-emerald-200">{studentName} (كود: {sequence})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {message && (
            <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{message.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="123456"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="ادخل كلمة المرور الجديدة"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-emerald-600 focus:bg-white"
              placeholder="اعد كتابة كلمة المرور الجديدة"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

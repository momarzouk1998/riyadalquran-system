'use client';

import React, { useState } from 'react';
import { KeyRound, LogOut } from 'lucide-react';
import { ParentProfileModal } from './ParentProfileModal';

interface ParentHeaderActionsProps {
  studentName: string;
  sequence: string;
  handleSignOut: () => Promise<void>;
}

export function ParentHeaderActions({ studentName, sequence, handleSignOut }: ParentHeaderActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100 transition-colors text-xs font-bold cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
          <span>تغيير كلمة المرور</span>
        </button>

        <form action={handleSignOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </form>
      </div>

      <ParentProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentName={studentName}
        sequence={sequence}
      />
    </>
  );
}

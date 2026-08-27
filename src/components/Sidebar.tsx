'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu, X, LogOut, User, Home, Users, Award, BookOpen,
  Heart, Activity, HelpCircle, Baby, ExternalLink
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface SidebarProps {
  adminName: string;
}

const menuItems = [
  { name: 'الرئيسية',           path: '/admin/dashboard',               icon: Home,        emoji: '🏠' },
  { name: 'إدارة المديرين',     path: '/admin/dashboard/admins',         icon: User,        emoji: '👑', highlight: true },
  { name: 'الطلاب',             path: '/admin/dashboard/students',      icon: Users,       emoji: '👶' },
  { name: 'المعلمات',           path: '/admin/dashboard/teachers',      icon: User,        emoji: '👩‍🏫' },
  { name: 'تقييم المعلمات',     path: '/admin/dashboard/assessments',   icon: Award,       emoji: '📊' },
  { name: 'طلبات الحجز',        path: '/admin/dashboard/bookings',      icon: BookOpen,    emoji: '📝' },
  { name: 'تاب الحضانة',        path: '/admin/dashboard/nursery',       icon: Baby,        emoji: '🏫' },
  { name: 'كفالة الأيتام',      path: '/admin/dashboard/orphans',       icon: Heart,       emoji: '🤝' },
  { name: 'المساعدات المرضية',  path: '/admin/dashboard/medical',       icon: Activity,    emoji: '🩺' },
  { name: 'الحالات الفقيرة',    path: '/admin/dashboard/poor',          icon: HelpCircle,  emoji: '💸' },
  { name: 'طلبات التسجيل',      path: '/admin/dashboard/requests',      icon: Activity,    emoji: '📋', highlight: true },
];
export function Sidebar({ adminName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      router.push('/admin/login');
      router.refresh();
    }
  };

  const NavLink = ({
    item,
    onClick,
  }: {
    item: typeof menuItems[number];
    onClick?: () => void;
  }) => {
    const isActive =
      pathname === item.path ||
      (item.path !== '/admin/dashboard' && pathname.startsWith(item.path + '/'));

    return (
      <Link
        href={item.path}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
          ${isActive
            ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
            : item.highlight
            ? 'text-amber-700 hover:bg-amber-50 border border-amber-200/60 bg-amber-50/40'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }
        `}
      >
        <span className="text-base shrink-0">{item.emoji}</span>
        <span className="truncate">{item.name}</span>
        {item.highlight && !isActive && (
          <span className="mr-auto text-[9px] bg-amber-400 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
            جديد
          </span>
        )}
      </Link>
    );
  };

  const UserFooter = () => (
    <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-700/10 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-base shrink-0">
          {adminName[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 font-semibold">المدير المسؤول</p>
          <p className="text-sm font-bold text-slate-800 truncate">{adminName}</p>
        </div>
      </div>

      {/* Public site link */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-emerald-700 hover:border-emerald-200 transition-colors text-xs font-medium"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>الموقع العام</span>
      </Link>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors text-sm font-semibold"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-4 shadow-sm">
        <button onClick={() => setIsOpen(true)} className="text-slate-600 focus:outline-none p-1">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={30} height={30} className="object-contain" />
          <span className="font-black text-sm text-emerald-900">رياض القرآن</span>
        </div>
        <div className="w-8" />
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden
        flex flex-col border-l border-slate-100
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={32} height={32} className="object-contain" />
            <span className="font-black text-sm text-emerald-900">رياض القرآن</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.path} item={item} onClick={() => setIsOpen(false)} />
          ))}
        </nav>

        <UserFooter />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex w-64 bg-white border-l border-slate-100 h-screen sticky top-0 flex-col shadow-sm">
        {/* Brand header */}
        <div className="h-18 flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Image
            src="/logo.png"
            alt="رياض القرآن"
            width={40}
            height={40}
            className="object-contain shrink-0"
          />
          <div className="min-w-0">
            <span className="font-black text-sm text-emerald-900 block leading-tight truncate">
              رياض القرآن
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">لوحة الإدارة</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <UserFooter />
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, LogOut, User, Home, Users, Award, BookOpen, 
  Heart, Activity, HelpCircle, FileText 
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface SidebarProps {
  adminName: string;
}

export function Sidebar({ adminName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'الرئيسية', path: '/admin/dashboard', icon: Home, emoji: '🏠' },
    { name: 'الطلاب', path: '/admin/dashboard/students', icon: Users, emoji: '👶' },
    { name: 'المعلمات', path: '/admin/dashboard/teachers', icon: User, emoji: '👩‍🏫' },
    { name: 'تقييم المعلمات', path: '/admin/dashboard/assessments', icon: Award, emoji: '📊' },
    { name: 'طلبات الحجز', path: '/admin/dashboard/bookings', icon: BookOpen, emoji: '📝' },
    { name: 'كفالة الأيتام', path: '/admin/dashboard/orphans', icon: Heart, emoji: '🤝' },
    { name: 'المساعدات المرضية', path: '/admin/dashboard/medical', icon: Activity, emoji: '🩺' },
    { name: 'الحالات الفقيرة', path: '/admin/dashboard/poor', icon: HelpCircle, emoji: '💸' },
  ];

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      router.push('/admin/login');
      router.refresh();
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-4">
        <button onClick={toggleSidebar} className="text-slate-600 focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-brand-primary flex items-center gap-2">
          <span>🕌</span> رياض القرآن
        </span>
        <div className="w-6" /> {/* spacer */}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Mobile Drawer */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out border-l border-slate-100 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <span className="font-bold text-lg text-brand-primary flex items-center gap-2">
            <span>🕌</span> رياض القرآن
          </span>
          <button onClick={toggleSidebar} className="text-slate-600 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
              {adminName[0]}
            </div>
            <div>
              <p className="text-xs text-slate-500">مرحباً بك</p>
              <p className="text-sm font-semibold text-slate-800">{adminName}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (RTL) */}
      <div className="hidden md:flex w-64 bg-white border-l border-slate-100 h-screen sticky top-0 flex-col">
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <span className="font-bold text-xl text-brand-primary flex items-center gap-2">
            <span className="text-2xl">🕌</span> 
            <span className="tracking-wide">رياض القرآن</span>
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 overflow-y-auto px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg">
              {adminName[0]}
            </div>
            <div>
              <p className="text-xs text-slate-500">المدير المسؤول</p>
              <p className="text-sm font-semibold text-slate-800">{adminName}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
}

'use client';

import { motion, AnimatePresence } from "motion/react";
import {
  X, Home, Gift, Award, Heart,
  Phone, User, ShieldCheck, Baby, HeartHandshake,
  Stethoscope, HandCoins, GraduationCap, Wallet, ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─── البوابات ─── */
const PORTALS = [
  {
    title: "بوابة أولياء الأمور",
    subtitle: "متابعة الطفل والدرجات",
    icon: User,
    href: "/parent/login",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-200",
    tag: "ولي الأمر",
    tagBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    title: "دخول المعلمات",
    subtitle: "رصد الدرجات وإدارة الفصل",
    icon: GraduationCap,
    href: "/teacher/login",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    border: "border-sky-200",
    tag: "المعلمة",
    tagBg: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    title: "دخول الإدارة",
    subtitle: "لوحة التحكم الكاملة",
    icon: ShieldCheck,
    href: "/admin/login",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    border: "border-rose-200",
    tag: "المشرف",
    tagBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

/* ─── التسجيل ─── */
const REGISTER = [
  {
    title: "تسجيل حالة فقيرة",
    subtitle: "دعم الأسر غير القادرة",
    icon: HandCoins,
    href: "/register/poor",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "تسجيل طالب حضانة",
    subtitle: "الالتحاق للمرة الأولى",
    icon: Baby,
    href: "/register/nursery",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "تسجيل حالة يتيمة",
    subtitle: "كفالة الأيتام والأسر",
    icon: HeartHandshake,
    href: "/register/orphan",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "تسجيل حالة مرضية",
    subtitle: "دعم العلاج والأدوية",
    icon: Stethoscope,
    href: "/register/medical",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

/* ─── الموقع ─── */
const MAIN_LINKS = [
  { title: "الرئيسية",       subtitle: "",                  icon: Home,     href: "/" },
  { title: "متجر التبرعات",  subtitle: "المشاريع الخيرية",  icon: Gift,     href: "#store" },
  { title: "نظام الحضانة",   subtitle: "البوابة التعليمية", icon: Award,    href: "/nursery" },
  { title: "كفالات الأيتام", subtitle: "21 أسرة مسجلة",     icon: Heart,    href: "#store" },
  { title: "تواصل واتساب",   subtitle: "01010453630",        icon: Phone,    href: "https://wa.me/201010453630" },
];

export function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto"
        >
          <div className="container mx-auto max-w-4xl px-5 py-8" dir="rtl">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="رياض القرآن" width={44} height={44} className="object-contain" />
                </div>
                <div>
                  <p className="font-black text-emerald-950 text-base leading-tight">جمعية رياض القرآن الكريم</p>
                  <p className="text-xs font-semibold text-secondary mt-0.5">المشهرة برقم 1300 — المنشأة الكبرى</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all border border-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ══ البوابات ══ */}
            <SectionLabel text="البوابات الإلكترونية" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {PORTALS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div key={p.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link
                      href={p.href}
                      onClick={onClose}
                      className={`group flex items-center gap-4 p-5 rounded-2xl bg-white border ${p.border} hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}
                    >
                      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${p.iconBg} group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-5 h-5 ${p.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-800 text-sm leading-tight">{p.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.subtitle}</p>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* ══ التسجيل ══ */}
            <SectionLabel text="خدمات التسجيل والدعم الاجتماعي" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {REGISTER.map((r, i) => {
                const Icon = r.icon;
                return (
                  <motion.div key={r.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.06 }}>
                    <Link
                      href={r.href}
                      onClick={onClose}
                      className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-center"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${r.iconBg} group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-5 h-5 ${r.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight">{r.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{r.subtitle}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* ══ الموقع ══ */}
            <SectionLabel text="روابط الموقع" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-10">
              {MAIN_LINKS.map((l, i) => {
                const Icon = l.icon;
                return (
                  <motion.div key={l.href + l.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 + i * 0.04 }}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-primary/30 hover:bg-emerald-50/40 transition-all cursor-pointer"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-700 text-xs leading-tight truncate group-hover:text-primary transition-colors">{l.title}</p>
                        {l.subtitle && <p className="text-[10px] text-slate-400 truncate">{l.subtitle}</p>}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Wallet, text: "الحساب: 1300" },
                  { icon: Phone,  text: "فودافون: 01010453630" },
                  { icon: Phone,  text: "انستاباي: 01281660541" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <span key={item.text} className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                      <Icon className="w-3 h-3 text-slate-400" />
                      {item.text}
                    </span>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم
              </p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-4 rounded-full bg-primary" />
      <p className="text-xs font-black text-slate-600 tracking-wide">{text}</p>
    </div>
  );
}

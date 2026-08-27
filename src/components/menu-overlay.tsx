'use client';

import { motion, AnimatePresence } from "motion/react";
import {
  X, Home, Gift, Award, Heart, BookOpen,
  Phone, User, ShieldCheck, Baby, HeartHandshake,
  Stethoscope, HandCoins, GraduationCap, Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   تعريف الروابط مع لون وأيقونة وخلفية لكل قسم
═══════════════════════════════════════════════ */

interface MenuLink {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  href: string;
  section: "portals" | "register" | "main";
  accent: string;       // لون الأيقونة
  bg: string;           // خلفية الكارد عادي
  bgHover: string;      // خلفية عند hover
  border: string;       // لون البوردر
  iconBg: string;       // خلفية الأيقونة
  iconHover: string;    // خلفية الأيقونة عند hover
}

const MENU_LINKS: MenuLink[] = [
  /* ─── البوابات ─── */
  {
    title:    "بوابة أولياء الأمور",
    subtitle: "متابعة الطفل والدرجات",
    icon: User,
    href: "/parent/login",
    section: "portals",
    accent: "text-amber-300",
    bg: "bg-amber-500/20",
    bgHover: "hover:bg-amber-500/35",
    border: "border-amber-400/40",
    iconBg: "bg-amber-400/30",
    iconHover: "group-hover:bg-amber-500",
  },
  {
    title:    "دخول المعلمات",
    subtitle: "لوحة الحضانة والفصول",
    icon: GraduationCap,
    href: "/teacher/login",
    section: "portals",
    accent: "text-sky-300",
    bg: "bg-sky-500/20",
    bgHover: "hover:bg-sky-500/35",
    border: "border-sky-400/40",
    iconBg: "bg-sky-400/30",
    iconHover: "group-hover:bg-sky-500",
  },
  {
    title:    "دخول الإدارة",
    subtitle: "لوحة التحكم الكاملة",
    icon: ShieldCheck,
    href: "/admin/login",
    section: "portals",
    accent: "text-rose-300",
    bg: "bg-rose-500/20",
    bgHover: "hover:bg-rose-500/35",
    border: "border-rose-400/40",
    iconBg: "bg-rose-400/30",
    iconHover: "group-hover:bg-rose-500",
  },

  /* ─── التسجيل ─── */
  {
    title:    "تسجيل حالة فقيرة",
    subtitle: "دعم الأسر غير القادرة",
    icon: HandCoins,
    href: "/register/poor",
    section: "register",
    accent: "text-yellow-300",
    bg: "bg-yellow-500/18",
    bgHover: "hover:bg-yellow-500/30",
    border: "border-yellow-400/35",
    iconBg: "bg-yellow-400/25",
    iconHover: "group-hover:bg-yellow-500",
  },
  {
    title:    "تسجيل طالب حضانة",
    subtitle: "التسجيل للمرة الأولى",
    icon: Baby,
    href: "/register/nursery",
    section: "register",
    accent: "text-emerald-300",
    bg: "bg-emerald-500/18",
    bgHover: "hover:bg-emerald-500/30",
    border: "border-emerald-400/35",
    iconBg: "bg-emerald-400/25",
    iconHover: "group-hover:bg-emerald-500",
  },
  {
    title:    "تسجيل حالة يتيمة",
    subtitle: "كفالة الأيتام والأسر",
    icon: HeartHandshake,
    href: "/register/orphan",
    section: "register",
    accent: "text-pink-300",
    bg: "bg-pink-500/18",
    bgHover: "hover:bg-pink-500/30",
    border: "border-pink-400/35",
    iconBg: "bg-pink-400/25",
    iconHover: "group-hover:bg-pink-500",
  },
  {
    title:    "تسجيل حالة مرضية",
    subtitle: "دعم العلاج والأدوية",
    icon: Stethoscope,
    href: "/register/medical",
    section: "register",
    accent: "text-cyan-300",
    bg: "bg-cyan-500/18",
    bgHover: "hover:bg-cyan-500/30",
    border: "border-cyan-400/35",
    iconBg: "bg-cyan-400/25",
    iconHover: "group-hover:bg-cyan-500",
  },

  /* ─── الموقع ─── */
  {
    title: "الرئيسية",
    icon: Home,
    href: "/",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
  {
    title:    "متجر التبرعات",
    subtitle: "المشاريع الخيرية",
    icon: Gift,
    href: "#store",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
  {
    title:    "نظام الحضانة",
    subtitle: "البوابة التعليمية",
    icon: Award,
    href: "/nursery",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
  {
    title:    "كفالات الأيتام",
    subtitle: "21 أسرة مسجلة",
    icon: Heart,
    href: "#orphans",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
  {
    title:    "بنك الطعام",
    subtitle: "121 حالة شهرياً",
    icon: BookOpen,
    href: "#food",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
  {
    title:    "تواصل واتساب",
    subtitle: "01010453630",
    icon: Phone,
    href: "https://wa.me/201010453630",
    section: "main",
    accent: "text-white",
    bg: "bg-white/10",
    bgHover: "hover:bg-white/18",
    border: "border-white/15",
    iconBg: "bg-white/15",
    iconHover: "group-hover:bg-secondary",
  },
];

const SECTIONS: { key: "portals" | "register" | "main"; label: string; labelCls: string }[] = [
  {
    key: "portals",
    label: "🔐  البوابات الإلكترونية",
    labelCls: "text-amber-200 border-amber-400/50 bg-amber-400/20",
  },
  {
    key: "register",
    label: "📋  خدمات التسجيل والدعم",
    labelCls: "text-emerald-200 border-emerald-400/50 bg-emerald-400/20",
  },
  {
    key: "main",
    label: "🌐  روابط الموقع",
    labelCls: "text-white/80 border-white/25 bg-white/10",
  },
];

/* ═══════════════════════════════════════════════
   المكوّن الرئيسي
═══════════════════════════════════════════════ */
export function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{ background: "linear-gradient(135deg, #0f3d1a 0%, #1a6b2e 50%, #0f3d1a 100%)" }}
        >
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
          </div>

          <div className="relative container mx-auto max-w-5xl px-5 py-8">

            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg p-1.5 flex items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="رياض القرآن" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">
                    جمعية رياض القرآن الكريم
                  </h3>
                  <p className="text-xs text-secondary font-bold mt-0.5">
                    المشهرة برقم 1300 — المنشأة الكبرى، سوهاج
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300 cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Sections ── */}
            <div className="space-y-10">
              {SECTIONS.map((sec) => {
                const links = MENU_LINKS.filter((l) => l.section === sec.key);
                return (
                  <div key={sec.key}>
                    {/* Section label */}
                    <span className={`inline-flex items-center text-[11px] font-black px-3.5 py-1.5 rounded-full border mb-5 tracking-wide ${sec.labelCls}`}>
                      {sec.label}
                    </span>

                    {/* Cards grid */}
                    <div className={`grid gap-3 ${
                      sec.key === "portals"
                        ? "grid-cols-1 sm:grid-cols-3"
                        : sec.key === "register"
                        ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
                        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    }`}>
                      {links.map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.div
                            key={link.href + link.title}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className={`
                                group flex items-center gap-4 px-5 py-4 rounded-2xl border
                                transition-all duration-200 cursor-pointer
                                ${link.bg} ${link.bgHover} ${link.border}
                                ${sec.key === "portals" ? "py-5" : ""}
                              `}
                            >
                              {/* Icon box */}
                              <div className={`
                                shrink-0 w-11 h-11 flex items-center justify-center rounded-xl
                                transition-all duration-200 ${link.iconBg} ${link.iconHover}
                                ${sec.key === "portals" ? "w-12 h-12 rounded-2xl" : ""}
                              `}>
                                <Icon className={`w-5 h-5 ${link.accent} group-hover:text-white transition-colors`} />
                              </div>

                              {/* Text */}
                              <div className="min-w-0">
                                <p className={`font-black text-white text-sm leading-tight truncate
                                  ${sec.key === "portals" ? "text-base" : "text-sm"}
                                `}>
                                  {link.title}
                                </p>
                                {link.subtitle && (
                                  <p className="text-[11px] text-white/70 mt-0.5 truncate font-medium">
                                    {link.subtitle}
                                  </p>
                                )}
                              </div>

                              {/* Arrow indicator for portals */}
                              {sec.key === "portals" && (
                                <div className="mr-auto shrink-0 w-7 h-7 rounded-full bg-white/8 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                  <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white rotate-180 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div className="mt-12 pt-6 border-t border-white/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: <Wallet className="w-3.5 h-3.5" />, label: "الحساب البنكي: 1300" },
                    { icon: <Phone className="w-3.5 h-3.5" />, label: "فودافون كاش: 01010453630" },
                    { icon: <Phone className="w-3.5 h-3.5" />, label: "انستا باي: 01281660541" },
                  ].map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                      <span className="text-white/50">{item.icon}</span>
                      {item.label}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/50">
                  &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

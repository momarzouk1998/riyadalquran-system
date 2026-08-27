'use client';

import { motion, AnimatePresence } from "motion/react";
import {
  X, Home, Gift, Award, Heart, BookOpen, Users,
  Phone, User, ShieldCheck, Baby, HeartHandshake,
  Stethoscope, HandCoins,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MENU_LINKS = [
  { title: "الرئيسية",                      icon: Home,           href: "/",                         section: "main" },
  { title: "متجر المشاريع والتبرعات",        icon: Gift,           href: "#store",                    section: "main" },
  { title: "بوابة أولياء الأمور والطفل",     icon: User,           href: "/parent/login",             section: "portals" },
  { title: "دخول الإدارة",                   icon: ShieldCheck,    href: "/admin/login",              section: "portals" },
  { title: "بوابة ونظام الحضانة",            icon: Award,          href: "/nursery",                  section: "main" },
  // صفحات التسجيل الجديدة
  { title: "تسجيل حالة فقيرة",               icon: HandCoins,      href: "/register/poor",            section: "register" },
  { title: "تسجيل طالب حضانة (أول مرة)",    icon: Baby,           href: "/register/nursery",         section: "register" },
  { title: "تسجيل حالة يتيمة",               icon: HeartHandshake, href: "/register/orphan",          section: "register" },
  { title: "تسجيل حالة مرضية",               icon: Stethoscope,    href: "/register/medical",         section: "register" },
  // خدمات عامة
  { title: "كفالات الأيتام",                 icon: Heart,          href: "#orphans",                  section: "main" },
  { title: "سلال بنك الطعام",                icon: BookOpen,       href: "#food",                     section: "main" },
  { title: "تواصل معنا (واتساب)",            icon: Phone,          href: "https://wa.me/201010453630",section: "main" },
];

const SECTION_LABELS: Record<string, string> = {
  portals:  "البوابات الإلكترونية",
  register: "خدمات التسجيل والدعم",
  main:     "روابط الموقع",
};

const SECTION_COLORS: Record<string, string> = {
  portals:  "bg-amber-500/20 text-amber-200 border-amber-400/30",
  register: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  main:     "bg-white/10 text-white/70 border-white/15",
};

const sections = ["portals", "register", "main"] as const;

export function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          className="fixed inset-0 z-[100] bg-primary/98 backdrop-blur-2xl p-6 md:p-10 overflow-y-auto font-tajawal text-white"
        >
          <div className="container mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg">
                  <Image src="/logo.png" alt="رياض القرآن" width={44} height={44} className="object-contain" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">جمعية رياض القرآن الكريم</h3>
                  <p className="text-xs text-secondary font-bold">المشهرة برقم 1300 بالمنشأة الكبرى</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section) => {
                const links = MENU_LINKS.filter((l) => l.section === section);
                return (
                  <div key={section}>
                    <p className={`inline-flex items-center gap-2 text-[11px] font-black px-3 py-1 rounded-full border mb-4 ${SECTION_COLORS[section]}`}>
                      {SECTION_LABELS[section]}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {links.map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.div
                            key={link.href + link.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all group cursor-pointer
                                ${section === "portals"
                                  ? "bg-amber-500/10 border-amber-400/20 hover:bg-amber-500/25"
                                  : section === "register"
                                  ? "bg-emerald-500/10 border-emerald-400/20 hover:bg-emerald-500/25"
                                  : "bg-white/5 border-white/10 hover:bg-white/15"
                                }`}
                            >
                              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-all duration-300
                                ${section === "portals"
                                  ? "bg-amber-400/20 text-amber-300 group-hover:bg-secondary group-hover:text-white"
                                  : section === "register"
                                  ? "bg-emerald-400/20 text-emerald-300 group-hover:bg-secondary group-hover:text-white"
                                  : "bg-white/10 text-white group-hover:bg-secondary"
                                }`}
                              >
                                <Icon className="w-7 h-7" />
                              </div>
                              <span className="text-white text-sm font-bold text-center leading-snug group-hover:text-amber-300 transition-colors">
                                {link.title}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span>الحساب البنكي: 1300</span>
                <span>فودافون كاش: 01010453630</span>
                <span>انستا باي: 01281660541</span>
              </div>
              <div>
                &copy; {new Date().getFullYear()} جمعية رياض القرآن الكريم. جميع الحقوق محفوظة لـ OpenAppo.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

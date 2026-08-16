'use client';

import { motion, AnimatePresence } from "motion/react";
import { X, Home, Gift, Award, Heart, BookOpen, Users, PhoneCall, Shield, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MENU_LINKS = [
  { title: "الرئيسية", icon: Home, href: "/" },
  { title: "عن الجمعية المشهرة", icon: Shield, href: "#about" },
  { title: "متجر المشاريع والتبرعات", icon: Gift, href: "#store" },
  { title: "تاب الحضانة والدرجات", icon: Award, href: "#nursery-platform" },
  { title: "كفالات الأيتام (21 أسرة)", icon: Heart, href: "#orphans" },
  { title: "سلال بنك الطعام (121 حالة)", icon: BookOpen, href: "#food" },
  { title: "بوابة أولياء الأمور", icon: Users, href: "/parent/login" },
  { title: "بوابة الإدارة والمشرفين", icon: Users, href: "/admin/login" },
  { title: "تواصل معنا", icon: Phone, href: "#contact" },
];

export function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[100] bg-primary/98 backdrop-blur-2xl p-8 overflow-y-auto font-tajawal text-white"
        >
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {MENU_LINKS.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all group cursor-pointer"
                    >
                      <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl group-hover:scale-110 group-hover:bg-secondary transition-all duration-300 text-white">
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-white text-base font-bold text-center group-hover:text-amber-300 transition-colors">{link.title}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/60">
              <div className="flex gap-6">
                <span>الحساب البنكي الرسمي: 1300</span>
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
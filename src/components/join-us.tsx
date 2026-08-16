'use client';

import { motion } from "motion/react";
import Link from "next/link";

export function JoinUs() {
  return (
    <section className="py-20 relative overflow-hidden font-tajawal">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              كن جزءاً من <span className="text-amber-300">عائلة</span> رياض القرآن
            </h2>
            <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed font-light">
              انضم إلينا كمتطوع، كافل يتيم، أو ولي أمر طفل بالحضانة وساعدنا في نشر الخير والتعليم بالمنشأة الكبرى. عطاؤك يصنع الأثر المباشر.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <a href="#store" className="bg-secondary text-white px-10 py-4 rounded-2xl font-black text-xs sm:text-sm hover:bg-white hover:text-primary transition-all shadow-2xl">
                ساهم وتبرع الآن
              </a>
              <Link href="/parent/login" className="bg-white/15 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-black text-xs sm:text-sm hover:bg-white hover:text-primary transition-all">
                بوابة أولياء الأمور
              </Link>
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
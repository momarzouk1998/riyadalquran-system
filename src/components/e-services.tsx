'use client';

import { motion } from "motion/react";
import Link from "next/link";

export function EServices() {
  return (
    <section className="relative bg-primary py-36 overflow-hidden font-tajawal">
      {/* Top Wave */}
      <div className="absolute top-0 inset-x-0 wave-container">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-28 w-full fill-white">
          <path d="M-0.27,149.50 C190.46,1.48 288.09,-0.48 499.72,150.48 L514.39,-49.83 L-0.27,-15.28 Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.img 
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            src="https://emch.ae/WebsiteNewContent/images/electronic_services.svg" 
            className="mx-auto mb-4 w-20 invert brightness-0" 
            alt="icon" 
          />
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-white"
          >
            الخدمات والبوابات الإلكترونية
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "بوابة متابعة الطفل بالرياض", icon: "newfifthsection-1.svg", color: "bg-white/10", btn: "دخول ولي الأمر", href: "/parent/login", desc: "متابعة درجات الطفل شهرياً وموقفه المالي" },
            { title: "بوابة المساعدات الخيرية", icon: "newfifthsection-2.svg", color: "bg-white/20", btn: "حجز مقعد حضانة", href: "/nursery", desc: "تقديم طلب حجز جديد لطفلك بالجمعية" },
            { title: "بوابة المشرفين والإدارة", icon: "newfifthsection-3.svg", color: "bg-white/10", btn: "دخول الإدارة", href: "/admin/login", desc: "لوحة التحكم ورصد درجات المعلمات والطلاب" },
          ].map((gate, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${gate.color} rounded-[3rem] p-10 text-center text-white border border-white/10 hover:bg-white/25 transition-all group backdrop-blur-sm flex flex-col justify-between`}
            >
              <div>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <img src={`https://emch.ae/WebsiteNewContent/images/${gate.icon}`} className="w-12 invert" alt="gate" />
                </div>
                <h3 className="text-2xl font-black mb-3">{gate.title}</h3>
                <p className="text-white/70 text-xs mb-8 leading-relaxed">{gate.desc}</p>
              </div>
              <Link href={gate.href} className="w-full bg-white text-primary py-4 rounded-2xl font-black hover:bg-secondary hover:text-white transition-all shadow-xl text-xs block">
                {gate.btn}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 inset-x-0 wave-container">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-28 w-full fill-white">
          <path d="M-13.82,167.27 C132.34,-22.20 349.20,-49.98 513.26,165.28 L514.39,179.11 L-23.98,182.06 Z"></path>
        </svg>
      </div>
    </section>
  );
}
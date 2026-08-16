'use client';

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const STATS = [
  { label: "كفالة أيتام مسجلة", value: 21, suffix: "أسرة", icon: "combined-shape1.svg", color: "bg-primary" },
  { label: "كراتين بنك الطعام", value: 121, suffix: "حالة شهرياً", icon: "combined-shape2.svg", color: "bg-secondary" },
  { label: "المساعدات العلاجية", value: 21, suffix: "حالة مرضية", icon: "combined-shape1.svg", color: "bg-primary" },
  { label: "رقم الإشهار الرسمي", value: 1300, suffix: "البنك الزراعي", icon: "combined-shape4.svg", color: "bg-secondary" },
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = Math.max(1, Math.floor(end / (duration / 16)));
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Achievements() {
  return (
    <section className="py-32 bg-light relative overflow-hidden font-tajawal">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(https://emch.ae/WebsiteNewContent/images/pattern_1.png)', backgroundSize: '400px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.img 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            src="https://emch.ae/WebsiteNewContent/images/loving-home.svg" 
            className="mx-auto mb-6 w-20" 
            alt="icon" 
          />
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
          >
            إنجازاتنا بالأرقام والشفافية
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted text-base max-w-2xl mx-auto leading-relaxed"
          >
            نمد جسور الإنسانية والتكافل الاجتماعي بالمنشأة الكبرى بين المحسن والمحتاج لينمو العطاء
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 max-w-6xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className={`w-56 h-56 rounded-full ${stat.color} flex flex-col items-center justify-center text-white p-6 shadow-2xl relative group border-4 border-white/20`}>
                <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-105 group-hover:scale-115 transition-transform duration-700 pointer-events-none" />
                <p className="text-xs font-bold mb-1 opacity-90">{stat.label}</p>
                <div className="text-4xl font-black">
                  <Counter value={stat.value} />
                </div>
                <span className="text-[10px] text-amber-300 font-bold mt-1">{stat.suffix}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
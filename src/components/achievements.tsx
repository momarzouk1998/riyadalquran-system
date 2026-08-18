'use client';

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Droplets, Heart, Sparkles, Users, Award } from "lucide-react";

const STATS = [
  {
    id: 1,
    label: "المشاريع الخيرية",
    value: 33210,
    icon: Droplets,
    color: "from-blue-600 to-cyan-500",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    floatDuration: 4.2
  },
  {
    id: 2,
    label: "كفالة الأيتام والطلاب",
    value: 8952,
    icon: Heart,
    color: "from-amber-500 to-orange-400",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    floatDuration: 4.8
  },
  {
    id: 3,
    label: "البرامج والمساعدات",
    value: 60487,
    icon: Sparkles,
    color: "from-emerald-600 to-teal-500",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    floatDuration: 5.2
  },
  {
    id: 4,
    label: "الأسر المستفيدة",
    value: 16025,
    icon: Users,
    color: "from-purple-600 to-indigo-500",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    floatDuration: 4.5
  }
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Achievements() {
  return (
    <section 
      id="third-section" 
      className="relative w-full py-24 overflow-hidden font-tajawal bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-100"
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Heading Section */}
        <div className="text-center mb-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-100/80 border border-amber-300/50 flex items-center justify-center shadow-md animate-pulse">
            <Award className="w-8 h-8 text-amber-600" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            إنجازاتنا بالمنشأة الكبرى
          </h2>

          <p className="text-sm sm:text-base font-medium text-slate-500 max-w-xl">
            نمد جسور الإنسانية بين المحسن والمحتاج لينمو العطاء ويزهر الأثر
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: stat.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group-hover:-translate-y-1"
                >
                  {/* Top glowing gradient pill */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                    <Counter value={stat.value} />
                    <span className="text-secondary text-2xl font-bold font-tajawal me-1">+</span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-600 leading-tight mb-4">
                    {stat.label}
                  </p>

                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${stat.badgeColor}`}>
                    موثق ومسجل رسمياً
                  </div>

                  <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-slate-100 rounded-full blur-2xl group-hover:bg-amber-100/50 transition-colors" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
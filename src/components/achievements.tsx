'use client';

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const STATS = [
  { 
    id: 1, 
    label: "المشاريع الخيرية", 
    value: 21, 
    suffix: "مشروع معتمد",
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape1.svg", 
    isOffset: false,
    topType: "teal", // teal top (icon + label), gold bottom (number)
  },
  { 
    id: 2, 
    label: "كفالة الأيتام", 
    value: 21, 
    suffix: "أسرة مكفولة",
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape2.svg", 
    isOffset: true, // staggered top offset like original top-100
    topType: "gold", // gold top (number), teal bottom (icon + label)
  },
  { 
    id: 3, 
    label: "بنك الطعام المصري", 
    value: 121, 
    suffix: "حالة شهرياً",
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape1.svg", 
    isOffset: false,
    topType: "teal",
  },
  { 
    id: 4, 
    label: "رقم الإشهار الرسمي", 
    value: 1300, 
    suffix: "البنك الزراعي",
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape4.svg", 
    isOffset: true,
    topType: "gold",
  },
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
    <section 
      id="third-section" 
      className="py-28 bg-[#f9fafb] relative overflow-hidden font-tajawal"
      style={{ 
        backgroundImage: 'url(https://emch.ae/WebsiteNewContent/images/pattern_1.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '350px'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Heading matching emch.ae original */}
        <div className="text-center mb-20 space-y-3">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <img 
              src="https://emch.ae/WebsiteNewContent/images/loving-home.svg" 
              alt="loving home icon" 
              className="mx-auto w-16 h-16 mb-2"
            />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900"
          >
            إنجازاتنا
          </motion.h2>

          <motion.h4 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium"
          >
            نمد جسور الإنسانية بين المحسن والمحتاج بالمنشأة الكبرى لينمو العطاء
          </motion.h4>
        </div>

        {/* 4 Staggered Two-Tone Counter Pill Containers matching emch.ae flipInY wrappers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className={`flex flex-col items-center justify-center ${stat.isOffset ? 'lg:-translate-y-6' : ''}`}
            >
              <div className="w-56 rounded-[3.5rem] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 group border-2 border-white/40">
                
                {stat.topType === 'teal' ? (
                  <>
                    {/* Top Teal Half (blue-first) */}
                    <div className="bg-[#246c74] text-white p-8 text-center flex flex-col items-center justify-center space-y-2 border-b border-white/10">
                      <img 
                        src={stat.icon} 
                        alt="icon" 
                        className="w-12 h-12 invert group-hover:scale-110 transition-transform duration-300"
                      />
                      <p className="font-bold text-sm leading-snug">{stat.label}</p>
                    </div>

                    {/* Bottom Gold Half (yellow-first) */}
                    <div className="bg-[#bd9d54] text-white p-6 text-center flex flex-col items-center justify-center">
                      <span className="text-4xl font-black tracking-tight drop-shadow-md">
                        <Counter value={stat.value} />
                      </span>
                      <span className="text-[11px] font-bold text-amber-100 mt-1">{stat.suffix}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Top Gold Half (yellow-second) */}
                    <div className="bg-[#bd9d54] text-white p-6 text-center flex flex-col items-center justify-center border-b border-white/10">
                      <span className="text-4xl font-black tracking-tight drop-shadow-md">
                        <Counter value={stat.value} />
                      </span>
                      <span className="text-[11px] font-bold text-amber-100 mt-1">{stat.suffix}</span>
                    </div>

                    {/* Bottom Teal Half (blue-second) */}
                    <div className="bg-[#246c74] text-white p-8 text-center flex flex-col items-center justify-center space-y-2">
                      <img 
                        src={stat.icon} 
                        alt="icon" 
                        className="w-12 h-12 invert group-hover:scale-110 transition-transform duration-300"
                      />
                      <p className="font-bold text-sm leading-snug">{stat.label}</p>
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
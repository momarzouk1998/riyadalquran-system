'use client';

import { motion } from "motion/react";

const DOORS = [
  { 
    title: "المشاريع الخيرية", 
    desc: "كفالة الأيتام - تحلية المياه - المساعدات الطبية", 
    color: "bg-primary", 
    btn: "تبرع للمشاريع", 
    href: "#store",
    icon: "https://emch.ae/WebsiteNewContent/images/newfifthsection-1.svg"
  },
  { 
    title: "الكفالات", 
    desc: "21 أسرة يتيمة - طلاب الحضانة - أسر متعففة", 
    color: "bg-secondary", 
    btn: "اكفل الآن", 
    href: "#orphans",
    icon: "https://emch.ae/WebsiteNewContent/images/newfifthsection-2.svg"
  },
  { 
    title: "التبرعات العاجلة", 
    desc: "صدقة عامة - بنك الطعام المصري - إطعام الطعام", 
    color: "bg-primary", 
    btn: "تبرع الآن", 
    href: "#donations",
    icon: "https://emch.ae/WebsiteNewContent/images/newfifthsection-3.svg"
  },
  { 
    title: "الحالات الطارئة", 
    desc: "علاجية - ترميم بيوت - تيسير زواج الفتيات", 
    color: "bg-secondary", 
    btn: "شارك في الخير", 
    href: "#campaigns",
    icon: "https://emch.ae/WebsiteNewContent/images/newfifthsection-1.svg"
  },
];

export function DoorsOfGood() {
  return (
    <section className="py-24 container mx-auto px-4 font-tajawal">
      <div className="text-center mb-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold mb-3"
        >
          أبواب الخير بالجمعية
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900"
        >
          تخير من .. <span className="text-primary">أبواب الخير</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {DOORS.map((door, i) => (
          <motion.div
            key={door.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-[2.5rem] p-10 text-white h-[380px] flex flex-col justify-end group cursor-pointer shadow-2xl ${door.color}`}
          >
            <div className="absolute top-10 right-10 opacity-15 group-hover:opacity-25 group-hover:scale-125 transition-all duration-500">
              <img src={door.icon} className="w-32 h-32 invert" alt="icon" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-3 leading-tight">{door.title}</h3>
              <p className="text-white/80 mb-8 text-xs leading-relaxed">{door.desc}</p>
              <a 
                href={door.href} 
                className="inline-flex items-center justify-center w-full py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-secondary hover:text-white transition-all shadow-lg text-xs"
              >
                {door.btn}
              </a>
            </div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
'use client';

import { motion } from "motion/react";
import { HeartHandshake, Users, Flame, Droplets } from "lucide-react";

const DOORS = [
  {
    title: "المشاريع الخيرية",
    desc: "كفالة الأيتام - الحالات المرضية - الحالات الفقيرة - توزيع الطعام - محطة المياه - المسجد - تجهيز العرائس",
    color: "bg-primary",
    btn: "تبرع للمشاريع",
    href: "#store",
    icon: Droplets
  },
  {
    title: "الكفالات",
    desc: "21 أسرة يتيمة - طلاب الحضانة - أسر متعففة",
    color: "bg-secondary",
    btn: "اكفل الآن",
    href: "#orphans",
    icon: Users
  },
  {
    title: "التبرعات العاجلة",
    desc: "صدقة عامة - بنك الطعام المصري - إطعام الطعام",
    color: "bg-primary",
    btn: "تبرع الآن",
    href: "#donations",
    icon: Flame
  },
  {
    title: "الحالات الطارئة",
    desc: "علاجية - تيسير زواج الفتيات",
    color: "bg-secondary",
    btn: "شارك في الخير",
    href: "#campaigns",
    icon: HeartHandshake
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
        {DOORS.map((door, i) => {
          const Icon = door.icon;
          return (
            <motion.div
              key={door.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-[2.5rem] p-10 text-white h-[380px] flex flex-col justify-end group cursor-pointer shadow-2xl ${door.color}`}
            >
              <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                <Icon className="w-12 h-12 text-white" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 leading-tight">{door.title}</h3>
                <p className="text-white/80 mb-8 text-xs leading-relaxed">{door.desc}</p>
                <a 
                  href={door.href} 
                  className="inline-flex items-center justify-center w-full py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-amber-400 hover:text-slate-950 transition-all shadow-lg text-xs"
                >
                  {door.btn}
                </a>
              </div>

              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
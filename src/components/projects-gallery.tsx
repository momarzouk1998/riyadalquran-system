'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

const PROJECTS = [
  { src: "/projects/orphans.png",  title: "كفالة الأيتام",      rotate: -18, x: -340 },
  { src: "/projects/food.jpg",     title: "توزيع الطعام",        rotate: -9,  x: -170 },
  { src: "/projects/nursery.png",  title: "حضانة الأطفال",      rotate: 0,   x: 0    },
  { src: "/projects/houses.png",   title: "ترميم البيوت",        rotate: 9,   x: 170  },
  { src: "/projects/water.png",    title: "محطة المياه",         rotate: 18,  x: 340  },
];

export function ProjectsGallery() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // الصور تنفرد من الوسط مع الـ scroll
  const spread = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="py-24 overflow-hidden bg-slate-50 font-tajawal">
      <div className="container mx-auto px-4 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold mb-4 border border-primary/20"
        >
          مكتبة مشاريعنا
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-black text-slate-900"
        >
          مشاريع <span className="text-primary">جمعية رياض القرآن</span> الكريم
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-slate-500 text-sm mt-3 max-w-lg mx-auto"
        >
          من كفالة الأيتام إلى تحلية المياه — نخدم أبناء المنشأة الكبرى بمشاريع مستدامة
        </motion.p>
      </div>

      {/* Fan Gallery */}
      <div className="relative h-[420px] flex items-center justify-center">
        {PROJECTS.map((p, i) => (
          <FanCard
            key={p.src}
            src={p.src}
            title={p.title}
            targetRotate={p.rotate}
            targetX={p.x}
            spread={spread}
            index={i}
          />
        ))}
      </div>

      {/* Row labels below */}
      <div className="flex justify-center gap-3 flex-wrap mt-8 px-4">
        {PROJECTS.map((p) => (
          <motion.span
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm"
          >
            {p.title}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

function FanCard({
  src, title, targetRotate, targetX, spread, index,
}: {
  src: string;
  title: string;
  targetRotate: number;
  targetX: number;
  spread: ReturnType<typeof useTransform>;
  index: number;
}) {
  const rotate = useTransform(spread, [0, 1], [0, targetRotate]);
  const x      = useTransform(spread, [0, 1], [0, targetX]);
  const scale  = useTransform(spread, [0, 1], [0.85, index === 2 ? 1.08 : 0.95]);

  return (
    <motion.div
      style={{ rotate, x, scale, zIndex: index === 2 ? 10 : 5 - Math.abs(index - 2) }}
      className="absolute w-52 h-72 md:w-60 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer group"
      whileHover={{ scale: 1.05, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="280px"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <p className="text-white font-black text-sm">{title}</p>
      </div>
    </motion.div>
  );
}

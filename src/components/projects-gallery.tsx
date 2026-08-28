'use client';

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";

const PROJECTS = [
  {
    num: "01",
    title: "كفالة الأيتام",
    desc: "نكفل 21 أسرة يتيمة بالمنشأة الكبرى وقراها المجاورة، نوفر لهم الكفالة الشهرية وملابس العيد والمستلزمات المدرسية لضمان حياة كريمة.",
    img: "/projects/orphans.png",
    tag: "كفالات شهرية",
  },
  {
    num: "02",
    title: "حضانة الأطفال",
    desc: "نضم أكثر من 100 طفل في مراحل KG1 وKG2، بمناهج تحفيظ القرآن الكريم والأذكار واللغة الإنجليزية والحساب الذهني.",
    img: "/projects/nursery.png",
    tag: "تعليم وتحفيظ",
  },
  {
    num: "03",
    title: "ترميم البيوت",
    desc: "نرمم بيوت الأسر الفقيرة الهالكة ونوفر مواد البناء والعمالة لإعادة السكن الآمن لأكثر من 15 أسرة سنوياً.",
    img: "/projects/houses.png",
    tag: "مساعدات اجتماعية",
  },
  {
    num: "04",
    title: "محطة تحلية المياه",
    desc: "محطة تحلية مياه شرب مجانية تخدم أهالي القرية وتوفر مياهاً نقية لأكثر من 500 أسرة يومياً بتكلفة رمزية.",
    img: "/projects/water.png",
    tag: "سقيا ماء",
  },
  {
    num: "05",
    title: "الحالات المرضية",
    desc: "نساعد الحالات المرضية الحرجة في تكاليف العلاج والأدوية والعمليات الجراحية لضمان حصول كل مريض على الرعاية اللازمة.",
    img: "/projects/medical.png",
    tag: "رعاية صحية",
  },
  {
    num: "06",
    title: "تجهيز العرائس",
    desc: "نيسّر زواج الفتيات الفقيرات بتوفير جهاز العروسة والأثاث الأساسي، تخفيفاً للعبء عن كاهل الأسر غير القادرة.",
    img: "/projects/brides.png",
    tag: "تيسير الزواج",
  },
  {
    num: "07",
    title: "توزيع الطعام",
    desc: "توزيع الطرود الغذائية وسلال بنك الطعام المصري على 121 أسرة شهرياً، مع تكثيف العطاء في رمضان والمناسبات.",
    img: "/projects/food.jpg",
    tag: "إطعام وسلال",
  },
  {
    num: "08",
    title: "مسجد رياض القرآن",
    desc: "مسجد الجمعية الذي يُقام فيه تحفيظ القرآن الكريم وحلقات الذكر وصلاة الجمعة لأبناء المنشأة الكبرى.",
    img: "/projects/mosque.jpg",
    tag: "الشعائر الدينية",
  },
];

export function ProjectsGallery() {
  return (
    <section className="py-24 bg-slate-50 font-tajawal overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold mb-4 border border-primary/20">
            مشاريعنا الخيرية
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            نخدم أبناء <span className="text-primary">المنشأة الكبرى</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            من كفالة الأيتام إلى تحلية المياه — مشاريع متكاملة تصنع فارقاً حقيقياً في حياة الناس
          </p>
        </motion.div>

        {/* Projects — alternating rows */}
        <div className="space-y-20 md:space-y-28">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.num} project={p} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-10 md:gap-16`}
    >
      {/* ── Text ── */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 space-y-4"
      >
        {/* Number */}
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/25">
          <span className="text-white text-xs font-black">{project.num}</span>
        </div>

        {/* Tag */}
        <span className="inline-block text-[11px] font-bold text-secondary bg-secondary/10 border border-secondary/25 px-3 py-1 rounded-full">
          {project.tag}
        </span>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
          {project.desc}
        </p>

        {/* Accent line */}
        <div className="w-10 h-1 rounded-full bg-primary/40 mt-2" />
      </motion.div>

      {/* ── Image ── */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.12 }}
        className="flex-1 w-full"
      >
        <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/80 border border-slate-100 group">
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle green tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

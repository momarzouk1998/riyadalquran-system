'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Image from "next/image";
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  HeartHandshake, 
  ArrowLeft,
  ZoomIn
} from "lucide-react";

export interface ProjectItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  desc: string;
  accent: string;
}

const ALL_PROJECTS: ProjectItem[] = [
  {
    id: "orphans",
    src: "/projects/orphans.png",
    title: "كفالة الأيتام",
    tag: "كفالة ورعاية 🤍",
    desc: "رعاية شاملة تعليمية وصحية للأيتام وأسرهم لتوفير حياة كريمة ومستقبل مشرق.",
    accent: "#10b981",
  },
  {
    id: "brides",
    src: "/projects/brides.png",
    title: "تجهيز العرائس اليتيمات",
    tag: "تيسير الزواج 💍",
    desc: "توفير الأجهزة الكهربائية والمستلزمات الأساسية للفتيات اليتيمات وغير القادرات.",
    accent: "#f43f5e",
  },
  {
    id: "food",
    src: "/projects/food.jpg",
    title: "إطعام وتوزيع المواد الغذائية",
    tag: "إطعام وسلال 🍲",
    desc: "توفير كراتين وسلال المواد الغذائية الشهرية ووجبات الطعام للأسر الأكثر احتياجاً.",
    accent: "#f59e0b",
  },
  {
    id: "medical",
    src: "/projects/medical.png",
    title: "الرعاية والحالات الطبية",
    tag: "علاج وشفاء 🩺",
    desc: "المساهمة في إجراء العمليات الجراحية وتوفير العلاج والأجهزة للمرضى غير القادرين.",
    accent: "#06b6d4",
  },
  {
    id: "nursery",
    src: "/projects/nursery.png",
    title: "حضانة براعم الإيمان",
    tag: "تعليم وبناء 📖",
    desc: "تنشئة جيل قرآني وتربية إسلامية وتعليم مبكر للأطفال بأعلى المعايير.",
    accent: "#8b5cf6",
  },
  {
    id: "houses",
    src: "/projects/houses.png",
    title: "سكن كريم وترميم البيوت",
    tag: "إيواء وأمان 🏡",
    desc: "تسقيف المنازل وتأهيل دورات المياه وبناء جدران آمنة لحماية الأسر المستحقة.",
    accent: "#d97706",
  },
  {
    id: "water",
    src: "/projects/water.png",
    title: "محطة مياه الشرب (سقيا الماء)",
    tag: "صدقة جارية 💧",
    desc: "إنشاء وصيانة محطات تنقية المياه وتوصيل مياه الشرب النقية لأهالي القرية.",
    accent: "#0ea5e9",
  },
  {
    id: "mosque",
    src: "/projects/mosque.jpg",
    title: "مسجد ودار رياض القرآن",
    tag: "عمارة بيوت الله 🕌",
    desc: "تجهيز وصيانة المسجد وحلقات تحفيظ القرآن الكريم لخدمة حفظة كتاب الله.",
    accent: "#059669",
  },
];

export function ProjectsGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // حركة المسار الأفقي أثناء السكرول الرأسي
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["12.5%", "100%"]);

  const openLightbox = (project: ProjectItem, idx: number) => {
    setSelectedProject(project);
    setSelectedIndex(idx);
  };

  const nextProject = () => {
    const next = (selectedIndex + 1) % ALL_PROJECTS.length;
    setSelectedIndex(next);
    setSelectedProject(ALL_PROJECTS[next]);
  };

  const prevProject = () => {
    const prev = (selectedIndex - 1 + ALL_PROJECTS.length) % ALL_PROJECTS.length;
    setSelectedIndex(prev);
    setSelectedProject(ALL_PROJECTS[prev]);
  };

  // التنقل بالكيبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") setSelectedProject(null);
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, selectedIndex]);

  return (
    <section className="relative bg-slate-950 text-white font-tajawal overflow-clip" id="projects-gallery">
      {/* الخلفية والإضاءة */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px]" />
      </div>

      {/* العنوان والمقدمة */}
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-4 py-1.5 text-xs font-bold mb-4 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>مكتبة ومسيرة العطاء — 8 مشاريع متكاملة</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-black text-white leading-tight"
        >
          مشاريع <span className="text-emerald-400">جمعية رياض القرآن</span> الخيرية
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-slate-400 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          تصفح ملصقات وتفاصيل مشاريعنا الـ 8 المستمرة في خدمة أهالي المنشأة الكبرى. تحرك مع السكرول لتجربة تفاعلية واضغط على أي مشروع لمشاهدته بالحجم الكامل.
        </motion.p>

        {/* أزرار الانتقال السريع للمشاريع */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {ALL_PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => openLightbox(p, idx)}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* مسار السكرول التفاعلي (Sticky Scroll Track) */}
      <div ref={containerRef} className="relative h-[250vh] md:h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden z-10">
          
          {/* شريط الإحصائيات ونسبة التقدم */}
          <div className="max-w-7xl w-full mx-auto px-6 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-md">
                تصفح مع السكرول ⇄
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                مرر لأسفل للتنقل بين بطاقات المشاريع الـ 8 بوضوح كامل
              </span>
            </div>

            {/* شريط تقدم السكرول */}
            <div className="w-32 md:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* بطاقات المشاريع المتحركة أفقياً */}
          <div className="w-full relative overflow-hidden py-4">
            <motion.div
              style={{ x }}
              className="flex gap-6 md:gap-8 px-8 md:px-16 w-max items-center"
            >
              {ALL_PROJECTS.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={() => openLightbox(project, index)}
                />
              ))}
            </motion.div>
          </div>

          {/* تلميح سفلي */}
          <div className="max-w-7xl w-full mx-auto px-6 mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-emerald-400" />
              <span>اضغط على أي بطاقة لعرض الصورة بالحجم الكامل والتفاصيل</span>
            </div>
            <div className="font-bold text-slate-400">
              8 / 8 مشاريع
            </div>
          </div>

        </div>
      </div>

      {/* نافذة العرض المكبر (Lightbox Modal) */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            index={selectedIndex}
            total={ALL_PROJECTS.length}
            onClose={() => setSelectedProject(null)}
            onNext={nextProject}
            onPrev={prevProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: ProjectItem;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex-shrink-0 w-[290px] sm:w-[320px] md:w-[350px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
    >
      {/* الشارات العلوية */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <span className="backdrop-blur-md bg-slate-900/90 text-emerald-400 border border-emerald-500/30 text-[11px] font-black px-3 py-1 rounded-full shadow-lg">
          {project.tag}
        </span>
        <span className="backdrop-blur-md bg-black/70 text-white/90 text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-white/10">
          0{index + 1}
        </span>
      </div>

      {/* صورة الملصق */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 p-2">
        <Image
          src={project.src}
          alt={project.title}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 rounded-2xl"
          sizes="(max-width: 768px) 300px, 350px"
          priority={index < 3}
        />
      </div>

      {/* بيانات البطاقة بالأسفل */}
      <div className="p-5 relative z-20 bg-slate-900 border-t border-slate-800">
        <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
          {project.desc}
        </p>

        {/* زر التكبير داخل البطاقة */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:underline">
            عرض الملصق كاملاً
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </span>
          <span className="text-slate-500 text-[11px]">
            انقر للتكبير
          </span>
        </div>
      </div>

      {/* إطار مضيء عند التمرير */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-emerald-400/40" />
    </motion.div>
  );
}

function ProjectModal({
  project,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-lg"
          title="إغلاق (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* عرض الملصق بجودة كاملة */}
        <div className="relative w-full md:w-3/5 bg-black/60 min-h-[380px] md:min-h-[550px] flex items-center justify-center p-4">
          <div className="relative w-full h-full max-h-[75vh] aspect-[3/4]">
            <Image
              src={project.src}
              alt={project.title}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />
          </div>

          {/* أزرار التنقل السابقة والتالية */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-600 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer shadow-xl z-20"
            title="المشروع السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-600 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer shadow-xl z-20"
            title="المشروع التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* الجانب التعريفي والتبرع */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                {project.tag}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {index + 1} من {total}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white leading-snug">
              {project.title}
            </h3>

            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {project.desc}
            </p>

            <div className="mt-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                <HeartHandshake className="w-4 h-4" />
                <span>طرق المساهمة والمشاركة</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                يمكنك التبرع لدعم هذا المشروع أو كفالة الحالات الخاصة به عبر فودافون كاش أو إنستا باي من قسم التبرعات المباشر.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <a
              href="#donate"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
            >
              <span>ساهم بالتبرع لهذا المشروع</span>
              <ArrowLeft className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

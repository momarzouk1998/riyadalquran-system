'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Heart, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  { 
    id: 1, 
    image: "/images/hero-1.png", 
    title: "جمعية ونظام رياض القرآن الكريم", 
    subtitle: "نمد جسور الإنسانية والتكافل بين المحسن والمحتاج وتأسيس راقٍ لأطفالكم بالمنشأة الكبرى" 
  },
  { 
    id: 2, 
    image: "/images/hero-2.png", 
    title: "عطاء بلا حدود بالمنشأة الكبرى", 
    subtitle: "كفالة الأيتام، رعاية الحالات المرضية، طرود بنك الطعام، وتأسيس تعليمي متميز بالحضانة" 
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((current + 1) % SLIDES.length);
  const prev = () => setCurrent((current - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-[550px] md:h-[750px] mt-[80px] md:mt-[110px] overflow-hidden group font-tajawal">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={SLIDES[current].image} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/90 via-primary/75 to-transparent" />
          
          <div className="absolute inset-0 flex items-center container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl text-white space-y-6">
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="badge-gold bg-amber-400/20 text-amber-300 border-amber-400/30 backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>جمعية خيرية ومؤسسة تعليمية مشهرة برقم 1300</span>
              </motion.div>

              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight"
              >
                {SLIDES[current].title}
              </motion.h1>

              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-2xl text-emerald-100/90 leading-relaxed max-w-2xl font-light"
              >
                {SLIDES[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <a href="#store" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>تبرع الآن لدعم المشاريع</span>
                </a>

                <Link href="/parent/login" className="bg-white/15 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm hover:bg-white hover:text-primary transition-all flex items-center gap-2">
                  <span>بوابة الحضانة والدرجات</span>
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button onClick={prev} className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-secondary transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-secondary transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${current === i ? "w-12 bg-secondary" : "w-3 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
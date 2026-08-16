'use client';

import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-12 bg-secondary text-white font-tajawal">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">اشترك في النشرة والتحديثات الأخبارية</h3>
              <p className="text-white/80 text-xs">كن أول من يعرف عن نتائج التبرعات وحملات الجمعية بالمنشأة الكبرى</p>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col md:flex-row gap-3">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني أو رقم المحمول" 
              className="w-full md:w-80 px-6 py-3.5 rounded-2xl bg-white/15 border border-white/30 text-white placeholder:text-white/60 outline-none focus:bg-white/25 transition-all text-xs" 
            />
            <button className="bg-white text-secondary px-8 py-3.5 rounded-2xl font-black hover:bg-primary hover:text-white transition-all shadow-xl text-xs cursor-pointer">
              اشترك الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
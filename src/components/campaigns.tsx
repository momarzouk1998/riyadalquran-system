'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Clock, AlertCircle } from "lucide-react";

const CAMPAIGNS = [
  { id: 1, title: "كفالة ومساعدات 21 أسرة يتيمة", target: 27000, current: 22950, days: 10, image: "https://emch.ae/WebsiteNewContent/images/slide-1.jpg" },
  { id: 2, title: "سلال وبنوك الإطعام لـ 121 حالة", target: 13800, current: 12420, days: 5, image: "https://emch.ae/WebsiteNewContent/images/slide-2.jpg" },
  { id: 3, title: "ترميم البيوت وتيسير زواج الفتيات", target: 20000, current: 13000, days: 15, image: "https://emch.ae/WebsiteNewContent/images/slide-1.jpg" },
];

export function Campaigns() {
  const [activeTab, setActiveTab] = useState("urgent");

  return (
    <section id="campaigns" className="py-24 container mx-auto px-4 font-tajawal">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b border-slate-100 pb-6">
        <div>
          <div className="badge-emerald mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>الحالات الطارئة والمستعجلة</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900">الحالات <span className="text-primary">العاجلة بالمنشأة الكبرى</span></h2>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {["urgent", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === tab ? "bg-white text-primary shadow-md" : "text-gray-500 hover:text-primary"}`}
            >
              {tab === "urgent" ? "حالات عاجلة" : "مكتملة بفضل الله"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {CAMPAIGNS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group flex flex-col justify-between"
          >
            <div className="relative h-60">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
              <div className="absolute top-4 right-4 bg-danger text-white px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">
                حالة عاجلة جداً
              </div>
            </div>

            <div className="p-8 space-y-6">
              <h3 className="text-xl font-bold leading-tight text-slate-900">{item.title}</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">المبلغ المتبقي</span>
                  <span className="text-primary font-mono">{(item.target - item.current).toLocaleString()}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.current / item.target) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-muted">
                  <span>تم جمع: {((item.current / item.target) * 100).toFixed(0)}%</span>
                  <span>المستهدف: {item.target.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <a 
                  href="#store"
                  className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-secondary transition-all shadow-lg text-xs text-center flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>تبرع الآن للحالة</span>
                </a>
                <div className="text-center px-3 border-s border-gray-100">
                  <div className="text-lg font-black text-secondary">{item.days}</div>
                  <div className="text-[10px] font-bold text-muted uppercase">يوم متبقي</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
'use client';

import { motion } from "motion/react";
import { Play, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function MediaCenter() {
  return (
    <section className="py-24 container mx-auto px-4 font-tajawal">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* News Section */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
            <h2 className="text-4xl font-black text-slate-900">أخبار <span className="text-primary">وأنشطة الجمعية</span></h2>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronRight className="w-5 h-5" /></button>
              <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronLeft className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "توزيع ملابس العيد والحقائب المدرسية لأطفال الأيتام بالمنشأة الكبرى", date: "16 أغسطس 2026", img: "https://emch.ae/WebsiteNewContent/images/slide-1.jpg" },
              { title: "تشغيل وصيانة محطة تحلية المياه وتوفير مياه نقية مجانية لجميع الأهالي", date: "10 أغسطس 2026", img: "https://emch.ae/WebsiteNewContent/images/slide-2.jpg" },
            ].map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer space-y-3"
              >
                <div className="relative h-56 rounded-[2rem] overflow-hidden">
                  <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="news" />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    {news.date}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">{news.title}</h3>
                <p className="text-muted text-xs line-clamp-2 leading-relaxed">تواصل جمعية رياض القرآن تقديم كافة المساعدات العينية والغذائية والتعليمية للحد من الأعباء عن كاهل المستحقين...</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-black text-slate-900 mb-10 border-b border-slate-100 pb-4">مكتبة <span className="text-secondary">الوسائط</span></h2>
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-44 rounded-[2rem] overflow-hidden group cursor-pointer shadow-md"
            >
              <img src="https://emch.ae/WebsiteNewContent/images/slide-1.jpg" className="w-full h-full object-cover" alt="gallery" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-4 right-6 text-white font-bold text-xs">فيديو أنشطة الجمعية وحفظ القرآن</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative h-44 rounded-[2rem] overflow-hidden group cursor-pointer shadow-md"
            >
              <img src="https://emch.ae/WebsiteNewContent/images/slide-2.jpg" className="w-full h-full object-cover" alt="gallery" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute bottom-4 right-6 text-white font-bold text-xs">معرض صور وتكريم طلاب الحضانة</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { motion } from "motion/react";
import { ShoppingCart, Heart, Copy, Check, CreditCard, Sparkles, Smartphone } from "lucide-react";
import { useState } from "react";

const CARDS = [
  { title: "كفالة الأيتام والكسوة", category: "كفالات شهرية", target: "27,000", raised: "22,950", imageEmoji: "🎁" },
  { title: "طرود بنك الطعام المصري", category: "إطعام وسلال", target: "13,800", raised: "12,420", imageEmoji: "🍲" },
  { title: "ترميم البيوت وتيسير الزواج", category: "مساعدات اجتماعية", target: "20,000", raised: "13,000", imageEmoji: "🧱" },
  { title: "محطة تحلية مياه الشرب", category: "سقيا ماء", target: "15,000", raised: "15,000", imageEmoji: "💧" },
];

export function GatewayGiving() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="store" className="py-24 bg-light/50 font-tajawal">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-gray-200 pb-6">
          <div>
            <div className="badge-emerald mb-2">
              <Heart className="w-3.5 h-3.5 fill-primary" />
              <span>متجر التبرعات الشفاف</span>
            </div>
            <h2 className="text-4xl font-black mb-2 text-slate-900">بوابة <span className="text-secondary">العطاء والخير</span></h2>
            <p className="text-muted text-sm">ساهم معنا في تغيير حياة أهالينا بالمنشأة الكبرى للأفضل</p>
          </div>
          
          <div className="flex gap-2">
            <span className="badge-gold bg-amber-400/10 text-amber-800 border-amber-400/30">
              الحساب البنكي الرسمي: 1300
            </span>
          </div>
        </div>

        {/* Payment Accounts Banner */}
        <div className="bg-primary text-white p-6 rounded-3xl shadow-xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 block">البنك الزراعي المصري</span>
                <span className="font-mono text-lg font-black text-amber-300">1300</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy('1300', 'bank-banner')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black hover:bg-amber-500 transition-colors cursor-pointer"
            >
              {copiedKey === 'bank-banner' ? 'تم النسخ ✓' : 'نسخ'}
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 block">فودافون كاش</span>
                <span className="font-mono text-lg font-black text-amber-300" dir="ltr">01010453630</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy('01010453630', 'voda-banner')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black hover:bg-amber-500 transition-colors cursor-pointer"
            >
              {copiedKey === 'voda-banner' ? 'تم النسخ ✓' : 'نسخ'}
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 block">انستا باي InstaPay</span>
                <span className="font-mono text-lg font-black text-amber-300" dir="ltr">01281660541</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy('01281660541', 'insta-banner')}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black hover:bg-amber-500 transition-colors cursor-pointer"
            >
              {copiedKey === 'insta-banner' ? 'تم النسخ ✓' : 'نسخ'}
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-gray-100 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-emerald">{card.category}</span>
                  <span className="text-4xl">{card.imageEmoji}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-slate-900">{card.title}</h3>
                
                <div className="flex items-baseline justify-between text-xs text-slate-500 my-4 border-t border-slate-100 pt-3">
                  <span>تم جمع: <strong className="text-slate-900">{card.raised}</strong></span>
                  <span>الهدف: <strong className="text-slate-900">{card.target}</strong></span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {[50, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleCopy('1300', `card-${i}-${amt}`)}
                      className="py-1.5 px-2 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 rounded-xl text-xs font-black transition-all cursor-pointer text-center"
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handleCopy('1300', `donate-${i}`)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
                >
                  {copiedKey?.startsWith(`donate-${i}`) || copiedKey?.startsWith(`card-${i}`) ? 'تم نسخ الحساب البنكي 1300 ✓' : 'تبرع الآن للمشروع'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
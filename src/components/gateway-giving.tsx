'use client';

import { motion } from "motion/react";
import { Heart, CreditCard, Sparkles, Smartphone } from "lucide-react";
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
            <a
              href="https://wa.me/201010453630"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-black hover:bg-[#1ebe5d] transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              واتساب
            </a>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <div>
                <span className="text-[10px] text-emerald-200 block">انستا باي InstaPay</span>
                <span className="font-mono text-lg font-black text-amber-300" dir="ltr">01281660541</span>
              </div>
            </div>
            <a
              href="https://wa.me/201281660541"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25D366] text-white rounded-xl text-xs font-black hover:bg-[#1ebe5d] transition-colors cursor-pointer flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              واتساب
            </a>
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
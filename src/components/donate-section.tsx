'use client';

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Copy, Check, MessageCircle, CreditCard, Smartphone, Zap } from "lucide-react";

const PROJECTS = [
  {
    title: "كفالة الأيتام والكسوة",
    category: "كفالات شهرية",
    img: "/projects/orphans.png",
    raised: 22950,
    target: 27000,
    color: "from-rose-600 to-rose-800",
    accent: "#e05c5c",
  },
  {
    title: "طرود بنك الطعام المصري",
    category: "إطعام وسلال 🍲",
    img: "/projects/food.jpg",
    raised: 12420,
    target: 13800,
    color: "from-amber-500 to-orange-700",
    accent: "#e8b84b",
  },
  {
    title: "ترميم البيوت وتيسير الزواج",
    category: "مساعدات اجتماعية 🧱",
    img: "/projects/houses.png",
    raised: 13000,
    target: 20000,
    color: "from-emerald-600 to-emerald-800",
    accent: "#1a6b2e",
  },
  {
    title: "محطة تحلية مياه الشرب",
    category: "سقيا ماء 💧",
    img: "/projects/water.png",
    raised: 15000,
    target: 15000,
    color: "from-sky-500 to-sky-800",
    accent: "#3b9edd",
  },
];



const PAYMENT_ACCOUNTS = [
  { label: "فودافون كاش",  value: "01010453630", icon: Smartphone },
  { label: "انستا باي",    value: "01281660541", icon: Zap },
  { label: "حساب بنكي",   value: "1300",         icon: CreditCard },
];

export function DonateSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const waLink = (title: string) => {
    const msg = `السلام عليكم، تبرعت لمشروع (${title}) — برجاء تأكيد الاستلام`;
    return `https://wa.me/201010453630?text=${encodeURIComponent(msg)}`;
  };
    <section id="store" className="py-24 bg-white font-tajawal">
      <div className="container mx-auto px-4">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold mb-4 border border-primary/20"
          >
            تبرع الآن
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-black text-slate-900"
          >
            ساهم في <span className="text-primary">مشاريع الجمعية</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-slate-500 text-sm mt-2"
          >
            اختر مشروعاً، انسخ الرقم، حوّل المبلغ، وأرسل إيصال على واتساب — وخلاص ✓
          </motion.p>
        </div>

        {/* ── حسابات الدفع ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 p-6 bg-slate-50 rounded-3xl border border-slate-200"
        >
          <div className="sm:col-span-3 text-xs font-black text-slate-500 mb-1">
            📲 أرقام التحويل الرسمية — انسخ واحوّل
          </div>
          {PAYMENT_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            const key = `acc-${acc.value}`;
            const copied = copiedKey === key;
            return (
              <div key={acc.value} className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold">{acc.label}</p>
                    <p className="font-black text-slate-800 font-mono text-sm" dir="ltr">{acc.value}</p>
                  </div>
                </div>
                <button
                  onClick={() => copy(acc.value, key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "تم" : "نسخ"}
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* ── كارداتـ المشاريع ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((proj, i) => {
            const pct = Math.min(100, Math.round((proj.raised / proj.target) * 100));
            const completed = pct >= 100;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* صورة */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={proj.img}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="320px"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${proj.color} opacity-50`} />
                  {/* category badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-full">
                    {proj.category}
                  </div>
                  {completed && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                      مكتمل ✓
                    </div>
                  )}
                </div>

                {/* محتوى */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                  <h3 className="font-black text-slate-800 text-sm leading-snug">{proj.title}</h3>

                  {/* progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>تم جمع: <span className="text-slate-800">{proj.raised.toLocaleString()}</span></span>
                      <span>الهدف: <span className="text-slate-800">{proj.target.toLocaleString()}</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-left" dir="ltr">{pct}% completed</p>
                  </div>

                  {/* الزرين */}
                  <div className="flex flex-col gap-2 mt-auto">
                    {/* نسخ الرقم */}
                    <button
                      onClick={() => copy("01010453630", `card-${i}`)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-xs font-black hover:bg-emerald-800 transition-colors cursor-pointer shadow-md"
                    >
                      {copiedKey === `card-${i}`
                        ? <><Check className="w-3.5 h-3.5" /> تم نسخ الرقم — حوّل الآن</>
                        : <><Copy className="w-3.5 h-3.5" /> انسخ رقم التحويل</>
                      }
                    </button>

                    {/* واتساب */}
                    <a
                      href={waLink(proj.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      أرسل الإيصال على واتساب
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── تعليمات التبرع ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center"
        >
          <p className="text-sm font-black text-slate-700 mb-3">📌 خطوات التبرع في 3 ثواني</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 font-medium">
            {[
              "① اختر المشروع والمبلغ",
              "② انسخ رقم فودافون كاش أو انستا باي",
              "③ حوّل المبلغ من موبايل بنكينج",
              "④ ابعت صورة الإيصال على واتساب — وخلاص ✓",
            ].map((step) => (
              <span key={step} className="bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                {step}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

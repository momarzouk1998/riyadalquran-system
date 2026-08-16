'use client';

import { Phone, Heart, Share2, CreditCard, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function SocialBar() {
  const items = [
    { icon: <Heart className="w-5 h-5 fill-white" />, label: "التبرعات", color: "bg-[#246c74]", href: "#store" },
    { icon: <CreditCard className="w-5 h-5" />, label: "الحسابات", color: "bg-[#bd9d54]", href: "#donations" },
    { icon: <Sparkles className="w-5 h-5" />, label: "الحضانة", color: "bg-[#194e54]", href: "#nursery-platform" },
    { icon: <Phone className="w-5 h-5" />, label: "التواصل", color: "bg-[#246c74]", href: "#contact" },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1">
      {items.map((item, i) => (
        <motion.a
          key={i}
          href={item.href}
          initial={{ x: 40 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className={`${item.color} text-white p-3 hover:pe-8 transition-all duration-300 rounded-s-xl flex items-center justify-center shadow-lg group relative`}
          title={item.label}
        >
          {item.icon}
          <span className="hidden group-hover:inline-block ms-2 text-xs font-bold whitespace-nowrap">
            {item.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
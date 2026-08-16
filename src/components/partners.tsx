'use client';

import { motion } from "motion/react";

const LOGOS = [
  "elmanar1.png", "Julphar.png", "amanShelter.jpg", "EmiratesHospital.jpg", "DIB.png", "EtihadWe.png", "itp.png", "arabian.png"
];

export function Partners() {
  return (
    <section className="py-20 bg-white overflow-hidden border-y border-gray-100 font-tajawal">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl font-black text-slate-900">شركاء <span className="text-primary">النجاح والتكافل</span></h2>
      </div>
      <div className="relative flex overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center whitespace-nowrap"
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <img 
              key={i} 
              src={`https://emch.ae/WebsiteNewContent/images/${logo}`} 
              className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 duration-500" 
              alt="partner" 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
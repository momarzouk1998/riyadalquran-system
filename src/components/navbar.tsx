'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Home, Menu, User, ShieldCheck } from "lucide-react";
import { MenuOverlay } from "./menu-overlay";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? "glass-nav py-2 shadow-lg" : "bg-white py-3 border-b border-gray-100"}`}>
        
        {/* Top Mini Governance Strip */}
        <div className="bg-primary text-emerald-100 text-[11px] py-1 px-4 text-center font-bold flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            منصة الجمعيات الرقمية • المشهرة برقم 1300 بالمنشأة الكبرى
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-white/90">ترخيص التضامن الاجتماعي • كفر شكر • القليوبية</span>
        </div>

        <div className="container mx-auto px-4 flex items-center justify-between mt-1">
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-primary/10 border border-primary/20 bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <Image 
                src="/logo.png" 
                alt="رياض القرآن" 
                width={48} 
                height={48} 
                className="object-contain" 
                priority
              />
            </div>
            <div>
              <span className="font-black text-lg text-primary tracking-wide block leading-tight">
                رياض القرآن
              </span>
              <span className="text-[10px] text-secondary font-bold block">
                منصة الجمعيات الخيرية والحضانة
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center gap-6 border-e border-gray-200 pe-6">
              <a href="#store" className="relative group cursor-pointer flex items-center gap-1.5 text-primary hover:text-secondary transition-colors text-xs font-bold">
                <ShoppingCart className="w-5 h-5" />
                <span>متجر التبرعات</span>
              </a>
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                <Home className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/parent/login" 
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-secondary transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>بوابة الأبوين والطفل</span>
              </Link>

              <Link 
                href="/admin/login" 
                className="hidden sm:flex items-center gap-1.5 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-all"
              >
                <span>دخول الإدارة</span>
              </Link>

              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-secondary transition-all shadow-md cursor-pointer"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-bold">القائمة</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
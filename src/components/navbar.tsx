'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Home, Menu } from "lucide-react";
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
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
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
                جمعية رياض القرآن الكريم
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* متجر التبرعات - desktop only */}
            <div className="hidden lg:flex items-center gap-6 border-e border-gray-200 pe-6">
              <a
                href="#store"
                className="relative group cursor-pointer flex items-center gap-1.5 text-primary hover:text-secondary transition-colors text-xs font-bold"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>متجر التبرعات</span>
              </a>
              <Link href="/" className="text-secondary hover:text-primary transition-colors">
                <Home className="w-5 h-5" />
              </Link>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-secondary transition-all shadow-md cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold">القائمة</span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

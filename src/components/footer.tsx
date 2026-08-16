'use client';

import { PlayCircle, Phone, Mail, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-light pt-20 pb-10 border-t border-gray-200 font-tajawal text-slate-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="text-center lg:text-right space-y-4">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200">
                <Image src="/logo.png" alt="رياض القرآن" width={44} height={44} className="object-contain" />
              </div>
              <div>
                <span className="font-black text-xl text-primary block leading-tight">رياض القرآن</span>
                <span className="text-[10px] text-secondary font-bold block">منصة الجمعيات الرقمية والحضانة</span>
              </div>
            </div>
            
            <p className="text-muted text-xs leading-relaxed">
              جمعية خيرية ومؤسسة تعليمية مشهرة برقم 1300 تهدف لتقديم المساعدات للأسر المتعففة وتأسيس الأطفال تعليمياً وسلوكياً بالمنشأة الكبرى، كفر شكر، القليوبية.
            </p>

            <div className="flex justify-center lg:justify-start gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 transition-all shadow-md">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center hover:scale-110 transition-all shadow-md">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center hover:scale-110 transition-all shadow-md">
                <PlayCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="https://emch.ae/WebsiteNewContent/images/footer-care.svg" className="w-5" alt="icon" />
              <h3 className="text-xl font-bold text-slate-900"><span className="text-primary">عن</span> الجمعية والمشاريع</h3>
            </div>
            <ul className="space-y-3 text-muted text-xs font-semibold">
              <li><a href="#orphans" className="hover:text-primary transition-colors">• كفالة أيتام مسجلة (21 أسرة)</a></li>
              <li><a href="#food" className="hover:text-primary transition-colors">• كراتين بنك الطعام (121 حالة)</a></li>
              <li><a href="#store" className="hover:text-primary transition-colors">• محطة تحلية المياه المجانية</a></li>
              <li><a href="#nursery-platform" className="hover:text-primary transition-colors">• منظومة الحضانة المتقدمة</a></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="https://emch.ae/WebsiteNewContent/images/footer-startup.svg" className="w-5" alt="icon" />
              <h3 className="text-xl font-bold text-slate-900"><span className="text-primary">روابط</span> سريعة</h3>
            </div>
            <ul className="space-y-3 text-muted text-xs font-semibold">
              <li><Link href="/parent/login" className="hover:text-primary transition-colors">• دخول ولي الأمر والنتائج</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">• دخول المشرفين والإدارة</Link></li>
              <li><a href="#booking-form" className="hover:text-primary transition-colors">• حجز مقعد لطفلك بالحضانة</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">• التواصل والاستفسارات</a></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-slate-900"><span className="text-primary">اتصل</span> بنا</h3>
            </div>
            <div className="space-y-4 text-muted text-xs font-semibold">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p>المنشأة الكبرى، كفر شكر، القليوبية، مصر.</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <p dir="ltr">0132545455 • 01010453630</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <p>البنك الزراعي المصري: 1300</p>
              </div>
              <div className="pt-4 flex gap-3">
                <img src="https://emch.ae/WebsiteNewContent/images/mastercard.svg" className="h-8" alt="mastercard" />
                <img src="https://emch.ae/WebsiteNewContent/images/visa.svg" className="h-8" alt="visa" />
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-muted">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لجمعية رياض القرآن الكريم بالمنشأة الكبرى.</p>
          <p>تطوير وتشغيل منصة OpenAppo Digital Ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
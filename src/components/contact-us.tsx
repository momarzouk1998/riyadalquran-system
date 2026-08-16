'use client';

import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export function ContactUs() {
  return (
    <section id="contact" className="py-24 container mx-auto px-4 font-tajawal">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        {/* Form Side */}
        <div className="lg:w-1/2 p-10 md:p-16">
          <h2 className="text-4xl font-black text-slate-900 mb-2">تواصل <span className="text-primary">معنا</span></h2>
          <p className="text-muted mb-10 text-sm">نحن هنا للإجابة على جميع استفساراتكم بشأن التبرعات أو حجز الحضانة</p>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="الاسم الكامل" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-xs" />
              <input type="text" placeholder="رقم المحمول" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-xs" dir="ltr" />
            </div>
            <input type="text" placeholder="موضوع الرسالة" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-xs" />
            <textarea placeholder="رسالتك أو ملاحظاتك..." rows={4} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none text-xs"></textarea>
            <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm hover:bg-secondary transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
              <Send className="w-4 h-4" />
              إرسال الرسالة
            </button>
          </form>
        </div>

        {/* Contact Info & Map Side */}
        <div className="lg:w-1/2 bg-primary p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-8">
            <h3 className="text-3xl font-black mb-8">معلومات التواصل المباشر</h3>
            
            <div className="space-y-6 text-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">المقر الرئيسي للجمعية</h4>
                  <p className="text-white/80 leading-relaxed">المنشأة الكبرى، مركز كفر شكر، محافظة القليوبية، مصر.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">الهاتف المباشر والواتساب</h4>
                  <p className="text-white/80 leading-relaxed" dir="ltr">0132545455 • 01010453630</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">الحسابات والتحويل</h4>
                  <p className="text-white/80 leading-relaxed">البنك الزراعي 1300 • فودافون كاش 01010453630</p>
                </div>
              </div>
            </div>

            <div className="mt-8 h-48 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-inner">
              <iframe 
                src="https://maps.google.com/maps?q=Kafr%20Shukr%20Qalyubia&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
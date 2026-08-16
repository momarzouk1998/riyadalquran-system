'use client';

import React, { useState, useTransition } from 'react';
import { HeroSlider } from "@/components/hero-slider";
import { DoorsOfGood } from "@/components/doors-of-good";
import { GatewayGiving } from "@/components/gateway-giving";
import { Achievements } from "@/components/achievements";
import { Campaigns } from "@/components/campaigns";
import { EServices } from "@/components/e-services";
import { NurserySuite } from "@/components/nursery-suite";
import { MediaCenter } from "@/components/media-center";
import { Partners } from "@/components/partners";
import { ContactUs } from "@/components/contact-us";
import { Newsletter } from "@/components/newsletter";
import { JoinUs } from "@/components/join-us";
import { createNurseryBooking } from '@/app/actions/admin';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createNurseryBooking(formData);
      if (res.success) {
        setBookingSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setBookingError(res.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* 1. Hero Slider */}
      <HeroSlider />
      
      {/* 2. Doors of Goodness */}
      <DoorsOfGood />
      
      {/* 3. Gateway to Giving */}
      <GatewayGiving />
      
      {/* 4. Achievements */}
      <Achievements />
      
      {/* 5. Urgent Cases / Campaigns */}
      <Campaigns />
      
      {/* 6. Electronic Services & Portals */}
      <EServices />
      
      {/* 7. Nursery Suite Showcase (Student Grades Chart, Financials & Teachers) */}
      <NurserySuite />

      {/* 8. Nursery Seat Registration Booking Form */}
      <section id="booking-form" className="max-w-3xl w-full mx-auto px-4 py-20 space-y-8 font-tajawal">
        <div className="text-center space-y-2">
          <div className="badge-emerald">
            <Send className="w-3.5 h-3.5 text-primary" />
            <span>استمارة التسجيل المباشر</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">حجز مقعد جديد في الحضانة</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            يرجى تعبئة البيانات وسيقوم فريق الجمعية بالاتصال بكم لتحديد موعد الاختبار واستكمال التسجيل.
          </p>
        </div>

        {bookingSuccess ? (
          <div className="card-modern p-8 bg-emerald-50 border-emerald-200 text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">تم إرسال طلب الحجز بنجاح!</h3>
              <p className="text-xs text-slate-600">
                شكرًا لثقتكم برياض القرآن. سيتواصل معكم مسؤولو الجمعية على رقم المحمول المقدم في أقرب وقت.
              </p>
            </div>
          </div>
        ) : (
          <div className="card-modern p-6 sm:p-10 bg-white border border-slate-200 shadow-2xl">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs mb-6">
                {bookingError}
              </div>
            )}
            
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسم ولي الأمر بالكامل</label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    className="form-input-modern"
                    placeholder="ادخل اسم ولي الأمر"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">رقم المحمول للاتصال</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="form-input-modern text-center font-bold"
                    placeholder="010xxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسم الطفل بالكامل</label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    className="form-input-modern"
                    placeholder="ادخل اسم الطفل"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">عمر الطفل (سنوات)</label>
                  <input
                    type="number"
                    name="age"
                    min={2}
                    max={8}
                    required
                    className="form-input-modern text-center font-bold"
                    placeholder="مثال: 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ملاحظات أو متطلبات خاصة</label>
                <textarea
                  name="notes"
                  className="form-input-modern h-28"
                  placeholder="أي ملاحظات تود إشعار الجمعية بها..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-2xl font-black shadow-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال طلب الحجز والتسجيل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* 9. Media Center */}
      <MediaCenter />
      
      {/* 10. Partners Marquee */}
      <Partners />
      
      {/* 11. Contact Us */}
      <ContactUs />
      
      {/* 12. Newsletter */}
      <Newsletter />
      
      {/* 13. Join Us */}
      <JoinUs />
    </div>
  );
}
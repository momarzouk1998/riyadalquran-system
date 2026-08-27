'use client';

import React from 'react';
import { HeroSlider }       from "@/components/hero-slider";
import { ProjectsGallery }  from "@/components/projects-gallery";
import { DonateSection }    from "@/components/donate-section";
import { Achievements }     from "@/components/achievements";
import { Campaigns }        from "@/components/campaigns";
import { EServices }        from "@/components/e-services";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. مكتبة المشاريع — fan scroll animation */}
      <ProjectsGallery />

      {/* 3. قسم التبرع — كارداتـ بصور + نسخ + واتساب */}
      <DonateSection />

      {/* 4. الإنجازات */}
      <Achievements />

      {/* 5. الحالات العاجلة */}
      <Campaigns />

      {/* 6. الخدمات الإلكترونية */}
      <EServices />
    </div>
  );
}

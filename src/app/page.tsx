'use client';

import React from 'react';
import { HeroSlider } from "@/components/hero-slider";
import { DoorsOfGood } from "@/components/doors-of-good";
import { GatewayGiving } from "@/components/gateway-giving";
import { Achievements } from "@/components/achievements";
import { Campaigns } from "@/components/campaigns";
import { EServices } from "@/components/e-services";
import { JoinUs } from "@/components/join-us";

export default function Home() {
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
      
      {/* 7. Join Us */}
      <JoinUs />
    </div>
  );
}

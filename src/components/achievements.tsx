'use client';

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const STATS = [
  {
    id: 1,
    label: "المشاريع الخيرية",
    value: 33210,
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape1.svg",
    blueBg: "https://emch.ae/WebsiteNewContent/images/ballon-blue-right.svg",
    yellowBg: "https://emch.ae/WebsiteNewContent/images/ballon-yellow-left.svg",
    isTop100: false,
    layout: "blue-right-yellow-left",
    floatDuration: 4.2
  },
  {
    id: 2,
    label: "كفالة",
    value: 8952,
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape2.svg",
    yellowBg: "https://emch.ae/WebsiteNewContent/images/ballon-yellow-right.svg",
    blueBg: "https://emch.ae/WebsiteNewContent/images/ballon-blue-left.svg",
    isTop100: true,
    layout: "yellow-right-blue-left",
    floatDuration: 4.8
  },
  {
    id: 3,
    label: "البرامج الخيرية",
    value: 60487,
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape1.svg",
    blueBg: "https://emch.ae/WebsiteNewContent/images/ballon-blue-right.svg",
    yellowBg: "https://emch.ae/WebsiteNewContent/images/ballon-yellow-left.svg",
    isTop100: true,
    layout: "blue-right-yellow-left",
    floatDuration: 5.2
  },
  {
    id: 4,
    label: "الأسر المستفيدة",
    value: 16025,
    icon: "https://emch.ae/WebsiteNewContent/images/combined-shape4.svg",
    yellowBg: "https://emch.ae/WebsiteNewContent/images/ballon-yellow-right.svg",
    blueBg: "https://emch.ae/WebsiteNewContent/images/ballon-blue-left.svg",
    isTop100: false,
    layout: "yellow-right-blue-left",
    floatDuration: 4.5
  }
];

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 2200; // 2.2 seconds animation
      const steps = 60;
      const stepTime = duration / steps;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Achievements() {
  return (
    <section 
      id="third-section" 
      className="relative w-full py-20 overflow-hidden font-tajawal my-12"
      style={{ 
        backgroundImage: 'linear-gradient(to bottom, #ffffff, rgba(204, 204, 204, 0.3)), url(https://emch.ae/WebsiteNewContent/images/pattern_1.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0% 0%'
      }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Heading Section matching computed styles */}
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          
          {/* Circle icon wrapper */}
          <div 
            className="w-24 h-24 flex items-center justify-center mb-2 bg-no-repeat bg-contain bg-center animate-pulse"
            style={{ backgroundImage: 'url("https://emch.ae/WebsiteNewContent/images/circle_bg.svg")' }}
          >
            <img 
              src="https://emch.ae/WebsiteNewContent/images/loving-home.svg" 
              alt="loving home" 
              className="w-14 h-13 object-contain"
            />
          </div>

          <h2 className="text-[26px] font-bold text-[#bd9d54] leading-[31.2px] mb-1 -mt-2">
            إنجازاتنا
          </h2>

          <h4 className="text-[17px] font-medium text-[#b9c7d4] leading-[27.2px] max-w-xl">
            نمد جسور الإنسانية بين المحسن والمحتاج لينمو العطاء
          </h4>
        </div>

        {/* Balloon Counters Grid with U-Arc Dip & Continuous Floating Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start justify-items-center min-h-[280px] pt-4">
          {STATS.map((stat, i) => {
            return (
              <motion.div
                key={stat.id}
                initial={{ rotateY: 90, opacity: 0 }}
                whileInView={{ rotateY: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className={`w-[255px] h-[160px] flex items-end justify-center transition-all duration-500 hover:scale-110 ${
                  stat.isTop100 ? 'lg:translate-y-24' : 'lg:translate-y-0'
                }`}
              >
                {/* Continuous Floating Flight Animation */}
                <motion.div
                  animate={{
                    y: [0, -10, 0, 10, 0],
                    rotate: [0, 1.5, 0, -1.5, 0],
                  }}
                  transition={{
                    duration: stat.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full flex items-end justify-center drop-shadow-xl"
                >
                  {stat.layout === 'blue-right-yellow-left' ? (
                    /* Layout 1 & 3: Blue-First (right) + Yellow-First (left) */
                    <div className="flex items-end justify-center w-[255px] h-[160px] font-bold cursor-pointer">
                      
                      {/* Blue First (Right balloon containing Icon & Label) */}
                      <div 
                        className="w-[120px] h-[160px] pt-6 text-center text-white flex flex-col items-center justify-start bg-no-repeat bg-full"
                        style={{ backgroundImage: `url("${stat.blueBg}")`, backgroundSize: '100%' }}
                      >
                        <img src={stat.icon} alt="icon" className="w-[40px] h-[40px] mb-1" />
                        <p className="m-0 text-xs font-bold w-[120px] leading-tight text-white">{stat.label}</p>
                      </div>

                      {/* Yellow First (Left balloon containing Number) */}
                      <div 
                        className="w-[90px] h-[120px] pt-7 text-center text-white flex items-center justify-center bg-no-repeat bg-contain"
                        style={{ backgroundImage: `url("${stat.yellowBg}")` }}
                      >
                        <span className="text-[22px] leading-[33px] font-bold tracking-tight text-white font-sans">
                          <Counter value={stat.value} />
                        </span>
                      </div>

                    </div>
                  ) : (
                    /* Layout 2 & 4: Yellow-Second (right) + Blue-Second (left) */
                    <div className="flex items-end justify-center w-[255px] h-[160px] font-bold cursor-pointer">
                      
                      {/* Yellow Second (Right balloon containing Number) */}
                      <div 
                        className="w-[90px] h-[120px] pt-7 text-center text-white flex items-center justify-center bg-no-repeat"
                        style={{ backgroundImage: `url("${stat.yellowBg}")`, backgroundSize: '100%' }}
                      >
                        <span className="text-[22px] leading-[33px] font-bold tracking-tight text-white font-sans">
                          <Counter value={stat.value} />
                        </span>
                      </div>

                      {/* Blue Second (Left balloon containing Icon & Label) */}
                      <div 
                        className="w-[120px] h-[160px] pt-6 text-center text-white flex flex-col items-center justify-start bg-no-repeat bg-contain"
                        style={{ backgroundImage: `url("${stat.blueBg}")` }}
                      >
                        <img src={stat.icon} alt="icon" className="w-[40px] h-[40px] mb-1" />
                        <p className="m-0 text-xs font-bold w-[120px] leading-tight text-white">{stat.label}</p>
                      </div>

                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
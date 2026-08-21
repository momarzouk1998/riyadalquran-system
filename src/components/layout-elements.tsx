'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export function LayoutElements({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isNurserySystem = 
    pathname.startsWith('/nursery') || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/parent');

  return (
    <>
      {!isNurserySystem && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isNurserySystem && <Footer />}
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "جمعية ونظام رياض القرآن الكريم",
  description: "الموقع الرسمي ونظام إدارة الحضانة والخدمات التعليمية بجمعية رياض القرآن بالمنشأة الكبرى",
  applicationName: "رياض القرآن",
};

export const viewport: Viewport = {
  themeColor: "#137d54", // primary brand color
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-cairo bg-slate-50 text-slate-900 selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}

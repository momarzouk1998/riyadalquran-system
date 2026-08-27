import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { LayoutElements } from "@/components/layout-elements";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "جمعية رياض القرآن الكريم",
  description: "الموقع الرسمي ونظام إدارة الحضانة والخدمات التعليمية بجمعية رياض القرآن بالمنشأة الكبرى",
  applicationName: "رياض القرآن",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#246c74",
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
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900 selection:bg-primary selection:text-white">
        <LayoutElements>{children}</LayoutElements>
      </body>
    </html>
  );
}

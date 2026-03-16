import type { Metadata } from "next";
import { Geist, Silkscreen, Share_Tech_Mono, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatGal - 阿卡夏漫游列车",
  description: "在数据的星海中，让 AI 分身替你找到灵魂共鸣的人",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`
          ${geistSans.variable}
          ${silkscreen.variable}
          ${shareTechMono.variable}
          ${caveat.variable}
          antialiased bg-[#FFF8F5] text-[#3D3029] min-h-screen font-sans
        `}
      >
        {children}
      </body>
    </html>
  );
}

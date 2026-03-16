import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
        className={`${geistSans.variable} antialiased bg-[#FFF8F5] text-[#3D3029] min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

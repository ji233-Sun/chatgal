import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatGal - AI 个人名片",
  description: "展示你的 SecondMe AI 身份，分享个人兴趣标签",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} antialiased bg-[#FFF8F5] text-[#3D3029] min-h-screen font-sans`}>
        {children}
      </body>
    </html>
  );
}

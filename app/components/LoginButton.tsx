"use client";

import PixelIcon from "./ui/PixelIcon";

/**
 * LoginButton - 登录按钮
 * 使用 ArcadeUI 风格 + 像素化设计
 */
export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="
        inline-flex items-center gap-3
        px-8 py-4
        rounded-lg
        font-pixel text-sm font-bold
        bg-gradient-to-b from-[#ffd700] to-[#ff8c00]
        border-4 border-[#8b5a2b]
        text-[#0a0e27]
        cursor-pointer
        transition-all duration-200
        hover:translate-y-[-2px]
        hover:shadow-pixel-lg
        active:translate-y-[2px]
        active:shadow-pixel-sm
        shadow-pixel
      "
      style={{
        boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.75)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "6px 6px 0px 0px rgba(0, 0, 0, 0.75)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0, 0, 0, 0.75)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.boxShadow = "2px 2px 0px 0px rgba(0, 0, 0, 0.75)";
        e.currentTarget.style.transform = "translateY(2px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.boxShadow = "6px 6px 0px 0px rgba(0, 0, 0, 0.75)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
    >
      <PixelIcon name="icon-train" size={18} color="#0a0e27" />
      登车
    </a>
  );
}

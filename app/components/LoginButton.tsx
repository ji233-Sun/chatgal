"use client";

import { Button } from "arcadeui";
import PixelIcon from "./ui/PixelIcon";

/**
 * LoginButton - 登录按钮
 * 使用 ArcadeUI Button 组件 + 金色渐变覆盖
 */
export default function LoginButton() {
  return (
    <Button
      variant="primary"
      size="lg"
      className="!bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !border-[#8b5a2b] !text-[#0a0e27] !inline-flex !items-center !gap-3 !px-8 !py-4 !font-pixel !text-sm !font-bold"
      onClick={() => {
        window.location.href = "/api/auth/login";
      }}
    >
      <PixelIcon name="icon-train" size={18} color="#0a0e27" />
      登车
    </Button>
  );
}

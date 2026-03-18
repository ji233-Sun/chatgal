"use client";

import { useEffect } from "react";
import PixelIcon from "./PixelIcon";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: "icon-alert" as const,
      iconColor: "#ef4444",
      confirmBg: "bg-rose-500 hover:bg-rose-600",
    },
    warning: {
      icon: "icon-alert" as const,
      iconColor: "#f59e0b",
      confirmBg: "bg-amber-500 hover:bg-amber-600",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#0F0F23] border border-white/10 rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 p-2 rounded-lg bg-white/5">
            <PixelIcon name={style.icon} size={24} color={style.iconColor} />
          </div>
          <div className="flex-1">
            <h3 className="font-pixel text-sm text-white mb-2">{title}</h3>
            {message && (
              <p className="font-retro text-xs text-white/60 leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 font-pixel text-[10px] text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-sm transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-pixel text-[10px] text-white ${style.confirmBg} px-4 py-2.5 rounded-sm transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

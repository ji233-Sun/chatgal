/**
 * 车厢类型共享常量
 * 从 ConversationObserver 提取，供历史卡片等组件复用
 */

export const CARRIAGE_NAMES: Record<string, string> = {
  tech: "TECH_BAY",
  art: "ART_GALLERY",
  philosophy: "VOID_DECK",
  gaming: "ARCADE_CORE",
};

export const CARRIAGE_COLORS: Record<string, string> = {
  tech: "#7C3AED",
  art: "#F43F5E",
  philosophy: "#22D3EE",
  gaming: "#FACC15",
};

/** 车厢对应的 PixelIcon 名称 */
export const CARRIAGE_ICONS: Record<string, string> = {
  tech: "icon-wrench",
  art: "icon-star",
  philosophy: "icon-scope",
  gaming: "icon-game",
};

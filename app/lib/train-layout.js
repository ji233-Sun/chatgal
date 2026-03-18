/**
 * train-layout.js - 照抄 Star-Office-UI 的 layout.js 架构
 *
 * 核心思想：数据驱动渲染，所有坐标统一管理
 * 铁律遵守：
 * - 背景：public/train_interior_bullet.png
 * - 人物：public/npc_anim_00.png（绿发小女孩，已去绿幕）
 * - 全屏 Canvas，pixelated
 */

// 🎮 游戏画布配置（照抄 Star-Office-UI）
export const TRAIN_LAYOUT = {
  // === 游戏画布 ===
  game: {
    width: 1280,
    height: 720
  },

  // === 铁律 4：强制正交移动 - 固定 Y 轴，水平移动 ===
  // 在中间过道定义单行 Waypoints
  aisleWaypoints: [
    { x: 200, y: 432, id: 'wp_1' },  // Y 固定为 60% (432/720 = 0.6)
    { x: 400, y: 432, id: 'wp_2' },
    { x: 640, y: 432, id: 'wp_3' },  // 中心
    { x: 880, y: 432, id: 'wp_4' },
    { x: 1080, y: 432, id: 'wp_5' }
  ],

  // === 素材路径（铁律 2） ===
  assets: {
    background: '/train_interior_bullet.png',
    sprite: '/npc_anim_00.png',
    bubble: '/Train Example/assets/emotes/question.png'
  },

  // === Agent 配置 ===
  agentColors: {
    player: 0x00ff00,  // 绿色发光
    npc: 0x94a3b8       // 蓝灰色
  }
};

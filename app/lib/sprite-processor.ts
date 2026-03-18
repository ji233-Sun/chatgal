/**
 * sprite-processor.ts - 完全重构版
 *
 * 核心修复：
 * 1. 正确去除绿幕（读取左上角像素）
 * 2. 严格网格切分（16x16）
 * 3. 支持上、下、右 + 左方向 flipX
 */

export interface SpriteFrame {
  dataUrl: string;
  width: number;
  height: number;
}

export interface SpriteSheet {
  frames: {
    down: SpriteFrame[];
    up: SpriteFrame[];
    right: SpriteFrame[];
    left: SpriteFrame[];
  };
}

/**
 * 加载图片
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

/**
 * 去除绿幕并提取帧
 *
 * @param sourceImg - 源图片
 * @param frameX - 帧的 X 坐标
 * @param frameY - 帧的 Y 坐标
 * @param frameWidth - 帧宽度
 * @param frameHeight - 帧高度
 * @param flipX - 是否水平翻转
 */
async function extractFrameWithGreenScreenRemoval(
  sourceImg: HTMLImageElement,
  frameX: number,
  frameY: number,
  frameWidth: number,
  frameHeight: number,
  flipX: boolean = false
): Promise<SpriteFrame> {
  const canvas = document.createElement('canvas');
  canvas.width = frameWidth;
  canvas.height = frameHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('无法获取 Canvas 上下文');

  // 设置翻转
  if (flipX) {
    ctx.translate(frameWidth, 0);
    ctx.scale(-1, 1);
  }

  // 🎯 核心：先绘制到临时 canvas 读取绿幕色
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = frameWidth;
  tempCanvas.height = frameHeight;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;

  // 切割帧
  tempCtx.drawImage(
    sourceImg,
    frameX, frameY, frameWidth, frameHeight,
    0, 0, frameWidth, frameHeight
  );

  // 获取像素数据
  const imageData = tempCtx.getImageData(0, 0, frameWidth, frameHeight);
  const data = imageData.data;

  // 🎯 读取左上角像素作为绿幕色
  const greenR = data[0];
  const greenG = data[1];
  const greenB = data[2];

  console.log(`🎮 绿幕色: RGB(${greenR}, ${greenG}, ${greenB})`);

  // 遍历所有像素，将绿幕色设为透明
  let transparentPixels = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 精确匹配绿幕色
    if (r === greenR && g === greenG && b === greenB) {
      data[i + 3] = 0; // Alpha = 0
      transparentPixels++;
    }
  }

  console.log(`🎮 去除 ${transparentPixels} 个绿幕像素`);

  // 绘制到目标 canvas
  ctx.putImageData(imageData, 0, 0);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: frameWidth,
    height: frameHeight,
  };
}

/**
 * 加载并处理 npc_anim_00.png 精灵表
 *
 * 图片分析：
 * - 尺寸：16x48 像素
 * - 布局：纵向 3 帧
 * - 每帧：16x16 像素
 * - 内容：Frame 0=向下, Frame 1=向上, Frame 2=向右
 */
export async function loadNPCSpriteSheet(spritePath: string): Promise<SpriteSheet> {
  console.log('🎮 开始加载精灵表:', spritePath);

  const img = await loadImage(spritePath);
  const { width, height } = img;

  console.log(`🎮 精灵表尺寸: ${width}x${height}`);

  // 🎯 严格网格切分：16x16
  const FRAME_WIDTH = 16;
  const FRAME_HEIGHT = 16;
  const NUM_FRAMES = height / FRAME_HEIGHT;

  console.log(`🎮 单帧: ${FRAME_WIDTH}x${FRAME_HEIGHT}, 总帧数: ${NUM_FRAMES}`);

  // 提取 3 个方向的帧
  const downFrame = await extractFrameWithGreenScreenRemoval(
    img, 0, 0, FRAME_WIDTH, FRAME_HEIGHT, false
  );
  const upFrame = await extractFrameWithGreenScreenRemoval(
    img, 0, FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT, false
  );
  const rightFrame = await extractFrameWithGreenScreenRemoval(
    img, 0, FRAME_HEIGHT * 2, FRAME_WIDTH, FRAME_HEIGHT, false
  );
  const leftFrame = await extractFrameWithGreenScreenRemoval(
    img, 0, FRAME_HEIGHT * 2, FRAME_WIDTH, FRAME_HEIGHT, true
  );

  const sheet: SpriteSheet = {
    frames: {
      down: [downFrame],
      up: [upFrame],
      right: [rightFrame],
      left: [leftFrame],
    },
  };

  console.log('✅ 精灵表加载完成');

  return sheet;
}

/**
 * 获取当前帧
 */
export function getFrame(sheet: SpriteSheet, direction: 'down' | 'up' | 'left' | 'right'): SpriteFrame {
  return sheet.frames[direction][0];
}

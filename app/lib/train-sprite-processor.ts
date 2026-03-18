/**
 * train-sprite-processor.ts - 终极修复版
 * 修复：
 * 1. 加入 frame1/frame2 交替动画
 * 2. 正确处理 left 方向的翻转
 */

export interface SpriteFrame {
  frame1: string;
  frame2: string;
}

export interface SpriteSheet {
  frames: {
    down: SpriteFrame;
    up: SpriteFrame;
    left: SpriteFrame;
    right: SpriteFrame;
  };
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

async function extractFrame(
  sourceImg: HTMLImageElement,
  frameX: number,
  frameY: number,
  frameWidth: number,
  frameHeight: number,
  greenColor: number[],
  flipX: boolean = false
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = frameWidth;
  canvas.height = frameHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('无法获取 Canvas 上下文');

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = frameWidth;
  tempCanvas.height = frameHeight;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;

  tempCtx.drawImage(sourceImg, frameX, frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

  const imageData = tempCtx.getImageData(0, 0, frameWidth, frameHeight);
  const data = imageData.data;
  const [greenR, greenG, greenB] = greenColor;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === greenR && data[i + 1] === greenG && data[i + 2] === greenB) {
      data[i + 3] = 0;
    }
  }
  tempCtx.putImageData(imageData, 0, 0);

  if (flipX) {
    ctx.translate(frameWidth, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(tempCanvas, 0, 0);

  return canvas.toDataURL('image/png');
}

export async function loadNPCSpriteSheet(spritePath: string): Promise<SpriteSheet> {
  console.log('🎮 开始加载精灵表:', spritePath);
  const img = await loadImage(spritePath);

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = 1; colorCanvas.height = 1;
  const colorCtx = colorCanvas.getContext('2d')!;
  colorCtx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
  const [gR, gG, gB] = colorCtx.getImageData(0, 0, 1, 1).data;
  const greenColor = [gR, gG, gB];

  const SIZE = 16;

  // 完美提取交替动画帧 (Frame1 为静止/迈左腿, Frame2 为迈右腿)
  // 横向分布：[下1, 下2, 上1, 上2, 右1, 右2]
  const d1 = await extractFrame(img, 0, 0, SIZE, SIZE, greenColor, false);
  const d2 = await extractFrame(img, 16, 0, SIZE, SIZE, greenColor, false);
  const u1 = await extractFrame(img, 32, 0, SIZE, SIZE, greenColor, false);
  const u2 = await extractFrame(img, 48, 0, SIZE, SIZE, greenColor, false);
  const r1 = await extractFrame(img, 64, 0, SIZE, SIZE, greenColor, false);
  const r2 = await extractFrame(img, 80, 0, SIZE, SIZE, greenColor, false);
  // 左走是右走的镜像
  const l1 = await extractFrame(img, 64, 0, SIZE, SIZE, greenColor, true);
  const l2 = await extractFrame(img, 80, 0, SIZE, SIZE, greenColor, true);

  return {
    frames: {
      down: { frame1: d1, frame2: d2 },
      up: { frame1: u1, frame2: u2 },
      right: { frame1: r1, frame2: r2 },
      left: { frame1: l1, frame2: l2 }
    }
  };
}

export function getFrame(sheet: SpriteSheet, direction: 'down' | 'up' | 'left' | 'right'): SpriteFrame {
  return sheet.frames[direction];
}

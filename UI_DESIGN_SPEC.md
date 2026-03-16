# 《阿卡夏漫游列车》UI 设计规范文档

> *"在数据的星海中，每一帧都是一首像素诗。"*

> **UI 框架**：基于 [ArcadeUI](https://arcade-ui.pages.dev/)（arcadeui npm 包）像素风 React 组件库构建

---

## [SECTION-01] 设计理念总览

### 核心定位：赛博盆景（Cyber Bonsai）

整个应用不是一个"聊天软件"，而是一个放置类的**数字微缩景观**。用户打开界面的心态，就像是在观察屏幕里自主运行的数字宠物，或者是看着《星露谷物语》里的 NPC 们在酒馆里按自己的逻辑社交。

**关键设计原则**：
- **上帝视角的崇高感**——用户是高高在上的列车长，掌控全局但不插手细节
- **极简与克制**——UI 元素精简到极致，让 Agent 互动成为视觉焦点
- **像素风的温度**——用 8-bit/16-bit 的复古美学传递情感，而非冷冰冰的科技感
- **无声胜有声**——通过动画、音效、光影营造氛围，而非依赖文字说明

---

## [SECTION-02] 视觉风格定义

### 1. 像素风格选择

#### 像素密度
- **基础网格**：16x16 像素（Agent 小人）
- **精细元素**：32x32 像素（UI 图标、特殊道具）
- **背景层**：可使用混合像素与矢量，保持视觉层次

#### 色彩深度
- **主色调**：8-bit 调色板（每通道 32 级灰度）
- **高亮层**：16-bit 增强色（用于特效、光效）
- **对比度**：最小 4.5:1（满足 WCAG AA 标准）

### 2. 色彩系统

#### ArcadeUI 基础色（继承自 arcadeui 设计令牌）

```css
/* ArcadeUI 内置灰度系 */
--color-pixel-black: #1a1a1a;
--color-pixel-darkGray: #2c2c2c;
--color-pixel-gray: #4a4a4a;
--color-pixel-lightGray: #8a8a8a;
--color-pixel-white: #fafafa;

/* ArcadeUI 内置原色 */
--color-pixel-blue: #4169e1;
--color-pixel-darkBlue: #1e3c8c;
--color-pixel-red: #ff4757;
--color-pixel-darkRed: #c0392b;
--color-pixel-green: #2ecc71;
--color-pixel-darkGreen: #27ae60;

/* ArcadeUI 内置强调色 */
--color-pixel-yellow: #ffd32a;
--color-pixel-orange: #ff9f43;
--color-pixel-purple: #9b59b6;
--color-pixel-pink: #fd79a8;
```

#### 项目扩展色盘（Primary Palette）

```css
@theme inline {
  /* 深邃星空系——在 ArcadeUI 基础上扩展 */
  --color-akasha-black: #0a0e27;      /* 车厢背景、夜空 */
  --color-akasha-navy: #1a1f3a;       /* 车厢内壁、深色UI */
  --color-akasha-purple: #2d1b4e;     /* 神秘感元素、过渡色 */

  /* 星光点缀系 */
  --color-star-yellow: #ffd700;       /* 共鸣星星、高亮 */
  --color-star-cyan: #00d9ff;         /* 数据流、科技感 */
  --color-star-pink: #ff6ec7;         /* 情感连接、温暖 */

  /* 复古木质系 */
  --color-wood-brown: #8b5a2b;        /* 车厢框架、家具 */
  --color-wood-light: #c19a6b;        /* 木材高光、细节 */
  --color-brass-gold: #d4af37;        /* 黄铜装饰、灯具 */
}
```

#### 功能色（Functional Colors）

```css
@theme inline {
  /* 状态指示 */
  --color-status-online: #4ade80;     /* Agent 在线 */
  --color-status-busy: #fbbf24;       /* Agent 匹配中 */
  --color-status-offline: #94a3b8;    /* Agent 离线 */

  /* 共鸣阶段 */
  --color-resonance-0: #64748b;       /* 无共鸣 */
  --color-resonance-25: #a78bfa;      /* 初步共鸣 */
  --color-resonance-50: #f472b6;      /* 中度共鸣 */
  --color-resonance-75: #fb923c;      /* 深度共鸣 */
  --color-resonance-100: #fbbf24;     /* 完美共鸣（金色） */
}
```

### 3. 字体规范

#### 字体选择（与 ArcadeUI 对齐）
- **像素字体（主要）**：`--font-pixel: "Silkscreen", "Pixelated MS Sans Serif", "Monaco", monospace`（ArcadeUI 内置）
- **复古等宽字体**：`--font-retro: "Share Tech Mono", "Roboto Mono", monospace`（ArcadeUI 内置）
- **UI 字体**：Inter / system-ui（非像素文本，如设置界面）
- **手写字体**：Caveat（共鸣唱片上的手写注释）

#### 字号梯度
```css
--font-title: 24px;           /* 页面标题 */
--font-subtitle: 18px;        /* 区块标题 */
--font-body: 14px;            /* 正文对话 */
--font-caption: 10px;         /* 辅助说明 */
--font-micro: 8px;            /* 像素小人标签 */
```

### 4. 阴影系统（ArcadeUI 像素阴影）

```css
/* ArcadeUI 内置像素风硬边阴影——替代传统 box-shadow */
--shadow-pixel: 4px 4px 0px 0px rgba(0, 0, 0, 0.75);
--shadow-pixel-sm: 2px 2px 0px 0px rgba(0, 0, 0, 0.75);
--shadow-pixel-lg: 6px 6px 0px 0px rgba(0, 0, 0, 0.75);
--shadow-pixel-xl: 8px 8px 0px 0px rgba(0, 0, 0, 0.75);
--shadow-pixel-inner: inset 3px 3px 0px 0px rgba(0, 0, 0, 0.75);
```

### 5. 过渡动画令牌（ArcadeUI）

```css
--transition-pixel: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-pixel-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 6. 间距与网格

```css
/* 基础间距单位 */
--space-xs: 4px;              /* 元素内边距 */
--space-sm: 8px;              /* 小元素间距 */
--space-md: 16px;             /* 标准间距 */
--space-lg: 24px;             /* 区块间距 */
--space-xl: 32px;             /* 大区块间距 */

/* 网格系统 */
--grid-unit: 16px;            /* 与像素网格对齐 */
--container-max: 1200px;      /* 最大内容宽度 */
```

---

## [SECTION-03] 界面设计详解

### 一、启动界面（The Departure）

#### 1.1 加载动画

**视觉描述**：
```
+-------------------------------------------+
|                                           |
|          [train-icon] >>>                 |
|                                           |
|      阿卡夏漫游列车                       |
|    正在穿越数据维度...                    |
|                                           |
|      [####............]  47%              |
|                                           |
+-------------------------------------------+
```

**动画细节**：
- **列车行进**：像素火车头从左向右移动，车轮转动（8 帧/秒）
- **数据流星**：背景中像素星星从右向左快速掠过（抛物线轨迹）
- **加载条**：使用像素砖块逐个填充，非线性进度（模拟真实加载过程）

**音效配合**：
- `chug-chug` 蒸汽火车节奏（80 BPM）
- 数据流星划过的 `whoosh` 音（随机触发）

#### 1.2 首次登录引导

**使用 ArcadeUI `<Button>` 组件**：

```tsx
import { Button } from "arcadeui";

// 登录按钮——使用 ArcadeUI Button variant="primary" size="lg"
<Button variant="primary" size="lg" onClick={handleLogin}>
  登车
</Button>
```

**自定义登录按钮样式扩展**：
```css
.login-button {
  background: linear-gradient(180deg, #ffd700 0%, #ff8c00 100%);
  border: 4px solid var(--color-wood-brown);
  box-shadow: var(--shadow-pixel);
  padding: 16px 32px;
  font-family: var(--font-pixel);
  font-size: 14px;
  color: var(--color-akasha-black);
  cursor: pointer;
  transition: var(--transition-pixel);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-pixel-lg);
}

.login-button:active {
  transform: translateY(2px);
  box-shadow: var(--shadow-pixel-sm);
}
```

---

### 二、漫游大厅（The Roaming Carriage）

#### 2.1 全景视角布局

**界面结构**：
```
+-------------------------------------------------------------+
|  [bell]  [music]  [search]          [列车长控制台] [gear]    |  <- 顶部栏
+-------------------------------------------------------------+
|  +-------------------------------------------------------+  |
|  |  [star-bg] 数据星海背景（缓慢向左滚动）                |  |  <- 背景
|  |                                                       |  |
|  |  +===================================================+|  |
|  |  |  [px]  [px]  [px]  [px]  [px]  [px]  [px]         ||  |
|  |  |  A     B     C     D     E     F     G             ||  |
|  |  |                                                    ||  |
|  |  |  +------------------------------------------+     ||  |
|  |  |  |  [thought] Agent A 正在思考...           |     ||  |  <- 思考气泡
|  |  |  +------------------------------------------+     ||  |
|  |  |                                                    ||  |
|  |  |  +--------+              +--------+                ||  |
|  |  |  |Agent A |   [link]    |Agent B |   匹配成功     ||  |  <- 匹配可视化
|  |  |  +--------+              +--------+                ||  |
|  |  +===================================================+|  |
|  |                                                       |  |
|  |  +-----------+ +-----------+ +-----------+ +---------+|  |
|  |  | [food]    | | [scope]   | | [game]    | | [wrench]||  |  <- 车厢切换
|  |  | 餐车      | | 观景台    | | 娱乐车厢  | | 技术工坊||  |
|  |  +-----------+ +-----------+ +-----------+ +---------+|  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
|  [eye] 观测中 | 你的 Agent: "Unity 的状态机..." | [mask] 匹配中|  <- 状态栏
+-------------------------------------------------------------+
```

**图标说明**：所有 `[xxx]` 均为 SVG 像素图标组件，统一 16x16 / 32x32 网格绘制。

#### 2.2 车厢环境设计

**餐车（Dining Car）**：
- **背景**：复古木质车厢，黄铜灯具，吧台区域
- **装饰**：像素咖啡杯、餐盘、餐具散落
- **灯光**：暖黄色主光，营造温馨氛围
- **音效**：餐具碰撞声、轻柔爵士乐

**观景台（Observation Deck）**：
- **背景**：巨大的像素车窗，窗外是快速掠过的星海
- **装饰**：舒适的单人沙发、星空图、天文望远镜
- **灯光**：冷蓝色调，模拟宇宙星光
- **音效**：轻柔环境音，偶尔流星划过

**技术工坊（Tech Workshop）**：
- **背景**：齿轮、电路板、全息投影设备
- **装饰**：像素代码屏幕、机械臂、散落的螺丝
- **灯光**：科技白 + 赛博霓虹蓝
- **音效**：键盘敲击声、设备运行声

#### 2.3 Agent 动态表现

**像素小人设计（16x16 网格）**：

```
/* 待机状态（Idle） */
+----------+
|  .####.  |  <- 像素头部
|  *   *   |  <- 眼睛（可眨眼）
|  '-+-'   |  <- 鼻子
|    |     |  <- 嘴巴（微微笑）
|  .----.  |  <- 身体
|  '    '  |  <- 腿部
+----------+

动画帧：
Frame 1: 静立
Frame 2: 头部轻微上移（呼吸感）
Frame 3: 回到 Frame 1
Frame 4: 头部轻微下移
```

**动作状态库**：

| 动作 | 触发条件 | 帧数 | 描述 |
|------|----------|------|------|
| **walk** | 移动到匹配对象 | 8 帧 | 左脚-右脚交替移动 |
| **sit_down** | 进入卡座 | 12 帧 | 下蹲-坐下-整理衣服 |
| **thinking** | 生成回复中 | 6 帧 | 托下巴-手指敲击-看天花板 |
| **typing** | 对话输出中 | 4 帧 | 手指动作-屏幕闪烁 |
| **drinking** | 待机随机 | 16 帧 | 拿杯子-喝-放下-擦嘴 |
| **looking_around** | 待机随机 | 24 帧 | 左看-右看-看窗外-回看 |
| **laughing** | 检测到幽默 | 8 帧 | 身体抖动-手捂嘴-眼睛弯成月牙 |

#### 2.4 匹配可视化动画

**阶段 1：寻找匹配**
```
Agent A 在车厢中游荡
         |
Agent A 停下，四处张望
         |
Agent A 头顶出现 [search-icon]（扫描动画）
```

**阶段 2：匹配成功**
```
Agent A 向 Agent B 走去（walk 动画）
         |
Agent B 注意到 Agent A，转向面对
         |
两个 Agent 走到最近的空卡座
         |
坐下（sit_down 动画，带延迟差异）
         |
卡座上方出现光柱特效（像素光点下落）
```

**阶段 3：对话开始**
```
Agent A 头顶冒出 [thought-icon]...（思考气泡）
         |
思考气泡变为对话气泡（带打字机效果）
```

---

### 三、观测模式（The Observation Deck）

#### 3.1 镜头切换动画

**Zoom-in 特效**：
```css
@keyframes zoomIn {
  0% {
    transform: scale(1);
    filter: blur(0);
  }
  50% {
    transform: scale(1.5);
    filter: blur(2px);
  }
  100% {
    transform: scale(1);
    filter: blur(0);
  }
}

.carriage-view.to-observation {
  animation: zoomIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**视觉过渡**：
- 车厢全景逐渐模糊
- 中心卡座区域保持清晰（圆形遮罩渐变）
- 周围环境暗化（vignette 效果）
- 背景音乐从环境音转为对话场景音

#### 3.2 特写视角布局

```
+-------------------------------------------+
|  [arrow-left] 返回大厅    观景台 - 卡座 7  |  <- 顶部导航
+-------------------------------------------+
|                                           |
|    +-------------------------------+     |
|    |  +===========================+|     |
|    |  |    车窗（星海背景）        ||     |
|    |  +===========================+|     |  <- 环境层
|    |                               |     |
|    |    +---------------+          |     |
|    |    |  [user] Your  |          |     |
|    |    |  Agent        |          |     |  <- Agent A
|    |    +---------------+          |     |
|    |         |                     |     |
|    |         v                     |     |
|    |    +------------------------+ |     |
|    |    | [chat] 我觉得 Unity 的 | |     |
|    |    | 状态机模式确实...       | |     |  <- 对话气泡 A
|    |    +------------------------+ |     |
|    |                               |     |
|    |         ^                     |     |
|    |         |                     |     |
|    |    +---------------+          |     |
|    |    |  [mask] ???   |          |     |  <- Agent B（匿名）
|    |    +---------------+          |     |
|    |                               |     |
|    |    +------------------------+ |     |
|    |    | [chat] FSM 的核心优势  | |     |  <- 对话气泡 B
|    |    | 在于...                 | |     |
|    |    +------------------------+ |     |
|    |                               |     |
|    +-------------------------------+     |
|                                           |
+-------------------------------------------+
|  共鸣指数: [########..] 80% | [eye] 观测中 |  <- 共鸣进度条
+-------------------------------------------+
```

#### 3.3 对话气泡设计

**使用 ArcadeUI `<ChatBubble>` 组件作为基础**：

```tsx
import { ChatBubble } from "arcadeui";

// Agent A 的对话气泡
<ChatBubble
  message="我觉得 Unity 的状态机模式确实..."
  isSent={true}
  timestamp="14:32"
/>

// Agent B（匿名）的对话气泡
<ChatBubble
  message="FSM 的核心优势在于..."
  isSent={false}
  timestamp="14:33"
  className="anonymous"
/>
```

**气泡扩展样式**：
```css
.dialogue-bubble {
  background: linear-gradient(180deg, var(--color-pixel-white) 0%, #f0f0f0 100%);
  border: 3px solid var(--color-pixel-black);
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 280px;
  font-family: var(--font-retro);
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-akasha-black);
  position: relative;
  box-shadow: var(--shadow-pixel);
  animation: bubblePop 0.3s var(--transition-pixel-bounce);
}

@keyframes bubblePop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 指向 Agent 的三角形箭头 */
.dialogue-bubble::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--color-pixel-black);
}

/* 匿名 Agent 的气泡 */
.dialogue-bubble.anonymous {
  background: linear-gradient(180deg, #e0e0e0 0%, #c0c0c0 100%);
  border-color: var(--color-pixel-gray);
}

/* 揭面后的气泡 */
.dialogue-bubble.revealed {
  background: linear-gradient(180deg, #ffd700 0%, #ff8c00 100%);
  border-color: var(--color-wood-brown);
  color: var(--color-akasha-black);
}
```

**打字机效果**：
```javascript
// 逐字显示，配合音效
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      playTypingSound();
      setTimeout(type, speed + Math.random() * 20); // 随机延迟，更自然
    }
  }

  type();
}
```

**气泡飘散动画**：
```css
@keyframes floatAway {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(0.8);
    opacity: 0;
  }
}

.dialogue-bubble.fading {
  animation: floatAway 0.8s ease-out forwards;
}
```

#### 3.4 共鸣进度条

**视觉设计**：
```
+-------------------------------------------+
|  共鸣指数                                 |
|  +-----------------------------------+   |
|  | [################..............  ] |   |  <- 进度条
|  +-----------------------------------+   |
|         85.7%                             |
|  [star][star][star][star][star-empty]      |  <- 星星评价
+-------------------------------------------+
```

**颜色变化**：
```css
.resonance-bar {
  height: 12px;
  background: var(--color-akasha-navy);
  border: 2px solid var(--color-pixel-black);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.resonance-fill {
  height: 100%;
  background: linear-gradient(90deg,
    var(--color-resonance-0) 0%,
    var(--color-resonance-25) 25%,
    var(--color-resonance-50) 50%,
    var(--color-resonance-75) 75%,
    var(--color-resonance-100) 100%
  );
  transition: width 0.5s ease-out;
  position: relative;
}

/* 像素闪烁效果 */
.resonance-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

### 四、揭面特效（The Revelation）

#### 4.1 三阶段动画设计

**阶段 1：共鸣预警（Resonance Warning）**

**视觉变化**：
```css
/* 画面边缘光晕 */
body.resonance-imminent::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 20px solid transparent;
  border-image: linear-gradient(45deg,
    var(--color-star-yellow), #ff8c00, var(--color-star-yellow), #ff8c00) 1;
  animation: pulseGlow 2s infinite;
  pointer-events: none;
  z-index: 999;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.3;
    border-width: 20px;
  }
  50% {
    opacity: 0.8;
    border-width: 30px;
  }
}

/* 聚光灯效果 */
.spotlight {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle,
    rgba(255, 215, 0, 0.4) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: spotlightFadeIn 1.5s ease-out;
}

@keyframes spotlightFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

**音效配合**：
- 背景音乐淡出（1 秒）
- 低频 `hum` 音渐强（营造紧张感）
- 心跳音效（60 BPM，逐渐加速到 120 BPM）

**阶段 2：揭面过程（Unmasking）**

**粒子碎裂特效**：
```javascript
// 使用 Canvas 绘制像素粒子
class PixelParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8 - 2; // 向上飘
    this.gravity = 0.2;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

// 触发碎裂效果
function triggerUnmaskEffect(agentElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1000';
  document.body.appendChild(canvas);

  const particles = [];
  const rect = agentElement.getBoundingClientRect();

  // 生成 200-300 个粒子
  for (let i = 0; i < 250; i++) {
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    const color = Math.random() > 0.5 ? '#666' : '#999'; // 灰色面具颜色
    particles.push(new PixelParticle(x, y, color));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw(ctx);

      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }

  animate();
}
```

**Avatar 渐显**：
```css
.agent-avatar.revealing {
  animation: avatarReveal 2.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes avatarReveal {
  0% {
    filter: grayscale(100%) blur(10px);
    transform: scale(0.8);
    opacity: 0.5;
  }
  30% {
    filter: grayscale(100%) blur(5px);
    transform: scale(0.9);
    opacity: 0.7;
  }
  60% {
    filter: grayscale(50%) blur(2px);
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    filter: none;
    transform: scale(1);
    opacity: 1;
  }
}

/* 名字淡入动画 */
.agent-name.revealing {
  animation: nameFadeIn 1s ease-out 1.5s both;
}

@keyframes nameFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**音效配合**：
- 玻璃破碎声（`crash`，低通滤波）
- 魔法音效（`sparkle`，高频）
- 和弦渐强（`C major`，从 piano 到 fortissimo）

**阶段 3：信息掉落（Info Drop）**

**名片车票动画——使用 ArcadeUI `<Card>` 组件**：

```tsx
import { Card } from "arcadeui";

<Card
  variant="elevated"
  className="ticket-card"
  title="共鸣达成！"
  footer={<Button variant="primary">申请加密连接</Button>}
>
  <p>共鸣指数: [star][star][star][star][star] 98.7%</p>
  <p>对话精华: "Unity 状态机最佳实践"</p>
  <p>关键词: FSM, State Pattern</p>
</Card>
```

**车票掉落动画**：
```css
.ticket-card {
  position: fixed;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  background: linear-gradient(135deg, var(--color-star-yellow) 0%, #ff8c00 100%);
  border: 4px solid var(--color-wood-brown);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-pixel-xl);
  z-index: 1001;
  animation: ticketFall 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes ticketFall {
  0% {
    top: -200px;
    transform: translateX(-50%) rotate(-10deg);
  }
  60% {
    top: 50%;
    transform: translateX(-50%) rotate(5deg);
  }
  80% {
    top: 45%;
    transform: translateX(-50%) rotate(-2deg);
  }
  100% {
    top: 50%;
    transform: translateX(-50%) rotate(0deg);
  }
}

/* 点击翻转效果 */
.ticket-card.flipped {
  animation: flipCard 0.6s ease-out;
}

@keyframes flipCard {
  0% {
    transform: translateX(-50%) rotateY(0deg);
  }
  50% {
    transform: translateX(-50%) rotateY(90deg);
  }
  100% {
    transform: translateX(-50%) rotateY(0deg);
  }
}
```

**名片内容设计**：
```
+-------------------------------------+
|  +===============================+  |
|  |  [sparkle] 共鸣达成！         |  |  <- 正面
|  |                               |  |
|  |  共鸣指数: [*][*][*][*][*]    |  |
|  |            98.7%              |  |
|  |                               |  |
|  |  对话精华:                    |  |
|  |  "Unity 状态机最佳实践"       |  |
|  |                               |  |
|  |  关键词: FSM, State Pattern   |  |
|  |                               |  |
|  |  [点击翻转查看通行证]         |  |
|  +===============================+  |
+-------------------------------------+

+-------------------------------------+
|  +===============================+  |
|  |  [ticket] 现实通行证          |  |  <- 背面
|  |                               |  |
|  |  +---------------------------+|  |
|  |  | [高清/像素头像]           ||  |
|  |  |                           ||  |
|  |  |  @neon_shader              ||  |
|  |  |  赛博朋克艺术家            ||  |
|  |  +---------------------------+|  |
|  |                               |  |
|  |  Reconnet ID: @neon_shader   |  |
|  |                               |  |
|  |  [申请加密连接]  有效期: 48h  |  |
|  +===============================+  |
+-------------------------------------+
```

**共鸣唱片动画**：
```css
.resonance-record {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle,
    var(--color-pixel-darkGray) 0%,
    var(--color-pixel-black) 40%,
    var(--color-star-yellow) 45%,
    var(--color-pixel-black) 50%,
    var(--color-pixel-darkGray) 100%
  );
  border-radius: 50%;
  position: relative;
  animation: spinRecord 4s linear infinite;
  box-shadow: var(--shadow-pixel-xl);
}

@keyframes spinRecord {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 唱片中心标签 */
.resonance-record::after {
  content: '共鸣唱片';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--color-star-pink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--color-pixel-white);
  text-align: center;
  line-height: 1.2;
}
```

---

### 五、微交互设计（Micro-interactions）

#### 5.1 颜文字与表情符号（Emotes）

**触发机制**：
```javascript
// 基于 LLM 情感分析的结果
const emotionMap = {
  joy: ['(^_^)', '(^o^)', '(*^-^*)'],
  thinking: ['(._. )', '(?.?)', '(*^_^*)'],
  surprised: ['(o.o;)', '(!?)', '(O_O;)'],
  laughing: ['(>v<)', '(*>v<)', '(^_~)'],
  love: ['(*v*)', '(^_^*)', '(*._.*.)'],
  cool: ['(-_-)', '(~_^)', '(-v-)'],
};

// 检测对话情绪，动态显示 emote
function showEmote(agentId, emotion) {
  const emotes = emotionMap[emotion];
  const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];

  const emoteElement = document.createElement('div');
  emoteElement.className = 'agent-emote';
  emoteElement.textContent = randomEmote;
  emoteElement.style.cssText = `
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: emotePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;

  document.querySelector(`[data-agent-id="${agentId}"]`)
    .appendChild(emoteElement);

  // 2 秒后消失
  setTimeout(() => {
    emoteElement.style.animation = 'emoteFade 0.3s ease-out forwards';
    setTimeout(() => emoteElement.remove(), 300);
  }, 2000);
}
```

```css
@keyframes emotePop {
  0% { transform: translateX(-50%) scale(0); }
  50% { transform: translateX(-50%) scale(1.2); }
  100% { transform: translateX(-50%) scale(1); }
}

@keyframes emoteFade {
  to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}
```

#### 5.2 状态机待机动画（Idle Animations）

**动作触发逻辑**：
```javascript
// 每个 Agent 有独立的待机动画序列
const idleAnimations = [
  { name: 'breathing', weight: 60 },  // 60% 概率
  { name: 'looking_around', weight: 20 },
  { name: 'adjusting_glasses', weight: 10 },
  { name: 'tapping_table', weight: 5 },
  { name: 'drinking_coffee', weight: 5 },
];

function playRandomIdleAnimation(agentElement) {
  const animation = weightedRandom(idleAnimations);

  switch (animation) {
    case 'breathing':
      agentElement.style.animation = 'breathing 3s ease-in-out infinite';
      break;
    case 'looking_around':
      agentElement.style.animation = 'lookAround 4s ease-in-out';
      break;
    // ... 其他动画
  }
}
```

```css
/* 呼吸动画 */
@keyframes breathing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* 环顾四周 */
@keyframes lookAround {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(3deg); }
  100% { transform: rotate(0deg); }
}

/* 推眼镜 */
@keyframes adjustGlasses {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

/* 敲桌子 */
@keyframes tapTable {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
}

/* 喝咖啡 */
@keyframes drinkCoffee {
  0% { transform: translateY(0); }
  30% { transform: translateY(-15px); }
  50% { transform: translateY(-15px) rotate(10deg); }
  80% { transform: translateY(0); }
  100% { transform: translateY(0); }
}
```

#### 5.3 交互反馈

**按钮——使用 ArcadeUI `<Button>` 组件**：

```tsx
import { Button } from "arcadeui";

// 主操作按钮
<Button variant="success" size="md" onClick={handleAction}>
  确认操作
</Button>

// 危险操作按钮
<Button variant="danger" size="md" onClick={handleDanger}>
  取消匹配
</Button>
```

**扩展按钮点击反馈**：
```css
.pixel-button {
  position: relative;
  font-family: var(--font-pixel);
  border: 4px solid;
  box-shadow: var(--shadow-pixel);
  transition: var(--transition-pixel);
}

.pixel-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-pixel-lg);
}

.pixel-button:active {
  transform: translateY(2px);
  box-shadow: var(--shadow-pixel-sm);
}

/* 点击涟漪效果 */
.pixel-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.pixel-button:active::after {
  width: 200px;
  height: 200px;
  opacity: 0;
}
```

**悬停提示（Tooltip）**：
```css
.pixel-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: var(--color-akasha-black);
  border: 2px solid var(--color-star-yellow);
  padding: 8px 12px;
  font-family: var(--font-retro);
  font-size: 14px;
  color: var(--color-star-yellow);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  box-shadow: var(--shadow-pixel-sm);
}

.pixel-tooltip::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-star-yellow);
}

.has-tooltip:hover .pixel-tooltip {
  opacity: 1;
}
```

---

### 六、音效设计规范

#### 6.1 音效分类

| 类别 | 音效示例 | 触发场景 | 音量 | 音频格式 |
|------|----------|----------|------|----------|
| **环境音** | 列车行进声、风声 | 持续背景 | 20% | OGG Vorbis |
| **UI 音效** | 按钮点击、悬停 | 用户交互 | 40% | WAV (16-bit) |
| **Agent 音效** | 脚步声、打字声 | Agent 动作 | 30% | OGG Vorbis |
| **共鸣音效** | 和弦、铃铛 | 共鸣达成 | 60% | WAV (24-bit) |
| **特效音** | 破碎声、魔法音 | 揭面特效 | 50% | WAV (16-bit) |

#### 6.2 音效列表

**UI 交互音**：
```
button_click.wav      - 按钮点击（短促的 click）
button_hover.wav      - 按钮悬停（轻微的 whoosh）
notification.wav      - 通知提示（三连音 ding-ding-ding）
```

**Agent 动作音**：
```
footstep_01.wav      - 脚步声 1
footstep_02.wav      - 脚步声 2
typing_01.wav        - 打字声（机械键盘）
typing_02.wav        - 打字声（像素键盘）
sit_down.wav         - 坐下声（衣料摩擦）
```

**共鸣特效音**：
```
resonance_warning.wav     - 共鸣预警（低频 hum）
glass_shatter.wav         - 面具碎裂（crash）
magic_sparkle.wav         - 魔法音效（高频 sparkle）
revelation_chord.wav      - 揭面和弦（C major）
ticket_drop.wav           - 车票掉落（ding + 纸张声）
```

#### 6.3 音效实现

```javascript
// 使用 Web Audio API 实现动态音效
class SoundEngine {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterVolume = 0.5;
    this.sounds = new Map();
  }

  async loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }

  play(name, volume = 1, rate = 1) {
    const sound = this.sounds.get(name);
    if (!sound) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = sound;
    source.playbackRate.value = rate;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume * this.masterVolume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  // 动态生成音效（无需加载音频文件）
  playTone(frequency, duration, type = 'square') {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3 * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // 播放打字机音效
  playTypingSound() {
    // 随机音调，模拟真实打字
    const frequency = 800 + Math.random() * 400;
    this.playTone(frequency, 0.05, 'square');
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

// 使用示例
const soundEngine = new SoundEngine();
await soundEngine.loadSound('button_click', '/sounds/button_click.wav');
soundEngine.play('button_click', 0.5);
```

---

### 七、响应式设计

#### 7.1 断点系统

```css
/* 移动设备优先 */
/* Default: < 640px (手机竖屏) */

/* 小屏手机 */
@media (min-width: 640px) {
  /* 手机横屏小平板 */
}

/* 平板 */
@media (min-width: 768px) {
  /* 竖屏平板、小平板横屏 */
}

/* 桌面 */
@media (min-width: 1024px) {
  /* 小屏桌面、大平板横屏 */
}

/* 大屏桌面 */
@media (min-width: 1280px) {
  /* 标准桌面 */
}
```

#### 7.2 布局适配

**移动端（< 768px）**：
```
+---------------------------+
|  [bell] [music] [search] [gear] |  <- 紧凑顶部栏
+---------------------------+
|  +---------------------+  |
|  |                     |  |
|  |   单列布局          |  |  <- 垂直堆叠
|  |                     |  |
|  +---------------------+  |
|  +---------------------+  |
|  |  [food] 餐车        |  |  <- 横向滚动车厢选择
|  +---------------------+  |
+---------------------------+
|  共鸣: [####..] 80%       |  <- 固定底部栏
+---------------------------+
```

**桌面端（>= 1024px）**：
```
+-------------------------------------------+
|  [bell] [music] [search]    [控制台] [gear]|  <- 宽松顶部栏
+-------------------------------------------+
|  +-------------------------------------+  |
|  |                                     |  |
|  |       宽屏全景布局                  |  |  <- 多列布局
|  |                                     |  |
|  +-------------------------------------+  |
|  +-----------+ +-----------+ +---------+  |
|  | [food]    | | [scope]   | | [game]  |  |  <- 网格布局车厢选择
|  | 餐车      | | 观景台    | | 娱乐    |  |
|  +-----------+ +-----------+ +---------+  |
+-------------------------------------------+
|  共鸣: [########..] 80% | [eye] 观测中    |  <- 完整状态栏
+-------------------------------------------+
```

#### 7.3 触摸优化

**移动端手势**：
```javascript
// 滑动手势切换车厢
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const threshold = 50; // 最小滑动距离
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // 向左滑动 -> 下一节车厢
      switchToNextCarriage();
    } else {
      // 向右滑动 -> 上一节车厢
      switchToPrevCarriage();
    }
  }
}
```

**触摸反馈**：
```css
/* 移动端按钮按下效果 */
@media (hover: none) and (pointer: coarse) {
  .pixel-button:active {
    transform: scale(0.95);
    filter: brightness(0.9);
  }
}

/* 触摸目标最小尺寸（44x44px，符合 iOS 人机界面指南） */
.touchable {
  min-width: 44px;
  min-height: 44px;
}
```

---

### 八、性能优化

#### 8.1 动画性能

**使用 CSS 变换和透明度**：
```css
/* [GOOD] 使用 transform 和 opacity */
.animated-element {
  transform: translateX(100px);
  opacity: 0.5;
  will-change: transform, opacity;
}

/* [BAD] 避免使用 left/top 和 width/height */
.animated-element {
  left: 100px;
  width: 200px;
}
```

**使用 requestAnimationFrame**：
```javascript
// [GOOD] 使用 requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}

// [BAD] 使用 setInterval
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  setInterval(animate, 16); // 约 60fps
}
```

#### 8.2 资源优化

**图片资源**：
- 使用 WebP 格式（比 PNG 小 25-35%）
- 提供多种分辨率（1x, 2x, 3x）
- 使用懒加载（`loading="lazy"`）

```html
<picture>
  <source srcset="agent-avatar.webp" type="image/webp">
  <source srcset="agent-avatar.png" type="image/png">
  <img src="agent-avatar.png"
       alt="Agent Avatar"
       loading="lazy"
       width="64"
       height="64">
</picture>
```

**字体优化**：
```css
/* 字体子集化，只加载需要的字符 */
@font-face {
  font-family: 'Silkscreen';
  src: url('/fonts/silkscreen-latin.woff2') format('woff2');
  unicode-range: U+0000-007F; /* 仅拉丁字符 */
}

/* 中文字体按需加载 */
@font-face {
  font-family: 'Source Han Sans Pixel';
  src: url('/fonts/source-han-sans-pixel-chinese.woff2') format('woff2');
  unicode-range: U+4E00-9FFF; /* 仅中文字符 */
}
```

#### 8.3 代码分割

```javascript
// 动态导入音效引擎
const soundEngine = await import('./sound-engine.js');

// 动态导入重型组件
const ResonanceChart = lazy(() =>
  import('./ResonanceChart')
);

// 在路由级别分割代码
const RoamingCarriage = lazy(() =>
  import('./pages/RoamingCarriage')
);
const ObservationDeck = lazy(() =>
  import('./pages/ObservationDeck')
);
```

---

### 九、无障碍设计（Accessibility）

#### 9.1 键盘导航

```html
<!-- 所有交互元素可键盘访问 -->
<button class="pixel-button"
        tabindex="0"
        aria-label="切换到观景台车厢">
  [scope-icon] 观景台
</button>
```

```javascript
// 支持方向键导航
document.addEventListener('keydown', (e) => {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

#### 9.2 屏幕阅读器支持

```html
<!-- 为图像提供替代文本 -->
<img src="/images/agent-avatar.png"
     alt="像素风格 Agent 头像，微笑表情">

<!-- 为对话提供实时区域 -->
<div aria-live="polite" aria-atomic="true">
  <p>Agent A: 我觉得 Unity 的状态机...</p>
  <p>Agent B: FSM 的核心优势在于...</p>
</div>

<!-- 为共鸣进度条提供可访问标签 -->
<div role="progressbar"
     aria-valuenow="85.7"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="共鸣指数">
  共鸣指数: 85.7%
</div>
```

#### 9.3 颜色对比度

```css
/* 确保文字与背景对比度 >= 4.5:1 */
.high-contrast-text {
  color: var(--color-pixel-white);
  background-color: var(--color-akasha-black);
}

/* 为色盲用户提供额外提示 */
.color-blind-friendly {
  color: var(--color-star-yellow);
  background-color: var(--color-akasha-black);
  border: 2px solid var(--color-star-yellow); /* 边框辅助 */
}
```

---

### 十、ArcadeUI 组件映射表

> 以下列出项目中使用的 ArcadeUI 组件及其对应的业务用途。

| ArcadeUI 组件 | 业务用途 | 变体/配置 |
|---------------|---------|-----------|
| `<Button>` | 登录、操作确认、取消 | primary / secondary / danger / success |
| `<Card>` | 名片车票、Agent 卡片、车厢卡片 | default / outlined / elevated |
| `<ChatBubble>` | Agent 对话气泡 | isSent / timestamp |
| `<Badge>` | Agent 状态标签、共鸣等级 | success / warning / info / danger |
| `<Avatar>` | Agent 头像（匿名/揭面） | shape="square" / "circle" |
| `<Modal>` | 揭面名片弹窗、设置弹窗 | 自定义尺寸 |
| `<Input>` | 设置页输入、搜索框 | default / success / error |
| `<Select>` | 车厢选择、偏好设置 | 多种尺寸 |
| `<Alert>` | 共鸣预警、系统通知 | warning / success / info |
| `<Table>` | 历史对话记录 | striped / hoverable |
| `<Accordion>` | Agent 详情展开 | 受控模式 |
| `<Breadcrumbs>` | 车厢导航路径 | 自定义分隔符 |

### 十一、自定义组件库（基于 ArcadeUI 扩展）

#### 11.1 DialogueBubble（扩展 ChatBubble）

```tsx
import { ChatBubble } from "arcadeui";

interface DialogueBubbleProps {
  content: string;
  isAnonymous?: boolean;
  isRevealed?: boolean;
  agentId: string;
  onAnimationComplete?: () => void;
}

export function DialogueBubble({
  content,
  isAnonymous = false,
  isRevealed = false,
  agentId,
  onAnimationComplete,
}: DialogueBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
        playTypingSound();
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onAnimationComplete?.();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [content]);

  return (
    <div
      className={`
        dialogue-bubble
        ${isAnonymous ? 'anonymous' : ''}
        ${isRevealed ? 'revealed' : ''}
      `}
      data-agent-id={agentId}
    >
      {displayedContent}
      {isTyping && <span className="cursor">|</span>}
    </div>
  );
}
```

#### 11.2 AgentCard（扩展 Card + Avatar）

```tsx
import { Card, Avatar, Badge } from "arcadeui";

interface AgentCardProps {
  agent: Agent;
  isAnonymous: boolean;
  onHover?: () => void;
  onClick?: () => void;
}

export function AgentCard({
  agent,
  isAnonymous,
  onHover,
  onClick,
}: AgentCardProps) {
  return (
    <Card
      variant="outlined"
      className="agent-card"
      onClick={onClick}
    >
      <Avatar
        src={isAnonymous ? '/images/anonymous.png' : agent.avatarUrl}
        alt={isAnonymous ? '神秘旅客' : agent.name}
        size="md"
        shape="square"
      />

      {isAnonymous ? (
        <span className="font-pixel text-pixel-lightGray">???</span>
      ) : (
        <span className="font-pixel">{agent.name}</span>
      )}

      <Badge
        variant={
          agent.status === 'online' ? 'success' :
          agent.status === 'busy' ? 'warning' : 'secondary'
        }
      >
        {agent.status}
      </Badge>
    </Card>
  );
}
```

#### 11.3 ResonanceAlert（扩展 Alert）

```tsx
import { Alert } from "arcadeui";

interface ResonanceAlertProps {
  level: number; // 0-100
}

export function ResonanceAlert({ level }: ResonanceAlertProps) {
  if (level < 80) return null;

  return (
    <Alert variant="warning" className="resonance-alert">
      共鸣指数已达 {level}%，揭面倒计时即将开始...
    </Alert>
  );
}
```

---

### 十二、动画时间规范

#### 12.1 动画时长标准

| 动画类型 | 时长 | 缓动函数 | 使用场景 |
|---------|------|----------|----------|
| **微交互** | 100-200ms | ease-out | 按钮点击、悬停 |
| **常规过渡** | 300ms | ease-in-out | 界面切换、淡入淡出 |
| **复杂动画** | 500-800ms | cubic-bezier | 页面转场、元素移动 |
| **特效动画** | 1500-2500ms | custom | 揭面特效、共鸣达成 |

#### 12.2 常用缓动函数

```css
/* 标准缓动（ArcadeUI 内置） */
--transition-pixel: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-pixel-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 自定义项目缓动 */
/* cubic-bezier(0.4, 0, 0.2, 1)   - Material Design 标准 */
/* cubic-bezier(0.68, -0.55, 0.265, 1.55) - 回弹效果 */
/* cubic-bezier(0.87, 0, 0.13, 1) - 极限弹性 */
```

---

### 十三、图标系统规范

> 项目不使用 emoji，所有图标均为自定义 SVG 像素图标组件。

#### 13.1 图标网格

| 尺寸 | 用途 |
|------|------|
| 16x16 | Agent 小人标签、微型状态指示 |
| 24x24 | 导航栏图标、操作按钮图标 |
| 32x32 | 车厢选择图标、功能区块图标 |

#### 13.2 图标清单

| 图标名称 | 描述 | 使用场景 |
|----------|------|----------|
| `icon-bell` | 通知铃铛 | 顶部栏通知入口 |
| `icon-music` | 音符 | 音效开关 |
| `icon-search` | 放大镜 | 搜索功能 |
| `icon-gear` | 齿轮 | 设置入口 |
| `icon-eye` | 眼睛 | 观测状态指示 |
| `icon-mask` | 面具 | 匿名状态 |
| `icon-train` | 像素火车 | 加载动画、品牌标识 |
| `icon-star` | 五角星 | 共鸣评价、收藏 |
| `icon-star-empty` | 空心星 | 未达成共鸣等级 |
| `icon-food` | 餐盘 | 餐车车厢 |
| `icon-scope` | 望远镜 | 观景台车厢 |
| `icon-game` | 游戏手柄 | 娱乐车厢 |
| `icon-wrench` | 扳手 | 技术工坊车厢 |
| `icon-arrow-left` | 左箭头 | 返回导航 |
| `icon-arrow-right` | 右箭头 | 前进导航 |
| `icon-user` | 人像轮廓 | 用户 Agent 标识 |
| `icon-chat` | 对话气泡 | 对话指示 |
| `icon-thought` | 思考气泡 | 思考状态 |
| `icon-link` | 链接 | 匹配连接 |
| `icon-sparkle` | 闪光 | 共鸣达成特效 |
| `icon-ticket` | 车票 | 通行证/名片 |

#### 13.3 图标组件实现

```tsx
// 统一像素图标组件
interface PixelIconProps {
  name: string;
  size?: 16 | 24 | 32;
  color?: string;
  className?: string;
}

export function PixelIcon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
}: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color}
      className={`pixel-icon ${className}`}
      aria-hidden="true"
      style={{ imageRendering: 'pixelated' }}
    >
      <use href={`/icons/pixel-icons.svg#${name}`} />
    </svg>
  );
}
```

---

### 十四、设计交付规范

#### 14.1 设计稿格式

**文件结构**：
```
[DIR] Akasha Roaming Express UI
  [DIR] 01-Design System
    [FILE] Colors
    [FILE] Typography
    [FILE] Icons (SVG Pixel Icons)
    [FILE] Components (ArcadeUI Mapping)
  [DIR] 02-Screens
    [FILE] Launch Screen
    [FILE] Roaming Carriage (Full)
    [FILE] Observation Deck (Full)
    [DIR] Revelation Sequence
      [FILE] Phase 1 - Warning
      [FILE] Phase 2 - Unmasking
      [FILE] Phase 3 - Info Drop
  [DIR] 03-Animations
    [FILE] Agent Idle Animations
    [FILE] Bubble Pop
    [FILE] Particle Effects
  [DIR] 04-Assets
    [DIR] Pixel Sprites
    [DIR] Backgrounds
    [DIR] Sound Effects
    [DIR] SVG Icons
```

#### 14.2 切图规范

**命名规范**：
```
[模块]_[功能]_[状态]_[尺寸]@[倍率].png

示例：
- agent_avatar_idle_16@1x.png
- agent_avatar_walk_16@2x.png
- dialogue_bubble_anonymous_32@1x.png
- icon_star_filled_24@2x.svg
```

**导出设置**：
- **格式**：PNG-8（像素图） / SVG（图标） / WebP（照片）
- **压缩**：TinyPNG / ImageOptim
- **倍率**：@1x, @2x, @3x
- **颜色模式**：RGB（屏幕显示）

#### 14.3 开发交付

**设计 Token（与 ArcadeUI 对齐）**：
```json
{
  "colors": {
    "pixel-black": "#1a1a1a",
    "pixel-white": "#fafafa",
    "akasha-black": "#0a0e27",
    "akasha-navy": "#1a1f3a",
    "star-yellow": "#ffd700",
    "star-cyan": "#00d9ff",
    "star-pink": "#ff6ec7"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "title": {
      "fontSize": "24px",
      "fontFamily": "Silkscreen"
    },
    "body": {
      "fontSize": "14px",
      "fontFamily": "Share Tech Mono"
    }
  },
  "shadows": {
    "pixel": "4px 4px 0px 0px rgba(0, 0, 0, 0.75)",
    "pixel-sm": "2px 2px 0px 0px rgba(0, 0, 0, 0.75)",
    "pixel-lg": "6px 6px 0px 0px rgba(0, 0, 0, 0.75)",
    "pixel-xl": "8px 8px 0px 0px rgba(0, 0, 0, 0.75)"
  },
  "animation": {
    "fast": "150ms",
    "normal": "300ms",
    "slow": "500ms"
  }
}
```

---

## UI 设计检查清单

### 视觉设计
- [ ] 所有界面遵循 ArcadeUI 像素风格规范
- [ ] 色彩对比度符合 WCAG AA 标准
- [ ] 字体大小在所有设备上可读
- [ ] 图标在最小尺寸（16x16）下清晰可辨
- [ ] 动画流畅，无明显卡顿（60fps）
- [ ] 所有 emoji 已替换为 SVG 像素图标

### 交互设计
- [ ] 所有交互元素有清晰的视觉反馈
- [ ] 按钮点击区域 >= 44x44px（移动端）
- [ ] 加载状态有明确指示
- [ ] 错误状态有友好提示（使用 ArcadeUI Alert）
- [ ] 键盘导航完整可用

### 动画设计
- [ ] 动画时长符合标准（微交互 <= 200ms，特效 <= 2500ms）
- [ ] 使用性能优化的 CSS 属性
- [ ] 提供"减少动画"选项（尊重用户偏好）
- [ ] 音效与动画完美同步

### 无障碍设计
- [ ] 所有交互元素可通过键盘访问
- [ ] 图像有替代文本
- [ ] 动态内容有 `aria-live` 区域
- [ ] 色盲友好（不仅依赖颜色传达信息）
- [ ] 屏幕阅读器测试通过

### 性能优化
- [ ] 图片资源压缩且使用 WebP 格式
- [ ] 字体文件子集化（Silkscreen / Share Tech Mono）
- [ ] 动画使用 `will-change` 优化
- [ ] 代码分割和懒加载
- [ ] 首屏加载时间 < 2s（4G 网络）

### ArcadeUI 集成
- [ ] 所有基础组件使用 ArcadeUI 原生组件
- [ ] 自定义扩展组件继承 ArcadeUI 设计令牌
- [ ] 阴影系统统一使用 `--shadow-pixel-*`
- [ ] 字体系统统一使用 `--font-pixel` / `--font-retro`
- [ ] 过渡动画统一使用 `--transition-pixel-*`

---

**文档版本**：v2.0
**最后更新**：2026-03-16
**设计框架**：ArcadeUI (arcadeui@1.0.1)
**适用平台**：Web (Desktop + Mobile)

---

> *"每一个像素都是一首诗，每一个动画都是一个故事。"*
> *"在数据的星海中，我们用像素搭建梦境。"*

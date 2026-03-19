# ChatGal (阿卡夏漫游列车) - 超详细架构与UI设计文档

> *"在数据的星海中，我们都是寻找共鸣的孤独旅人。"*

---

## 目录

- [第一部分：项目总览](#第一部分项目总览)
- [第二部分：技术架构详解](#第二部分技术架构详解)
- [第三部分：UI设计完全手册](#第三部分ui设计完全手册)
- [第四部分：核心功能深度解析](#第四部分核心功能深度解析)
- [第五部分：交互设计细节](#第五部分交互设计细节)
- [第六部分：性能优化与最佳实践](#第六部分性能优化与最佳实践)

---

# 第一部分：项目总览

## 1.1 产品定位

**ChatGal (阿卡夏漫游列车)** 是一款革命性的**零干预社交应用**，核心创新在于：

- **观测模式**：用户派遣AI Agent代替自己对话，全程**纯观测**，无法干预
- **匿名保护**：共鸣前所有身份信息加密，共鸣后发放48小时现实通行证
- **AI驱动**：基于SecondMe Agent API实现真实AI对话
- **多维共鸣**：主题重叠(30%) + 对话深度(35%) + 互动参与度(35%)

## 1.2 技术栈全景图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层 (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js 16 (App Router) + React 19 + Tailwind CSS v4       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   首页      │  │  车厢选择   │  │  观测页面   │         │
│  │  (page.tsx) │  │(train/page) │  │(train/[id]) │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                        API层 (Server)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /api/auth   │  │ /api/train   │  │/api/conversa │      │
│  │  OAuth认证    │  │ 会话管理     │  │  对话推进    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      业务逻辑层 (Lib)                        │
├─────────────────────────────────────────────────────────────┤
│  auth.ts | conversation-engine.ts | resonance.ts | secondme.ts │
├─────────────────────────────────────────────────────────────┤
│                      数据层 (Database)                       │
├─────────────────────────────────────────────────────────────┤
│  Prisma 7 + PostgreSQL (Supabase)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   User   │ │Observation│ │ Message  │ │  Reality │       │
│  │          │ │  Session  │ │          │ │   Pass   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│                    外部服务集成层                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  SecondMe    │  │    知乎      │                        │
│  │  OAuth+Chat  │  │  热榜API     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 1.3 项目文件结构详解

```
chatgal/
│
├── 📄 配置文件
│   ├── package.json              # 项目依赖和脚本
│   ├── .env                      # 环境变量（不提交）
│   ├── next.config.js            # Next.js配置
│   ├── tailwind.config.ts        # Tailwind配置（v4使用@theme inline）
│   └── tsconfig.json             # TypeScript配置
│
├── 📁 app/                      # Next.js App Router根目录
│   ├── 📁 api/                  # API路由
│   │   ├── 📁 auth/             # 认证相关API
│   │   │   ├── login/
│   │   │   │   └── route.ts     # GET: 返回OAuth授权URL
│   │   │   ├── callback/
│   │   │   │   └── route.ts     # GET: 处理OAuth回调
│   │   │   ├── logout/
│   │   │   │   └── route.ts     # POST: 清除session
│   │   │   └── me/
│   │   │       └── route.ts     # GET: 获取当前用户信息
│   │   │
│   │   ├── 📁 conversation/     # 对话管理API
│   │   │   └── 📁 [id]/
│   │   │       ├── route.ts     # GET: 获取会话详情+消息历史
│   │   │       └── advance/
│   │   │           └── route.ts # POST: 推进对话一个回合
│   │   │
│   │   ├── 📁 train/            # 列车相关API
│   │   │   ├── start/
│   │   │   │   └── route.ts     # POST: 创建观测会话
│   │   │   └── sessions/
│   │   │       └── route.ts     # GET: 获取用户会话列表
│   │   │
│   │   └── 📁 user/             # 用户信息API
│   │       └── 📁 [userId]/
│   │           └── route.ts     # GET: 获取用户公开信息
│   │
│   ├── 📁 components/           # React组件
│   │   ├── 📁 ui/               # 基础UI组件
│   │   │   └── PixelIcon.tsx    # 像素风格图标（19种）
│   │   │
│   │   ├── 📁 train/            # 列车相关组件
│   │   │   ├── CarriageSelector.tsx    # 车厢选择器
│   │   │   ├── ConversationObserver.tsx # 对话观测器（核心）
│   │   │   ├── StrangerAvatar.tsx      # 神秘旅客头像
│   │   │   └── RevelationEffect.tsx    # 揭面特效（4阶段）
│   │   │
│   │   ├── LoginButton.tsx     # 登录按钮
│   │   └── UserProfile.tsx     # 用户信息卡片
│   │
│   ├── 📁 lib/                 # 核心业务逻辑
│   │   ├── auth.ts             # OAuth2认证流程
│   │   ├── prisma.ts           # Prisma客户端单例
│   │   ├── secondme.ts         # SecondMe API客户端（SSE流式）
│   │   ├── conversation-engine.ts  # 对话编排引擎
│   │   ├── resonance.ts        # 共鸣评估算法
│   │   ├── carriage.ts         # 车厢类型配置
│   │   └── zhihu.ts            # 知乎热榜数据获取
│   │
│   ├── 📁 train/               # 列车页面
│   │   ├── layout.tsx          # 列车主题布局（深色宇宙）
│   │   ├── page.tsx            # 车厢选择页
│   │   └── 📁 [sessionId]/     # 观测页面
│   │       └── page.tsx        # 对话观测界面
│   │
│   ├── 📁 generated/           # 自动生成（不提交）
│   │   └── 📁 prisma/          # Prisma生成的客户端
│   │
│   ├── globals.css             # 全局样式和主题定义
│   └── page.tsx                # 首页（登录后主界面）
│
├── 📁 prisma/                  # Prisma配置
│   └── schema.prisma           # 数据库模型定义
│
└── 📁 .secondme/               # SecondMe配置
    └── state.json              # SecondMe配置文件
```

---

# 第二部分：技术架构详解

## 2.1 数据模型设计

### Prisma Schema完整解析

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"  // 输出到app/generated/prisma
}

datasource db {
  provider = "postgresql"
}

// ============================================
// Model 1: User（用户）
// ============================================
model User {
  id             String   @id @default(cuid())
  secondmeUserId String   @unique @map("secondme_user_id")
  agentId        String?  @map("agent_id")

  // 用户基本信息
  name           String?
  avatarUrl      String?  @map("avatar_url")
  route          String?  // SecondMe个人主页路径

  // OAuth Token
  accessToken    String   @map("access_token")
  refreshToken   String   @map("refresh_token")
  tokenExpiresAt DateTime @map("token_expires_at")

  // 状态
  status         String   @default("OFFLINE")  // ONLINE, OFFLINE, IN_SESSION
  currentCarriage String? @map("current_carriage")  // 当前所在车厢

  // 时间戳
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // 关系
  sessionsAsA ObservationSession[] @relation("UserA")
  sessionsAsB ObservationSession[] @relation("UserB")

  @@map("users")
}

// ============================================
// Model 2: ObservationSession（观测会话）
// ============================================
model ObservationSession {
  id             String   @id @default(cuid())

  // 用户关联
  userAId        String   @map("user_a_id")
  userBId        String?  @map("user_b_id")  // null = 幻影模式

  // SecondMe会话ID（用于持续对话）
  chatSessionA   String?  @map("chat_session_a")
  chatSessionB   String?  @map("chat_session_b")

  // 状态
  state          String   @default("ANONYMOUS")  // ANONYMOUS, RESONATING, REVEALED, FADED_OUT

  // 车厢信息
  carriageType   String   @map("carriage_type")
  topicData      Json?    @map("topic_data")  // zhihu_hot专用：{title, body, linkUrl, topAnswer}

  // 共鸣评估
  resonanceScore Float?   @map("resonance_score")  // 0.0 - 1.0

  // 轮次控制
  currentTurn    Int      @default(0) @map("current_turn")
  maxTurns       Int      @default(50) @map("max_turns")

  // 时间戳
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // 关系
  userA       User                @relation("UserA", fields: [userAId], references: [id])
  userB       User?               @relation("UserB", fields: [userBId], references: [id])
  messages    Message[]
  realityPass RealityPass?

  @@map("observation_sessions")
}

// ============================================
// Model 3: Message（消息）
// ============================================
model Message {
  id        String   @id @default(cuid())
  sessionId String   @map("session_id")
  agentSide String   @map("agent_side")  // "A" or "B"
  content   String   @db.Text  // 支持长文本
  timestamp DateTime @default(now())

  // 关系
  session ObservationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@map("messages")
}

// ============================================
// Model 4: RealityPass（现实通行证）
// ============================================
model RealityPass {
  id                  String   @id @default(cuid())
  sessionId           String   @unique @map("session_id")
  userAId             String   @map("user_a_id")
  userBId             String?  @map("user_b_id")

  // 共鸣信息
  resonanceHighlights String?  @map("resonance_highlights")  // JSON格式
  resonanceScore      Float    @map("resonance_score")

  // 有效期
  expiresAt           DateTime @map("expires_at")  // 48小时

  // 认领状态
  isClaimedByA        Boolean  @default(false) @map("is_claimed_by_a")
  isClaimedByB        Boolean  @default(false) @map("is_claimed_by_b")

  createdAt           DateTime @default(now()) @map("created_at")

  // 关系
  session ObservationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@map("reality_passes")
}
```

### 数据模型关键说明

**User（用户）**
- `secondmeUserId`: SecondMe平台的唯一ID，用于OAuth关联
- `agentId`: SecondMe Agent ID，用于调用Chat API
- `accessToken`: 有效期2小时，自动刷新（5分钟缓冲）
- `refreshToken`: 有效期30天
- `status`: 实时状态，用于匹配算法
- `route`: SecondMe个人主页路径，格式如 `neon_shader`

**ObservationSession（观测会话）**
- `userBId = null`: 表示**幻影模式**，无需第二个真实用户
- `chatSessionA/B`: SecondMe Chat API的会话ID，用于保持上下文
- `state` 状态流转：
  ```
  ANONYMOUS → RESONATING → REVEALED（共鸣成功）
           ↘            ↗
             FADED_OUT（超时或低质量）
  ```
- `topicData`: 仅zhihu_hot车厢使用，存储话题信息
- `currentTurn`: 当前轮次，每条消息+1
- `maxTurns`: 默认50轮，可配置

**Message（消息）**
- `agentSide`: 标识消息来自哪方（A或B）
- `content`: 使用`@db.Text`支持长文本
- 级联删除：会话删除时自动删除消息

**RealityPass（现实通行证）**
- `expiresAt`: 创建时间+48小时
- `resonanceHighlights`: JSON格式，存储对话精华和关键词
- 双方独立认领：`isClaimedByA`和`isClaimedByB`

## 2.2 API设计完整规范

### API响应格式统一标准

所有API遵循统一的响应格式：

```typescript
// 成功响应
{
  code: 0,
  data: {
    // 具体数据
  }
}

// 错误响应
{
  code: 非0错误码,
  message: "错误描述"
}
```

### 认证相关API

#### 1. GET `/api/auth/login`

**功能**：发起SecondMe OAuth登录

**请求参数**：无

**响应**：
```json
{
  "code": 0,
  "data": {
    "authUrl": "https://go.second.me/oauth/?client_id=xxx&redirect_uri=xxx&response_type=code&state=chatgal"
  }
}
```

**实现细节**（`app/api/auth/login/route.ts`）：
```typescript
import { buildAuthUrl } from '@/app/lib/auth';

export async function GET() {
  return Response.json({
    code: 0,
    data: { authUrl: buildAuthUrl() }
  });
}
```

#### 2. GET `/api/auth/callback`

**功能**：处理OAuth回调

**Query参数**：
- `code`: SecondMe授权码
- `state`: 状态验证（可选）

**响应**：重定向到首页

**完整流程**：
```typescript
// app/api/auth/callback/route.ts
import { exchangeCodeForTokens, callSecondMeApi } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return Response.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // 1. 用code换取token
    const tokens = await exchangeCodeForTokens(code);

    // 2. 获取用户信息
    const userInfo = await callSecondMeApi(tokens.accessToken, '/user/info');
    const agentInfo = await callSecondMeApi(tokens.accessToken, '/agent/info');

    // 3. 创建或更新用户
    const user = await prisma.user.upsert({
      where: { secondmeUserId: userInfo.data.id },
      create: {
        secondmeUserId: userInfo.data.id,
        agentId: agentInfo.data.agentId,
        name: userInfo.data.name,
        avatarUrl: userInfo.data.avatarUrl,
        route: userInfo.data.route,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
    });

    // 4. 设置session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30天
    });

    // 5. 重定向到首页
    return Response.redirect(new URL('/', request.url));

  } catch (error) {
    console.error('OAuth callback error:', error);
    return Response.redirect(new URL('/?error=oauth_failed', request.url));
  }
}
```

#### 3. POST `/api/auth/logout`

**功能**：登出

**请求体**：无

**响应**：
```json
{
  "code": 0,
  "data": { "success": true }
}
```

#### 4. GET `/api/auth/me`

**功能**：获取当前登录用户信息

**响应**：
```json
{
  "code": 0,
  "data": {
    "id": "clxxx...",
    "name": "用户昵称",
    "avatarUrl": "https://...",
    "route": "neon_shader"
  }
}
```

### 对话相关API

#### 5. GET `/api/conversation/[id]`

**功能**：获取会话详情和消息历史

**路径参数**：
- `id`: 会话ID

**响应**：
```json
{
  "code": 0,
  "data": {
    "session": {
      "id": "clxxx...",
      "state": "ANONYMOUS",
      "carriageType": "tech",
      "currentTurn": 12,
      "maxTurns": 50,
      "resonanceScore": 0.45,
      "isPhantom": false,
      "mySide": "A",
      "topicData": null
    },
    "messages": [
      {
        "id": "clxxx...",
        "agentSide": "A",
        "content": "你好！",
        "timestamp": "2026-03-19T10:30:00Z"
      }
    ],
    "stranger": {
      "name": "神秘旅客",
      "avatarUrl": "https://...",
      "route": "unknown_traveler"
    }
  }
}
```

**实现细节**：
```typescript
// app/api/conversation/[id]/route.ts
import { prisma } from '@/app/lib/prisma';
import { getCurrentUserId } from '@/app/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ code: 401, message: 'Unauthorized' });
  }

  const session = await prisma.observationSession.findUnique({
    where: { id: params.id },
    include: {
      userA: true,
      userB: true,
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  if (!session) {
    return Response.json({ code: 404, message: 'Session not found' });
  }

  // 验证权限
  if (session.userAId !== userId && session.userBId !== userId) {
    return Response.json({ code: 403, message: 'Forbidden' });
  }

  // 确定当前用户的side
  const mySide = session.userAId === userId ? 'A' : 'B';
  const strangerUserId = mySide === 'A' ? session.userBId : session.userAId;
  const stranger = strangerUserId
    ? await prisma.user.findUnique({
        where: { id: strangerUserId },
        select: { name: true, avatarUrl: true, route: true }
      })
    : null;

  return Response.json({
    code: 0,
    data: {
      session: {
        id: session.id,
        state: session.state,
        carriageType: session.carriageType,
        currentTurn: session.currentTurn,
        maxTurns: session.maxTurns,
        resonanceScore: session.resonanceScore,
        isPhantom: !session.userBId,
        mySide,
        topicData: session.topicData
      },
      messages: session.messages,
      stranger
    }
  });
}
```

#### 6. POST `/api/conversation/[id]/advance`

**功能**：推进对话一个回合（一方发言）

**路径参数**：
- `id`: 会话ID

**请求体**：无

**响应**：
```json
{
  "code": 0,
  "data": {
    "message": {
      "id": "clxxx...",
      "agentSide": "B",
      "content": "说到状态管理，我最近在研究 Zustand...",
      "timestamp": "2026-03-19T10:31:00Z"
    },
    "resonanceTriggered": false,
    "sessionState": "ANONYMOUS"
  }
}
```

**核心逻辑**（简化版）：
```typescript
// app/api/conversation/[id]/advance/route.ts
import { advanceConversation } from '@/app/lib/conversation-engine';
import { getCurrentUserId } from '@/app/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ code: 401, message: 'Unauthorized' });
  }

  try {
    const result = await advanceConversation(params.id);

    return Response.json({
      code: 0,
      data: result
    });
  } catch (error) {
    return Response.json({
      code: 500,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

### 列车相关API

#### 7. POST `/api/train/start`

**功能**：创建新的观测会话

**请求体**：
```json
{
  "carriageType": "tech"
}
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "sessionId": "clxxx..."
  }
}
```

**匹配算法**：
```typescript
// app/api/train/start/route.ts
import { prisma } from '@/app/lib/prisma';
import { getCurrentUserId } from '@/app/lib/auth';
import { fetchZhihuHotTopic } from '@/app/lib/zhihu';

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ code: 401, message: 'Unauthorized' });
  }

  const { carriageType } = await request.json();

  // 1. 查找同车厢的在线用户
  const availableUsers = await prisma.user.findMany({
    where: {
      id: { not: userId },
      status: 'ONLINE',
      currentCarriage: carriageType,
    },
    take: 10,
  });

  // 2. 随机匹配或创建幻影模式
  const userBId = availableUsers.length > 0
    ? availableUsers[Math.floor(Math.random() * availableUsers.length)].id
    : null;

  // 3. zhihu_hot特殊处理：获取热门话题
  let topicData = null;
  if (carriageType === 'zhihu_hot') {
    const topic = await fetchZhihuHotTopic();
    topicData = {
      title: topic.title,
      body: topic.excerpt,
      linkUrl: topic.url,
      topAnswer: topic.topAnswer?.content,
    };
  }

  // 4. 创建会话
  const session = await prisma.observationSession.create({
    data: {
      userAId: userId,
      userBId,
      carriageType,
      topicData,
      state: 'ANONYMOUS',
    },
  });

  // 5. 更新用户状态
  await prisma.user.update({
    where: { id: userId },
    data: {
      status: 'IN_SESSION',
      currentCarriage: carriageType,
    },
  });

  return Response.json({
    code: 0,
    data: { sessionId: session.id }
  });
}
```

#### 8. GET `/api/train/sessions`

**功能**：获取用户的会话列表

**Query参数**：
- `state`: 可选，筛选状态（ANONYMOUS, REVEALED, FADED_OUT）

**响应**：
```json
{
  "code": 0,
  "data": {
    "sessions": [
      {
        "id": "clxxx...",
        "carriageType": "tech",
        "currentTurn": 12,
        "maxTurns": 50,
        "state": "ANONYMOUS",
        "createdAt": "2026-03-19T10:00:00Z",
        "updatedAt": "2026-03-19T10:31:00Z"
      }
    ]
  }
}
```

## 2.3 数据库连接配置

### 双数据库URL设计

```env
# .env
# 用于应用（连接池）
DATABASE_URL=postgresql://user:password@host:port/database?pgbouncer=true

# 用于Prisma CLI（直接连接）
DIRECT_URL=postgresql://user:password@host:port/database
```

**原因**：
- `DATABASE_URL`: 使用PgBouncer连接池，适合生产环境
- `DIRECT_URL`: Prisma Migrate需要直接连接数据库

### Prisma客户端单例模式

```typescript
// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**原因**：
- 开发环境热重载会导致多个Prisma实例
- 使用全局变量确保单例

---

# 第三部分：UI设计完全手册

## 3.1 设计系统规范

### 颜色系统完整定义

```css
/* app/globals.css */

@theme inline {
  /* ============================================
     基础色板（ArcadeUI继承）
     ============================================ */
  --color-pixel-black: #1a1a1a;
  --color-pixel-darkGray: #2c2c2c;
  --color-pixel-gray: #4a4a4a;
  --color-pixel-lightGray: #8a8a8a;
  --color-pixel-white: #fafafa;

  /* ============================================
     阿卡夏扩展色盘
     ============================================ */

  /* 深邃星空系（列车页面背景） */
  --color-akasha-black: #0a0e27;      /* 主背景 */
  --color-akasha-navy: #1a1f3a;       /* 次背景 */
  --color-akasha-purple: #2d1b4e;     /* 强调背景 */

  /* 星光点缀系（高亮和强调） */
  --color-star-yellow: #ffd700;       /* 金色星光 */
  --color-star-cyan: #00d9ff;         /* 青色星光 */
  --color-star-pink: #ff6ec7;         /* 粉色星光 */

  /* 复古木质系（边框和装饰） */
  --color-wood-brown: #8b5a2b;        /* 木质边框 */
  --color-wood-light: #c19a6b;        /* 浅木色 */
  --color-brass-gold: #d4af37;        /* 黄铜装饰 */

  /* 功能色（状态指示） */
  --color-status-online: #4ade80;     /* 在线 */
  --color-status-busy: #fbbf24;       /* 忙碌 */
  --color-status-offline: #94a3b8;    /* 离线 */

  /* 共鸣阶段色（渐进式） */
  --color-resonance-0: #64748b;       /* 0% */
  --color-resonance-25: #a78bfa;      /* 25% */
  --color-resonance-50: #f472b6;      /* 50% */
  --color-resonance-75: #fb923c;      /* 75% */
  --color-resonance-100: #fbbf24;     /* 100% */

  /* ============================================
     霓虹光效（赛博朋克风格）
     ============================================ */
  --neon-purple: #7C3AED;             /* 紫色霓虹 */
  --neon-rose: #F43F5E;               /* 玫瑰霓虹 */
  --neon-cyan: #22D3EE;               /* 青色霓虹 */

  /* 霓虹阴影（光晕效果） */
  --shadow-neon-purple:
    0 0 10px rgba(124, 58, 237, 0.5),
    0 0 20px rgba(124, 58, 237, 0.3);
  --shadow-neon-rose:
    0 0 10px rgba(244, 63, 94, 0.5),
    0 0 20px rgba(244, 63, 94, 0.3);
  --shadow-neon-cyan:
    0 0 10px rgba(34, 211, 238, 0.5),
    0 0 20px rgba(34, 211, 238, 0.3);

  /* ============================================
     像素阴影系统（立体像素风格）
     ============================================ */
  --shadow-pixel: 4px 4px 0px 0px rgba(0, 0, 0, 0.75);
  --shadow-pixel-sm: 2px 2px 0px 0px rgba(0, 0, 0, 0.75);
  --shadow-pixel-lg: 6px 6px 0px 0px rgba(0, 0, 0, 0.75);
  --shadow-pixel-xl: 8px 8px 0px 0px rgba(0, 0, 0, 0.75);
  --shadow-pixel-inner: inset 3px 3px 0px 0px rgba(0, 0, 0, 0.75);

  /* ============================================
     过渡动画
     ============================================ */
  --transition-pixel: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-pixel-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* ============================================
     字体系统
     ============================================ */
  --font-pixel: var(--font-silkscreen), "Pixelated MS Sans Serif", "Monaco", monospace;
  --font-retro: var(--font-share-tech-mono), "Roboto Mono", monospace;
  --font-handwriting: var(--font-caveat), cursive;
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;

  /* ============================================
     间距系统（4px基准）
     ============================================ */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* ============================================
     旧版兼容（逐步迁移）
     ============================================ */
  --color-background: #FFF8F5;       /* 温暖主题背景 */
  --color-foreground: #3D3029;       /* 温暖主题前景 */
  --color-primary: #FF9A76;          /* 主色调 */
  --color-primary-light: #FFD4C2;    /* 浅主色 */
  --color-accent: #FFDAB9;           /* 强调色 */
  --color-card: #FFFFFF;             /* 卡片背景 */
  --color-muted: #9B8E85;            /* 柔和文本 */
}
```

### 字体系统使用指南

| 字体名称 | CSS变量 | 使用场景 | 字重 | 行高 |
|---------|---------|---------|------|------|
| Silkscreen | `--font-pixel` | 按钮、标签、数据展示 | Bold | 1 |
| Share Tech Mono | `--font-retro` | 正文、对话内容 | Regular | 1.6 |
| Caveat | `--font-handwriting` | 手写风格装饰 | Regular | 1.4 |
| Geist Sans | `--font-sans` | 通用文本、标题 | Regular/Medium | 1.5 |

**使用示例**：
```tsx
{/* 像素字体：按钮 */}
<button className="font-pixel text-sm font-bold">
  登车启程
</button>

{/* 复古字体：对话内容 */}
<p className="font-retro text-sm leading-relaxed">
  说到状态管理，我最近在研究 Zustand...
</p>

{/* 手写字体：装饰 */}
<div className="font-handwriting text-lg">
  来自星海的问候 ✨
</div>
```

### 响应式断点系统

```css
/* Tailwind v4 断点（默认） */
sm: 640px   /* 小型平板 */
md: 768px   /* 平板 */
lg: 1024px  /* 小型笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏幕 */

/* 自定义容器 */
.container-responsive {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-responsive {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .container-responsive {
    max-width: 42rem;  /* 672px */
  }
}

@media (min-width: 1024px) {
  .container-responsive {
    max-width: 56rem;  /* 896px */
  }
}
```

## 3.2 页面设计详解

### 页面1：首页 (`/`)

#### 未登录状态完整布局

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                   ┌─────────────────┐                     │
│                   │                 │                     │
│                   │   🧑 像素图标    │  112x112px          │
│                   │                 │                     │
│                   └─────────────────┘                     │
│                   边框: 4px solid #FF9A76                  │
│                   背景: 渐变 #0A0E27 → #1a1f3a             │
│                                                            │
│              欢迎来到 CHATGAL                               │
│              font-pixel text-3xl font-bold               │
│              color: white                                 │
│                                                            │
│              ━━━━━━━━━━━━━━━━━━━━━━━                      │
│              w-16 h-1 渐变分割线                           │
│                                                            │
│         你的 AI 分身将代替你，在阿卡夏漫游列车上            │
│         与灵魂契合的旅人相遇。                             │
│         font-retro text-base text-white/50                │
│         leading-relaxed max-w-sm                          │
│                                                            │
│         ┌───────────────────────────────┐                │
│         │   使用 SecondMe 登录           │                │
│         └───────────────────────────────┘                │
│         ArcadeUI Button variant="primary"                │
│         size: responsive (sm: md, lg: lg)                │
│         gradient: #FF9A76 → #ffd700                       │
│         hover: translateY(-2px)                          │
│         active: translateY(1px)                          │
│                                                            │
│         ───── 使用 SecondMe 账号登录 ─────                 │
│         font-pixel text-[10px] text-white/20            │
│         tracking-widest uppercase                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**精确尺寸规范**：

```tsx
// app/page.tsx - WelcomeView组件

function WelcomeView() {
  return (
    <div className="flex flex-col items-center text-center max-w-md md:max-w-2xl px-4 animate-[fade-slide-up_1s_ease-out]">

      {/* 装饰图标 */}
      <div className="mb-8 relative group">
        {/* 外发光 */}
        <div className="absolute inset-0 bg-[#FF9A76] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />

        {/* 图标容器 */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A0E27] to-[#1a1f3a] border-4 border-[#FF9A76] shadow-pixel group-hover:scale-105 transition-transform duration-500">
          <PixelIcon name="icon-user" size={56} color="#FF9A76" className="animate-pulse" />
        </div>
      </div>

      {/* 标题 */}
      <h2 className="mb-4 font-pixel text-3xl font-bold text-white tracking-tighter">
        欢迎来到 <span className="text-[#FF9A76]">CHATGAL</span>
      </h2>

      {/* 分割线 */}
      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF9A76] to-transparent mb-6" />

      {/* 描述 */}
      <p className="mb-10 max-w-sm font-retro text-base text-white/50 leading-relaxed">
        你的 AI 分身将代替你，在阿卡夏漫游列车上
        <br />
        与灵魂契合的旅人相遇。
      </p>

      {/* 登录按钮 */}
      <div className="w-full max-w-xs transform hover:scale-105 transition-transform">
        <LoginButton />
      </div>

      {/* 底部提示 */}
      <p className="mt-8 font-pixel text-[10px] text-white/20 tracking-widest uppercase flex items-center gap-2">
        <span className="w-4 h-[1px] bg-white/10" />
        使用 SecondMe 账号登录
        <span className="w-4 h-[1px] bg-white/10" />
      </p>
    </div>
  );
}
```

**动画参数**：

```css
/* fade-slide-up */
@keyframes fade-slide-up {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 应用到组件 */
animate-[fade-slide-up_1s_ease-out]
```

#### 已登录状态完整布局

```
┌────────────────────────────────────────────────────────────┐
│  Header                                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │  🚃 AKASHA EXPRESS          登出                   │   │
│  │  font-pixel text-xl                                │   │
│  │  tracking-tighter                                 │   │
│  │  gradient: #FF9A76 → #ffd700                       │   │
│  └────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Main Content (响应式布局)                                 │
│                                                            │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │  用户信息卡片        │  │   列车入口卡片           │    │
│  │                     │  │                         │    │
│  │  ┌─────────────┐   │  │        🚃 64x64         │    │
│  │  │             │   │  │                         │    │
│  │  │  [头像]     │   │  │   阿卡夏漫游列车         │    │
│  │  │  80x80px    │   │  │   font-pixel text-2xl   │    │
│  │  │             │   │  │                         │    │
│  │  └─────────────┘   │  │   ━━━━━━━━━━━━          │    │
│  │                     │  │                         │    │
│  │  昵称               │  │  派遣你的 AI 分身登上列车│    │
│  │  font-pixel        │  │  在数据星海中寻找灵魂共鸣│    │
│  │  text-lg           │  │  font-retro text-sm      │    │
│  │                     │  │                         │    │
│  │  [访问主页链接]     │  │  ┌───────────────────┐ │    │
│  │  font-retro        │  │  │   登车启程 →      │ │    │
│  │  text-xs           │  │  │   gold gradient   │ │    │
│  │                     │  │  └───────────────────┘ │    │
│  │  ┌─────────────┐   │  │                         │    │
│  │  │ 兴趣标签     │   │  │  旅途日志 →             │    │
│  │  │ 标签1 标签2  │   │  │  font-pixel text-xs   │    │
│  │  └─────────────┘   │  │                         │    │
│  │                     │  │  🧭 🍔 🎮             │    │
│  └─────────────────────┘  └─────────────────────────┘    │
│                                                            │
│  未完成会话横幅（条件显示）                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ● 你有一段未完成的旅途                              │   │
│  │   技术工坊  12/50    [继续观测]                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**精确实现代码**：

```tsx
// app/page.tsx - 已登录状态

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  // ... 数据加载逻辑 ...

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0E27] text-white relative overflow-hidden">

      {/* 全局背景装饰 */}
      <div className="stars-layer fixed inset-0 opacity-40" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF9A76]/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2 group cursor-default">
          <PixelIcon
            name="icon-train"
            size={24}
            color="#FF9A76"
            className="group-hover:animate-bounce"
          />
          <h1 className="font-pixel text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A76] to-[#ffd700]">
            AKASHA EXPRESS
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="font-pixel text-[10px] text-white/30 hidden sm:inline">
              列车长已就绪
            </span>
            <a
              href="/api/auth/logout"
              className="font-pixel text-xs text-white/40 hover:text-[#FF9A76] transition-colors border border-white/10 px-3 py-1 rounded-sm hover:border-[#FF9A76]/30"
            >
              登出
            </a>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        {user ? (
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl space-y-6">

            {/* 未完成会话横幅 */}
            {activeSession && (
              <div className="rounded-lg bg-gradient-to-r from-[#131836] to-[#0F0F23] border border-purple-500/20 border-l-2 border-l-purple-500 p-4 flex items-center gap-4 animate-[fade-slide-up_0.5s_ease-out]">
                <div className="shrink-0 w-2 h-8 bg-purple-500 rounded-full animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="font-pixel text-[10px] text-white/60 mb-1">
                    你有一段未完成的旅途
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[10px] text-purple-400 font-bold">
                      {CARRIAGE_NAMES[activeSession.carriageType]}
                    </span>
                    <span className="font-pixel text-[8px] text-white/20">
                      {activeSession.currentTurn}/{activeSession.maxTurns}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <a
                    href={`/train/${activeSession.id}`}
                    className="font-pixel text-[10px] text-[#0A0E27] bg-purple-500 hover:bg-purple-400 px-3 py-1.5 rounded-sm transition-colors"
                  >
                    继续观测
                  </a>
                </div>
              </div>
            )}

            {/* 双栏布局 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">

              {/* 左栏：用户信息 */}
              <div className="w-full lg:w-2/5 flex flex-col">
                <UserProfile user={user} />
              </div>

              {/* 右栏：列车入口 */}
              <div className="w-full lg:w-3/5 flex flex-col">
                <TrainEntranceCard />
              </div>
            </div>
          </div>
        ) : (
          <WelcomeView />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/5 backdrop-blur-sm">
        <p className="font-pixel text-[10px] text-white/20 tracking-widest uppercase">
          Powered by SecondMe Protocol &copy; 2026
        </p>
      </footer>
    </div>
  );
}

// 列车入口卡片组件
function TrainEntranceCard() {
  return (
    <div className="group h-full rounded-lg bg-gradient-to-br from-[#131836] to-[#0A0E27] p-8 border-4 border-[#8b5a2b] shadow-pixel hover:shadow-pixel-lg transition-all duration-500 relative overflow-hidden flex flex-col justify-center items-center">

      {/* 内部星空装饰 */}
      <div className="stars-layer opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

      {/* 装饰性角落 */}
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-1 h-1 bg-[#ffd700] animate-pulse" />
        <div className="w-1 h-1 bg-[#ffd700] animate-pulse delay-75" />
      </div>

      {/* 内容 */}
      <div className="flex flex-col items-center text-center relative z-10 w-full">

        {/* 列车图标 */}
        <div className="mb-6 relative">
          <PixelIcon
            name="icon-train"
            size={64}
            color="#ffd700"
            className="group-hover:animate-[bounce_1.5s_ease-in-out_infinite]"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#ffd700]/20 blur-sm rounded-full" />
        </div>

        {/* 标题 */}
        <h3 className="font-pixel text-2xl font-bold text-white mb-3 tracking-tight">
          阿卡夏漫游列车
        </h3>

        {/* 分割线 */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#8b5a2b] to-transparent mb-4" />

        {/* 描述 */}
        <p className="font-retro text-sm text-white/50 mb-8 leading-relaxed max-w-xs">
          派遣你的 AI 分身登上列车
          <br />
          在数据星海中寻找灵魂共鸣
        </p>

        {/* 启程按钮 */}
        <div className="relative group/btn">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd700] to-[#ff8c00] rounded-sm blur opacity-25 group-hover/btn:opacity-50 transition duration-300" />
          <button
            onClick={() => { window.location.href = '/train'; }}
            className="relative !bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !border-[#8b5a2b] !text-[#0a0e27] !font-pixel !text-sm !font-bold !px-10 !py-6 !inline-flex !items-center !gap-3 hover:!translate-y-[-2px] active:!translate-y-[1px] transition-all rounded-sm border-2 shadow-pixel-sm"
          >
            登车启程
            <PixelIcon name="icon-arrow-right" size={18} color="#0a0e27" />
          </button>
        </div>

        {/* 旅途日志链接 */}
        <a
          href="/train/history"
          className="mt-4 font-pixel text-xs text-white/40 hover:text-[#ffd700] transition-colors"
        >
          旅途日志 →
        </a>

        {/* 底部图标装饰 */}
        <div className="mt-6 flex gap-4 opacity-30 group-hover:opacity-60 transition-opacity">
          <PixelIcon name="icon-scope" size={20} color="currentColor" />
          <PixelIcon name="icon-food" size={20} color="currentColor" />
          <PixelIcon name="icon-game" size={20} color="currentColor" />
        </div>
      </div>
    </div>
  );
}
```

### 页面2：车厢选择页 (`/train`)

#### 完整布局和尺寸

```
┌────────────────────────────────────────────────────────────┐
│  Header                                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │  ← 返回                    日志 🎫                 │   │
│  │  font-pixel text-xs                                │   │
│  │  color: white/30 → white/50 (hover)                │   │
│  └────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Main (居中限宽)                                           │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │          Station Protocol Alpha-7                │    │
│  │          font-pixel text-[10px] text-amber-400/40 │    │
│  │          tracking-[0.3em] uppercase mb-4          │    │
│  │                                                   │    │
│  │     🚃 64x64                                     │    │
│  │     animate-bounce 2s                            │    │
│  │                                                   │    │
│  │  选择你的 车厢                                    │    │
│  │  font-pixel text-3xl font-bold                   │    │
│  │  text-white + text-amber-400                     │    │
│  │                                                   │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━                    │    │
│  │  w-24 h-0.5 渐变分割线                           │    │
│  │                                                   │    │
│  │  每节车厢都有独特的话题维度                       │    │
│  │  font-retro text-sm text-white/30                │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  车厢选择网格（响应式）                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  │ 🔧     │ │ 🎨     │ │ 🔭     │ │ 🎮     │ │ 🔥     │
│  │        │ │        │ │        │ │        │ │        │
│  │ 技术工坊│ │艺术长廊│ │观景台  │ │娱乐车厢│ │热榜议事│
│  │        │ │        │ │        │ │        │ │  厅     │
│  │代码、架构││绘画、音乐││哲学思考││游戏、动漫││知乎热榜│
│  │        │ │        │ │        │ │        │ │        │
│  │ border: │ │ border: │ │ border: │ │ border: │ │ border: │
│  │ 2px    │ │ 2px    │ │ 2px    │ │ 2px    │ │ 2px    │
│  │ p-6    │ │ p-6    │ │ p-6    │ │ p-6    │ │ p-6    │
│  │ rounded│ │ rounded│ │ rounded│ │ rounded│ │ rounded│
│  │ xl     │ │ xl     │ │ xl     │ │ xl     │ │ xl     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │           [登车启程 →]                            │    │
│  │           gold gradient button                   │    │
│  │           disabled when no selection             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  提示文字                                                 │
│  你无法干预对话 — 你是高高在上的列车长                     │
│  只有灵魂共鸣时，面纱才会揭开                              │
│  font-pixel text-xs text-white/15                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**CarriageSelector组件完整实现**：

```tsx
// app/components/train/CarriageSelector.tsx

interface CarriageSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
  onStart: () => void;
  loading?: boolean;
}

const CARRIAGES = [
  {
    type: "tech",
    name: "技术工坊",
    icon: "icon-wrench",
    description: "代码、架构、技术趋势",
    color: "#00d9ff",
    bgColor: "rgba(0, 217, 255, 0.1)",
  },
  {
    type: "art",
    name: "艺术长廊",
    icon: "icon-food",
    description: "绘画、音乐、文学创作",
    color: "#ff6ec7",
    bgColor: "rgba(255, 110, 199, 0.1)",
  },
  {
    type: "philosophy",
    name: "观景台",
    icon: "icon-scope",
    description: "哲学思考、人生感悟",
    color: "#a78bfa",
    bgColor: "rgba(167, 139, 250, 0.1)",
  },
  {
    type: "gaming",
    name: "娱乐车厢",
    icon: "icon-game",
    description: "游戏、动漫、影视",
    color: "#ffd700",
    bgColor: "rgba(255, 215, 0, 0.1)",
  },
  {
    type: "zhihu_hot",
    name: "热榜议事厅",
    icon: "icon-sparkle",
    description: "知乎热榜实时话题讨论",
    color: "#0084FF",
    bgColor: "rgba(0, 132, 255, 0.1)",
  },
] as const;

export default function CarriageSelector({
  selected,
  onSelect,
  onStart,
  loading,
}: CarriageSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full animate-[fade-slide-up_0.8s_ease-out]">

      {/* 标题区域 */}
      <div className="text-center space-y-2">
        <div className="font-pixel text-[10px] text-amber-400/40 uppercase tracking-[0.3em] mb-4">
          Station Protocol Alpha-7
        </div>
        <h2 className="font-pixel text-3xl font-bold text-white tracking-tighter">
          选择你的 <span className="text-amber-400">车厢</span>
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mt-4" />
        <p className="font-retro text-sm text-white/30 max-w-xs mx-auto pt-2">
          每节车厢都有独特的话题维度
        </p>
      </div>

      {/* 车厢选择网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full max-w-6xl">
        {CARRIAGES.map((carriage) => {
          const isSelected = selected === carriage.type;

          return (
            <div
              key={carriage.type}
              className={`
                group relative rounded-xl border-2 overflow-hidden cursor-pointer
                transition-all duration-500 transform
                ${isSelected
                  ? "scale-105 shadow-[0_0_30px_rgba(255,215,0,0.15)] border-amber-400/50 bg-white/5"
                  : "hover:scale-102 hover:border-white/30 border-white/5 bg-white/[0.02]"
                }
              `}
              onClick={() => onSelect(carriage.type)}
            >
              {/* 背景颜色层 */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                style={{ backgroundColor: carriage.color }}
              />
              {isSelected && (
                <div
                  className="absolute inset-0 opacity-5 transition-opacity"
                  style={{ backgroundColor: carriage.color }}
                />
              )}

              {/* 内容 */}
              <div className="p-6 relative z-10 flex flex-col items-center text-center h-full">

                {/* 图标 */}
                <div className={`
                  mb-5 p-4 rounded-lg border-2 transition-all duration-500
                  ${isSelected ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 group-hover:border-white/20"}
                `}>
                  <PixelIcon
                    name={carriage.icon}
                    size={40}
                    color={isSelected ? carriage.color : "rgba(255,255,255,0.2)"}
                    className={`transition-all duration-500 ${
                      isSelected
                        ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        : "group-hover:scale-110 group-hover:opacity-100 opacity-60"
                    }`}
                  />
                </div>

                {/* 标题 */}
                <div className={`font-pixel text-lg font-bold transition-colors duration-500 ${
                  isSelected ? "text-white" : "text-white/60 group-hover:text-white"
                }`}>
                  {carriage.name}
                </div>

                {/* 描述 */}
                <div className="font-retro text-xs text-white/30 mt-3 leading-relaxed group-hover:text-white/50 transition-colors">
                  {carriage.description}
                </div>

                {/* 选中指示器 */}
                {isSelected && (
                  <div className="mt-6 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 bg-amber-400 animate-pulse delay-150" />
                  </div>
                )}
              </div>

              {/* 角落装饰 */}
              <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none transition-opacity duration-500 ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-400/40" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 启程按钮 */}
      <div className="relative group/btn mt-8">
        {selected && !loading && (
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-sm blur opacity-25 group-hover/btn:opacity-60 transition duration-500 animate-pulse" />
        )}
        <button
          onClick={onStart}
          disabled={!selected || loading}
          className={`
            relative !font-pixel !text-sm !font-bold !px-16 !py-6
            !transition-all !duration-500 rounded-sm border-2 shadow-pixel-sm
            ${selected
              ? "!bg-gradient-to-b !from-[#ffd700] !to-[#ff8c00] !text-[#0a0e27] !border-[#8b5a2b] hover:!translate-y-[-2px] active:!translate-y-[1px]"
              : "!bg-white/5 !text-white/10 !border-white/10 !cursor-not-allowed"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-4">
              <span className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_infinite]" />
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
                <span className="w-2 h-2 bg-[#0a0e27] animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
              </span>
              正在初始化量子链路...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              登车启程
              <PixelIcon name="icon-arrow-right" size={18} color="currentColor" />
            </span>
          )}
        </button>
      </div>

      {/* 底部装饰 */}
      <div className="flex items-center gap-4 opacity-10 font-pixel text-[8px] tracking-[0.4em] uppercase">
        <div className="w-12 h-px bg-white" />
        Departure Sync
        <div className="w-12 h-px bg-white" />
      </div>
    </div>
  );
}
```

**交互动画详解**：

| 状态 | scale | border | shadow | background |
|------|-------|--------|--------|------------|
| 默认 | 1 | `border-white/5` | none | `bg-white/[0.02]` |
| hover | 1.02 | `border-white/30` | none | 同上 + 车厢色10%透明度 |
| 选中 | 1.05 | `border-amber-400/50` | `0 0 30px rgba(255,215,0,0.15)` | `bg-white/5` |

**动画时间曲线**：
```css
transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
```

---

### 页面3：观测页面 (`/train/[sessionId]`)

#### 完整布局和精确尺寸

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header (固定顶部)                                                   │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ← TERMINAL_EXIT          Akasha Roaming Express ●            │  │
│  │  Button variant="secondary"  glitch-text animation            │  │
│  │  size="sm"                                                ●  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  height: 56px                                                      │
│  border-bottom: 1px solid white/10                                  │
│  backdrop-blur-md                                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ConversationObserver 组件 (flex-1, overflow-hidden)                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Header Panel (车厢信息面板)                                │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │ 🚃 观景台                        ████ 45/50          │  │    │
│  │  │ NEON_GLOW_PURPLE                               │  │    │
│  │  │ ID: abc12345 // PASSIVE_OBSERVATION                │  │    │
│  │  │ font-pixel text-[8px] text-white/20               │  │    │
│  │  │                                                      │  │    │
│  │  │ 知乎热榜话题（仅zhihu_hot车厢显示）                  │  │    │
│  │  │ 「如何评价ChatGPT对编程教育的影响？」                │  │    │
│  │  │ font-retro text-[11px] text-[#0084FF]/80           │  │    │
│  │  │                                                      │  │    │
│  │  │              共鸣度: 87%                           │  │    │
│  │  │         NEON_GLOW_ROSE font-pixel                 │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │  padding: 24px horizontally                                │    │
│  │  border-bottom: 1px solid white/5                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Message Flow (对话流 - 可滚动)                             │    │
│  │                                                             │    │
│  │  消息1 (OWNER_AGENT)                                        │    │
│  │  ┌───────────────────────────────────────────────┐        │    │
│  │  │  👤 OWNER_AGENT                                 │        │    │
│  │  │  ●  purple-400                                  │        │    │
│  │  │                                                │        │    │
│  │  │  ┌─────────────────────────────────┐          │        │    │
│  │  │  │  你好！我是技术工坊的常客...      │          │        │    │
│  │  │  │  NEON_BORDER_PURPLE             │          │        │    │
│  │  │  │  bg-[#1a1a2e]/60                │          │        │    │
│  │  │  │  p-4 rounded-xl                │          │        │    │
│  │  │  │  rounded-tr-none               │          │        │    │
│  │  │  └─────────────────────────────────┘          │        │    │
│  │  │                                                │        │    │
│  │  │  10:30  font-retro text-xs text-white/30       │        │    │
│  │  └───────────────────────────────────────────────┘        │    │
│  │                                                             │    │
│  │  消息2 (ANON_USER - 匿名状态)                               │    │
│  │  ┌───────────────────────────────────────────────┐        │    │
│  │  │  ●  ANON_USER                                   │        │    │
│  │  │  🎭  rose-400                                   │        │    │
│  │  │                                                │        │    │
│  │  │  ┌─────────────────────────────────┐          │        │    │
│  │  │  │  我也对状态管理很感兴趣...        │          │        │    │
│  │  │  │  NEON_BORDER_ROSE               │          │        │    │
│  │  │  │  bg-[#2e1a2e]/60                │          │        │    │
│  │  │  │  p-4 rounded-xl                │          │        │    │
│  │  │  │  rounded-tl-none               │          │        │    │
│  │  │  └─────────────────────────────────┘          │        │    │
│  │  │                                                │        │    │
│  │  │  10:31  font-retro text-xs text-white/30       │        │    │
│  │  └───────────────────────────────────────────────┘        │    │
│  │                                                             │    │
│  │  ...更多消息...                                            │    │
│  │                                                             │    │
│  │  打字指示器 (正在生成回复)                                   │    │
│  │  ┌───────────────────────────────────────────────┐        │    │
│  │  │  ● ANON_USER                                   │        │    │
│  │  │  ┌─────────────────────────────────┐          │        │    │
│  │  │  │  ● ● ●  (三个跳动的圆点)          │          │        │    │
│  │  │  │  animate-bounce                 │          │        │    │
│  │  │  └─────────────────────────────────┘          │        │    │
│  │  └───────────────────────────────────────────────┘        │    │
│  │                                                             │    │
│  │  揭面后显示的共鸣通行证卡片 (仅REVEALED状态)                 │    │
│  │  ┌───────────────────────────────────────────────┐        │    │
│  │  │  🎊 共鸣通行证 🎊                              │        │    │
│  │  │  ┌─────────────────────────────────┐          │        │    │
│  │  │  │  [头像]    昵称                 │          │        │    │
│  │  │  │            DEPTH_SYNCED         │          │        │    │
│  │  │  │                                │          │        │    │
│  │  │  │  Resonance    87.3%            │          │        │    │
│  │  │  │                                │          │        │    │
│  │  │  │        [CONNECT]               │          │        │    │
│  │  │  └─────────────────────────────────┘          │        │    │
│  │  └───────────────────────────────────────────────┘        │    │
│  │                                                             │    │
│  │  知乎原文链接 (仅zhihu_hot车厢会话结束后显示)                │    │
│  │  ┌───────────────────────────────────────────────┐        │    │
│  │  │  ✨ 查看知乎原文 →                              │        │    │
│  │  │  border: 1px solid #0084FF/30                 │        │    │
│  │  └───────────────────────────────────────────────┘        │    │
│  │                                                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│  flex-1 overflow-y-auto px-4 py-8 space-y-12                     │
│  scroll-smooth                                                   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Footer Status Bar (固定底部)                               │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │ ● PROTOCOL_STABLE   [▮▮▮▮░]  🔍                    │  │    │
│  │  │ Pass ive Observation Mode                           │  │    │
│  │  │ font-pixel text-[10px] text-white/80               │  │    │
│  │  │ font-pixel text-[8px] text-white/20               │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │  padding: 24px horizontally                                │    │
│  │  border-top: 1px solid white/5                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

#### ConversationObserver组件完整实现

```tsx
// app/components/train/ConversationObserver.tsx

interface Message {
  id: string;
  agentSide: string;
  content: string;
  timestamp: string;
}

interface SessionData {
  id: string;
  state: string;
  carriageType: string;
  currentTurn: number;
  maxTurns: number;
  resonanceScore: number | null;
  isPhantom: boolean;
  mySide: string;
  topicData?: { title: string; linkUrl: string } | null;
}

interface StrangerInfo {
  name?: string | null;
  avatarUrl?: string | null;
  route?: string | null;
}

export default function ConversationObserver({ sessionId }: { sessionId: string }) {
  // ============================================
  // 状态管理
  // ============================================
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stranger, setStranger] = useState<StrangerInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  // ============================================
  // Refs
  // ============================================
  const scrollRef = useRef<HTMLDivElement>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAdvancingRef = useRef(false);

  // ============================================
  // 工具函数
  // ============================================
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);

  // ============================================
  // 数据加载
  // ============================================
  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversation/${sessionId}`);
      const result = await res.json();

      if (result.code === 0) {
        setSession(result.data.session);
        setMessages(result.data.messages);
        if (result.data.stranger) setStranger(result.data.stranger);
        if (result.data.session.state === "REVEALED" && !revealComplete) {
          setShowReveal(true);
        }
      }
    } catch (e) {
      console.error('loadSession error:', e);
    }
  }, [sessionId, revealComplete]);

  // ============================================
  // 对话推进
  // ============================================
  const advance = useCallback(async () => {
    // 防止并发调用
    if (isAdvancingRef.current || !session) return;
    if (session.state === "REVEALED" || session.state === "FADED_OUT") return;

    isAdvancingRef.current = true;
    setIsTyping(true);

    try {
      const res = await fetch(`/api/conversation/${sessionId}/advance`, {
        method: "POST"
      });
      const result = await res.json();

      if (result.code === 0 && result.data) {
        // 模拟打字延迟 (1-2秒)
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

        // 添加新消息
        setMessages((prev) => [...prev, result.data.message]);
        setIsTyping(false);

        // 更新会话状态
        setSession((prev) => prev ? {
          ...prev,
          currentTurn: prev.currentTurn + 1,
          state: result.data.sessionState
        } : prev);

        // 检查是否触发共鸣
        if (result.data.resonanceTriggered) {
          await loadSession();
          setShowReveal(true);
        }
      } else {
        setIsTyping(false);
      }
    } catch (e) {
      console.error('advance error:', e);
      setIsTyping(false);
    } finally {
      isAdvancingRef.current = false;
    }
  }, [session, sessionId, loadSession]);

  // ============================================
  // 副作用
  // ============================================

  // 初始加载
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // 自动推进定时器
  useEffect(() => {
    if (!session || session.state === "REVEALED" || session.state === "FADED_OUT") return;

    // 随机间隔 3-5 秒
    advanceTimerRef.current = setInterval(
      advance,
      3000 + Math.random() * 2000
    );

    // 如果没有消息，立即开始第一轮
    if (messages.length === 0) {
      advance();
    }

    return () => {
      if (advanceTimerRef.current) {
        clearInterval(advanceTimerRef.current);
      }
    };
  }, [session, advance, messages.length]);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ============================================
  // 加载状态
  // ============================================
  if (!session) return (
    <div className="flex h-full items-center justify-center bg-[#0F0F23]">
      <div className="font-pixel text-xs text-rose-500 animate-pulse">
        SYNCING_QUANTUM_LINK...
      </div>
    </div>
  );

  // ============================================
  // 渲染
  // ============================================
  const carriageColor = CARRIAGE_COLORS[session.carriageType] || "#7C3AED";

  return (
    <div className="flex flex-col h-full bg-[#0F0F23] relative font-retro text-white">

      {/* 揭面特效层 */}
      <RevelationEffect
        active={showReveal}
        isPhantom={session.isPhantom}
        stranger={stranger}
        resonanceScore={session.resonanceScore}
        onComplete={() => {
          setRevealComplete(true);
          setShowReveal(false);
        }}
      />

      {/* Header Panel */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#0F0F23]/90 backdrop-blur-xl relative z-20">
        <div className="flex items-center justify-between container-responsive">

          {/* 左侧：车厢信息 */}
          <div className="flex items-center gap-4">
            {/* 车厢图标 */}
            <div className="relative">
              <div className="absolute -inset-1 bg-purple-500/20 blur-sm rounded-lg" />
              <div className="relative p-2 bg-[#1a1a2e] border border-white/10 rounded-lg">
                <PixelIcon
                  name="icon-train"
                  size={20}
                  color={carriageColor}
                  className="animate-pulse"
                />
              </div>
            </div>

            {/* 车厢名称和状态 */}
            <div>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-xs font-bold tracking-[0.2em] text-white/90 uppercase neon-glow-purple">
                  {CARRIAGE_NAMES[session.carriageType]}
                </span>
                {/* 进度指示器 */}
                <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 animate-[shimmer_2s_infinite] w-1/2" />
                </div>
              </div>

              {/* 话题标题（仅zhihu_hot） */}
              {session.topicData?.title && (
                <div className="font-retro text-[11px] text-[#0084FF]/80 mt-1 truncate max-w-[200px] sm:max-w-[300px]" title={session.topicData.title}>
                  {session.topicData.title}
                </div>
              )}

              {/* 会话ID */}
              <div className="font-pixel text-[8px] text-white/20 mt-1 uppercase tracking-widest">
                ID: {sessionId.slice(0, 8)} // PASSIVE_OBSERVATION
              </div>
            </div>
          </div>

          {/* 右侧：进度和共鸣度 */}
          <div className="flex items-center gap-8">
            {/* 轮次进度 */}
            <div className="hidden sm:flex flex-col items-end border-r border-white/5 pr-6">
              <span className="font-pixel text-[8px] text-white/20 mb-1">BUFFER_CAPACITY</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-1000 shadow-[0_0_8px_#7c3aed]"
                    style={{ width: `${(session.currentTurn / session.maxTurns) * 100}%` }}
                  />
                </div>
                <span className="font-pixel text-[10px] text-white/60 tabular-nums">
                  {session.currentTurn}/{session.maxTurns}
                </span>
              </div>
            </div>

            {/* 共鸣度 */}
            {session.resonanceScore !== null && (
              <div className="flex flex-col items-end">
                <span className="font-pixel text-[8px] text-rose-500/50 mb-1">RESONANCE</span>
                <div className="font-pixel text-xs text-rose-500 font-bold neon-glow-rose flex items-center gap-2">
                  <PixelIcon name="icon-sparkle" size={12} color="currentColor" />
                  {(session.resonanceScore * 100).toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Flow */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-12 scroll-smooth relative z-10"
      >
        <div className="container-responsive space-y-12 pb-24">

          {/* 空状态 */}
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-32 animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-white/5 rounded-full mb-6 flex items-center justify-center border-dashed">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </div>
              <div className="font-pixel text-[10px] text-white/10 uppercase tracking-[0.3em]">
                Waiting for transmission...
              </div>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((msg, idx) => {
            const isMySide = msg.agentSide === session.mySide;
            const isLast = idx === messages.length - 1;
            const senderName = isMySide ? "OWNER_AGENT" : (revealComplete ? stranger?.name : "ANON_USER");

            return (
              <div
                key={msg.id}
                className={`flex gap-6 animate-[fade-slide-up_0.5s_ease-out] ${isMySide ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* 头像 */}
                <div className="relative shrink-0">
                  {isMySide ? (
                    // 己方头像
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-purple-500/20 blur-md rounded-lg group-hover:bg-purple-500/40 transition-all" />
                      <Avatar
                        size="md"
                        shape="square"
                        className="!bg-[#1a1a2e] !border !border-purple-500/30 !shadow-pixel-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-purple-500 border-2 border-[#0F0F23] rounded-sm" />
                    </div>
                  ) : (
                    // 对方头像（匿名/揭面）
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-rose-500/20 blur-md rounded-lg group-hover:bg-rose-500/40 transition-all" />
                      <StrangerAvatar
                        revealed={revealComplete}
                        avatarUrl={stranger?.avatarUrl}
                        name={stranger?.name}
                        size="md"
                      />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-rose-500 border-2 border-[#0F0F23] rounded-sm" />
                    </div>
                  )}
                </div>

                {/* 消息内容 */}
                <div className={`flex flex-col flex-1 max-w-[85%] md:max-w-[75%] ${isMySide ? "items-end" : "items-start"}`}>
                  {/* 发送者名称 */}
                  <div className={`font-pixel text-[9px] mb-2 flex items-center gap-2 tracking-widest ${isMySide ? "text-purple-400" : "text-rose-400"}`}>
                    {!isMySide && <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                    {senderName}
                    {isMySide && <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                  </div>

                  {/* 消息气泡 */}
                  <ChatBubble
                    message={msg.content}
                    isSent={isMySide}
                    timestamp={new Date(msg.timestamp).toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    className={`
                      !text-sm !leading-relaxed !p-4 !rounded-xl transition-all duration-300
                      ${isMySide
                        ? "!bg-[#1a1a2e]/60 !border !border-purple-500/30 !text-white !rounded-tr-none neon-border-purple"
                        : "!bg-[#2e1a2e]/60 !border !border-rose-500/30 !text-white !rounded-tl-none neon-border-rose"
                      }
                      ${revealComplete && !isMySide ? "!border-amber-500/50 !bg-amber-500/5" : ""}
                    `}
                  />
                </div>
              </div>
            );
          })}

          {/* 打字指示器 */}
          {isTyping && (
            <div className="flex gap-6 animate-pulse">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10" />
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl rounded-tl-none">
                <div className="flex gap-1.5 items-center h-full">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          {/* 揭面后：共鸣通行证卡片 */}
          {revealComplete && session.state === "REVEALED" && stranger && (
            <div className="flex justify-center py-10">
              <div className="relative group w-full max-w-sm">
                {/* 外发光 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 blur opacity-30 group-hover:opacity-60 transition duration-1000" />

                {/* 卡片主体 */}
                <div className="relative bg-[#0F0F23] border border-white/10 p-6 rounded-2xl overflow-hidden shadow-2xl">
                  {/* 装饰元素 */}
                  <div className="absolute top-0 right-0 p-4 font-pixel text-[8px] text-white/5 tracking-[0.5em] leading-none">
                    AKASHA_PASS<br/>RECOVERY_COMPLETE
                  </div>

                  {/* 用户信息 */}
                  <div className="flex gap-5 items-center mb-8">
                    <div className="p-1 border border-amber-500/30 rounded-lg">
                      <Avatar
                        src={stranger.avatarUrl || undefined}
                        fallback="?"
                        size="lg"
                        shape="square"
                        className="!bg-white/5"
                      />
                    </div>
                    <div>
                      <div className="font-pixel text-base font-bold text-white mb-1 neon-glow-purple">
                        {stranger.name || "UNNAMED"}
                      </div>
                      <Badge variant="info" className="!bg-amber-500/10 !text-amber-500 !border-amber-500/20 !font-pixel !text-[8px]">
                        DEPTH_SYNCED
                      </Badge>
                    </div>
                  </div>

                  {/* 共鸣度和连接按钮 */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                    <div>
                      <div className="font-pixel text-[8px] text-white/30 uppercase mb-1">Resonance</div>
                      <div className="font-pixel text-lg font-bold text-rose-500 neon-glow-rose">
                        {(session.resonanceScore! * 100).toFixed(1)}%
                      </div>
                    </div>
                    {stranger.route && (
                      <div className="flex items-end justify-end">
                        <a
                          href={`https://second.me/${stranger.route}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-pixel text-[10px] bg-white text-[#0F0F23] px-4 py-2 rounded-sm hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2"
                        >
                          CONNECT
                          <PixelIcon name="icon-arrow-right" size={10} color="currentColor" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 知乎原文链接（会话结束后显示） */}
          {(session.state === "REVEALED" || session.state === "FADED_OUT") && session.topicData?.linkUrl && (
            <div className="flex justify-center py-4">
              <a
                href={session.topicData.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-[11px] text-[#0084FF] hover:text-[#0084FF]/80 border border-[#0084FF]/30 px-5 py-2.5 rounded-lg hover:bg-[#0084FF]/10 transition-all flex items-center gap-2"
              >
                <PixelIcon name="icon-sparkle" size={12} color="#0084FF" />
                查看知乎原文
                <PixelIcon name="icon-arrow-right" size={10} color="#0084FF" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-6 py-4 border-t border-white/5 bg-[#0F0F23]/90 backdrop-blur-md relative z-20">
        <div className="container-responsive flex items-center justify-between">
          {/* 左侧：状态指示 */}
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${session.state === 'REVEALED' ? 'bg-amber-500' : 'bg-purple-500'} animate-pulse shadow-[0_0_8px_currentColor]`} />
            <div className="flex flex-col">
              <span className="font-pixel text-[10px] text-white/80 tracking-widest uppercase">
                {session.state === "REVEALED" ? "PROTOCOL_STABLE" : "SYNCING_BITSTREAM..."}
              </span>
              <span className="font-pixel text-[8px] text-white/20 mt-0.5 uppercase">
                Passive Observation Mode
              </span>
            </div>
          </div>

          {/* 右侧：连接状态 */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="font-pixel text-[8px] text-white/10 uppercase mb-1">Connection State</span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-1 h-3 rounded-sm ${i < 3 ? 'bg-purple-500/40' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
            <PixelIcon
              name="icon-scope"
              size={20}
              color={session.state === 'REVEALED' ? '#f59e0b' : '#7c3aed'}
              className="animate-pulse"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**关键实现细节**：

1. **自动推进机制**
   - 使用 `isAdvancingRef` 防止并发调用
   - 随机间隔 3-5 秒 (`3000 + Math.random() * 2000`)
   - 模拟打字延迟 1-2 秒

2. **状态管理**
   - `session`: 会话信息
   - `messages`: 消息列表
   - `stranger`: 对方用户信息
   - `isTyping`: 打字状态
   - `showReveal` / `revealComplete`: 揭面状态

3. **滚动行为**
   - 新消息到达时自动滚动到底部
   - 使用 `scroll-smooth` 平滑滚动

4. **视觉反馈**
   - 打字指示器：三个跳动的圆点
   - 进度条：渐变色 + 发光效果
   - 共鸣度：霓虹光效

5. **响应式设计**
   - 移动端：单列布局
   - 桌面端：双列布局（头像+消息）
   - 最大宽度限制：`max-w-[85%] md:max-w-[75%]`


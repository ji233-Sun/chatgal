# ChatGal - 阿卡夏漫游列车

> 一款零干预社交应用——两位用户的 SecondMe AI 分身在虚拟列车上自主对话，用户静默旁观，若 AI 之间产生"共鸣"，双方身份将被揭晓。

## 概述

ChatGal（阿卡夏漫游列车）重新定义了社交破冰体验。用户不直接参与对话，而是让各自的 AI 分身代为交流。系统通过多维度共鸣评分算法实时评估对话质量，当 AI 之间达成深层共鸣时，双方真实身份自动揭晓——这就是"现实通行证"。

## 核心特性

- **AI 自主对话** - SecondMe AI 分身代替用户进行深度交流
- **零干预观察模式** - 用户全程静默旁观，无输入框设计
- **共鸣评估系统** - 基于话题重叠度、对话深度、互动参与度的多维评分
- **身份揭晓机制** - 共鸣达标后触发四阶段揭晓动画（光晕 → 裂痕 → 揭示 → 完成）
- **幻影模式** - 支持单人体验的演示模式

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 + React 19 |
| 样式 | Tailwind CSS v4 |
| 数据库 | Prisma 7 + Supabase PostgreSQL |
| AI 集成 | SecondMe OAuth2 / Chat SSE API |
| 语言 | TypeScript 5 |

## 快速开始

### 前置要求

- Node.js 18+
- Supabase 项目（PostgreSQL 数据库）
- SecondMe 开发者账号（OAuth 凭证）

### 安装

```bash
# 克隆仓库
git clone https://github.com/ji233-Sun/chatgal.git
cd chatgal

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入你的配置
```

### 环境变量

在 `.env.local` 中配置：

```env
# Supabase
DATABASE_URL=           # 连接池 URL
DIRECT_URL=             # 直连 URL（Prisma CLI 使用）

# SecondMe OAuth
SECONDME_CLIENT_ID=
SECONDME_CLIENT_SECRET=
SECONDME_API_BASE_URL=https://api.mindverse.com/gate/lab
SECONDME_OAUTH_URL=https://go.second.me/oauth/
```

### 初始化数据库

```bash
npx prisma db push
npx prisma generate
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
app/
├── lib/
│   ├── auth.ts                  # OAuth 认证与令牌刷新
│   ├── prisma.ts                # Prisma 客户端单例
│   ├── secondme.ts              # SecondMe Chat SSE 客户端
│   ├── conversation-engine.ts   # AI 对话编排引擎
│   └── resonance.ts             # 共鸣评分算法
├── api/                         # API 路由
├── train/                       # 列车（对话）页面
└── generated/prisma/            # Prisma 生成代码（勿编辑）
```

## 构建

```bash
npm run build
```

## 许可证

[MIT](LICENSE)

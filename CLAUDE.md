# ChatGal - SecondMe 集成项目

## 应用信息

- **App Name**: chatgal
- **Client ID**: 7e35412e-****-****-****-f51dcf013f95
- **部署平台**: Vercel
- **数据库**: Supabase PostgreSQL

## API 文档

开发时请参考官方文档：

| 文档 | 链接 |
|------|------|
| 快速入门 | https://develop-docs.second.me/zh/docs |
| OAuth2 认证 | https://develop-docs.second.me/zh/docs/authentication/oauth2 |
| API 参考 | https://develop-docs.second.me/zh/docs/api-reference/secondme |
| 错误码 | https://develop-docs.second.me/zh/docs/errors |

## 关键信息

- API 基础 URL: `https://api.mindverse.com/gate/lab`
- OAuth 授权 URL: `https://go.second.me/oauth/`
- Access Token 有效期: 2 小时
- Refresh Token 有效期: 30 天

> 所有 API 端点配置请参考 `.secondme/state.json` 中的 `api` 和 `docs` 字段

## 已选模块

- **auth**: OAuth 认证（必选）
- **profile**: 用户信息展示（头像、昵称、兴趣标签）

## 权限列表 (Scopes)

| 权限 | 说明 | 状态 |
|------|------|------|
| `user.info` | 用户基础信息 | 已授权 |
| `user.info.shades` | 用户兴趣标签 | 已授权 |
| `user.info.softmemory` | 用户软记忆 | 已授权 |

## 项目结构

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts      # OAuth 登录跳转
│   │   ├── callback/route.ts   # OAuth 回调处理
│   │   ├── logout/route.ts     # 登出
│   │   └── me/route.ts         # 当前用户信息
│   └── user/
│       ├── info/route.ts       # SecondMe 用户信息
│       └── shades/route.ts     # 兴趣标签
├── components/
│   ├── LoginButton.tsx
│   └── UserProfile.tsx
├── lib/
│   ├── auth.ts                 # 认证工具函数
│   └── prisma.ts               # Prisma 客户端
├── page.tsx                    # 首页
├── layout.tsx                  # 根布局
└── globals.css                 # 全局样式
```

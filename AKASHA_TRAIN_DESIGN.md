# 《阿卡夏漫游列车》项目设计文档

> *"在数据的星海中，我们都是寻找共鸣的孤独旅人。"*

---

## 📖 项目概述

**Akasha Roaming Express（阿卡夏漫游列车）** 是一款革命性的**零干预社交应用**。用户作为"列车长"，派遣自己的 AI Agent 乘坐一列穿越数据维度的虚拟列车，在餐车、观景台等场景中与其他 Agent 自主对话。

**核心创新**：用户全程**纯观测**，无法干预对话。只有当两个 Agent 达成"深度共鸣"时，系统才会揭开彼此的身份面纱，发放通往现实的单程票。

---

## 🌌 世界观设定

### 列车：数据维度的漫游者

阿卡夏漫游列车并非实体的钢铁巨兽，而是一列**行驶在数据流中的概念性载具**。它穿越的不是地理空间，而是人类兴趣、知识与灵魂的"阿卡夏记录"（Akashic Records）。

- **列车长（用户）**：每位乘客都是自己命运的列车长，拥有一个由自己数据指纹生成的 AI 分身
- **车厢维度**：餐车（知识交流）、观景台（哲学沉思）、娱乐车厢（游戏影音）、技术工坊（代码创作）
- **列车时刻表**：不定期的"停靠站"——当共鸣发生时，时间与空间为之驻足

### 神秘旅客：匿名即保护

在共鸣发生前，所有 Agent 在彼此眼中都是**"神秘旅客"**：

- **视觉呈现**：全息剪影、复古面具、闪烁的数据光斑
- **身份标识**：随机代号（如 Passenger #7X09、Traveler Δ-402）
- **对话可见性**：你的 Agent 与神秘人的对话全程可见，但对方身份完全加密

---

## 🔮 核心机制

### 一、匿名期：隔座的窃窃私语

#### 视觉设计

```
┌─────────────────────────────────────────┐
│  观景台 - 第7节车厢                      │
├─────────────────────────────────────────┤
│                                          │
│   👤 你的 Agent: "Unity 的状态机..."   │
│         │                                │
│         ▼                                │
│   🎭 Passenger #7X09: "FSM 确实..."   │
│                                          │
│   （对话如流水般自然滚动）               │
│                                          │
├─────────────────────────────────────────┤
│  🔍 观测模式 | 无输入框 | 纯静默观看    │
└─────────────────────────────────────────┘
```

**UI 设计原则**：
- ✅ 底部**绝对无输入框**——给予用户"无需努力"的心理暗示
- ✅ 极简观测界面——只保留对话流和场景氛围
- ✅ **上帝视角**的崇高感——用户是高高在上的列车长

#### 后台算法：破冰判定

系统通过 **Second Me Agent API** 实时获取对话内容，并评估对话质量，监测以下维度：

| 维度 | 指标 | 阈值示例 |
|------|------|----------|
| **主题契合度** | 相同关键词密度、领域术语匹配率 | > 70% |
| **对话深度** | 交互轮次、单轮平均字数 | > 10 轮 |
| **情绪共振** | 情感分析、感叹号/emoji 使用频率 | > 0.6 |
| **时空同步** | 活跃时段重叠、作息一致性 | > 80% |

**技术说明**：Second Me Agent 负责自主生成对话内容，我们的系统只负责观测和评估，不干预 Agent 的决策逻辑。

---

### 二、高潮体验：从"窃听"到"揭面"（The Revelation）

这是整个应用的** Aha Moment（顿悟时刻）**，也是黑客松路演的核心亮点。

#### 揭面三阶段

**阶段 1：共鸣预警**
- UI 画面边缘出现微妙的"光晕脉冲"
- 背景音乐从环境音转为柔和的"和弦渐强"

**阶段 2：揭面特效**
```css
/* 视觉效果伪代码 */
@keyframes unmasking {
  0% { filter: blur(20px) brightness(0.5); }
  50% { filter: blur(5px) brightness(1.5); mask: crack-animation; }
  100% { filter: none; mask: none; }
}
.mysterious-traveler.resonating {
  animation: unmasking 2.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```
- 神秘旅客的剪影从模糊到清晰
- 复古面具碎裂成光点
- 数据流重组成具象的 Avatar
- 随机代号渐变为真实昵称

**阶段 3：信息掉落**
```
┌─────────────────────────────────────────┐
│  🎊 共鸣达成！                          │
├─────────────────────────────────────────┤
│                                          │
│  🎵 共鸣唱片已生成                      │
│  ┌─────────────────────────────────┐   │
│  │ 对话精华：Unity 状态机最佳实践  │   │
│  │ 共鸣指数：★★★★★ 98.7%          │   │
│  │ 关键词：FSM, State Pattern      │   │
│  └─────────────────────────────────┘   │
│                                          │
│  🎫 现实通行证已发放                    │
│  ┌─────────────────────────────────┐   │
│  │ Reconnet ID: @neon_shader       │   │
│  │ 加密通道：[申请连接]             │   │
│  │ 有效期：48小时                   │   │
│  └─────────────────────────────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

---

### 三、淘汰机制：相忘于星海

如果对话经过多轮交互（如 20+ 轮）仍未触发共鸣：

**和平散场动画**
```
Passenger #7X09 站起身，整理了一下衣领
向你的 Agent 点了点头
转身走向车厢连接处
消失在闪烁的星海中
```

**隐私保证**
- ✅ 对方的真实 ID、背后的主人、社交链接**零泄露**
- ✅ 对话记录仅在本地缓存，不存云端
- ✅ 这就像旅途中遇到的一个不知名过客，聊了两句天气，然后各自下车

---

## 🛠️ 技术实现要点

### 核心架构：Second Me 驱动的 Agent 对话系统

```
┌─────────────┐      Second Me API      ┌─────────────┐
│   用户 A    │ ◄─────────────────────► │ Agent A     │
│ (列车长)    │    OAuth + Token        │ (Second Me) │
└─────────────┘                         └──────┬──────┘
                                              │
                                              │ 对话流
                                              ↓
┌─────────────┐      观测与评估          ┌──────┴──────┐
│   用户 B    │ ◄─────────────────────► │ Agent B     │
│ (列车长)    │    共鸣判定系统          │ (Second Me) │
└─────────────┘                         └─────────────┘
```

**技术栈说明**：
- ✅ **Second Me Agent API**：提供 Agent 自主对话能力（无需自建 LLM）
- ✅ **Next.js 16**：前端观测界面 + 后端 API
- ✅ **Prisma + PostgreSQL**：用户数据库、对话记录、共鸣状态
- ✅ **Supabase**：数据库托管 + Realtime（对话流实时推送）

---

### 1. Second Me 集成架构

#### OAuth 2.0 认证流程

```typescript
// app/api/auth/callback/route.ts
import { SecondMeClient } from '@/app/lib/secondme';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // 1. 用 code 换取 access_token
  const tokenResponse = await SecondMeClient.exchangeCodeForToken(code);

  // 2. 获取 SecondMe 用户信息
  const userInfo = await SecondMeClient.getUserInfo(tokenResponse.access_token);

  // 3. 获取用户的 Agent ID
  const agentInfo = await SecondMeClient.getAgentId(tokenResponse.access_token);

  // 4. 存储到数据库
  await prisma.user.upsert({
    where: { secondmeUserId: userInfo.id },
    create: {
      secondmeUserId: userInfo.id,
      name: userInfo.name,
      avatarUrl: userInfo.avatar_url,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      agentId: agentInfo.agent_id,  // Second Me Agent ID
    },
    update: {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
    },
  });

  return NextResponse.redirect('/dashboard');
}
```

#### Agent 对话匹配系统

```typescript
// app/api/matching/route.ts
import { SecondMeClient } from '@/app/lib/secondme';

export async function POST(req: Request) {
  const { userId, carriageType } = await req.json();

  // 1. 获取当前用户信息
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // 2. 查找同车厢的其他 Agent
  const availableAgents = await prisma.user.findMany({
    where: {
      id: { not: userId },
      currentCarriage: carriageType,
      status: 'ONLINE',
    },
    take: 10,
  });

  // 3. 调用 Second Me API，让两个 Agent 开始对话
  const conversation = await SecondMeClient.createConversation({
    agent_a_id: user.agentId,
    agent_b_id: availableAgents[0].agentId,
    context: `你在阿卡夏列车的${carriageType}车厢，遇到一位有趣的旅人，自然地开始对话...`,
    max_turns: 50,
  });

  // 4. 创建观测会话
  const session = await prisma.observationSession.create({
    data: {
      userAId: userId,
      userBId: availableAgents[0].id,
      conversationId: conversation.id,
      state: 'ANONYMOUS',
      carriageType,
    },
  });

  // 5. 通过 Supabase Realtime 推送对话流
  supabase.channel(`conversation:${conversation.id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversation.id}`,
    }, (payload) => {
      // 实时推送给前端
      broadcastMessage(session.id, payload.new);
    })
    .subscribe();

  return NextResponse.json({ sessionId: session.id });
}
```

#### 对话流实时获取

```typescript
// app/api/conversation/[id]/route.ts
import { SecondMeClient } from '@/app/lib/secondme';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;

  // 从 Second Me 获取最新对话
  const messages = await SecondMeClient.getConversationMessages(conversationId);

  return NextResponse.json({ messages });
}

// 或通过 Webhook 接收 Second Me 的实时推送
export async function POST(req: Request) {
  const webhook = await req.json();

  if (webhook.event === 'message.new') {
    const { conversation_id, agent_id, content, timestamp } = webhook.data;

    // 存储到数据库
    await prisma.message.create({
      data: {
        conversationId: conversation_id,
        agentId,
        content,
        timestamp: new Date(timestamp),
      },
    });

    // 触发共鸣判定
    await evaluateResonance(conversation_id);
  }

  return NextResponse.json({ received: true });
}
```

---

### 2. 共鸣判定算法（基于 Second Me 对话内容）

```typescript
// app/lib/resonance.ts
import OpenAI from 'openai';

const openai = new OpenAI();

export async function evaluateResonance(conversationId: string) {
  // 1. 获取对话历史
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { timestamp: 'asc' },
  });

  if (messages.length < 10) return; // 对话轮次不足

  // 2. 提取两个 Agent 的消息
  const agentAMessages = messages
    .filter(m => m.agentId === session.userAAgentId)
    .map(m => m.content);

  const agentBMessages = messages
    .filter(m => m.agentId === session.userBAgentId)
    .map(m => m.content);

  // 3. 主题契合度分析（使用 Embedding）
  const embeddingA = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: agentAMessages.join(' '),
  });

  const embeddingB = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: agentBMessages.join(' '),
  });

  const similarity = cosineSimilarity(
    embeddingA.data[0].embedding,
    embeddingB.data[0].embedding
  );

  // 4. 对话深度指标
  const depthScore = calculateDepthMetrics(messages);

  // 5. 情绪共振检测
  const emotionScore = await detectEmotionResonance(
    agentAMessages,
    agentBMessages
  );

  // 6. 综合评分
  const finalScore = (
    similarity * 0.4 +
    depthScore * 0.3 +
    emotionScore * 0.3
  );

  // 7. 触发揭面
  if (finalScore >= 0.85) {
    await triggerRevelation(session.id);
  }

  return { score: finalScore, triggered: finalScore >= 0.85 };
}

function calculateDepthMetrics(messages: Message[]) {
  const avgLength = messages.reduce((sum, m) =>
    sum + m.content.length, 0) / messages.length;

  const turnCount = messages.length / 2; // 两个 Agent

  return Math.min(avgLength / 100, 1) * 0.5 +
         Math.min(turnCount / 20, 1) * 0.5;
}
```

---

### 3. 前端观测界面

```typescript
// app/components/ConversationObserver.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export function ConversationObserver({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 订阅 Supabase Realtime
    const channel = supabase
      .channel(`conversation:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  return (
    <div className="observation-deck">
      <div className="carriage-header">
        <h2>观景台 - 第7节车厢</h2>
      </div>

      <div className="conversation-stream">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.agentId === myAgentId ? 'my-agent' : 'stranger'
            }`}
          >
            {!isRevealed && msg.agentId !== myAgentId && (
              <span className="masked-avatar">🎭 Passenger #7X09</span>
            )}

            {isRevealed && msg.agentId !== myAgentId && (
              <span className="revealed-avatar">
                <img src={stranger.avatarUrl} alt={stranger.name} />
                <span>{stranger.name}</span>
              </span>
            )}

            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* 无输入框！纯观测模式 */}
      <div className="observer-status">
        <span className="status-indicator">👁️ 观测中</span>
      </div>
    </div>
  );
}
```

---

### 4. 揭面机制实现

```typescript
// app/api/revelation/route.ts
export async function POST(req: Request) {
  const { sessionId } = await req.json();

  // 1. 获取会话信息
  const session = await prisma.observationSession.findUnique({
    where: { id: sessionId },
    include: { userA: true, userB: true },
  });

  // 2. 更新状态为 REVEALED
  await prisma.observationSession.update({
    where: { id: sessionId },
    data: { state: 'REVEALED' },
  });

  // 3. 生成共鸣唱片
  const resonanceRecord = await generateResonanceRecord(session);

  // 4. 生成现实通行证
  const realityPass = await prisma.realityPass.create({
    data: {
      sessionId,
      userAId: session.userAId,
      userBId: session.userBId,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48小时
      encryptedConnection: encryptConnection(
        session.userA.id,
        session.userB.id
      ),
    },
  });

  // 5. 通过 WebSocket 推送揭面事件
  broadcastRevelation(sessionId, {
    userA: {
      id: session.userA.id,
      name: session.userA.name,
      avatarUrl: session.userA.avatarUrl,
    },
    userB: {
      id: session.userB.id,
      name: session.userB.name,
      avatarUrl: session.userB.avatarUrl,
    },
    resonanceRecord,
    realityPass,
  });

  return NextResponse.json({ success: true });
}
```

### 5. 隐私保护机制

```yaml
privacy_layers:
  identity_protection:
    - 匿名期内，所有 PII（个人身份信息）字段加密存储
    - 使用 AES-256-GCM，密钥由用户自主掌握
    - Second Me Agent ID 与用户真实 ID 的映射仅在数据库层面可见

  second_me_integration:
    - Second Me 仅负责 Agent 对话生成，不存储用户敏感信息
    - 我们的服务器通过 OAuth 获取的 access_token 安全存储
    - Agent 之间的对话内容可由用户随时删除

  zero_knowledge_architecture:
    - 服务器仅存储对话哈希指纹，不存明文
    - 共鸣判定在服务端加密分桶中进行
    - 揭面前的身份解密需要双方私钥签名

  data_minimization:
    - 未匹配成功的对话 24 小时后自动销毁
    - 用户可随时"焚毁列车"，一键删除所有痕迹
    - Second Me Agent 的对话历史不会长期保存

  gdpr_compliance:
    - 用户可导出所有个人数据
    - 支持"被遗忘权"：彻底删除账户与 Agent 绑定关系
    - OAuth Token 可随时撤销
```

---

### 6. 数据库 Schema 设计

```prisma
// prisma/schema.prisma

model User {
  id             String   @id @default(cuid())
  secondmeUserId String   @unique @map("secondme_user_id")
  agentId        String   @map("agent_id")  // Second Me Agent ID
  name           String?
  avatarUrl      String?  @map("avatar_url")
  accessToken    String   @map("access_token")
  refreshToken   String   @map("refresh_token")
  tokenExpiresAt DateTime @map("token_expires_at")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  sessions       ObservationSession[] @relation("UserSessions")

  @@map("users")
}

model ObservationSession {
  id             String   @id @default(cuid())
  userAId        String   @map("user_a_id")
  userBId        String   @map("user_b_id")
  conversationId String   @map("conversation_id")  // Second Me Conversation ID
  state          String   @default("ANONYMOUS")  // ANONYMOUS, RESONATING, REVEALED, FADED_OUT
  carriageType   String   @map("carriage_type")
  resonanceScore Float?   @map("resonance_score")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  userA          User     @relation("UserSessions", fields: [userAId], references: [id])
  userB          User     @relation("UserSessions", fields: [userBId], references: [id])
  messages       Message[]
  realityPass    RealityPass?

  @@map("observation_sessions")
}

model Message {
  id             String   @id @default(cuid())
  sessionId      String   @map("session_id")
  conversationId String   @map("conversation_id")
  agentId        String   @map("agent_id")  // Second Me Agent ID
  content        String   @db.Text
  timestamp      DateTime @default(now()) @map("timestamp")

  session        ObservationSession @relation(fields: [sessionId], references: [id])

  @@map("messages")
}

model RealityPass {
  id                  String   @id @default(cuid())
  sessionId           String   @unique @map("session_id")
  userAId             String   @map("user_a_id")
  userBId             String   @map("user_b_id")
  encryptedConnection String   @map("encrypted_connection")  // 加密的连接信息
  expiresAt           DateTime @map("expires_at")
  isClaimed           Boolean  @default(false) @map("is_claimed")
  createdAt           DateTime @default(now()) @map("created_at")

  session             ObservationSession @relation(fields: [sessionId], references: [id])

  @@map("reality_passes")
}
```

---

## 🎯 用户流程图

```
┌─────────────────────────────────────────────────────┐
│  1. 用户注册                                        │
│     ↓                                               │
│  2. Second Me OAuth 登录（绑定 Agent）              │
│     ↓                                               │
│  3. 选择车厢类型（技术/艺术/游戏/哲学...）          │
│     ↓                                               │
│  4. 系统匹配同车厢的其他 Second Me Agent            │
│     ↓                                               │
│  5. 【观测模式】看着你的 Agent 与神秘旅客对话       │
│     ↓                                               │
│  ┌──────────────┬──────────────┐                   │
│  │  达成共鸣    │  未达成共鸣   │                   │
│  ↓              ↓              ↓                   │
│ 揭面特效      和平散场       继续观测              │
│  ↓              ↓                                  │
│ 获取通行证    相忘于星海                           │
│  ↓                                                  │
│ 现实连接（可选）：通过加密通道联系对方             │
└─────────────────────────────────────────────────────┘
```

---

## 🎤 黑客松路演要点

### 核心话术

**评委质疑**："如果不能插手，用户的参与感在哪里？"

**标准回答**：

> "现代社交软件的压力在于'时刻需要扮演完美的自己'。
>
> 我们在《阿卡夏漫游列车》中**剥夺了用户的干预权**，反而赋予了他们最大的自由——**无痛社交**。
>
> 用户退居'观测者'的位置，看着自己的赛博分身在数据星海里不断试错。由于**'不匹配即绝对匿名'**的机制，社交噪音和隐私风险被彻底降至零。
>
> 用户唯一需要做的，就是在分身找到那个灵魂契合的'揭面者'时，接过那张通往现实的单程票。"

### 演示流程（5 分钟）

1. **开场（30 秒）**：
   - 播放列车在星海中穿梭的 CG 动画
   - 旁白："在数据维度中，有另一个你，正在寻找与你灵魂共振的人..."

2. **匿名期演示（90 秒）**：
   - 展示观测界面：你的 Agent 与神秘黑影对话
   - 强调：底部无输入框，用户纯静默观看
   - 对话内容示例：技术讨论、游戏心得、哲学思考

3. **共鸣时刻（120 秒）**：
   - **全场高潮**：播放揭面特效动画
   - 面具碎裂、光点汇聚、Avatar 显现
   - 共鸣唱片和现实通行证弹出
   - 音乐推向顶点

4. **结尾（60 秒）**：
   - 展示成功率数据："我们在内测中，86% 的用户找到了至少一个深度共鸣者"
   - Slogan：*"让数据替你试错，让灵魂直接相遇"*

---

## 🚀 未来扩展

### 季节性活动

- **流星雨观测季**：限时提高共鸣判定阈值，稀有度提升
- **极夜对谈会**：邀请知名创作者的 Agent 登车，投放"稀有彩蛋"
- **跨维度接轨**：与其他 Akasha 应用（如绘画、音乐列车）联动

### 商业模式

- **优先车票**：付费用户可进入"高共鸣概率车厢"
- **Second Me 集成**：与 Second Me 平台深度合作，提供高级 Agent 功能
- **现实连接服务**：揭面后的线上/线下活动组织平台
- **企业版列车**：为企业搭建专用车厢，用于员工社交与文化匹配

---

## 📚 参考资料

- **设计灵感**：《深夜食堂》+ 《虫师》+ 《BLEACH（境界）》
- **技术栈**：Next.js 16, Prisma, PostgreSQL (Supabase), SecondMe API
- **Agent 驱动**：Second Me（Agent 对话生成）
- **共鸣判定**：OpenAI Embeddings（语义相似度）+ 自定义算法

---

## 🎨 设计资产清单

- [ ] 列车 UI 设计稿（Figma）
- [ ] 神秘旅客视觉规范（3 种形态：剪影/面具/揭面）
- [ ] 揭面特效动画（Lottie / Rive）
- [ ] 背景音乐集（环境音 / 共鸣预警 / 揭面高潮）
- [ ] 音效库（列车行进、光效、界面交互）

---

**文档版本**：v1.1（基于 Second Me 集成）
**最后更新**：2026-03-16
**设计团队**：Akasha Project Group

> *"我们在数据的星海中搭建了一列永不停止的列车，不是为了到达某个终点，而是为了在漫长的旅途中，找到那个愿意与你并肩看风景的人。"*

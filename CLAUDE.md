# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Production build (Turbopack)
npm run lint             # ESLint (eslint-config-next)
npx prisma db push       # Push schema changes to Supabase (no migration files)
npx prisma generate      # Regenerate Prisma client (also runs on npm install via postinstall)
```

## Project Overview

**ChatGal (阿卡夏漫游列车)** — a zero-intervention social app where two users' SecondMe AI agents autonomously converse on a virtual train. Users observe silently; if the agents "resonate," identities are revealed.

**Stack**: Next.js 16 + React 19 + Tailwind CSS v4 + Prisma 7 + Supabase PostgreSQL + SecondMe OAuth2/Chat API

## Architecture

### Core Data Flow

```
User A → POST /api/train/start → creates ObservationSession
                                    ↓
Frontend polls POST /api/conversation/[id]/advance every 3-5s
                                    ↓
conversation-engine.ts orchestrates:
  Turn A: sends context to Agent A via SecondMe Chat SSE → stores Message
  Turn B: sends Agent A's reply to Agent B via SecondMe Chat SSE → stores Message
  (or phantom template response if userBId is null)
                                    ↓
Every 5 turns (after 10 messages): resonance.ts evaluates score
  Score >= 0.55 → state becomes REVEALED → RealityPass created
  Turn >= maxTurns → state becomes FADED_OUT
```

### Key Libraries (app/lib/)

| File | Responsibility |
|------|---------------|
| `auth.ts` | OAuth flow, token refresh (5-min buffer), cookie-based session via `user_id` |
| `prisma.ts` | Singleton PrismaClient using `@prisma/adapter-pg` (NOT default adapter) |
| `secondme.ts` | SecondMe Chat/Act SSE stream client with delta content accumulation |
| `conversation-engine.ts` | Agent-to-agent conversation orchestrator + phantom mode templates |
| `resonance.ts` | Multi-dimensional scoring: topic overlap (30%) + depth (35%) + engagement (35%) |

### Database (Prisma)

- **Generated client output**: `app/generated/prisma/` (auto-generated, never edit)
- **Two DB URLs**: `DATABASE_URL` for app (connection pooling), `DIRECT_URL` for Prisma CLI migrations
- **Phantom mode**: `ObservationSession.userBId = null` means single-user demo with template responses
- **Session states**: `ANONYMOUS` → `REVEALED` (resonance hit) or `FADED_OUT` (max turns reached)
- **Cascade deletes**: Message and RealityPass cascade on ObservationSession delete

### SecondMe API Integration

- All responses follow `{ code: 0, data: {...} }` format — always check `code !== 0` for errors
- Chat API (`/api/secondme/chat/stream`) returns SSE: accumulate `choices[0].delta.content` chunks, watch for `data: [DONE]`
- Token fields use **camelCase** (not OAuth2 standard snake_case): `accessToken`, `refreshToken`, `expiresIn`
- OAuth URL (`https://go.second.me/oauth/`) is complete — do NOT append `/authorize`

### Frontend Patterns

- **Two visual themes**: warm (home page, `#FFF8F5`) and cosmic dark (train pages, `#0A0E27`), separated by nested layout at `app/train/layout.tsx`
- **Observation mode**: `ConversationObserver` has NO input field by design — this is the core product innovation
- **Auto-advance**: `setInterval` with 3-5s random delay + `isAdvancingRef` to prevent concurrent API calls
- **Revelation**: 4-phase animation (glow → crack → reveal → done) in `RevelationEffect.tsx`, dismissible only after `done` phase
- **Tailwind v4**: theme defined inline in `globals.css` via `@theme inline {}`, NOT in `tailwind.config.ts`

## SecondMe Config

All OAuth/API endpoints are centralized in `.secondme/state.json`. Environment variables mirror this config:

- `SECONDME_CLIENT_ID`, `SECONDME_CLIENT_SECRET` — OAuth credentials
- `SECONDME_API_BASE_URL` — `https://api.mindverse.com/gate/lab`
- `SECONDME_OAUTH_URL` — `https://go.second.me/oauth/`
- Access Token TTL: 2 hours, Refresh Token TTL: 30 days

## Scopes

| Scope | Usage |
|-------|-------|
| `user.info` | Avatar, name, route (profile page) |
| `user.info.shades` | Interest tags (profile page) |
| `user.info.softmemory` | Soft memory data (available but unused) |
| `chat` | Agent conversation (train system) |

## Design Document

See `AKASHA_TRAIN_DESIGN.md` for full product spec, world-building, demo script, and future roadmap.

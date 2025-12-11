# Development Environment Setup

This document provides instructions for setting up the Agent Studio development environment.

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (installed globally)
- Git
- VS Code with Cursor extension (recommended)

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase and OpenAI credentials.

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
Agent/
├── apps/
│   └── web/              # Next.js 14+ App Router application
├── packages/
│   ├── ui/              # Shared UI components (shadcn/ui)
│   ├── core/            # Business logic, compiler, lint, scoring
│   └── db/              # Database client, types, migrations
├── tests/
│   ├── e2e/             # Playwright E2E tests
│   └── unit/            # Vitest unit tests
└── package.json         # Root workspace configuration
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint on all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm format` - Format code with Prettier

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - Your OpenAI API key (for AI features)
- `AI_PROVIDER` - AI provider (default: `openai`)

## Next Steps

1. Set up your Supabase project (see [`../supabase/SUPABASE_SETUP_COMPLETE.md`](../supabase/SUPABASE_SETUP_COMPLETE.md))
2. Configure API keys (see [`../api-keys/API_KEYS_SETUP.md`](../api-keys/API_KEYS_SETUP.md))
3. Configure database schema (see [`../implementation/IMPLEMENTATION_PLAN.md`](../implementation/IMPLEMENTATION_PLAN.md) Phase 1.2)
4. Set up authentication (Phase 1.3)
5. Start building features according to the [implementation plan](../implementation/IMPLEMENTATION_PLAN.md)

## Troubleshooting

### Port 3000 already in use
Change the port in `apps/web/package.json`:
```json
"dev": "next dev -p 3001"
```

### TypeScript errors
Run `pnpm type-check` to see all type errors across packages.

### ESLint errors
Run `pnpm lint` to see all linting issues.


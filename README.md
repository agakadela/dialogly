# Dialogly – Real‑Time AI Voice Tutor

Dialogly is a full‑stack learning platform where students talk to AI “companions” in real time.  
Each companion is a configurable voice tutor (subject, topic, voice, style, duration) powered by OpenAI via Vapi, with authentication and subscriptions handled by Clerk and data stored in Supabase.

The goal of the project is to showcase a realistic, production‑style Next.js 16 app that combines:
auth, billing gates, server actions, typed data access, and a small but meaningful test suite.

---

## Features

- **Configurable AI companions**
  - Create companions with a title, subject, topic, voice and style (`/companions/new`).
  - Per‑user creation limits using Clerk feature flags / plan metadata (`newCompanionPermissions`).
- **Real‑time voice sessions**
  - Uses Vapi + ElevenLabs for streaming voice; OpenAI (`gpt-4`) for tutoring logic.
  - Companion behavior is configured via `configureAssistant` in `lib/utils.ts`.
  - Session history persisted in Supabase (`session_history` table).
- **Personal learning dashboard**
  - `My Journey` (`/my-journey`) shows:
    - lessons completed, companions created,
    - bookmarked companions,
    - recent sessions.
- **Bookmarking & library**
  - Browse all companions with search and subject filter (`/companions`).
  - Bookmark/unbookmark lessons; bookmarks are user‑scoped (`bookmarks` table).
  - Home page highlights “Popular Companions” and “Recently Completed Sessions”.
- **Auth & subscriptions**
  - Clerk authentication with sign‑in route (`/sign-in/[[...sign-in]]`).
  - Subscription upsell and pricing via `@clerk/nextjs` `PricingTable` (`/subscription`).
- **Solid testing setup**
  - Vitest + jsdom with tests grouped under `tests/`.
  - Coverage for utilities, server actions and key UI behavior (search, filters, lists).

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript / React 19
- **Auth & billing**: Clerk (`@clerk/nextjs`, `PricingTable`)
- **Database**: Supabase (`@supabase/supabase-js`) – Postgres + Row Level Security
- **Voice & AI**: Vapi Web SDK (`@vapi-ai/web`) + OpenAI (`gpt-4`) + ElevenLabs voices
- **Styling**:
  - Tailwind CSS v4 utility classes
  - Custom components inspired by shadcn/ui (see `components/ui/*`)
  - `Bricolage Grotesque` via `next/font`
- **Tooling**:
  - Vitest for unit/component tests
  - Testing Library (`@testing-library/react`, `@testing-library/jest-dom`)
  - ESLint + TypeScript strict mode

---

## Project Structure

Only the most relevant pieces:

- `app/`
  - `layout.tsx` – root layout, global font, `Navbar`, `ClerkProvider`.
  - `page.tsx` – home: popular companions + recent sessions + CTA.
  - `companions/`
    - `page.tsx` – searchable, filterable companion library.
    - `[id]/page.tsx` – single companion session view + `CompanionComponent`.
    - `new/page.tsx` – “Build Your Companion” form, gated by `newCompanionPermissions`.
  - `my-journey/page.tsx` – personal dashboard with accordion sections for bookmarks, sessions, and created companions.
  - `sign-in/[[...sign-in]]/page.tsx` – Clerk hosted sign‑in.
  - `subscription/page.tsx` – subscription / upgrade flow.
- `components/`
  - `companion-card.tsx` – companion summary card + bookmark button.
  - `companions-list.tsx` – table listing of companions used across views.
  - `companion-form.tsx` – `react-hook-form` + `zod` schema for creating companions.
  - `companion-component.tsx` – Vapi integration + transcript UI for live sessions.
  - `search-input.tsx`, `subject-filter.tsx` – URL‑driven filtering.
  - `navbar.tsx`, `nav-items.tsx`, `cta.tsx`, `ui/*` – layout and primitives.
- `lib/`
  - `actions/companion.actions.ts` – server actions for CRUD‑like operations:
    - create companion, list with filters, get by id,
    - bookmark/unbookmark,
    - session history, user companions,
    - permission logic based on Clerk plan/features.
  - `supabase.ts` – Supabase client wired to Clerk auth tokens.
  - `vapi.sdk.ts` – initialized Vapi Web SDK client.
  - `utils.ts` – Tailwind `cn`, subject color mapping, Vapi assistant configuration.
- `constants/`
  - `index.ts` – subjects, subject colors, call status enum, voice IDs.
- `types/`
  - `index.d.ts` – global TypeScript types for `Companion`, `Subject`, and related forms.
- `tests/`
  - `lib/*` – unit tests for utilities and server actions.
  - `components/*` – jsdom + Testing Library specs for search, filtering, and list rendering.

---

## Environment Variables

Create a `.env.local` file at the project root. At minimum, you’ll need:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Vapi (Web SDK)
NEXT_PUBLIC_VAPI_WEB_TOKEN=...

# Clerk (see Clerk docs for full list)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

Follow the official Clerk and Supabase docs to provision a project, configure RLS policies, and issue keys.

---

## Running the App

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

Build and run in production mode:

```bash
npm run build
npm start
```

Lint the codebase:

```bash
npm run lint
```

---

## Testing

This project uses [Vitest](https://vitest.dev) with jsdom and Testing Library.

- Test entrypoint: `npm test`
- Configuration: `vitest.config.ts`
- Setup file: `tests/setup.ts`
- Test files: colocated in `tests/**` and use the `@` alias to reference source files.

The existing tests focus on:

- `lib/utils.ts` – class merging, subject → color mapping, and assistant configuration.
- `lib/actions/companion.actions.ts` – `newCompanionPermissions` behavior with mocked Clerk + Supabase.
- `components/subject-filter.tsx`, `components/search-input.tsx` – URL‑driven filters & debounce logic.
- `components/companions-list.tsx` – empty state and duration rendering.

---

## Implementation Notes

- **Server Actions**  
  Business logic for companions, bookmarks and history lives in server actions under `lib/actions`. This keeps UI components lean and ensures data access always runs on the server.

- **Clerk + Supabase integration**  
  `createSupabaseClient` injects a Clerk access token into Supabase, so authorization is consistent across the app and database (and ready for RLS).

- **Rate limiting companion creation**  
  `newCompanionPermissions` inspects Clerk plan/feature flags:

  - `plan: 'pro'` bypasses limits,
  - or feature flags like `10_companion_limit` / `3_companion_limit` cap how many companions a user can create.

- **DX / Testing**  
  Tests are intentionally small, fast, and focused on observable behavior (URL changes, rendered text, branching logic) rather than implementation details. The stack is set up so more specs can be added with minimal friction.

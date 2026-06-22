# OpenSource Impact Tracker

OpenSource Impact Tracker is being developed into an evidence-first developer
impact profile platform.

Developers will be able to connect GitHub, import public GitHub work, add
non-GitHub impact items such as articles, talks, meetups, mentoring,
documentation, tutorials, podcasts, research, and community work, then publish a
clean public profile backed by evidence links.

The product is not a vanity score generator or a generic GitHub statistics
dashboard. It should answer: "What impact has this developer made?"

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest, React Testing Library, and jsdom
- ESLint with the Next.js config

## Current MVP Status

Implemented:

- public landing page foundation
- placeholder dashboard route
- placeholder public profile route
- reusable UI cards, badges, and empty states
- GitHub OAuth route scaffolding
- first-login user/profile bootstrap helpers
- authenticated GitHub repository sync foundation
- public GitHub lookup prototype retained in `src/components/impact/`

Planned next:

- PostgreSQL and Prisma persistence
- developer profile editing
- manual impact items
- evidence links and verification labels
- polished public profile rendering

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful local routes:

- `/` - product landing page
- `/dashboard` - placeholder authenticated dashboard surface
- `/demo-profile` - placeholder public developer impact profile

## Database Setup

The persistence foundation uses Prisma with PostgreSQL. Copy the example
environment file and fill in local values:

```bash
cp .env.example .env
```

Generate the Prisma client after dependency installation or schema changes:

```bash
npm run prisma:generate
```

When a local PostgreSQL database is available, run migrations and seed demo
data:

```bash
npm run db:migrate
npm run db:seed
```

## Existing GitHub Prototype

The repository still contains the original public GitHub lookup prototype:

- `src/components/impact/ImpactDashboard.tsx`
- `src/app/api/contributions/route.ts`
- `src/lib/github/`

This code is useful as a starting point for the authenticated GitHub repository
sync flow, but it no longer defines the full product scope.

## Product Principles

- Evidence first: major claims should support a URL, source, or proof item.
- Honest verification: distinguish GitHub verified, evidence provided,
  self-reported, pending, and rejected evidence.
- No fake developer score as the core feature.
- Public profiles should be clean, technical, credible, responsive, and
  shareable.

## Planned Environment Variables

The current foundation phase does not require local secrets. Later auth and
database phases are expected to add:

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Do not commit real `.env` files or OAuth secrets.

For local GitHub OAuth, create a GitHub OAuth app with this callback URL:

```text
http://localhost:3000/api/auth/callback/github
```

## Available Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

`npm test` covers username parsing, the GitHub profile search UI, dashboard
empty states, public profile placeholders, and domain validation.

## MVP Scope

Included:

- public landing page
- GitHub login or connection
- developer profile creation and editing
- public developer profile page
- GitHub repository import
- manual impact item creation
- evidence links for impact items
- featured impact items
- dashboard home and management pages
- impact timeline
- responsive UI
- clear empty, loading, and error states
- README and verification updates

Deferred:

- public developer directory and search
- follows, reactions, comments, endorsements, and notifications
- private repository import
- background sync jobs and webhooks
- paid APIs or AI-generated impact claims

## Final Verification Checklist

- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.
- `npm run prisma:generate` passes with a valid `DATABASE_URL`.
- Landing page explains the evidence-first impact profile product.
- Dashboard placeholder shows profile, GitHub sync, impact, and activity empty states.
- Public profile placeholder shows required profile sections and empty states.
- README instructions match the current MVP direction.

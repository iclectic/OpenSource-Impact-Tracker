# OpenSource Impact Tracker

A focused GitHub contribution lookup app for open-source activity.

Enter a GitHub profile URL or username and the app pulls public open-source contribution signals for that user:

- public repositories
- source repositories vs forks
- authored pull requests
- authored issues
- repository stars, forks, languages, and links

The app uses public GitHub REST API endpoints only. It does not require paid APIs, secrets, authentication, a database, or a GitHub token.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest, React Testing Library, and jsdom
- ESLint with the Next.js config

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

## How It Works

The home page has one primary workflow:

1. Paste a GitHub profile URL, such as `https://github.com/octocat`, or enter a username.
2. Click **Search**.
3. Review public repositories, authored pull requests, authored issues, and summary totals.

The lookup route lives at `src/app/api/contributions/route.ts`.

GitHub-specific parsing and API normalization live in `src/lib/github/`.

## Public Data Limits

Because the MVP intentionally avoids secrets and authentication:

- private contributions are not included
- organization-private work is not included
- GitHub search rate limits apply
- search results are capped by GitHub
- the app displays the first page of recent public pull requests and issues

These limits are shown in the UI after a successful lookup.

## Available Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
```

`npm test` covers username parsing and the GitHub profile search UI.

## MVP Scope

Included:

- GitHub profile URL or username input
- Public GitHub user lookup
- Public repository lookup
- Public authored pull request lookup
- Public authored issue lookup
- Contribution summary cards
- Public-data limitation notes
- Responsive UI

Deferred:

- GitHub OAuth or personal access tokens
- private contribution history
- complete pagination across every result
- commit-by-commit contribution graph reconstruction
- database persistence
- saved searches
- paid APIs or AI enrichment

## Final Verification Checklist

- `npm run lint` passes.
- `npm test` passes.
- `npm run build` completes with no required environment variables.
- The home page is centered on GitHub profile contribution lookup.
- The app accepts a GitHub profile URL and calls the local contribution API.
- Successful lookup results show repositories, pull requests, issues, and totals.
- Failed lookup results show an accessible error.

---
title: "feat: Build GitHub open-source contribution tracker MVP"
type: "feat"
date: "2026-06-22"
---

# feat: Build GitHub Open-Source Contribution Tracker MVP

## Summary

Build a clean MVP focused strictly on open-source contributions by GitHub user. The app should let someone enter a GitHub profile URL or username, click search, and see a public contribution summary: profile, public repositories, authored pull requests, authored issues, repository metadata, and evidence links back to GitHub.

The MVP uses only free public GitHub endpoints. It does not require paid APIs, databases, authentication, personal access tokens, or secrets.

## Current Stack

- **Framework:** Next.js App Router.
- **Runtime UI:** React with TypeScript.
- **Styling:** Tailwind CSS.
- **Quality tooling:** ESLint, Vitest, React Testing Library, jsdom.
- **Data source:** Public GitHub REST API through a server route.

## Existing Surface

- A home page renders the tracker UI.
- A server API route parses GitHub profile input and fetches contribution data.
- Client-side tests cover the search form, success rendering, and error rendering.
- GitHub profile parsing has unit tests.
- README documents the GitHub-only scope and verification commands.

## Requirements

- R1. The app is strictly about open-source contributions from GitHub public data.
- R2. Users can enter a GitHub profile URL or username and run a lookup.
- R3. The app fetches public profile, repository, authored pull request, and authored issue data without secrets.
- R4. Results include clear GitHub evidence links.
- R5. The UI communicates public-data limits instead of implying full private or historical coverage.
- R6. Automated checks cover parsing, API-shaping logic, and representative UI behavior.
- R7. README explains local setup, no-secret data source, limitations, and final verification.

## Smallest Useful MVP

1. Search input for GitHub profile URL or username.
2. Public profile summary with avatar, name, bio, and profile link.
3. Metric cards for public repositories, source repositories, forks, authored pull requests, authored issues, and stars.
4. Public repository list with repository links, language, fork/source status, stars, forks, open issues, and update date.
5. Authored pull request list with links to GitHub.
6. Authored issue list with links to GitHub.
7. Public-data limitation notices for unauthenticated lookup, pagination, and GitHub search caps.
8. Tests plus README and final verification checklist.

## Phases

### Phase 1: GitHub Lookup Foundation

- Add username/profile URL parsing.
- Add typed GitHub contribution models.
- Add server-side GitHub client for public profile, repositories, PR search, and issue search.
- Add API route with validation and rate-limit/user-not-found errors.
- Add unit tests for profile parsing and contribution mapping.

### Phase 2: User-Facing Search Experience

- Replace starter UI with the GitHub lookup page.
- Add search form, loading state, error state, and empty state.
- Render profile, summary cards, public repositories, authored PRs, authored issues, and GitHub links.
- Make public-data limitations visible in the result view.

### Phase 3: Documentation and Verification

- Update README to describe the strict GitHub open-source scope.
- Document no-secret operation and known public API limits.
- Run lint, tests, and production build.
- Review that old curated-data language is removed from app and docs.

## Deferred Work

- GitHub authentication or personal access tokens.
- Private contribution tracking.
- Complete historical pagination beyond the first MVP page.
- Contribution calendars, commit-level analysis, and GraphQL enrichment.
- In-app saving, accounts, databases, exports, or shareable reports.
- Paid APIs, analytics tools, or AI summarization.

## Final Verification Checklist

- `npm run lint` passes.
- `npm test` passes.
- `npm run build` passes.
- The home page no longer shows create-next-app starter content.
- Searching a valid GitHub profile URL shows public repositories, authored PRs, and authored issues.
- Invalid input shows a useful validation error.
- Missing users and rate limits show useful API errors.
- Every rendered contribution item links back to GitHub evidence.
- README states that the MVP uses public GitHub data only and requires no secrets.

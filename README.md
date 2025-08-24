# Hacker News Scraper — Design and Decisions

A small Next.js app that scrapes the first page of Hacker News and lets you analyze the first 30 entries by title length and engagement. It focuses on correctness, clarity, and testability under interview-like constraints.

### What was asked
- Scrape the first 30 entries from `https://news.ycombinator.com/`.
- Keep only: number, title, points, and number of comments.
- Provide two filters:
  - Titles with more than five words → sort by comments (descending).
  - Titles with five or fewer words → sort by points (descending).
- When counting words, consider only space-separated words and ignore symbols. Example: “This is - a self-explained example” has 5 words.
- Build for the web, with automated tests and clean, maintainable code.

---

## Why these choices

### Framework: Next.js 15 (App Router)
- **Server API route for scraping**: Scraping runs server-side in `app/api/scrape/route.ts`, avoiding CORS and keeping parsing off the client bundle.
- **Simple client page**: The UI in `app/page.tsx` calls the API and renders results, which keeps concerns separated and reduces complexity.

### Language: TypeScript
- **Type safety as documentation**: The core data shape lives in `src/lib/types.ts` and travels through API, logic, and components.
- **Safer refactoring**: Enables quick changes without breaking invariants.

### Scraping library: Cheerio
- **Fast HTML parsing** without a headless browser. The HN markup is stable and easily queryable (`.athing`, `.titleline`, `.score`). Puppeteer/Playwright would be heavier and unnecessary here.

### UI: React 19 + Tailwind CSS (v4 plugin)
- **React** for a small, composable UI (buttons + table) that maps cleanly to state.
- **Tailwind** for compact, consistent styling with no bespoke CSS system work.

### Tests: Jest + React Testing Library
- **Unit coverage** for word counting and filtering logic in `src/lib/filters.ts`.
- **Component tests** for `FilterControls` behavior and accessibility hints.
- **API route logic tests** validate the filter flow without hitting the network.

### Package manager: pnpm
- **Fast and deterministic** installs suitable for an interview project; works fine with Next 15 and TypeScript 5.

---

## Architecture overview

Flow:
1. The client renders `app/page.tsx` and fetches `/api/scrape?filter=<all|long|short>`.
2. The server route fetches the HN homepage, parses entries, and applies the requested filter.
3. The client renders a table with the resulting entries and allows switching filters.

Key decisions and trade‑offs:
- **CSR for the page, server work in the API**: The data is dynamic and should be fetched on interaction; keeping parsing server-side avoids CORS and trims client bundle weight.
- **Server-side filtering**: Ensures consistent logic across clients and supports future caching at the API layer.
- **No database**: The exercise is read-only; results are transient and do not need persistence.
- **30 entries assumption**: HN’s first page contains 30 `.athing` rows. The scraper consumes the first page only, which yields the required 30.

---

## How scraping works

- Selector strategy (in `app/api/scrape/route.ts`):
  - Each story is an `.athing` row with a companion details row.
  - Title: `.titleline a` (first link).
  - Points: `.score` text → digits only → integer.
  - Comments: last link text in the details row (can be “discuss”) → digits only → integer (falls back to 0).
- The “number” is the 1-based order on the page (stable for the first page use case).

---

## Word counting and filters (the core of the exercise)

Location: `src/lib/filters.ts`.

- **Counting**: `countWords(title)`
  - Replace symbols with spaces but preserve hyphens in words.
  - Normalize spaces, drop empty tokens and standalone hyphens.
  - Count the remaining tokens.
- **Why this approach**
  - Matches the prompt’s rule (“consider only the spaced words and exclude any symbols”) and the given example.
  - Hyphenated tokens like `React-TypeScript-Project` count as one word, which is consistent with “spaced words”.
- **Filtering**: `getFilteredData(entries, filterType)`
  - `long`: titles with > 5 words, sorted by `comments` desc.
  - `short`: titles with ≤ 5 words, sorted by `points` desc.
  - `all`: no filtering.

Examples verified by tests:
- "This is - a self-explained example" → 5 words.
- "React-TypeScript-Project" → 1 word.
- "API & REST @#$%^&*()" → 2 words.

---

## Project structure

```
hn-scraper/
├── app/
│   ├── api/
│   │   └── scrape/route.ts         # Server endpoint: fetch + parse + filter
│   ├── components/
│   │   ├── scrapeTable.tsx         # Read-only table renderer
│   │   └── FilterControls.tsx      # Filter buttons + status hint
│   └── page.tsx                    # Client page orchestrating fetch + render
├── src/
│   ├── lib/
│   │   ├── filters.ts              # Word counting + filter/sort logic
│   │   └── types.ts                # Shared Entry type
│   └── __tests__/                  # Jest + RTL tests
├── jest.config.ts                  # ts-jest config (jsdom)
├── tsconfig.json                   # Single TS config for app and tests
└── package.json                    # Scripts and dependencies
```

---

## Running the app

Prerequisites: Node 18+, pnpm.

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` and toggle filters:
- All entries
- Long titles (>5 words) → sorted by comments
- Short titles (≤5 words) → sorted by points

---

## Running tests

```bash
pnpm test
pnpm test:watch
```

What’s covered:
- Unit tests for `countWords`, filter and sort behavior.
- Component tests for `FilterControls` interactions and accessibility hints.
- API route logic tests built around `getFilteredData`.

---

## Performance and reliability

- **Server-side parsing** keeps the client lean and removes CORS issues.
- **Cheerio over headless browsers** for speed and lower resource usage.
- **Graceful degradation**: If points/comments are missing (e.g., “discuss”), they become `0`.

Potential improvements if productized:
- Add API caching with short TTL to shield HN and speed repeat queries.
- Add retry/backoff for upstream fetch failures.
- Add schema validation on parsed rows to catch markup changes early.

---

## Known limitations

- Assumes the first page structure of HN (30 `.athing` rows). If HN’s markup changes, selectors will need updating.
- No persistence or pagination beyond the first page (kept intentionally minimal for the exercise scope).

---

## What I’d do with more time

- Add lightweight request caching and conditional revalidation.
- Track parsing anomalies and surfacing them in the UI.
- Add e2e tests against a local HTML fixture to simulate HN changes.
- Extend filtering controls to show active sort and counts inline in the table.

---

## Versions

- Next.js 15.5.0, React 19.1.0, TypeScript 5
- Cheerio 1.1, Jest 30, RTL 16
- Tailwind v4 (PostCSS plugin)

---

Built for clarity and correctness under time constraints, with a focus on explicit decisions and trade‑offs.

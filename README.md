# Hotel PLP stack comparison

A minimal monorepo for building the same hotel PLP and PDP with two current React stacks:

- `apps/next`: Next.js App Router
- `apps/react-router`: React Router framework mode (SSR enabled)
- `packages/ui`: framework-neutral components, API client, types, and date logic

Both apps expose the same Tehran hotel PLP at `/`:

- With no query string, today's and tomorrow's dates (in `Asia/Tehran`) are sent
  to the hotel API and the complete page is server-rendered for SEO.
- With valid `startDate` and `endDate` query parameters, the shared client
  boundary fetches the dated result after hydration. Both server route adapters
  skip their hotel request, so dated hotel content is not server-rendered.
- Next.js caches and revalidates its server-side default-date API request every
  hour.

Example dated URL: `/?startDate=2026-09-10&endDate=2026-09-11`.

Hotel cards navigate client-side to the shared PDP at `/hotels/:hotelTitle`.
The PDP follows the same rendering rule: undated direct requests include
server-rendered hotel details, while dated requests fetch the detail API after
hydration. Date parameters are preserved during PLP → PDP navigation.

In the React Router app, route `loader`s are reserved for initial document SSR.
Both PLP and PDP export `clientLoader`s that call the hotel APIs directly for
subsequent router navigations, including date changes and PLP → PDP transitions.

## Commands

Use Node 24 (`nvm use` will read the included `.nvmrc`), then:

```bash
pnpm install
pnpm dev
```

Run one app at a time with `pnpm dev:next` or `pnpm dev:react-router`.

Build and type-check the entire workspace with `pnpm build` and `pnpm typecheck`.

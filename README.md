# Inversora

Inversora is an Expo / React Native app that helps beginner investors understand and compare index funds through an educational, visual, AI-assisted experience.

The MVP does not execute investments and does not replace a financial advisor. Its goal is to help beginner users understand the basics, compare index funds with better context, and read clear explanations about rankings, fees, risk, and historical performance.

**Project documentation:** see [docs/README.md](./docs/README.md) for product rules, user stories index, scoring spec, and architecture map.

## Product Principle

**Educate first, compare later.**

The experience should guide users before showing complex tables or rankings. Inversora should explain what an index fund is, how fees work, what risk means, why time horizon matters, and why past performance does not guarantee future results.

## MVP Scope

Included:

- Initial index-fund dashboard.
- "I want to learn" educational mode.
- Basic educational profiling without registration.
- Index-fund catalog.
- Category rankings based on objective criteria.
- Summary fund detail screen.
- Inversora Assistant explanations.
- Search by name, ISIN, or category.
- Basic filters for fee, risk, category, and historical performance.
- Basic fund comparison (up to two funds).
- Compound-interest calculator with educational scenarios.
- Local favorites stored on the device/browser.
- Visible legal notices and risk messages.

Excluded from the MVP:

- Registration, login, and personal accounts.
- Buy or sell order execution.
- Direct broker connections.
- Real portfolio custody or management.
- Legally valid personalized financial recommendations.
- ETFs, stocks, crypto, pension plans, and actively managed funds.
- Advanced administration panel.

## Current Stack

- Expo SDK 57.
- React Native 0.86.
- React 19.
- TypeScript.
- Expo Router.
- Planned client state: Zustand.
- Planned validation: Zod.
- **Backend oficial:** [inversora-api](https://github.com/) (NestJS + PostgreSQL + Prisma). Ver `inversora-api/docs/README.md`.
- **IA explicativa:** servicio de asistente en backend; nunca API key en el cliente.

Before changing Expo-related code, read the versioned documentation:

https://docs.expo.dev/versions/v57.0.0/

## Planned Routes

- `/` Initial dashboard.
- `/learn` Educational mode.
- `/funds` Fund catalog.
- `/funds/[isin]` Fund detail.
- `/compare` Comparison.
- `/favorites` Local favorites.
- `/calculator` Compound-interest calculator.
- `/legal` Legal notices and disclaimers.

## Architecture

The project follows a feature-first structure inspired by Clean Architecture:

```text
src/
  app/        Thin Expo Router route layer.
  shared/     Reusable UI, theme, constants, hooks, types, and utilities.
  features/   Product feature modules.
  core/       Cross-cutting infrastructure: API, config, errors, storage, and query.
```

Practical rules:

- `src/app` should only connect routes to feature screens.
- `features/*` contains screens, components, hooks, models, services, and mocks owned by that feature.
- `shared/*` contains reusable building blocks without feature-specific business knowledge.
- `core/*` contains cross-cutting infrastructure and should not depend on UI.
- Avoid direct dependencies between features unless they go through shared contracts or `core` services.

## Inversora Assistant

The Inversora Assistant is an educational explanation layer. It can translate financial concepts into plain language, explain why a fund appears highlighted, and help users navigate the app.

Key rules:

- It does not calculate rankings.
- It does not alter scoring.
- It does not invent financial data.
- It does not issue direct buy or sell recommendations.
- It must use prudent, educational language.
- It must make clear that Inversora is an informational tool, not personalized financial advice.

## Scoring And Data

Rankings must be deterministic and explainable. AI can explain results, but the scoring engine must rely on objective criteria.

For the MVP product spec (weights, labels, benchmark grouping, and data-quality rules), see [docs/product/scoring.md](./docs/product/scoring.md).

Financial data must show its update date and warnings when it is incomplete, stale, or not comparable.

## Development

Package manager: **pnpm** (`pnpm-lock.yaml`). Do not commit `package-lock.json`.

Install dependencies (also configures Git hooks via Husky):

```bash
corepack enable
pnpm install
```

Start Expo:

```bash
pnpm start
```

Start web:

```bash
pnpm run web
```

Start Android:

```bash
pnpm run android
```

Start iOS:

```bash
pnpm run ios
```

Run lint:

```bash
pnpm run lint
```

## Local API (development)

To load real catalog and fund detail data from `inversora-api`, copy `.env.example` to `.env`, set `EXPO_PUBLIC_API_URL` for your emulator or device, start the backend on port 3000, then restart Expo.

```bash
pnpm run api:url          # print suggested URLs (iOS, Android, LAN, web)
pnpm run api:url -- --lan # physical device on Wi‑Fi
```

Expo web requires CORS on the API (`CORS_ORIGINS` in staging). Native simulators and devices only need a reachable URL.

Catalog filters (HU-07) are sent to `GET /funds` where the API supports them; risk level is filtered client-side.

Full setup: [docs/development-api.md](./docs/development-api.md)

## UX Criteria

- Mobile-first.
- Cognitive accessibility for beginner users.
- Progressive disclosure of technical financial details.
- Clear, prudent copy with limited jargon.
- Explainable rankings, not absolute recommendations.
- Visible notices about risk, past performance, and lack of personalized advice.
- Do not gamify real investment decisions.

## Privacy

The MVP must not store personal data. Educational profiles and favorites should be local or anonymous. Any analytics must be minimal, anonymous, and focused on validating MVP usage.

## License

**Proprietary — all rights reserved.**

This repository is not open source. Use, copying, modification, distribution,
or reuse of the code by third parties is not permitted without written
permission from the copyright holder.

See [LICENSE.md](./LICENSE.md) for the full legal text.

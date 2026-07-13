# Agent Instructions: Inversora

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

This project uses Expo SDK 57. Do not rely on older Expo or React Native assumptions when changing app code, routing, config, native modules, build behavior, or package versions.

## Product

Inversora is an Expo / React Native app that helps beginner users understand and compare index funds.

Guiding principle:

**Educate first, compare later.**

Onboarding policy (platform-specific): native iOS/Android users must complete the profiling questionnaire (`/learn?mode=initial`) on first launch, with an explicit **Omitir** escape in the header; web users land on the dashboard with educational invitations only (no gate). See [docs/product/problem-statement.md](docs/product/problem-statement.md) §5.2.1.

The MVP must prioritize clarity, guided learning, responsible comparison, and explainable rankings. It must not behave like a broker, roboadvisor, or personalized financial advisor.

## MVP Functional Scope

Build toward these surfaces:

- Initial dashboard.
- "I want to learn" educational mode.
- Basic educational profiling without registration.
- Index-fund catalog.
- Basic search and filters.
- Category rankings.
- Summary fund detail screen.
- Inversora Assistant as an educational layer.
- Fund comparison.
- Compound-interest calculator.
- Local favorites.
- Legal and risk notices.

Do not implement in the MVP unless explicitly requested:

- Login, registration, or personal accounts.
- Buy/sell operations.
- Broker connections.
- Real portfolio custody or management.
- Legally valid personalized financial recommendations.
- ETFs, stocks, crypto, pension plans, or actively managed funds.
- Advanced administration panel.

## Planned Architecture

- Expo SDK 57.
- React Native 0.86.
- React 19.
- TypeScript.
- Expo Router.
- Backend oficial: **inversora-api** (NestJS + PostgreSQL + Prisma). Ver `inversora-api/docs/README.md`.
- IA explicativa: servicio de asistente en backend (OpenAI / agente Python); nunca API key en cliente.
- Zustand for client state when needed.
- Zod for typed validation when needed.

## Documentation source of truth

1. **Documento oficial** (*Documentación de Proyecto: Inversora*, v1.0) — negocio, HUs, reglas RN.
2. **`docs/product/*`** en este repo — resumen estable alineado al doc oficial (§2, §3, §4…).
3. **`inversora-api/docs/*`** — propósito backend, contratos HTTP, scoring RN-04, analytics.
4. **`docs/architecture/*`** — decisiones técnicas y mapa de implementación de la app.

Ante conflicto, prevalece el documento oficial. No implementar Supabase Edge Functions como backend; usar `inversora-api`.

Code structure:

```text
src/
  app/
  shared/
    components/
    theme/
    constants/
    utils/
    hooks/
    types/
  features/
    funds/
    onboarding/
    comparison/
    calculator/
    assistant/
  core/
    api/
    config/
    errors/
    storage/
    query/
```

Layer rules:

- `src/app` must remain a thin Expo Router layer.
- Screens live in `features/*/screens`.
- Shared components live in `shared/components`.
- Theme and visual tokens live in `shared/theme`.
- Reusable hooks live in `shared/hooks`; domain hooks live inside their feature.
- Domain services live in `features/*/services`.
- Cross-cutting infrastructure lives in `core`.
- Avoid direct imports from one feature into another feature.

Target routes:

- `/`
- `/learn`
- `/funds`
- `/funds/[isin]`
- `/compare`
- `/favorites`
- `/calculator`
- `/legal`

## Agent Working Rules

- Use `docs/README.md` for product and architecture docs; `README.md` and `package.json` for quick onboarding and scripts.
- Verification step for changes: run `pnpm run test:ci` before considering work complete (also enforced by the Husky pre-push hook after `pnpm install`).
- `pnpm run quality` is an alias for `pnpm run test:ci` (typecheck, lint with zero warnings, unit tests, script tests, Expo config).
- Pre-commit runs ESLint with `--fix` on staged files via lint-staged.
- Commit-msg runs commitlint ([Conventional Commits](https://www.conventionalcommits.org/)) via Husky after `pnpm install`.
- CI also runs `build:web:ci` and `verify:prebuild`. EAS preview Android builds run via `.eas/workflows/preview-android.yml` on push to `main`.
- Keep `src/app` thin. Add screens and feature logic under `src/features/*`, and place reusable UI/theme/helpers under `src/shared/*` or `src/core/*`.
- Do not introduce broker flows, account management, real portfolio actions, or personalized financial advice into the MVP.
- If a change touches Expo, React Native, routing, or native config, consult the exact Expo SDK 57 docs first instead of relying on older assumptions.
- Catalog filter **draft** UI must use in-memory data (`useCatalogFundsIndex` + `filterCatalogFunds`); do not call `GET /funds` per toggle. See [docs/architecture/catalog-client-side-filtering.md](docs/architecture/catalog-client-side-filtering.md) and `.cursor/rules/catalog-client-side-filtering.mdc`.

## Styling (NativeWind / Tailwind híbrido)

- Default: `className` with semantic tokens (`bg-surface`, `text-text-secondary`, `gap-md`, `rounded-card`, `shadow-card`).
- **Whitelist:** precision components use `StyleSheet` — see `docs/architecture/tailwind-stylesheet-whitelist.md` and `src/shared/nativewind/stylesheet-whitelist.ts`.
- Compose classes with `cn()` from `@/shared/utils/cn`.
- Variant maps live in `src/shared/nativewind/theme-classes.ts`.
- Do not add `StyleSheet.create` outside the whitelist without documenting it.
- `useTheme()` for third-party APIs (icon colors, `TextInput`, charts).
- MVP uses light theme only (`userInterfaceStyle: light`).
- After token JSON changes, run `pnpm run generate:theme`.

## AI And Finance Rules

The Inversora Assistant:

- Explains concepts and results in plain language.
- Does not calculate or modify rankings.
- Does not invent metrics, ISINs, returns, fees, or benchmarks.
- Does not recommend buying, selling, or subscribing to a fund.
- Does not present favorites as recommendations.
- Must use prudent, educational language.

Every sensitive surface must make clear that:

- Inversora is informational and educational.
- There is no personalized financial advice.
- Past performance does not guarantee future results.
- Every investment involves risk.
- Data depends on external sources and must show its update date.

## Scoring And Data Quality

Scoring must be deterministic, traceable, and explainable. AI may only explain the result.

Expected criteria:

- TER / fees.
- Tracking error.
- Assets under management.
- Fund age.
- Benchmark.
- Category.
- Historical consistency.
- Data-quality validations.

When data is incomplete or inconsistent, prefer warnings, quarantine, ranking exclusion, or beginner-user blocking instead of showing weak conclusions.

## UX

- Mobile-first.
- Cognitive accessibility for beginners.
- Progressive disclosure of technical details.
- Dense but clear interfaces for catalog, filters, rankings, and comparison.
- Do not use aggressive investment language.
- Do not gamify real financial decisions.
- Keep legal notices visible in calculator, ranking, fund detail, and AI explanation surfaces.

## Privacy

The MVP must not collect personal data. Favorites, educational profile, and preferences should be local or anonymous unless the user explicitly requests an evolution with accounts.

Analytics are allowed only if anonymous, minimal, and focused on validating MVP usage.

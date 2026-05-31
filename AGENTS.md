# Agent Instructions: Invesora

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

This project uses Expo SDK 56. Do not rely on older Expo or React Native assumptions when changing app code, routing, config, native modules, build behavior, or package versions.

## Product

Invesora is an Expo / React Native app that helps beginner users understand and compare index funds.

Guiding principle:

**Educate first, compare later.**

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
- Invesora Assistant as an educational layer.
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

- Expo SDK 56.
- React Native 0.85.
- React 19.
- TypeScript.
- Expo Router.
- Planned backend/database: Supabase.
- Planned AI explanations: OpenAI API or Vercel AI SDK on the backend.
- Zustand for client state when needed.
- Zod for typed validation when needed.

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

- Use the project docs in `README.md` and the available scripts in `package.json` as the primary source of truth.
- Verification step for changes: run `npm run lint` before considering work complete.
- There are no dedicated test scripts in this repository yet, so prefer lint + manual Expo verification for validation.
- Keep `src/app` thin. Add screens and feature logic under `src/features/*`, and place reusable UI/theme/helpers under `src/shared/*` or `src/core/*`.
- Do not introduce broker flows, account management, real portfolio actions, or personalized financial advice into the MVP.
- If a change touches Expo, React Native, routing, or native config, consult the exact Expo SDK 56 docs first instead of relying on older assumptions.

## AI And Finance Rules

The Invesora Assistant:

- Explains concepts and results in plain language.
- Does not calculate or modify rankings.
- Does not invent metrics, ISINs, returns, fees, or benchmarks.
- Does not recommend buying, selling, or subscribing to a fund.
- Does not present favorites as recommendations.
- Must use prudent, educational language.

Every sensitive surface must make clear that:

- Invesora is informational and educational.
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

# Test suite layout

Tests live under `test/` by **clean-architecture layer**, so suites stay locatable as they grow.

```text
test/
  domain/         # Unit — pure rules, engines, schemas, utils  (*.spec.ts)
  application/    # Integration — use cases / services         (*.integration.spec.ts)
  contracts/      # Adapter contracts — API, storage, analytics (*.contract.spec.ts)
  e2e/            # Playwright journeys
    journeys/     # Specs (product flows)
    fixtures/     # Ready-made data (funds, rankings, …)
    doubles/      # Route/API doubles for Playwright
    support/      # Page helpers (goto, text assertions)
  support/        # Shared fixtures/doubles for domain|application|contracts
    fixtures/
    doubles/
```

Tooling scripts keep colocated specs next to `scripts/` (`pnpm run test:scripts`).

## Commands

| Command | Scope |
|---------|-------|
| `pnpm run test:unit` | `test/domain`, `test/application`, `test/contracts` |
| `pnpm run test:e2e` | `test/e2e` (Playwright) |
| `pnpm run test:scripts` | `scripts/*.spec.mjs` |
| `pnpm run test:ci` | Full quality gate |

## Where to put a new test

1. **Domain rule / pure util** → `test/domain/.../*.spec.ts`
2. **Service / orchestration / policy** → `test/application/.../*.integration.spec.ts`
3. **HTTP, storage, mapper, port** → `test/contracts/.../*.contract.spec.ts`
4. **Critical UI journey** → `test/e2e/journeys/*.spec.ts` (+ fixtures/doubles as needed)
5. **Reusable builders** shared by several layers → `test/support/fixtures` or `test/support/doubles`
6. **Local stores** → test `create*Store` factories with `createMemoryKeyValueStorage()` (do not import production singletons that pull React Native / SecureStore)
7. **HTTP-backed services** → test `create*Service` factories with `createMemoryHttpGet()` (do not import production wrappers that pull `@/core/api/client` / React Native)

Import production code with `@/` and shared test builders with `@test/` (e.g. `@test/support/fixtures/catalog-fund`).

Strategy detail: [docs/architecture/testing-strategy.md](../docs/architecture/testing-strategy.md).

# Estrategia de tests (app Inversora)

Guía operativa de [ADR-004](./adr-004-testing-by-architecture-layer.md). La pirámide clásica es un **baremo de madurez**; el criterio de escritura es la **capa** (clean architecture).

## Baremo de pirámide (orientativo)

| Tipo | Baremo típico | Rol en Inversora |
|------|---------------|------------------|
| Unitarios | ~50–60 % | Dominio y reglas puras |
| Integración | ~25–30 % | Casos de uso / servicios |
| E2E | ~10–15 % | Journeys críticos de producto |

Estos porcentajes **no son cuotas de sprint**. Dependen del tipo de app (aquí: educativa, lógica densa, UI móvil/web) y del punto del MVP. Subir hacia el baremo significa **añadir** integración y contratos, no recortar unitarios útiles.

## Mapa a carpetas del repo

| Capa | Ubicación típica | Test | Runner / convención |
|------|------------------|------|---------------------|
| Dominio | `src/core/domain`, `src/core/scoring`, `features/*/utils`, `features/*/models`, schemas Zod de reglas | Unitario | `*.spec.ts` junto al módulo; `pnpm run test:unit` (`node:test` vía `tsx`) |
| Caso de uso | `features/*/services`, políticas/`hooks` de orquestación en feature o `core` | Integración | `*.integration.spec.ts` junto al servicio o en `__tests__/`; mismos runners unitarios con fakes in-memory |
| Adaptador | `src/core/api`, `src/core/storage`, mappers HTTP↔dominio | Contrato | `*.contract.spec.ts` junto al adaptador; cobertura **alta (~100 %)** de la API pública del adaptador tocada |
| UI / journey | `features/*/screens`, rutas `src/app` | E2E | `e2e/*.spec.ts` (Playwright); `pnpm run test:e2e` |
| Scripts de tooling | `scripts/*` | Unitario de script | `scripts/*.spec.mjs`; `pnpm run test:scripts` |

### Qué cuenta como cada tipo

- **Unitario:** una unidad pura (función, engine, schema) sin I/O real. Fixtures en memoria.
- **Integración:** varios módulos de aplicación colaboran; los **puertos** (API, storage, clock) se sustituyen por fakes. No levanta Expo ni red real.
- **Contrato de adaptador:** el adaptador cumple el puerto o el shape acordado (Zod/DTO, status→mensaje, mapeo de query, serialización storage). Preferible fixtures de respuesta API versionadas o builders compartidos con el contrato de `inversora-api`.
- **E2E:** navegador (o device en el futuro) sobre la app; API mockeada en el test cuando haga falta. Pocos, estables, de alto valor de producto.

## Definition of Done (por cambio)

1. ¿Tocaste **dominio**? → unitario de la regla.
2. ¿Tocaste un **caso de uso** (`services`, sync, políticas)? → integración con fakes.
3. ¿Tocaste un **adaptador** (`core/api`, `core/storage`, mapper)? → contrato del puerto público afectado.
4. ¿Tocaste un **journey crítico** ya listado en e2e o uno nuevo de riesgo (legal, ranking, compare, onboarding)? → valorar e2e; evitar duplicar aserciones ya cubiertas abajo.

Justifica en el PR si omites el tipo esperado (p. ej. rename mecánico).

## Prioridad de crecimiento (cómo escalar)

Orden recomendado mientras el suite madura:

1. **Contratos de adaptador** al tocar `core/api` / `core/storage` (máximo ROI frente a `inversora-api` y persistencia local).
2. **Integración de casos de uso** en `features/*/services` (learn/profile, catálogo, compare, favoritos, assistant guardrails de orquestación).
3. **Mantener y densificar unitarios de dominio** (scoring helpers, filtros, elegibilidad beginner, fairness compare, calculadora).
4. **E2E** solo para regresiones de journey; ampliar con cautela (coste CI).

## Estado actual (baseline 2026-07)

Recuento aproximado de casos (`it`/`test`):

| Capa / tipo | Casos (aprox.) | Lectura |
|-------------|----------------|---------|
| Unitarios (`src/**/*.spec.ts` + `scripts/*.spec.mjs`) | ~163 | Fuerte en dominio/utils; alineado con fase temprana |
| Integración (`*.integration.spec.ts`) | ~0 | Hueco principal frente al baremo |
| Contratos (`*.contract.spec.ts`) | ~0 (parte de client/storage hoy van como unitarios sueltos) | Formalizar al tocar adaptadores |
| E2E Playwright | ~8 | Por debajo del baremo; suficientes como red de seguridad MVP web |

Objetivo de madurez: **no** igualar porcentajes de un día para otro; en cada PR de capa media/alta, dejar el suite un poco más cerca del baremo.

## Comandos

| Comando | Qué ejecuta |
|---------|-------------|
| `pnpm run test:unit` | Specs bajo `src/**/*.spec.ts` |
| `pnpm run test:scripts` | Specs de `scripts/` |
| `pnpm run test:e2e` | Playwright (`e2e/`) |
| `pnpm run test:ci` / `pnpm run quality` | typecheck + lint + unit + scripts + e2e (+ verify plugins) |

Cuando existan `*.integration.spec.ts` y `*.contract.spec.ts`, deben entrar en el mismo glob de `test:unit` (o un script dedicado invocado desde `test:ci`) para no quedar fuera de CI.

## Relación con producto y backend

- Reglas RN / scoring: la fuente de verdad del algoritmo en producción es **inversora-api**; la app testea interpretación, mappers y mocks locales (`ADR-001`, `ADR-002`).
- Contratos HTTP: alinear fixtures con `inversora-api/docs` (p. ej. BFF ficha, catálogo) cuando el adaptador cambie.
- Asistente: unitarios/guardrails de salida + contratos del client; la IA no se “testea” con e2e de contenido libre.

## Referencias

- [ADR-004](./adr-004-testing-by-architecture-layer.md)
- [ADR-001 — límites de dominio](./adr-001-domain-boundaries.md)
- [mvp-feature-map.md](./mvp-feature-map.md)
- `.cursor/rules/testing-strategy.mdc`
- `AGENTS.md` — Agent Working Rules

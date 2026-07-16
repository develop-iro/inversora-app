# Principios no negociables de clean architecture (Inversora)

Inversora usa una estructura **feature-first** inspirada en Clean Architecture / hexagonal. Este documento fija **nueve principios no negociables** adaptados al cliente Expo (el décimo de materiales de formación externos no aplica aquí).

La regla Cursor always-on es [`.cursor/rules/clean-architecture-principles.mdc`](../../.cursor/rules/clean-architecture-principles.mdc). Complementa [ADR-001](./adr-001-domain-boundaries.md), [ADR-004](./adr-004-testing-by-architecture-layer.md) y [testing-strategy.md](./testing-strategy.md).

## Grafo de dependencias

```text
app       → features, shared
features  → shared, core
features  ↛ features   (evitar; ver excepción en ADR-001)
core      ↛ features, shared/components
```

- **Centro:** dominio y reglas puras (`core/domain`, `core/scoring`, utils/modelos puros en features).
- **Exterior:** composición Expo Router (`src/app`), UI, adaptadores de I/O (`core/api`, `core/storage`, `core/analytics`, `core/observability`).

## Los nueve principios

| # | Principio | Aplicación en este repo |
|---|-----------|-------------------------|
| 1 | **Regla de dependencias** | Flechas hacia dentro; `core` no depende de features ni de UI. |
| 2 | **Dominio puro** | Sin React, Router, storage, `fetch` ni analytics en calculadores de dominio/scoring. |
| 3 | **Casos de uso** | Orquestan en `features/*/services` (y hooks de dominio); pantallas finas; errores tipados estables. |
| 4 | **Puertos y adaptadores** | Puertos = necesidades; adaptadores = tecnología (`core/api`, `core/storage`, mappers). Tests con fakes/contratos. |
| 5 | **Composición explícita** | Wiring en `src/app/_layout.tsx` / `AppProviders` e imports explícitos; sin scan/autoload mágico de casos de uso. |
| 6 | **DTO ≠ Entidad/VO** | Mapear en la frontera; no tratar payloads API como dominio; modelos de lectura (p. ej. scoring) no son entidades de persistencia. |
| 7 | **Errores tipados** | `AppError` + `AppErrorCode` en fronteras de aplicación/adaptador; throws de invariante en dominio puro. |
| 8 | **Tests por capa** | Dominio → unit; caso de uso → integración; adaptador → contrato; journeys críticos → e2e. Ver ADR-004. |
| 9 | **Observabilidad como puente** | Analytics y Sentry vía adaptadores en `core`; dominio sin SDKs de vendor; dashboards fuera del cliente. |

## Detalle operativo

### 1–4 — Capas y fronteras

Ya estaban cubiertos en gran parte por ADR-001, `AGENTS.md` y la estrategia de tests. La regla Cursor unifica el lenguaje con estos nueve puntos.

### 5 — Composición en Expo

No hay contenedor DI tipo Nest en el cliente. La composición root es:

- `src/app/_layout.tsx` (init Sentry, providers, stack)
- `AppProviders` y rutas finas bajo `src/app`

Nuevos clientes o stores se registran con **imports y providers explícitos**, no con descubrimiento automático.

### 6 — DTOs y dominio

- Parsers/mappers en `core/api` validan con Zod y producen tipos de aplicación/dominio.
- Tipos de dominio viven en `core/domain` (y modelos puros de feature).
- DTOs de salida de scoring (`FundWithScore`, etc.) son **modelos de lectura tipados**, no entidades de persistencia ni sustitutos de VO sin invariantes.

### 7 — Errores

- Código canónico: [`src/core/errors/app-error.ts`](../../src/core/errors/app-error.ts).
- Los contratos de adaptador deben comprobar el mapeo status/causa → `AppErrorCode`.
- No sustituir fallos de frontera por estados UI vacíos sin código/mensaje explícito.

### 8 — Tests

Nombres Inversora (no “Acceptance” de algunos slides de formación):

| Capa | Tipo de test |
|------|----------------|
| Dominio | `*.spec.ts` |
| Caso de uso | `*.integration.spec.ts` |
| Adaptador | `*.contract.spec.ts` |
| Journey UI crítico | `e2e/*.spec.ts` |

### 9 — Observabilidad

| Canal | Dónde | Doc |
|-------|--------|-----|
| Eventos de producto / funnel | `core/analytics` → API | [analytics.md](./analytics.md) |
| Salud técnica | `core/observability` (Sentry) | init desde composition root |
| Dashboards / Grafana / SQL | Fuera del cliente (API / ops) | [analytics-dashboards.md](./analytics-dashboards.md) |

Privacidad MVP: eventos anónimos y mínimos; sin PII ni texto libre del cuestionario o del asistente.

## Relación con otras reglas Cursor

| Regla | Principios que refuerza |
|-------|-------------------------|
| `clean-architecture-principles.mdc` | 1–9 (esta guía) |
| `screen-reactivity-and-practices.mdc` | 1, 3 |
| `testing-strategy.mdc` | 4, 8 |
| `catalog-client-side-filtering.mdc` | 2, 3 (filtros draft puros) |

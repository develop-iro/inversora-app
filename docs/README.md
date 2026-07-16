# Documentación de Inversora

Índice de la documentación del repositorio. El detalle de negocio completo vive en el documento oficial del proyecto (*Documentación de Proyecto: Inversora*, v1.0); aquí se concentra lo **esencial para desarrollar y mantener el MVP** sin duplicar ese volumen.

## Cómo usar estos docs

| Si necesitas… | Lee |
|---------------|-----|
| Visión, principios y límites del producto | [product/vision-and-principles.md](./product/vision-and-principles.md) |
| Problema que resuelve Inversora (doc oficial §5) | [product/problem-statement.md](./product/problem-statement.md) |
| Objetivos específicos y objetivo del MVP (doc oficial §2) | [product/objectives.md](./product/objectives.md) |
| Público objetivo y perfiles de usuario (doc oficial §4) | [product/target-audience-and-profiles.md](./product/target-audience-and-profiles.md) |
| Qué entra y qué no en el MVP | [product/mvp-scope.md](./product/mvp-scope.md) |
| Score Inversora, rankings y etiquetas UI | [product/scoring.md](./product/scoring.md) |
| Reglas del Asistente Inversora (IA) | [product/assistant.md](./product/assistant.md) |
| Historias de usuario (HU) y trazabilidad | [product/user-stories-index.md](./product/user-stories-index.md) |
| Avisos legales y copy obligatorio | [product/legal-and-disclaimers.md](./product/legal-and-disclaimers.md) |
| Estado del código por feature | [architecture/mvp-feature-map.md](./architecture/mvp-feature-map.md) |
| Principios no negociables de clean architecture | [architecture/clean-architecture-principles.md](./architecture/clean-architecture-principles.md) · [`.cursor/rules/clean-architecture-principles.mdc`](../.cursor/rules/clean-architecture-principles.mdc) |
| Límites de dominio (scoring, favoritos, IA) | [architecture/adr-001-domain-boundaries.md](./architecture/adr-001-domain-boundaries.md) |
| Convención de componentes UI (tabs, texto) | [architecture/adr-003-component-naming.md](./architecture/adr-003-component-naming.md) |
| Estrategia y layout de tests (`test/`) | [architecture/testing-strategy.md](./architecture/testing-strategy.md) · [ADR-004](./architecture/adr-004-testing-by-architecture-layer.md) · [plan de olas](./architecture/testing-climb-plan.md) · [test/README.md](../test/README.md) |
| Stack elegido vs alternativas del doc oficial | [architecture/stack-decisions.md](./architecture/stack-decisions.md) |
| Conectar app a API local en dev (HU-07 filtros, CORS, LAN) | [development-api.md](./development-api.md) |
| Analytics anónimos, funnel learn y dashboards SQL | [architecture/analytics.md](./architecture/analytics.md) |

## Jerarquía de fuentes de verdad

```text
Memoria Final Inversora (entrega TFM)    ← fuente de verdad de entrega/as-built
        ↓
Documento oficial de proyecto            ← negocio, HUs y RN base
        ↓
docs/product/*                           ← reglas de producto resumidas (§2, §3, §4, §5…)
        ↓
inversora-api/docs/*                     ← backend: propósito, contratos HTTP, scoring RN-04
        ↓
README.md + AGENTS.md                    ← onboarding rápido para humanos y agentes
        ↓
docs/architecture/*                      ← decisiones técnicas y mapa de código (app)
        ↓
src/                                     ← implementación cliente
```

Ante conflicto entre repos o docs internas, **prevalece la Memoria Final Inversora como fuente de verdad de entrega**. Luego se usa el documento oficial de proyecto para negocio, HUs y reglas RN base; `docs/product/*` resume producto, e `inversora-api` concreta contratos y datos de servidor.

## Relación con inversora-api

El backend canónico es **[inversora-api](https://github.com/)** (NestJS + PostgreSQL + Prisma). No usar Supabase Edge Functions como referencia de implementación.

| Tema de producto (doc oficial) | Doc en `invesora` | Doc / código en `inversora-api` |
|--------------------------------|-------------------|----------------------------------|
| §5 Problema y principio educativo | [product/problem-statement.md](./product/problem-statement.md) | [purpose-and-scope.md](../../inversora-api/docs/purpose-and-scope.md) |
| §2 Objetivos y MVP | [product/objectives.md](./product/objectives.md) | [purpose-and-scope.md](../../inversora-api/docs/purpose-and-scope.md) |
| §3 Alcance funcional | [product/mvp-scope.md](./product/mvp-scope.md) | [purpose-and-scope.md](../../inversora-api/docs/purpose-and-scope.md) |
| §4 Público y perfiles | [product/target-audience-and-profiles.md](./product/target-audience-and-profiles.md) | Perfil educativo derivado → `anonymous-devices` |
| Score y rankings (RN-04) | [product/scoring.md](./product/scoring.md) | [scoring-rn-04.md](../../inversora-api/docs/scoring-rn-04.md) |
| Contrato ficha de fondo | [development-api.md](./development-api.md) | [bff-fund-detail-contract.md](../../inversora-api/docs/bff-fund-detail-contract.md) |
| Analytics anónimos (HU-41) | [architecture/analytics.md](./architecture/analytics.md) | [analytics-dashboards.md](../../inversora-api/docs/analytics-dashboards.md) |
| Estado de implementación | [architecture/mvp-feature-map.md](./architecture/mvp-feature-map.md) | Swagger `GET /api/docs` |

**Conexión local app ↔ API:** [development-api.md](./development-api.md).

## Producto (`docs/product/`)

Definiciones que **no deberían cambiar** sin revisar el doc oficial o un ADR:

- Principio *educar primero, comparar después*.
- Alcance MVP (productos indexados validados; sin broker ni asesoramiento personalizado).
- Modelo de scoring objetivo y papel del asistente.
- Índice de historias de usuario para cerrar issues y sprints.

## Arquitectura (`docs/architecture/`)

- **clean-architecture-principles:** nueve principios no negociables adaptados a Expo (dependencias, dominio puro, casos de uso, puertos/adaptadores, composición explícita, DTO≠entidad/VO, errores tipados, tests por capa, observabilidad).
- **ADR-001:** dónde vive el scoring, favoritos y el asistente; reglas de imports entre features.
- **ADR-004 + testing-strategy + `test/`:** tests por capa (domain / application / contracts / e2e) con fixtures y doubles; pirámide como baremo de madurez.
- **mvp-feature-map:** qué está implementado hoy (se actualiza con el código).
- **stack-decisions:** Expo, theme propio, backend **inversora-api** (NestJS + PostgreSQL).

## Mantenimiento

- Al cerrar una HU relevante, actualizar el estado en `user-stories-index.md` y, si aplica, una fila en `mvp-feature-map.md`.
- Si el cambio afecta al backend (endpoint, scoring, analytics), actualizar también la doc correspondiente en `inversora-api/docs/`.
- Si cambian pesos de scoring o reglas RN, actualizar `product/scoring.md`, `inversora-api/docs/scoring-rn-04.md` y el código de scoring en el mismo cambio.
- Nuevas decisiones irreversibles → nuevo ADR en `architecture/adr-NNN-titulo.md` y enlace desde este README.

## Referencias externas

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- Memoria Final Inversora — fuente de verdad de entrega/as-built.
- Documento oficial: *Documentación de Proyecto: Inversora* (v1.0) — base de negocio y requisitos.

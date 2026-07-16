# Estrategia de tests (app Inversora)

Guía operativa de [ADR-004](./adr-004-testing-by-architecture-layer.md). La pirámide clásica es un **baremo de madurez**; el criterio de escritura es la **capa**. El árbol físico vive en [`test/`](../../test/README.md).

## Baremo de pirámide (orientativo)

| Tipo | Baremo típico | Carpeta |
|------|---------------|---------|
| Unitarios | ~50–60 % | `test/domain` |
| Integración | ~25–30 % | `test/application` |
| E2E | ~10–15 % | `test/e2e/journeys` |

Los **contratos** (`test/contracts`) son obligación de frontera (~100 % de la superficie pública tocada), no compiten por cupo de pirámide.

## Árbol

```text
test/
  domain/              *.spec.ts
  application/         *.integration.spec.ts
  contracts/           *.contract.spec.ts
  e2e/
    journeys/          Playwright specs
    fixtures/          Datos listos (funds, rankings…)
    doubles/           Route/API doubles
    support/           Helpers de página
  support/
    fixtures/          Builders compartidos (domain/application/contracts)
    doubles/           Fakes in-memory compartidos
```

Los specs de tooling siguen en `scripts/*.spec.mjs` (`pnpm run test:scripts`).

## Definition of Done (por cambio)

1. ¿Dominio? → `test/domain`
2. ¿Caso de uso / servicio / política? → `test/application`
3. ¿Adaptador API/storage/mapper? → `test/contracts`
4. ¿Journey crítico? → `test/e2e/journeys` (+ fixture/double si hace falta)

Importa producción con `@/…` y builders de test con `@test/…` (alias a `test/`). No uses paths relativos hacia `src/`.

## Prioridad de crecimiento

1. Contratos al tocar `core/api` / `core/storage`
2. Integración en servicios (`features/*/services`)
3. Mantener unitarios de dominio
4. E2E solo para journeys de riesgo

## Comandos

| Comando | Scope |
|---------|-------|
| `pnpm run test:unit` | `test/domain` + `test/application` + `test/contracts` |
| `pnpm run test:e2e` | Playwright (`test/e2e`) |
| `pnpm run test:scripts` | `scripts/` |
| `pnpm run test:ci` | Quality gate completo |

## Referencias

- [ADR-004](./adr-004-testing-by-architecture-layer.md)
- [test/README.md](../../test/README.md)
- [ADR-001](./adr-001-domain-boundaries.md)
- `.cursor/rules/testing-strategy.mdc`

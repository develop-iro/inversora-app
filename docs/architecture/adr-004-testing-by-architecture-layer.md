# ADR-004: Estrategia de tests por capa (clean architecture)

| Campo | Valor |
|-------|--------|
| **Estado** | Aceptado |
| **Fecha** | 2026-07-16 |
| **Contexto** | App Expo feature-first con dominio en `core/`; pirámide clásica usada como baremo, no como cuota rígida |

---

## Contexto

La pirámide de tests (≈50–60 % unitarios, ≈25–30 % integración, ≈10–15 % e2e) es un **baremo orientativo**. El mix concreto depende del tipo de aplicación, del riesgo del dominio y del punto de madurez del MVP.

En Inversora el valor está en reglas educativas y financieras **deterministas**, orquestación de casos de uso y contratos con `inversora-api` / storage local. Sin una decisión explícita, los specs se dispersan junto al código de producción y cuesta localizar dominio vs adaptadores vs journeys.

---

## Decisión

### 1. Organización física bajo `test/`

```text
test/
  domain/         # unitarios (*.spec.ts)
  application/    # integración (*.integration.spec.ts)
  contracts/      # contratos de adaptador (*.contract.spec.ts)
  e2e/            # Playwright (journeys/, fixtures/, doubles/, support/)
  support/        # fixtures/doubles compartidos entre capas no-e2e
```

Guía operativa: [testing-strategy.md](./testing-strategy.md) y [test/README.md](../../test/README.md).

### 2. Mapa capa → tipo de test

| Capa | Carpeta | Expectativa |
|------|---------|-------------|
| Dominio | `test/domain` | **Necesario** en código nuevo o tocado |
| Casos de uso | `test/application` | **Deseable** al introducir o cambiar un flujo |
| Adaptadores | `test/contracts` | **Necesario ~100 %** de la API pública del adaptador tocada |
| UI / journeys | `test/e2e/journeys` | Pocos, sobre flujos de riesgo |

### 3. Pirámide como baremo, no como cuota

- 50–60 / 25–30 / 10–15 es **señal de salud**, no gate de CI por porcentaje.
- Subir hacia el baremo = añadir integración y contratos; no borrar unitarios útiles.

### 4. Definition of Done por capa

1. Dominio tocado → `test/domain/**/*.spec.ts`
2. Caso de uso tocado → `test/application/**/*.integration.spec.ts` (fakes in-memory)
3. Adaptador tocado → `test/contracts/**/*.contract.spec.ts`
4. Journey crítico tocado → valorar e2e en `test/e2e/journeys`

---

## Consecuencias

- Localización clara para humanos y agentes.
- Fixtures/doubles reutilizables en `test/e2e/*` y `test/support/*`.
- Coste de migración puntual (hecho mientras el suite es pequeño); imports de producción vía `@/`.

## Referencias

- [testing-strategy.md](./testing-strategy.md)
- [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md)
- `.cursor/rules/testing-strategy.mdc`

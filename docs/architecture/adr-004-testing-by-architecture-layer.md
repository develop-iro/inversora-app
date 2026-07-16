# ADR-004: Estrategia de tests por capa (clean architecture)

| Campo | Valor |
|-------|--------|
| **Estado** | Aceptado |
| **Fecha** | 2026-07-16 |
| **Contexto** | App Expo feature-first con dominio en `core/`; pirámide clásica usada como baremo, no como cuota rígida |

---

## Contexto

La pirámide de tests (≈50–60 % unitarios, ≈25–30 % integración, ≈10–15 % e2e) es un **baremo orientativo**. El mix concreto depende del tipo de aplicación, del riesgo del dominio y del punto de madurez del MVP.

En Inversora el valor está en reglas educativas y financieras **deterministas**, orquestación de casos de uso y contratos con `inversora-api` / storage local. Un recuento global de porcentajes sin mapear a capas puede ocultar huecos (hoy: muchos unitarios de utilidades, casi sin integración ni contratos de adaptador).

Sin una decisión explícita, los agentes y PRs seguirán añadiendo solo `*.spec.ts` de funciones puras y e2e web puntuales, sin subir la cobertura donde más protege (casos de uso y adaptadores).

---

## Decisión

Adoptar una **estrategia de tests alineada a clean architecture**, usando la pirámide como baremo de madurez y la capa como criterio de *qué* test escribir.

### 1. Mapa capa → tipo de test

| Capa (clean architecture) | Dónde vive en este repo | Tipo de test | Expectativa |
|---------------------------|-------------------------|--------------|-------------|
| **Dominio** (entidades, reglas puras, scoring helpers, schemas Zod de dominio) | `core/domain`, `core/scoring`, utils/engines puros en `features/*/utils` o `features/*/models` | **Unitarios** | **Necesario** en código nuevo o tocado |
| **Casos de uso** (orquestación: servicios, políticas, flujos sin UI) | `features/*/services`, hooks de dominio que coordinan varios módulos, políticas en `core/storage` / `core` | **Integración** (módulos reales + fakes de puertos) | **Deseable** al introducir o cambiar un flujo |
| **Adaptadores** (HTTP, storage, analytics, mappers API↔dominio) | `core/api`, `core/storage`, clientes/mappers en frontera Zod | **Contrato** (shape, errores, mapeo, cumplimiento del puerto) | **Necesario al ~100 %** de adaptadores públicos tocados |
| **UI / rutas** (pantallas, navegación crítica) | `features/*/screens`, `src/app`, flujos web | **E2E** (Playwright) selectivos | Pocos, sobre journeys de riesgo |

```text
        /\
       /  \      E2E — journeys críticos (pocos)
      /----\
     / Int. \    Casos de uso (servicios + fakes)
    /--------\
   /  Unit.   \  Dominio puro
  /------------\
 /  Contratos   \ Adaptadores (cobertura alta del puerto)
/________________\
```

Los **contratos de adaptador** no compiten con la pirámide “por recuento de `it()`”: son una **obligación de frontera**. Un adaptador nuevo sin test de contrato se considera incompleto aunque el % unitario global sea alto.

### 2. Pirámide como baremo, no como cuota

- Usar 50–60 / 25–30 / 10–15 como **señal de salud** al revisar madurez del suite, no como objetivo sprint a sprint.
- En fases tempranas del MVP es normal un sesgo hacia unitarios de dominio.
- El objetivo de “subir la pirámide” es **añadir integración de casos de uso y contratos de adaptador**, no bajar unitarios artificialmente.
- El dominio financiero/educativo prioriza unitarios densos; la UI prioriza e2e finos, no snapshots triviales.

### 3. Reglas de cambio (Definition of Done por capa)

Al tocar código en una capa, el PR debe incluir el tipo de test correspondiente **salvo** justificación explícita en la descripción (p. ej. rename sin cambio de comportamiento):

1. **Dominio tocado** → unitario que fije la regla (happy path + al menos un edge o warning/quarantine si aplica).
2. **Caso de uso tocado** → test de integración del servicio/flujo con puertos fake o in-memory (sin red real, sin dispositivo).
3. **Adaptador tocado** → test de contrato: entrada/salida Zod o DTO, errores mapeados, y que implementa el puerto/API pública documentada.
4. **Journey de producto crítico tocado** (onboarding web, catálogo+filtros, ranking, comparación, calculadora, legal) → valorar e2e; no duplicar lo ya cubierto por integración.

### 4. Qué no hacer

- No exigir e2e por cada componente UI.
- No sustituir tests de dominio por e2e lentos.
- No llamar “integración” a un unitario de una sola función pura.
- No mockear el dominio dentro de su propio test unitario.
- No añadir snapshots de render sin aserción de regla de negocio o contrato.

---

## Consecuencias

### Positivas

- Claridad para humanos y agentes: la capa indica el tipo de test.
- Fronteras con `inversora-api` y storage quedan protegidas por contratos.
- La pirámide se usa para conversar madurez, no para rechazar PRs por un % puntual.

### Negativas / coste

- Hay que introducir convenciones de naming/ubicación para integración y contratos (ver [testing-strategy.md](./testing-strategy.md)).
- El suite actual está sesgado a unitarios; el cierre del gap es **incremental**.

### Plan de adopción (escalar hacia el baremo)

| Fase | Enfoque |
|------|---------|
| Ahora | Mantener unitarios de dominio; documentar la estrategia (este ADR + rule) |
| Siguiente | Contratos en `core/api` y `core/storage` al tocar adaptadores |
| Después | Integración en `features/*/services` de flujos learn, catálogo, compare, favoritos |
| Continuo | E2E solo para journeys de riesgo; revisar baremo en auditorías de calidad |

Detalle operativo, naming y estado actual: [testing-strategy.md](./testing-strategy.md).

---

## Referencias

- [testing-strategy.md](./testing-strategy.md) — guía operativa
- [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md) — capas y imports
- [mvp-feature-map.md](./mvp-feature-map.md) — estado por feature
- `AGENTS.md` — verificación `test:ci`
- `.cursor/rules/testing-strategy.mdc` — regla para agentes

# Plan de subida hacia el baremo de tests

Plan ejecutable para alcanzar la estrategia de [ADR-004](./adr-004-testing-by-architecture-layer.md) y [testing-strategy.md](./testing-strategy.md).

La pirámide (~50–60 % unit / ~25–30 % integración / ~10–15 % e2e) es **baremo de madurez**. Los **contratos de adaptador** son obligación de frontera (~100 % de la superficie pública tocada).

## Estado de partida (tras layout `test/`)

| Capa | Situación |
|------|-----------|
| Domain | Fuerte en utils/engines; faltan scoring mock, themes, visibility |
| Application | Learn/onboarding parcial; faltan funds/compare/favorites/calculator services |
| Contracts | Parcial en API/storage timeout; faltan parsers/mappers y stores |
| E2E | 8 journeys web útiles; ampliar solo si hay gap de producto |

### Recuento orientativo

| Momento | Domain | Application | Contracts | E2E | Total unit* |
|---------|-------:|------------:|----------:|----:|------------:|
| Tras ola 1 | ~106 | ~32 | ~32 | ~8 | ~167 |
| Tras ola 2 | ~106 | ~32 | ~54 | ~8 | ~189 |
| Tras ola 3 | ~106 | ~32 | ~72 | ~8 | ~207 |
| Tras ola 4 | ~103 | ~52 | ~72 | ~8 | ~227 |
| Tras ola 5 | ~116 | ~58 | ~72 | ~8 | ~246 |
| Tras ola 6 | ~116 | ~58 | ~72 | ~11 | ~246 |

\* `pnpm run test:unit` (domain + application + contracts).

## Olas (módulo a módulo)

Cada ola → **rama + PR** dedicada. Definition of Done: tests nuevos en la carpeta correcta + `pnpm run test:unit` verde (+ e2e si se toca journey).

### Ola 1 — Contratos API catálogo + dominio scoring (ROI máximo)

**Estado:** entregada (`cursor/testing-climb-wave1-*`)  
**Rama sugerida:** `cursor/testing-climb-wave1-*`

| Módulo | Capa | Tests objetivo |
|--------|------|----------------|
| `core/api/map-api-fund` | contracts | risk map, category/theme labels, catalog mapping, null ISIN / visibility |
| `core/api/parse-fund-list-response` | contracts | happy path, meta inválida, items malformados filtrados |
| `core/api/parse-fund-return-snapshot` | contracts | parse + fallback empty |
| `core/scoring/score-fund` | domain | ISIN required, TER/referenceScore, status warning/ok |
| `core/domain/investment-theme` | domain | parse known/unknown |
| `funds/utils/catalog-visibility` | domain | visible vs quarantined/blocked |
| `funds/utils/apply-client-only-catalog-filters` | domain | sort client-only vs return-sort passthrough (extraído del servicio para evitar RN en unit) |

**Fixtures:** `test/support/fixtures/api-fund.ts` (+ reutilizar `catalog-fund`).

### Ola 2 — Contratos parsers BFF restantes

**Estado:** entregada (re-landed en `main` vía ola 3 si el merge a la rama intermedia no llegó a `main`)  
**Rama sugerida:** `cursor/testing-climb-wave2-*`

| Módulo | Capa |
|--------|------|
| `parse-fund-detail-response` | contracts |
| `parse-rankings-response` | contracts |
| `parse-featured-funds-response` | contracts |
| `parse-investment-news-response` | contracts |
| `parse-fund-live-market-snapshot` | contracts |
| `parse-assistant-response` | contracts |
| `quarter-metadata` | domain (cubierto en ola 1) |

### Ola 3 — Storage ports (contratos con doubles)

**Estado:** entregada (`cursor/testing-climb-wave3-*`)  
**Rama sugerida:** `cursor/testing-climb-wave3-*`

Introduce `KeyValueStoragePort` + `createMemoryKeyValueStorage` y factories `create*Store(storage)` (sin React Native) para contratos en `node:test`. Los singletons de producción siguen en `*.ts` con el adaptador secure.

| Módulo | Capa |
|--------|------|
| `favorites-store` | contracts |
| `educational-profile-store` | contracts |
| `compare-selection-store` | contracts |
| `learn-curriculum-progress-store` | contracts |
| `device-identity-store` | contracts |
| `initial-profile-onboarding-store` | contracts |

### Ola 4 — Casos de uso funds / rankings / home

**Estado:** entregada (`cursor/testing-climb-wave4-*`)  
**Rama sugerida:** `cursor/testing-climb-wave4-*`

Introduce `HttpGetPort` + `createMemoryHttpGet` y factories `create*Service(deps)` (sin React Native) para integración en `node:test`. Los singletons de producción siguen cableando `apiGet` real.

| Módulo | Capa | Enfoque |
|--------|------|---------|
| `get-funds` (mock path + shaping) | application | mock data + filters; fake `apiGet` vía puerto |
| `get-rankings` | application | mock + API parse/cache |
| `get-fund-by-isin` | application | parse detail + 404 fallback |
| `get-featured-funds` | application | carousel eligibility + fallback |
| `get-investment-news` | application | bundled vs API + fallback |
| `resolve-home-search` | application | default / fund-match / assistant answer |
| `load-compare-picker-funds` | application | mock sort + API search |

### Ola 5 — Favoritos, comparación, calculadora, feedback

**Estado:** entregada (`cursor/testing-climb-wave5-*`)  
**Rama sugerida:** `cursor/testing-climb-wave5-*`

Introduce `HttpPostPort` + `createMemoryHttpPost` y factories para hydrate de favoritos, carga de compare funds y submit de feedback. Toggle/selection de storage siguen en contratos de ola 3.

| Módulo | Capa |
|--------|------|
| Favoritos list hydration (`loadFavoriteCatalogFunds`) | application |
| Compare funds load + fairness/table/prompts | application + domain |
| Calculator export CSV / scenarios | domain |
| `submit-product-feedback` | application |
| Assistant output already covered; client parse in ola 2 | — |

### Ola 6 — E2E selectivo

**Estado:** en curso / entregada en `cursor/testing-climb-wave6-*`  
**Rama sugerida:** `cursor/testing-climb-wave6-*`

Journeys añadidos en `test/e2e/journeys/inversora-web.spec.ts` (+ `mockFundDetailApi`):

- Favoritos persistidos (web) — toggle en catálogo → `/favorites` → reload
- Ficha de fondo `/funds/[isin]` smoke
- Asistente SORA desde home search con disclaimer (sin asertar texto libre de IA)

No añadir e2e por componente.

## Orden de ejecución recomendado

```text
Ola 1 (API catálogo + scoring)  ← empezar aquí
  → Ola 2 (parsers BFF)
  → Ola 3 (storage + doubles)
  → Ola 4 (use cases funds/home)
  → Ola 5 (favorites/compare/calculator)
  → Ola 6 (e2e gaps)
```

## Cómo medir progreso (sin cuota rígida)

Tras cada ola, actualizar esta tabla en el PR:

| Señal | Qué mirar |
|-------|-----------|
| Contratos | % de archivos públicos en `core/api` y `core/storage` con `*.contract.spec.ts` |
| Application | Servicios orquestadores con `*.integration.spec.ts` |
| Domain | Reglas nuevas/tocadas con `*.spec.ts` |
| Pirámide | Recuento `it/test` por carpeta vs baremo (informativo) |

Meta tras olas 1–6: contratos + application de funds/home/compare/favorites/feedback; calculator CSV/scenarios; e2e de journeys críticos (favoritos, ficha, SORA disclaimer).

## Anti-objetivos

- No migrar ni borrar unitarios útiles para “cuadrar” porcentajes.
- No snapshots de UI triviales.
- No e2e que dupliquen un contrato/integración ya sólido.
- No refactors grandes solo para testear; si un store no es testeable, introducir puerto/double en el mismo PR del contrato.

## Referencias

- [testing-strategy.md](./testing-strategy.md)
- [test/README.md](../../test/README.md)
- [mvp-feature-map.md](./mvp-feature-map.md)

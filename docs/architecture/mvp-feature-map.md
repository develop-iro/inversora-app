# Mapa MVP por feature

Estado del código a julio de 2026.

Referencias de producto: [docs/product/](../product/) · [objectives.md](../product/objectives.md) · `README.md` · `AGENTS.md` · [Índice de HUs](../product/user-stories-index.md).

Leyenda de madurez:

| Símbolo | Significado |
|--------|-------------|
| ✅ | Implementado de forma usable |
| 🟡 | Parcial / prototipo UI |
| ⬜ | No iniciado |
| 🔧 | Infraestructura planificada, ausente en repo |

---

## Resumen ejecutivo

| Área MVP | Progreso global | Notas de cierre julio 2026 |
|----------|-----------------|----------------------------|
| Dashboard inicial | ✅ ~95% | Home con destacados, ranking por benchmark, SORA, perfil educativo |
| Catálogo y rankings | ✅ ~95% | Filtros incl. minReturn, `/rankings`, ficha `/funds/[isin]` |
| Modo educativo / perfil | ✅ ~90% | Cuestionario, perfil local, sync anónimo, sugerencias en catálogo |
| Comparación | ✅ ~85% | Hasta 2 fondos, fairness, picker contra API |
| Favoritos locales | ✅ ~85% | AsyncStorage + toggle en ficha y catálogo |
| Calculadora | ✅ ~85% | Motor + 3 escenarios educativos + modo fondo |
| Asistente (SORA) | ✅ ~90% | Home, ficha inline, catálogo, comparación; guardrails HU-40 |
| Avisos legales | ✅ ~90% | `LegalNotice` en superficies sensibles + `/legal` |
| Infra (`core`, API) | ✅ ~90% | Cliente HTTP, caché TTL, analytics, dispositivos anónimos |

---

## Capas transversales

### `src/app` (Expo Router)

| Elemento | Estado | Notas |
|----------|--------|-------|
| Tabs: inicio, fondos, favoritos, comparar, calcular | ✅ | `_layout.tsx` + `NavTabBar` |
| Re-export fino a `features/*/screens` | ✅ | Patrón consistente |
| `/learn` | ✅ | Cuestionario educativo |
| `/funds/[isin]` | ✅ | Ficha ampliada |
| `/legal` | ✅ | Textos legales centralizados |
| `explore.tsx` (oculto, `href: null`) | 🟡 | Deuda menor de rutas legacy |

### `src/shared`

| Elemento | Estado | Notas |
|----------|--------|-------|
| Theme (`theme.ts`, `palette`, `colors`) | ✅ | Tokens de spacing, tipografía, sombras |
| UI kit (`Card`, `Badge`, `Button`, `SearchField`, `ScorePill`, …) | ✅ | Base sólida para catálogo y comparación |
| `ThemedText` / `ThemedView` | ✅ | |
| `use-mobile-layout`, `use-reduced-motion` | ✅ | |
| Componentes sin dominio financiero | ✅ | Correcto para reutilización |

### `src/core`

| Módulo | Estado | Notas |
|--------|--------|-------|
| `domain/fund.ts` | ✅ | Tipos de dominio compartidos |
| `errors/app-error.ts` | ✅ | Errores tipados base |
| `storage/favorites-store.ts` | ✅ | Favoritos locales AsyncStorage |
| `scoring/` | 🟡 | Tipos y utilidades; score real en API |
| `api/` | ✅ | Cliente HTTP + mapeo filtros |
| `query/` | ✅ | Caché in-memory con TTL (catálogo 5 min, ficha 2 min) |
| `config/` | ✅ | Entornos `local` / `qa` / `pro`, flags mock |
| `analytics/` | ✅ | Eventos anónimos + `POST /analytics/events` + PostgreSQL + funnel learn |

---

## `features/onboarding` (dashboard / inicio)

**Rol actual:** pantalla principal del producto (hero, destacados, ranking teaser, búsqueda, entrada a guía “Sora”, disclaimer).

**Ruta:** `/` → `home-screen.tsx`

| Capacidad MVP | Estado | Detalle en código |
|---------------|--------|-------------------|
| Dashboard inicial | 🟡 | `HomeHero`, panel de contenido, ranking top 3 |
| Fondos destacados (carousel) | ✅ | `FeaturedFundsCarousel` + `FEATURED_FUNDS_MOCK` |
| Ranking resumido (Score Inversora) | ✅ | `use-home-screen-data` + pestaña Ranking; HU-16 vía `beginner-eligibility.ts` |
| Búsqueda / asistente en barra | 🟡 | `SearchField` con placeholders animados; sin submit ni backend |
| CTA “Quiero invertir” / explorar | 🟡 | Navega a `/explore` (pantalla oculta = fondos) |
| Guía “Sora” (perfil educativo) | 🟡 | Card UI; navega a `/explore`, no a `/learn` |
| Aviso educativo / no asesoramiento | ✅ | `disclaimerSection` con a11y |
| Modo “quiero aprender” dedicado | ⬜ | Sin ruta ni flujo |
| Perfil educativo sin registro | ⬜ | Copy de Sora; sin persistencia |

**Archivos clave:** `home-screen.tsx`, `home-hero-carousel.tsx`, `featured-funds-carousel.tsx`, `features/funds/components/fund-card-icon.tsx`

**Deuda:**

- Datos de ranking duplicados respecto a futuro catálogo (`funds`).
- Import directo desde `features/funds` (modelo, mock, `CardFund`).
- `home-screen.tsx` ~670 líneas — candidato a extraer secciones (`RankingPreview`, `SoraEntryCard`, `EducationalDisclaimer`).

**Próximos pasos sugeridos:**

1. Consumir ranking vía `features/funds/services` o `core` (una sola fuente).
2. Sustituir `/explore` por `/funds` o crear `/learn`.
3. Navegar a `/funds/[isin]` cuando exista detalle.

---

## `features/funds` (catálogo, detalle, rankings)

**Rutas:** `/funds`, `/explore` (alias oculto)

| Capacidad MVP | Estado | Detalle en código |
|---------------|--------|-------------------|
| Modelo `FeaturedFund` | ✅ | `models/fund.ts` (`RiskLevel`, métricas, `quarterTag`, etc.) |
| Mock destacados | ✅ | `mocks/featured-funds-mock.ts` |
| `CardFund` (presentación) | ✅ | Usado en home y carousel |
| `FundMetricRow` | ✅ | Componente listo para detalle/comparación |
| Pantalla catálogo | 🟡 | `funds-screen.tsx` — placeholder “Next Functional Block” |
| Búsqueda por nombre / ISIN / categoría | ⬜ | |
| Filtros (comisión, riesgo, categoría, histórico) | ⬜ | |
| Rankings por categoría | ✅ | `/rankings` + `/rankings/[benchmarkKey]` (HU-14); API por benchmark |
| Detalle ampliado `/funds/[isin]` | ✅ | `fund-detail-screen.tsx` + secciones Información, Rentabilidad, Ratios, Exposición |
| Desglose Score Inversora en ficha | ✅ | `FundScoreBreakdown` visible; dominio `FundDetailProfile` |
| Estados de calidad de datos | 🟡 | `FundDataQualityBanner` si `scoringStatus` ≠ ok |
| Fecha de actualización de datos | 🟡 | `profile.asOf` por sección (mock) |
| Servicios / repositorio | 🟡 | `get-fund-by-isin.ts` + mocks; sin API |

**Próximos pasos sugeridos:**

1. `services/funds-repository.ts` (mock → API).
2. Pantalla catálogo con lista + filtros.
3. Conectar catálogo y ranking a detalle ampliado (deep links consistentes).
4. Sustituir mocks de `fund-detail-profile-mock.ts` por `inversora-api` (`GET /funds/:isin` BFF).

---

## `features/comparison`

**Ruta:** `/compare`

| Capacidad MVP | Estado |
|---------------|--------|
| Pantalla comparación | ✅ | `comparison-screen.tsx` |
| Selección de hasta 2 fondos | ✅ | `MAX_COMPARE_FUNDS = 2`, `compare-selection-store.ts` |
| Tabla métricas (TER, riesgo, score, …) | ✅ | `compare-metrics-table.tsx` |
| Avisos legales en comparación | ✅ | `LegalNotice` + `CompareFairnessBanner` |
| Enlace desde favoritos / catálogo | ⬜ |

**Dependencias:** reutilizar `FundMetricRow`, modelos de `funds`, posible estado en Zustand (`comparisonSelection`).

---

## `features/favorites`

**Ruta:** `/favorites`

| Capacidad MVP | Estado |
|---------------|--------|
| Pantalla favoritos | 🟡 Shell |
| Persistencia local | ⬜ |
| Añadir / quitar desde catálogo o detalle | ⬜ |
| Copy “no es recomendación” | ⬜ |
| Comparar desde favoritos | ⬜ |

**Dependencias:** `core/storage` + API de favoritos (ADR-001).

---

## `features/calculator`

**Ruta:** `/calculator`

| Capacidad MVP | Estado |
|---------------|--------|
| Pantalla calculadora | 🟡 Shell |
| Interés compuesto | ⬜ |
| Escenarios educativos | ⬜ |
| Avisos riesgo / rendimiento pasado | ⬜ |

**Nota:** la lógica matemática puede vivir en `features/calculator/lib` (pura, testeable) sin IA.

---

## `features/assistant` (planificado — no existe)

| Capacidad MVP | Estado |
|---------------|--------|
| Módulo `features/assistant` | ⬜ |
| Explicaciones en lenguaje llano | ⬜ |
| Integración backend (OpenAI / Vercel AI SDK) | ⬜ |
| No alterar rankings ni inventar datos | ⬜ | Regla de producto documentada |

**Ubicación UI inicial probable:** overlay desde `SearchField` en home, panel en detalle de fondo, botón “¿Por qué este score?”.

---

## `features/legal` (planificado — no existe)

| Capacidad MVP | Estado |
|---------------|--------|
| Ruta `/legal` | ⬜ |
| Términos, riesgo, fuentes de datos | ⬜ |
| Componente reutilizable `LegalNotice` | ⬜ | Extraer disclaimer de home |

---

## Matriz de dependencias actuales

```text
app ──────────────────────────► features/*/screens
                                    │
                    onboarding ─────┼──► funds (models, mocks, CardFund)  ⚠️
                                    │
                                    └──► shared (theme, UI, navigation)
```

**Objetivo (post ADR-001):**

```text
app ──► features/* ──► shared
              │
              └──► core (storage, api, scoring-read)
```

---

## Rutas: planificado vs implementado

| Ruta | MVP | Implementado |
|------|-----|--------------|
| `/` | Dashboard | ✅ |
| `/learn` | Modo educativo + perfilado | ✅ (`InitialProfileGate` en nativo; voluntario en web) |
| `/funds` | Catálogo | ✅ |
| `/funds/[isin]` | Detalle ampliado | ✅ |
| `/compare` | Comparación | ✅ |
| `/favorites` | Favoritos | ✅ |
| `/calculator` | Calculadora | ✅ |
| `/legal` | Legal | ✅ |
| `/rankings` | Rankings por benchmark | ✅ |
| `/explore` | — | 🟡 legado (oculto; deprecar) |

---

## Orden de implementación recomendado

Fases pensadas para minimizar retrabajo y respetar “educar primero”:

### Fase A — Fundamentos (1–2 sprints)

1. Crear `src/core` mínimo (`storage`, tipos de error).
2. ADR-001 aplicado: contratos de dominio y reglas de imports.
3. Unificar fuente de datos de fondos (eliminar `RANKING_FUNDS` inline).
4. Eliminar o redirigir `/explore`.

### Fase B — Catálogo y detalle

5. Catálogo funcional + filtros básicos.
6. `/funds/[isin]` con métricas y avisos.
7. Favoritos locales conectados al detalle.

### Fase C — Comparación y calculadora

8. Comparación con selección persistente.
9. Calculadora con disclaimers.

### Fase D — Educación y asistente

10. `/learn` + perfil educativo local.
11. Asistente backend (solo explicación).
12. `/legal` + componente compartido de avisos.

### Fase E — Datos reales

13. `inversora-api` + validación Zod en boundaries.
14. Scoring en backend; cliente solo muestra y explica.

---

## Referencias

- [Documentación (índice)](../README.md)
- [ADR-001: Límites de dominio (scoring, favoritos, asistente)](./adr-001-domain-boundaries.md)
- [Scoring (producto)](../product/scoring.md)
- [Índice de historias de usuario](../product/user-stories-index.md)
- `AGENTS.md` — reglas de capas y producto
- `README.md` — alcance MVP resumido

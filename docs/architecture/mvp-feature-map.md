# Mapa MVP por feature

Estado del código a junio de 2026.

Referencias de producto: [docs/product/](../product/) · `README.md` · `AGENTS.md` · [Índice de HUs](../product/user-stories-index.md).

Leyenda de madurez:

| Símbolo | Significado |
|--------|-------------|
| ✅ | Implementado de forma usable |
| 🟡 | Parcial / prototipo UI |
| ⬜ | No iniciado |
| 🔧 | Infraestructura planificada, ausente en repo |

---

## Resumen ejecutivo

| Área MVP | Progreso global | Bloqueador principal |
|----------|-----------------|----------------------|
| Dashboard inicial | 🟡 ~60% | Datos duplicados; navegación a detalle inexistente |
| Catálogo y rankings | 🟡 ~40% | Catálogo parcial; ficha ampliada en `/funds/[isin]` |
| Modo educativo / perfil | ⬜ ~5% | CTA “Sora” sin ruta `/learn` |
| Comparación | 🟡 ~10% | Solo shell de pantalla |
| Favoritos locales | 🟡 ~5% | Sin storage ni estado |
| Calculadora | 🟡 ~5% | Sin fórmulas ni escenarios |
| Asistente (IA) | ⬜ 0% | Sin feature ni backend |
| Avisos legales | 🟡 ~20% | Disclaimer en home; sin `/legal` global |
| Infra (`core`, API) | 🟡 ~25% | `core/` con scoring mock, storage stub, domain; sin API ni Supabase |

---

## Capas transversales

### `src/app` (Expo Router)

| Elemento | Estado | Notas |
|----------|--------|-------|
| Tabs: inicio, fondos, favoritos, comparar, calcular | ✅ | `_layout.tsx` + `FloatingTabBar` |
| Re-export fino a `features/*/screens` | ✅ | Patrón consistente |
| `/learn` | ⬜ | No existe |
| `/funds/[isin]` | ✅ | `app/funds/[isin].tsx` → ficha ampliada |
| `/legal` | ⬜ | No existe |
| `explore.tsx` (oculto, `href: null`) | 🟡 | Duplica `funds`; home navega aquí vía `router.push("/explore")` — deuda de rutas |

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
| `storage/favorites-store.ts` | 🟡 | Stub; ver ADR-001 |
| `scoring/` | 🟡 | `score-fund.ts` mock + `criteria.ts`; alinear con [RN-04](../product/scoring.md) |
| `api/` | ⬜ | Cliente Supabase / Edge Functions |
| `query/` | ⬜ | Caché, estados loading/error, fecha de datos |
| `config/` | ⬜ | URLs, flags de entorno |

---

## `features/onboarding` (dashboard / inicio)

**Rol actual:** pantalla principal del producto (hero, destacados, ranking teaser, búsqueda, entrada a guía “Sora”, disclaimer).

**Ruta:** `/` → `home-screen.tsx`

| Capacidad MVP | Estado | Detalle en código |
|---------------|--------|-------------------|
| Dashboard inicial | 🟡 | `HomeHero`, panel de contenido, ranking top 3 |
| Fondos destacados (carousel) | ✅ | `FeaturedFundsCarousel` + `FEATURED_FUNDS_MOCK` |
| Ranking resumido (Score Inversora) | 🟡 | `RANKING_FUNDS` inline en `home-screen.tsx` (5 fondos, muestra 3) |
| Búsqueda / asistente en barra | 🟡 | `SearchField` con placeholders animados; sin submit ni backend |
| CTA “Quiero invertir” / explorar | 🟡 | Navega a `/explore` (pantalla oculta = fondos) |
| Guía “Sora” (perfil educativo) | 🟡 | Card UI; navega a `/explore`, no a `/learn` |
| Aviso educativo / no asesoramiento | ✅ | `disclaimerSection` con a11y |
| Modo “quiero aprender” dedicado | ⬜ | Sin ruta ni flujo |
| Perfil educativo sin registro | ⬜ | Copy de Sora; sin persistencia |

**Archivos clave:** `home-screen.tsx`, `home-hero.tsx`, `featured-funds-carousel.tsx`, `fund-card-icon.tsx`

**Deuda:**

- Datos de ranking duplicados respecto a futuro catálogo (`funds`).
- Import directo desde `features/funds` (modelo, mock, `FundCard`).
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
| `FundCard` (presentación) | ✅ | Usado en home y carousel |
| `FundMetricRow` | ✅ | Componente listo para detalle/comparación |
| Pantalla catálogo | 🟡 | `funds-screen.tsx` — placeholder “Next Functional Block” |
| Búsqueda por nombre / ISIN / categoría | ⬜ | |
| Filtros (comisión, riesgo, categoría, histórico) | ⬜ | |
| Rankings por categoría | ⬜ | Solo preview en home |
| Detalle ampliado `/funds/[isin]` | ✅ | `fund-detail-screen.tsx` + secciones Información, Rentabilidad, Ratios, Exposición |
| Desglose Score Inversora en ficha | ✅ | `FundScoreBreakdown` visible; dominio `FundDetailProfile` |
| Estados de calidad de datos | 🟡 | `FundDataQualityBanner` si `scoringStatus` ≠ ok |
| Fecha de actualización de datos | 🟡 | `profile.asOf` por sección (mock) |
| Servicios / repositorio | 🟡 | `get-fund-by-isin.ts` + mocks; sin API |

**Próximos pasos sugeridos:**

1. `services/funds-repository.ts` (mock → API).
2. Pantalla catálogo con lista + filtros.
3. Conectar catálogo y ranking a detalle ampliado (deep links consistentes).
4. Sustituir mocks de `fund-detail-profile-mock.ts` por API/Supabase cuando exista.

---

## `features/comparison`

**Ruta:** `/compare`

| Capacidad MVP | Estado |
|---------------|--------|
| Pantalla comparación | 🟡 Shell con título y subtítulo |
| Selección de 2+ fondos | ⬜ |
| Tabla métricas (TER, riesgo, score, …) | ⬜ |
| Avisos legales en comparación | ⬜ |
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
                    onboarding ─────┼──► funds (models, mocks, FundCard)  ⚠️
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
| `/learn` | Modo educativo | ⬜ |
| `/funds` | Catálogo | 🟡 placeholder |
| `/funds/[isin]` | Detalle ampliado | ✅ |
| `/compare` | Comparación | 🟡 shell |
| `/favorites` | Favoritos | 🟡 shell |
| `/calculator` | Calculadora | 🟡 shell |
| `/legal` | Legal | ⬜ |
| `/explore` | — | 🟡 legado (oculto) |

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

13. Supabase + validación Zod en boundaries.
14. Scoring en backend; cliente solo muestra y explica.

---

## Referencias

- [Documentación (índice)](../README.md)
- [ADR-001: Límites de dominio (scoring, favoritos, asistente)](./adr-001-domain-boundaries.md)
- [Scoring (producto)](../product/scoring.md)
- [Índice de historias de usuario](../product/user-stories-index.md)
- `AGENTS.md` — reglas de capas y producto
- `README.md` — alcance MVP resumido

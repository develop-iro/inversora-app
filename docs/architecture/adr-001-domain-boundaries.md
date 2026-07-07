# ADR-001: Límites de dominio — scoring, favoritos y asistente

| Campo | Valor |
|-------|--------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-01 |
| **Contexto** | MVP Inversora en Expo SDK 56; arquitectura feature-first documentada en `AGENTS.md` |

---

## Contexto

Inversora debe:

- Educar antes de comparar; no actuar como broker ni asesor personalizado.
- Mostrar rankings **deterministas, trazables y explicables**.
- Permitir favoritos y perfil educativo **sin cuenta**, en almacenamiento local.
- Ofrecer el **Asistente Inversora** (IA; nombre interno “Sora” en copy puntual) que **solo explique**, sin alterar datos ni recomendar compraventa.

Hoy el código tiene:

- `features/onboarding` como dashboard real con datos mock duplicados.
- `features/funds` con modelos y UI de presentación, sin servicios de catálogo.
- `src/core` parcial: dominio, errores, scoring mock, stub de favoritos; sin API ni backend.
- Sin Zustand en dependencias aún.
- Acoplamiento `onboarding → funds` (imports directos entre features).

Sin decisiones explícitas, el scoring acabará en componentes React, el asistente mezclará prompts con mocks, y los favoritos se dispersarán en pantallas sueltas.

---

## Decisión

### 1. Scoring (Score Inversora)

**Dueño del cálculo:** backend (Supabase Edge Function o API dedicada) en producción; durante desarrollo, un módulo puro en `core/scoring` que pueda ejecutarse en cliente **solo para mocks**.

**Reglas:**

| Qué | Dónde | Quién puede escribir |
|-----|--------|----------------------|
| Algoritmo y pesos de criterios | `core/scoring` (lógica pura) + servidor en prod | Solo código de scoring, nunca UI |
| Entrada (métricas de fondo) | API / mock validado con Zod | `features/funds/services` |
| Salida (`score`, desglose por criterio, warnings) | DTO tipado en `core/scoring/types` | Scoring engine |
| Presentación (pills, ranking rows) | `features/funds`, `shared` | Solo lectura del DTO |
| Explicación en lenguaje natural | `features/assistant` | Lee DTO; **no recalcula** |

**Flujo:**

```text
[Fuentes de datos] → validación (Zod) → scoring engine → FundWithScore
                                                      ↓
                                            UI (rankings, detalle)
                                                      ↓
                                            assistant (explain only)
```

**Criterios documentados en producto** (TER, tracking error, AUM, antigüedad, benchmark, consistencia histórica, calidad de datos) viven como configuración versionada en `core/scoring/criteria.ts`, no hardcodeados en pantallas.

Si faltan datos: el engine devuelve `status: 'quarantined' | 'warning' | 'ok'`; la UI bloquea o advierte según `AGENTS.md`, no inventa un score.

---

### 2. Favoritos

**Dueño del dominio:** `core/storage/favorites-store.ts` (implementación) + contrato mínimo en `core/storage/types.ts`.

**API pública sugerida:**

```ts
// core/storage/favorites-store.ts (conceptual)
listFavoriteIsins(): Promise<string[]>;
isFavorite(isin: string): Promise<boolean>;
toggleFavorite(isin: string): Promise<void>;
```

**Reglas:**

- Persistencia: `expo-secure-store` o `AsyncStorage` vía abstracción en `core/storage` (intercambiable en tests).
- La UI en `features/favorites` solo lista y navega; **no** escribe en storage directamente.
- Catálogo y detalle llaman `toggleFavorite` a través de un hook delgado, p. ej. `features/funds/hooks/use-favorite.ts`, que delega en `core`.
- Los favoritos **no** se usan como input del scoring ni del ranking global.
- Copy obligatorio: guardar un favorito no es una recomendación (componente `LegalNotice` reutilizable).

**Estado en cliente (opcional):** Zustand store `useFavoritesStore` en `features/favorites/state` o en `core` si varias features lo necesitan — preferencia: **store en `core` o hook compartido exportado desde `core/storage`** para evitar que `comparison` importe `favorites`.

---

### 3. Asistente (Sora / Inversora Assistant)

**Dueño:** `features/assistant` (UI + orquestación) y `core/api/assistant-client.ts` (transporte).

**Reglas inmutables:**

1. No calcula ni modifica `score` ni orden de ranking.
2. No inventa ISIN, TER, rendimientos ni benchmarks; solo usa props/contexto pasado por la pantalla.
3. No emite “compra”, “vende”, “suscríbete”.
4. Toda respuesta incluye o asume el marco educativo (no asesoramiento personalizado).
5. Las llamadas van al **backend**; la API key no vive en la app.

**Estructura feature:**

```text
features/assistant/
  components/     # sheets, chips, message bubbles
  hooks/          # useAssistantExplainScore, useAssistantChat
  screens/        # opcional: modal full-screen learn
  types/          # AssistantContext, ExplainScoreRequest
core/api/
  assistant-client.ts
```

**`AssistantContext` mínimo** (ejemplo):

```ts
type AssistantContext = {
  surface: 'home' | 'fund-detail' | 'ranking' | 'compare' | 'calculator';
  fund?: { isin: string; name: string; scoreBreakdown?: ScoreBreakdown };
  userProfile?: EducationalProfile; // anon, local
};
```

El backend valida el contexto y rechaza peticiones que pidan alterar rankings.

**Relación con `/learn`:** el flujo de perfil educativo es UI en `features/onboarding` o `features/learn` (nuevo); el asistente **consume** el perfil guardado en `core/storage/educational-profile-store.ts`, no lo define.

---

### 4. Contratos compartidos y acoplamiento entre features

**Problema actual:** `onboarding` importa `CardFund`, mocks y tipos de `funds`.

**Decisión:**

| Tipo de artefacto | Ubicación |
|-------------------|-----------|
| Tipos de dominio (`Fund`, `FeaturedFund`, `ScoreBreakdown`) | `core/domain/fund.ts` o `shared/types/fund.ts` cuando no dependan de infra |
| Componentes de presentación de fondo usados en 2+ features | `features/funds/components/card-fund.tsx` **o** `shared/components/fund/` si crece el uso cross-feature |
| Mocks de desarrollo | `features/funds/mocks` o `core/fixtures` — consumidos por servicios, no importados en pantallas como arrays inline |

**Regla de imports (aplicar en lint/review):**

```text
features/*  →  shared/*, core/*
features/*  ↛  features/*   (prohibido salvo excepción documentada)
app/*       →  features/*, shared/*
core/*      ↛  features/*, shared/components/*
```

**Excepción temporal:** `onboarding → funds` hasta exponer `getFeaturedFunds()` desde un servicio o mover `CardFund` a `shared`.

---

### 5. Rutas legacy

- **`/explore`:** deprecar. Sustituir navegación por `/funds` o `/learn`.
- **`/legal`:** pantalla en `features/legal` o `app/legal.tsx` reexportando `legal-screen`; disclaimers pequeños como `shared/components/legal/legal-notice.tsx`.

---

### 6. Renombrado opcional (no bloqueante)

`features/onboarding` describe mal el rol actual (dashboard recurrente). Renombrar a `features/home` o `features/dashboard` en un PR dedicado, solo cuando el equipo lo priorice.

---

## Consecuencias

### Positivas

- Scoring auditable y alineado con “la IA solo explica”.
- Favoritos y perfil intercambiables (web/native) sin duplicar lógica.
- Asistente acotado reduce riesgo regulatorio y de alucinaciones financieras.
- `core` crece con responsabilidades claras antes de Supabase.

### Negativas / coste

- Refactor inicial: extraer `RANKING_FUNDS` de `home-screen.tsx`, consolidar `CardFund` en `features/funds`.
- Backend necesario antes de asistente en producción.
- Más archivos que un prototipo monolítico.

### No hacer (explícito)

- No poner prompts del asistente dentro de `card-fund.tsx` o del scoring.
- No usar favoritos como señal de ranking personalizado en MVP.
- No añadir Zustand global hasta tener 2+ consumidores (favoritos + comparación); entonces store en `core` o feature `favorites` exportando hook.

---

## Plan de adopción incremental

| Paso | Acción | Esfuerzo |
|------|--------|----------|
| 1 | Crear `src/core/storage` + `favorites-store` stub | Bajo |
| 2 | Crear `src/core/domain/fund.ts`; reexport desde `funds/models` | Bajo |
| 3 | `funds/services/get-rankings.ts` + usar en home | Medio |
| 4 | `core/scoring` mock + DTO `FundWithScore` | Medio |
| 5 | Eliminar `/explore`, actualizar `router.push` | Bajo |
| 6 | `features/assistant` + `assistant-client` mock | Medio |
| 7 | Backend scoring + assistant | Alto (post-MVP UI) |

---

## Referencias

- [Mapa MVP por feature](./mvp-feature-map.md)
- [Scoring (producto)](../product/scoring.md)
- [Asistente Inversora (producto)](../product/assistant.md)
- [Índice de documentación](../README.md)
- `AGENTS.md` — Scoring, AI, Privacy
- `README.md` — alcance MVP resumido

# Analytics (HU-41 / HU-42)

## Hosting decision (MVP)

**Opción A — first-party:** la app envía eventos anónimos a `inversora-api` (`POST /analytics/events`), que los persiste en PostgreSQL. La visualización se hace con SQL o Metabase/Grafana conectados a la misma base.

Motivos:

- Alineado con privacidad del MVP (sin PII, control de retención).
- Ya existe `core/analytics/track-event.ts` y el módulo NestJS `analytics`.
- El backend canónico del MVP es NestJS + PostgreSQL.

**Complemento técnico:**

- **EAS Observe** (`expo-observe`) — arranque (cold/warm, TTR, TTI) y navegación por ruta en builds nativos.
- **EAS Insights** (`expo-insights`) — cold starts agregados por plataforma y versión de store.
- **Sentry** — errores y traces cuando `EXPO_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` estén configurados.

**Más adelante (opcional):** PostHog EU como capa de visualización (opción híbrida), sin sustituir PostgreSQL como fuente de verdad.

## Capas

| Capa | Cliente | Backend / destino |
|------|---------|-------------------|
| Producto (pantallas, clics, funnels) | `trackEvent` | `analytics_events` (PostgreSQL) |
| Rendimiento de superficies (catálogo/ficha) | `trackPerfMark` | `analytics_events` (`perf_mark`) |
| Arranque y navegación nativa | `expo-observe` (`ObserveRoot`, `markAppInteractive`) | EAS Observe dashboard |
| Uso por versión / plataforma | `expo-insights` (autolink nativo) | EAS Insights → App usage |
| Salud técnica (crashes) | Sentry SDK | Sentry (opcional) |

Expo Observe e Insights **no sustituyen** el funnel first-party: miden salud técnica y adopción, no drop-off de learn, fondos abiertos o comparaciones.

Las métricas de Observe/Insights aparecen tras un **build nativo nuevo** (preview/production). Expo Go y bundles debug no despachan por defecto. En **web**, Observe es no-op para no romper EAS Hosting.

## Taxonomía de eventos

Definida en `src/core/analytics/analytics-event-names.ts` (app) y `analytics-event.schema.ts` (API). Ambos deben mantenerse sincronizados.

Eventos del funnel learn: `learn_gate_redirect`, `learn_started`, `learn_step_viewed`, `learn_step_answered`, `learn_step_back`, `learn_abandoned`, `learn_inconsistency_shown`, `learn_inconsistency_resolved`, `learn_completed`.

## Reglas de privacidad

- No enviar texto libre del cuestionario ni mensajes del asistente.
- Solo IDs de paso/opción y enums agregados (`riskOrientation`, `profileVersion`).
- `sessionId` anónimo por sesión de funnel (AsyncStorage), no vinculado a cuenta.
- `deviceId` opaco por instalación (SecureStore) para cruzar analytics con perfil derivado; no incluye PII ni respuestas crudas del cuestionario.
- En EAS Observe, la integración Expo Router filtra el param `isin` para no exportar ISINs en URLs resueltas.

## Dashboards

Consultas SQL y vistas en [analytics-dashboards.md](./analytics-dashboards.md).

Dashboards nativos Expo: proyecto EAS → **Observe** (startup/navegación) e **Insights → App usage** (cold starts).

## Ver también

- [AGENTS.md](../../AGENTS.md) — política de analytics anónimos
- [mvp-feature-map.md](./mvp-feature-map.md) — estado de infra `analytics/`
- [EAS Observe get started](https://docs.expo.dev/eas/observe/get-started/)
- [EAS Insights app usage](https://docs.expo.dev/eas-insights/app-usage/)

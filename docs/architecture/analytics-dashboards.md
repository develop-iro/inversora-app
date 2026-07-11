# Analytics dashboards (Opción A — PostgreSQL)

Vistas SQL creadas en la migración `20250711120000_add_analytics_events`. Conecta Metabase, Grafana o `psql` a la misma base que usa `inversora-api`.

## Vistas disponibles

| Vista | Uso |
|-------|-----|
| `analytics_learn_step_views_daily` | Vistas por paso del cuestionario learn por día |
| `analytics_learn_completion_daily` | `learn_started` vs `learn_completed` por día |
| `analytics_screen_views_daily` | Pantallas más visitadas por día |
| `analytics_learn_profile_distribution` | Distribución de `riskOrientation` al completar |

## Funnel learn (drop-off por paso)

```sql
WITH step_views AS (
  SELECT
    properties ->> 'stepId' AS step_id,
    COUNT(DISTINCT "sessionId") AS sessions
  FROM analytics_events
  WHERE event = 'learn_step_viewed'
    AND "occurredAt" >= NOW() - INTERVAL '30 days'
  GROUP BY 1
),
completions AS (
  SELECT COUNT(DISTINCT "sessionId") AS completed_sessions
  FROM analytics_events
  WHERE event = 'learn_completed'
    AND "occurredAt" >= NOW() - INTERVAL '30 days'
)
SELECT step_id, sessions
FROM step_views
ORDER BY sessions DESC;
```

## Tasa de completado (30 días)

```sql
SELECT
  SUM(started_count) AS started,
  SUM(completed_count) AS completed,
  ROUND(
    100.0 * SUM(completed_count) / NULLIF(SUM(started_count), 0),
    2
  ) AS completion_rate_pct
FROM analytics_learn_completion_daily
WHERE day >= NOW() - INTERVAL '30 days';
```

## Abandono en gate inicial

```sql
SELECT COUNT(*) AS abandon_count
FROM analytics_events
WHERE event = 'learn_abandoned'
  AND properties ->> 'mode' = 'initial'
  AND "occurredAt" >= NOW() - INTERVAL '30 days';
```

## Eventos por sesión (depuración)

```sql
SELECT
  "sessionId",
  event,
  surface,
  properties,
  "occurredAt"
FROM analytics_events
WHERE "sessionId" = 'sess_example'
ORDER BY "occurredAt";
```

## Metabase

1. Añade la base PostgreSQL de `DATABASE_URL`.
2. Importa las cuatro vistas como modelos.
3. Crea un dashboard con: funnel learn (bar chart por `step_id`), completion rate (número), screen views (tabla), profile distribution (pie).

## Retención

Definir política de borrado (p. ej. 90 días) con un job programado o `pg_cron` cuando el volumen lo requiera.

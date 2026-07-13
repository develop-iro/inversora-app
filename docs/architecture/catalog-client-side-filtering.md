# Catalog Client-Side Filtering

Estado: Aceptado

## Contexto

El catalogo usa `GET /funds` paginado para los resultados definitivos, pero la UI de filtros necesita responder mientras el usuario edita un borrador dentro del sheet. Descargar todos los fondos para calcular esos numeros rompe el modelo de scroll infinito y puede bloquear la carga inicial.

## Decision

Los previews de filtros y categorias usan metricas ligeras del backend:

- `GET /funds` sigue cargando cards paginadas para scroll infinito.
- `GET /funds/catalog-metrics` devuelve `total` y categorias agregadas con `count/groupBy`.
- `useCatalogMetrics()` alimenta el headline, categorias y el CTA `Ver N fondos`.
- Las rentabilidades en tarjetas (`returns.oneYear`, `returns.threeYear`, `returns.asOf`) vienen de columnas materializadas en PostgreSQL durante el sync diario; el listado no recalcula precios en cada request.
- Los filtros de rentabilidad historica (`minReturn1y` / `minReturn3y`) se aplican en SQL al pulsar **Aplicar**; el preview del sheet no muestra contador fiable mientras el filtro de rentabilidad esta activo.

La lista principal sigue usando `useCatalogFundsPagination()` y solo refresca al aplicar filtros, al buscar o al recargar.

## Reglas

- No descargar todas las paginas del catalogo para pintar contadores.
- No llamar `GET /funds` por cada toggle del sheet; usar `GET /funds/catalog-metrics`.
- Si las metricas aun no cargaron, mostrar el ultimo total aplicado como fallback.
- Con `minReturnPercent` activo en el borrador, el CTA del sheet muestra **Aplica para ver resultados** (sin contador preview).
- Los filtros server-side y frontend deben evolucionar juntos: query, categoria/tema, TER, score, principiante y riesgo.

## Riesgos

- `catalog-metrics` no agrega por umbrales de rentabilidad; el contador preview no es fiable para ese filtro hasta aplicar.
- `catalog-metrics` debe mantenerse barato: solo agregaciones de Postgres, sin mapear cards ni cargar historicos.
- Para miles reales, revisar indices DB sobre `catalogVisibility`, `investmentTheme`, `riskLevel`, `score`, `ter`, `return1y`, `return3y` y campos de busqueda.

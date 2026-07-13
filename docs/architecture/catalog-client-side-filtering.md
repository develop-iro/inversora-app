# Catalog Client-Side Filtering

Estado: Aceptado

## Contexto

El catalogo usa `GET /funds` paginado para los resultados definitivos, pero la UI de filtros necesita responder mientras el usuario edita un borrador dentro del sheet. Descargar todos los fondos para calcular esos numeros rompe el modelo de scroll infinito y puede bloquear la carga inicial.

## Decision

Los previews de filtros y categorias usan metricas ligeras del backend:

- `GET /funds` sigue cargando cards paginadas para scroll infinito.
- `GET /funds/catalog-metrics` devuelve `total` y categorias agregadas con `count/groupBy`.
- `useCatalogMetrics()` alimenta el headline, categorias y el CTA `Ver N fondos`.
- Los filtros de rentabilidad historica siguen usando fallback porque requieren enriquecimiento de retornos.

La lista principal sigue usando `useCatalogFundsPagination()` y solo refresca al aplicar filtros, al buscar o al recargar.

## Reglas

- No descargar todas las paginas del catalogo para pintar contadores.
- No llamar `GET /funds` por cada toggle del sheet; usar `GET /funds/catalog-metrics`.
- Si las metricas aun no cargaron, mostrar el ultimo total aplicado como fallback.
- Los filtros server-side y frontend deben evolucionar juntos: query, categoria/tema, TER, score, principiante y riesgo.

## Riesgos

- El preview de rentabilidad historica puede caer a fallback porque depende de retornos enriquecidos.
- `catalog-metrics` debe mantenerse barato: solo agregaciones de Postgres, sin mapear cards ni cargar historicos.
- Para miles reales, revisar indices DB sobre `catalogVisibility`, `investmentTheme`, `riskLevel`, `score`, `ter` y campos de busqueda.

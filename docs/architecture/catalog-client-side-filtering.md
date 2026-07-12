# Catalog Client-Side Filtering

Estado: Aceptado

## Contexto

El catalogo usa `GET /funds` paginado para los resultados definitivos, pero la UI de filtros necesita responder mientras el usuario edita un borrador dentro del sheet. Si el contador del boton depende de `meta.total`, muestra el total de los filtros ya aplicados, no el total que tendra el borrador actual.

## Decision

Los previews de filtros usan un indice en memoria cargado una vez:

- `getCatalogFundsIndex()` carga una slice amplia del catalogo.
- `useCatalogFundsIndex()` comparte esa slice con categorias y previews.
- `filterCatalogFunds()` y `countCatalogFunds()` aplican filtros puros sobre esa slice.
- `FundCatalogFiltersSheet` calcula el label `Ver N fondos` desde el borrador local.

La lista principal sigue usando `useCatalogFundsPagination()` y solo refresca al aplicar filtros, al buscar o al recargar.

## Reglas

- No llamar `GET /funds` por cada toggle del sheet.
- Mantener la logica de filtros de preview en `src/features/funds/utils/filter-catalog-funds.ts`.
- Si el indice aun no cargo, mostrar el ultimo total aplicado como fallback.
- Los filtros server-side y client-side deben evolucionar juntos: query, categoria/tema, TER, score, rentabilidad, principiante y riesgo.

## Riesgos

- El indice es una slice, no necesariamente el 100% del universo si el backend supera `CATALOG_FUNDS_INDEX_LIMIT`.
- El preview puede diferir del total real si la API aplica reglas nuevas que el filtro local no conoce.
- Para escalar a miles reales, el backend deberia exponer un endpoint ligero de facets/counts o permitir descargar un indice compacto.

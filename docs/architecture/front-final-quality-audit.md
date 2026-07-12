# Front Final Quality Audit

Fecha: 2026-07-12
Alcance: app Expo/React Native `invesora`, foco en entrega final MVP.

## Veredicto

La app esta en buen estado para una entrega MVP si se mantiene el alcance educativo: dashboard, aprendizaje, catalogo, ranking, comparador, calculadora, favoritos locales y avisos legales. La arquitectura por `features`, `core` y `shared` es razonable, y la suite `test:ci` cubre los flujos principales.

## Mejoras aplicadas en esta rama

- El sheet de filtros del catalogo ahora recalcula el CTA `Ver N fondos` desde el borrador local.
- Se agrego un indice de catalogo en memoria (`useCatalogFundsIndex`) para categorias y previews.
- Se agregaron filtros puros (`filterCatalogFunds`, `countCatalogFunds`) con tests unitarios.
- La carga inicial del catalogo ahora aborta requests obsoletos al cambiar filtros o desmontar la pantalla.
- Los pares sugeridos de comparacion usan ISINs existentes en el catalogo mock, estabilizando e2e.

## Riesgos de rendimiento

- `funds-screen.tsx` sigue concentrando mucha coordinacion: filtros, analytics, paginado, SORA, perfil educativo y UI. Para post-MVP conviene extraer `useFundsCatalogController`.
- El indice de catalogo usa una slice amplia. Si el catalogo real supera varios miles de fondos, conviene pedir al backend un indice compacto o facets/counts.
- `filterCatalogFunds()` ordena despues de filtrar. Es correcto para el tamano actual, pero para miles conviene memoizar por clave de filtros o mover counts a backend.
- Los iconos y cards del catalogo pueden generar costo visual si se cargan muchas filas; mantener paginado y evitar renderizar todo el indice.

## Posibles fugas o carreras

- Mitigado: `useCatalogFundsPagination` aborta la carga inicial anterior cuando cambian filtros.
- Ya mitigado: `useCatalogCategoryIndex/useCatalogFundsIndex` aborta el request al desmontar.
- Riesgo restante: llamadas manuales de `loadMore()` no se abortan si el usuario navega justo durante carga. El `requestIdRef` evita aplicar estado viejo, pero no cancela la red.
- Riesgo restante: sheets de SORA y picker pueden mantener estado de sesion si se abren/cerran rapido; revisar si se observan warnings de setState after unmount.

## Casos de mejora recomendados

- Corregir textos con encoding roto (`mÃ©tricas`, `catÃ¡logo`, etc.) antes de demo final.
- Condicionar o configurar Sentry para eliminar warnings de build si no se usara en la presentacion.
- Extraer controller del catalogo para bajar complejidad de la pantalla y facilitar tests.
- Agregar test unitario de `useCatalogFundsPagination` con abort/cambio rapido de filtros.
- Agregar un smoke visual manual mobile/desktop sobre: catalogo, filtros, comparador, calculadora y legal.

## Checklist antes de entregar

- `pnpm run test:ci`
- Smoke manual web mobile en `/`, `/learn`, `/funds`, `/compare`, `/calculator`, `/legal`
- Abrir filtros de catalogo y verificar que el boton cambia al tocar riesgo, TER, score, rentabilidad y categoria
- Confirmar que el entorno de demo no depende de una API local apagada
- Confirmar que los avisos legales siguen visibles en comparador, calculadora y ficha

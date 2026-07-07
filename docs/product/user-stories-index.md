# Índice de historias de usuario (MVP)

Referencia condensada del documento oficial (*Documentación de Proyecto: Inversora*, v1.0). Para criterios de aceptación completos, consultar ese documento.

**Leyenda de estado (implementación en repo):**

| Estado | Significado |
|--------|-------------|
| ✅ | Cubierto de forma usable |
| 🟡 | Parcial / UI o mock |
| ⬜ | No iniciado |

Estado detallado por módulo: [mvp-feature-map.md](../architecture/mvp-feature-map.md).

---

## EP-01 — Dashboard y destacados

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-01 | Dashboard inicial sin login; destacados; “Quiero aprender” | Alta | 🟡 |
| HU-02 | Fondos destacados del último trimestre (tarjetas, score, aviso) | Alta | 🟡 |
| HU-03 | Tarjeta resumida (pocos datos, favorito, detalle) | Alta | 🟡 |

## EP-02 — Catálogo y búsqueda

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-04 | Catálogo de fondos indexados | Alta | ⬜ |
| HU-05 | Búsqueda por nombre o ISIN | Alta | ⬜ |
| HU-06 | Búsqueda predictiva / sugerencias | Media | 🟡 |
| HU-07 | Filtros básicos | Alta | ⬜ |
| HU-08 | Ordenación (score, comisión, histórico) | Media | ⬜ |
| HU-09 | Ficha de fondo | Alta | 🟡 |
| HU-10 | Desglose del score | Alta | ✅ |
| HU-11 | Explicación sencilla del fondo | Alta | 🟡 |
| HU-12 | Advertencias de datos en ficha | Alta | 🟡 |

## EP-03 — Scoring y rankings

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-13 | Calcular score técnico 0–100 | Alta | 🟡 |
| HU-14 | Agrupar por benchmark | Alta | ⬜ |
| HU-15 | Etiquetas UI por rango de score | Alta | ⬜ |
| HU-16 | Excluir score &lt; 30 de destacados / compatibles | Alta | ⬜ |

## EP-04 — Modo educativo

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-17 | Iniciar “Quiero aprender” | Alta | 🟡 |
| HU-18 | Perfilado con tarjetas/botones (sin teclado) | Alta | ⬜ |
| HU-19 | Explicar riesgo antes de preguntar | Alta | ⬜ |
| HU-20 | Perfil orientativo (conservador/moderado/dinámico) | Alta | ⬜ |
| HU-21 | Detectar respuestas inconsistentes | Media | ⬜ |

## EP-05 — Asistente Inversora

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-22 | Explicar conceptos financieros | Alta | ⬜ |
| HU-23 | Explicar por qué un fondo destaca | Alta | ⬜ |
| HU-24 | Explicaciones cacheadas | Media | ⬜ |
| HU-40 | Bloquear lenguaje de recomendación | Alta | ⬜ |

## EP-06 — Comparación y calculadora

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-25 | Añadir fondo al comparador | Media | ⬜ |
| HU-26 | Comparar **máximo dos** fondos | Media | 🟡 |
| HU-27 | Advertir comparación no homogénea | Media | ⬜ |
| HU-28 | Abrir calculadora | Alta | 🟡 |
| HU-29 | Inputs capital / aportación / horizonte | Alta | ⬜ |
| HU-30 | Tres escenarios (prudente / medio / optimista) | Alta | ⬜ |

## EP-07 — Favoritos

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-31 | Guardar favorito local | Media | 🟡 |
| HU-32 | Ver lista de favoritos | Media | 🟡 |
| HU-33 | Eliminar favorito | Media | 🟡 |

## EP-08 — Validación y calidad de datos

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-34 | Validar ISIN | Alta | ⬜ |
| HU-35 | Validar TER | Alta | ⬜ |
| HU-36 | Validar benchmark y categoría | Alta | ⬜ |
| HU-37 | Estados de fondo (válido, cuarentena, …) | Alta | ⬜ |

## EP-09 — Legal, analítica y rendimiento

| ID | Historia (resumen) | Prioridad | Estado |
|----|-------------------|-----------|--------|
| HU-38 | Aviso de no asesoramiento | Alta | 🟡 |
| HU-39 | Aviso rentabilidad pasada | Alta | ⬜ |
| HU-41 | Eventos analíticos anónimos | Media | ⬜ |
| HU-42 | Medición de rendimiento (RNF) | Media | ⬜ |

---

## Trazabilidad rápida → código

| HU | Ubicación principal |
|----|---------------------|
| HU-01, HU-02 | `features/onboarding/screens/home-screen.tsx`, `featured-funds-carousel.tsx` |
| HU-03 | `features/funds/components/card-fund.tsx` |
| HU-13 | `core/scoring/score-fund.ts` (mock) |
| HU-31–33 | `core/storage/favorites-store.ts` (stub) + `features/favorites` |
| HU-26 | `features/comparison` (shell) |

## Mantenimiento

Al implementar una HU, actualizar la columna **Estado** aquí y la tabla correspondiente en `mvp-feature-map.md`.

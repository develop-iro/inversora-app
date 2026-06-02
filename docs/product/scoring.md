# Score Inversora y rankings

Reglas de producto para el motor de puntuación. La implementación vive en `src/core/scoring/`; en producción el cálculo definitivo debería ejecutarse en **backend** (ADR-001).

## Objetivo

Ordenar fondos **indexados comparables** con un score **determinista, trazable y auditable** (0–100). La IA **explica** el resultado; **no** lo calcula ni lo modifica.

## Ponderación MVP (regla de negocio RN-04)

Para la **versión de producto acordada en el documento oficial**, el score técnico del MVP usa solo cuatro inputs normalizados dentro del mismo benchmark:

| Criterio | Peso |
|----------|------|
| TER (comisión) | 40 % |
| Tracking error | 40 % |
| Patrimonio gestionado (AUM) | 10 % |
| Antigüedad del fondo | 10 % |

Fórmula conceptual: normalizar cada métrica en el grupo comparable, aplicar pesos y obtener `puntuacionFinal` entre 0 y 100.

## Agrupación y comparabilidad (RN-02, HU-14)

- Un fondo solo compite en ranking con fondos del **mismo benchmark** (o categoría suficientemente homogénea).
- No mezclar renta fija con renta variable en el mismo ranking.
- Sin benchmark válido → **no participa** en rankings públicos.

## Datos mínimos (RN-03)

Para aparecer en ranking o destacados:

- ISIN válido
- Nombre
- TER
- Benchmark
- Categoría

## Calidad de datos (RN-05 y validaciones)

Si faltan datos secundarios o hay inconsistencias:

| Severidad | Acción posible |
|-----------|----------------|
| Crítica | Rechazo, cuarentena o exclusión del ranking |
| Media | Advertencia en UI o penalización del score |
| Baja | Mostrar con aviso; mantener último valor válido si aplica |

Estados de fondo (HU-37): válido, advertencia, datos incompletos, excluido, cuarentena.

## Etiquetas para el usuario (HU-15)

Traducción del score numérico a lenguaje accesible:

| Rango | Etiqueta UI |
|-------|-------------|
| 90–100 | Líder de categoría |
| 75–89 | Muy eficiente |
| 50–74 | Consistente / Promedio |
| 30–49 | Mejorable / Por debajo de la media |
| 0–29 | Bajo rendimiento técnico |

## Protección al principiante (HU-16)

- Fondos con score **&lt; 30** no deben aparecer en **destacados** ni como “compatibles” para flujos orientados a principiantes.
- Pueden seguir existiendo en catálogo con advertencias si el producto lo permite.

## Fondos destacados (HU-02)

Los destacados del **último trimestre** son un subconjunto curado de fondos con datos válidos y score adecuado, mostrados en tarjeta con:

- Etiqueta cualitativa (badge de contexto, p. ej. “Ideal para empezar”)
- Score numérico
- Enlace a ficha
- Aviso de que **no constituye recomendación personalizada** en la sección

## Desglose en ficha (HU-10)

La ficha debe poder mostrar puntos por TER, tracking error, AUM y edad, más **versión del modelo de scoring** (`SCORING_CRITERIA_VERSION` o equivalente en backend).

## Implementación en este repositorio

| Artefacto | Rol |
|-----------|-----|
| `src/core/scoring/criteria.ts` | Pesos versionados (`SCORING_CRITERIA_VERSION`) |
| `src/core/scoring/score-fund.ts` | Motor **mock** determinista para desarrollo |
| `src/core/scoring/types.ts` | `ScoredFund`, desglose, estados |

### Desfase actual (importante)

El mock en repo (`mvp-mock-1`) incluye pesos adicionales (**consistencia histórica**, **calidad de datos**) que **no** forman parte de RN-04 del documento oficial. Hasta alinear código y backend:

- Tratar RN-04 como **especificación de producto** para producción.
- Tratar `SCORING_CRITERIA` del cliente como **prototipo ampliado** para UI y desglose mock.

**Tarea de alineación:** unificar `criteria.ts` con RN-04 o documentar una v2 del modelo en un ADR antes de publicar rankings reales.

## Criterios mencionados en README pero fuera del score MVP

Benchmark, categoría y consistencia histórica pueden usarse como:

- Reglas de **agrupación** y filtros.
- Criterios de **validación** o señales de DQ.
- Ampliación **post-MVP** del modelo de scoring.

No deben mezclarse en documentación con los pesos RN-04 sin etiquetar la versión del modelo.

## Referencias

- [assistant.md](./assistant.md) — la IA no recalcula el score
- [adr-001-domain-boundaries.md](../architecture/adr-001-domain-boundaries.md)
- [user-stories-index.md](./user-stories-index.md) — HU-02, HU-10, HU-13–16, HU-34–37

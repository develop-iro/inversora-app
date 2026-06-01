# Documentación de Invesora

Índice de la documentación del repositorio. El detalle de negocio completo vive en el documento oficial del proyecto (*Documentación de Proyecto: Invesora*, v1.0); aquí se concentra lo **esencial para desarrollar y mantener el MVP** sin duplicar ese volumen.

## Cómo usar estos docs

| Si necesitas… | Lee |
|---------------|-----|
| Visión, principios y límites del producto | [product/vision-and-principles.md](./product/vision-and-principles.md) |
| Qué entra y qué no en el MVP | [product/mvp-scope.md](./product/mvp-scope.md) |
| Score Invesora, rankings y etiquetas UI | [product/scoring.md](./product/scoring.md) |
| Reglas del Asistente Invesora (IA) | [product/assistant.md](./product/assistant.md) |
| Historias de usuario (HU) y trazabilidad | [product/user-stories-index.md](./product/user-stories-index.md) |
| Avisos legales y copy obligatorio | [product/legal-and-disclaimers.md](./product/legal-and-disclaimers.md) |
| Estado del código por feature | [architecture/mvp-feature-map.md](./architecture/mvp-feature-map.md) |
| Límites de dominio (scoring, favoritos, IA) | [architecture/adr-001-domain-boundaries.md](./architecture/adr-001-domain-boundaries.md) |
| Stack elegido vs alternativas del doc oficial | [architecture/stack-decisions.md](./architecture/stack-decisions.md) |

## Jerarquía de fuentes de verdad

```text
Documento oficial (negocio, HUs, RN)     ← fuera del repo
        ↓
docs/product/*                           ← reglas de producto resumidas y estables
        ↓
README.md + AGENTS.md                    ← onboarding rápido para humanos y agentes
        ↓
docs/architecture/*                      ← decisiones técnicas y mapa de código
        ↓
src/                                     ← implementación
```

## Producto (`docs/product/`)

Definiciones que **no deberían cambiar** sin revisar el doc oficial o un ADR:

- Principio *educar primero, comparar después*.
- Alcance MVP (solo fondos indexados; sin broker ni asesoramiento personalizado).
- Modelo de scoring objetivo y papel del asistente.
- Índice de historias de usuario para cerrar issues y sprints.

## Arquitectura (`docs/architecture/`)

- **ADR-001:** dónde vive el scoring, favoritos y el asistente; reglas de imports entre features.
- **mvp-feature-map:** qué está implementado hoy (se actualiza con el código).
- **stack-decisions:** Expo, theme propio, backend planificado.

## Mantenimiento

- Al cerrar una HU relevante, actualizar el estado en `user-stories-index.md` y, si aplica, una fila en `mvp-feature-map.md`.
- Si cambian pesos de scoring o reglas RN, actualizar `product/scoring.md` y `src/core/scoring/criteria.ts` (o el backend) en el mismo cambio.
- Nuevas decisiones irreversibles → nuevo ADR en `architecture/adr-NNN-titulo.md` y enlace desde este README.

## Referencias externas

- [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/)
- Documento oficial: *Documentación de Proyecto: Invesora* (v1.0) — mantener copia local acordada por el equipo.

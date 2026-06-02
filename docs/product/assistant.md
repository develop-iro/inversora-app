# Asistente Inversora (IA)

Capa de **explicación educativa** entre los datos financieros y el usuario. En el documento oficial aparece como **Asistente Inversora**; en la portada del mismo documento el actor de IA se nombra **Sora** (nombre interno / personaje). En UI y copy de producto se prioriza **Asistente Inversora** salvo branding explícito de Sora en el modo “Quiero aprender”.

## Propósito

- Traducir conceptos (TER, benchmark, tracking error, riesgo, etc.).
- Explicar por qué un fondo aparece destacado o con cierto score.
- Acompañar el perfilado educativo con preguntas conversacionales (tarjetas, botones, sliders — HU-18).
- Ayudar a navegar la app.

## Lo que no debe hacer (RN-01, HU-40)

| Prohibido | Motivo |
|-----------|--------|
| Modificar el score o el orden del ranking | Separación ranking técnico / IA |
| Inventar ISIN, TER, rentabilidades o benchmarks | Integridad de datos |
| “Compra”, “vende”, “suscríbete”, “invierte ahora” | No es asesoramiento |
| Presentar favoritos como recomendación | Favorito ≠ consejo |
| Sustituir avisos legales | Compliance y claridad |

## Arquitectura prevista (ADR-001)

```text
Pantalla (features/*)
    → pasa AssistantContext (fondo, superficie, perfil local)
    → core/api/assistant-client.ts
    → backend (OpenAI / Vercel AI SDK)
    → respuesta validada + marco educativo
```

- **API keys solo en servidor.**
- El backend puede rechazar peticiones que pidan recalcular rankings o datos no presentes en el contexto.

## Contexto mínimo (`AssistantContext`)

Campos típicos (ver ADR-001 para el tipo completo):

- `surface`: `home` | `fund-detail` | `ranking` | `compare` | `calculator` | `learn`
- `fund`: ISIN, nombre, desglose de score opcional
- `userProfile`: perfil educativo anónimo (riesgo orientativo, horizonte, etc.)

## Flujos de producto ligados al asistente

| HU | Tema |
|----|------|
| HU-11 | Explicación sencilla en ficha |
| HU-17–21 | Modo “Quiero aprender” y perfil orientativo |
| HU-22 | Glosario de conceptos |
| HU-23 | Por qué un fondo está destacado |
| HU-24 | Explicaciones cacheadas |
| HU-40 | Bloqueo de lenguaje de recomendación directa |

## Copy y transparencia

- Indicar cuando una explicación fue **generada o asistida por IA** (HU-11, HU-23).
- Recordar que el perfil es **orientativo**, no MiFID.
- Ante contradicciones en el perfilado (HU-21), explicar antes de continuar.

## Estado en el repo

- Feature `features/assistant`: **no creada** (ver [mvp-feature-map.md](../architecture/mvp-feature-map.md)).
- Entrada UI provisional: card “Sora” / búsqueda en home sin backend.

## Ver también

- [legal-and-disclaimers.md](./legal-and-disclaimers.md)
- [scoring.md](./scoring.md)

# Arquitectura

Documentación técnica del repositorio Invesora.

## Documentos

| Documento | Contenido |
|-----------|-----------|
| [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md) | Scoring, favoritos, asistente, imports entre features |
| [mvp-feature-map.md](./mvp-feature-map.md) | Estado de implementación por feature y ruta |
| [stack-decisions.md](./stack-decisions.md) | Stack adoptado vs alternativas del doc oficial |

## Estructura de código

```text
src/
  app/          # Expo Router (capa fina)
  features/     # Módulos de producto (screens, components, services)
  shared/       # UI, theme, hooks reutilizables
  core/         # Dominio transversal: scoring, storage, errors, domain types
```

Reglas de dependencia:

```text
app       → features, shared
features  → shared, core
features  ↛ features   (evitar; ver excepción en ADR-001)
core      ↛ features, shared/components
```

## ADRs

Formato: `adr-NNN-titulo-corto.md`. Estado en cabecera (Propuesto / Aceptado / Obsoleto). Nuevas decisiones irreversibles → nuevo ADR + enlace en [docs/README.md](../README.md).

## Producto vs arquitectura

- Reglas de negocio estables → `docs/product/*`
- Dónde vive cada capacidad en código → este directorio + `mvp-feature-map.md`

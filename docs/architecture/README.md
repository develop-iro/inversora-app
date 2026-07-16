# Arquitectura

Documentación técnica del repositorio Inversora.

## Documentos

| Documento | Contenido |
|-----------|-----------|
| [clean-architecture-principles.md](./clean-architecture-principles.md) | Nueve principios no negociables (dependencias, dominio, puertos, composición, DTOs, errores, tests, observabilidad) |
| [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md) | Scoring, favoritos, asistente, imports entre features |
| [adr-003-component-naming.md](./adr-003-component-naming.md) | Nombres y carpetas del design system (`TabHeader`, `TextParagraph`, …) |
| [adr-004-testing-by-architecture-layer.md](./adr-004-testing-by-architecture-layer.md) | Tests por capa (dominio / caso de uso / adaptador); pirámide como baremo |
| [testing-strategy.md](./testing-strategy.md) | Guía operativa de tests, naming y plan de madurez |
| [mvp-feature-map.md](./mvp-feature-map.md) | Estado de implementación por feature y ruta |
| [catalog-client-side-filtering.md](./catalog-client-side-filtering.md) | Filtros de catálogo en memoria (sin HTTP por toggle) |
| [front-final-quality-audit.md](./front-final-quality-audit.md) | Auditoria final de calidad, rendimiento y riesgos del front |
| [stack-decisions.md](./stack-decisions.md) | Stack adoptado vs alternativas del doc oficial |
| [tailwind-stylesheet-whitelist.md](./tailwind-stylesheet-whitelist.md) | Cuándo usar `className` vs `StyleSheet` (lista blanca) |
| [styling-exceptions.md](./styling-exceptions.md) | Tipos de excepción y componentes documentados |

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

Detalle de los nueve principios (incl. composición explícita, DTO≠entidad, errores tipados y observabilidad): [clean-architecture-principles.md](./clean-architecture-principles.md). Regla Cursor: `.cursor/rules/clean-architecture-principles.mdc`.

## ADRs

Formato: `adr-NNN-titulo-corto.md`. Estado en cabecera (Propuesto / Aceptado / Obsoleto). Nuevas decisiones irreversibles → nuevo ADR + enlace en [docs/README.md](../README.md).

## Producto vs arquitectura

- Reglas de negocio estables → `docs/product/*`
- Dónde vive cada capacidad en código → este directorio + `mvp-feature-map.md`

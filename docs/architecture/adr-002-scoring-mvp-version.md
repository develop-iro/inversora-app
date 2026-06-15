# ADR-002: Versión de scoring MVP — RN-04 frente a mvp-1

| Campo | Valor |
|-------|--------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-08 |
| **Contexto** | Issue #67 — alinear app, producto y backend |

---

## Decisión (resumen)

La versión canónica del Score Inversora para el **MVP de producción** es **RN-04** (`rn-04`):

| Criterio | Peso |
|----------|------|
| TER | 40 % |
| Tracking error | 40 % |
| AUM | 10 % |
| Antigüedad | 10 % |

- **Backend (`inversora-api`):** la implementación actual `mvp-1` (6 factores) es legado experimental; la spec objetivo está en el repo API: `inversora-api/docs/scoring-rn-04.md`.
- **App (este repo):** el mock usa `rn-04-mock` con los cuatro criterios RN-04 (`src/core/scoring/criteria.ts`).
- **Calidad de datos:** reglas RN-05 / HU-37 afectan visibilidad y advertencias, **no** son factor del score.

Documento completo (consecuencias, migración, checklist):  
**`inversora-api/docs/architecture/adr-002-scoring-mvp-version.md`**

---

## Referencias

- [product/scoring.md](../product/scoring.md) — reglas RN-02 a RN-05
- [adr-001-domain-boundaries.md](./adr-001-domain-boundaries.md) — scoring en backend
- `src/core/scoring/criteria.ts` — `SCORING_CRITERIA_VERSION = 'rn-04-mock'`

# Alcance del MVP

Resumen alineado con el documento oficial y con `README.md` / `AGENTS.md`. Ante duda, prevalece el documento oficial; este archivo es la referencia rápida en el repo.

## Incluido en el MVP

| Área | Descripción |
|------|-------------|
| Dashboard inicial | Hero, fondos destacados del trimestre, teaser de ranking, búsqueda, avisos |
| Modo “Quiero aprender” | Flujo educativo y perfilado sin registro |
| Perfil educativo | Orientativo, local/anónimo, no vinculado a cuenta |
| Catálogo | Fondos indexados visibles, categorías, estados de calidad de datos |
| Búsqueda y filtros | Nombre, ISIN, categoría; filtros básicos (comisión, riesgo, benchmark, etc.) |
| Rankings | Por categoría / benchmark comparable, Score Inversora |
| Ficha de fondo | Resumen con métricas, score, desglose y advertencias |
| Asistente Inversora | Explicaciones en lenguaje llano; sin alterar rankings |
| Comparación | Hasta **2 fondos**; advertencia si no son homogéneos |
| Calculadora | Interés compuesto con escenarios educativos (prudente / medio / optimista) |
| Favoritos | Solo en dispositivo; no implican recomendación |
| Legal | Avisos de no asesoramiento, riesgo, rentabilidad pasada, fuentes de datos |

## Excluido del MVP

- Registro, login y cuentas personales.
- Órdenes de compra/venta y conexión con brokers.
- Custodia o gestión de cartera real.
- Recomendaciones financieras personalizadas con validez legal.
- ETFs, acciones, cripto, planes de pensiones y fondos de gestión activa (fuera del catálogo MVP).
- Panel de administración avanzado (“Clínica de Datos” y similares → fase posterior).

## Rutas planificadas

| Ruta | Propósito |
|------|-----------|
| `/` | Dashboard |
| `/learn` | Modo educativo |
| `/funds` | Catálogo |
| `/funds/[isin]` | Ficha de fondo |
| `/compare` | Comparador (máx. 2 fondos) |
| `/favorites` | Favoritos locales |
| `/calculator` | Calculadora |
| `/legal` | Textos legales centralizados |

**Deuda conocida:** `/explore` (alias oculto de fondos) — deprecar en favor de `/funds` o `/learn` (ver ADR-001).

## Datos y privacidad (MVP)

- Sin datos personales identificables en backend.
- Favoritos y perfil educativo: **almacenamiento local** del dispositivo.
- Analytics: solo **anónimos** y mínimos si se implementan (HU-41).
- Backend previsto: fondos, métricas, scores, validaciones DQ, explicaciones cacheadas (Supabase).

## Criterios de éxito del MVP (orientativos)

- Un visitante entiende qué hace la app en el dashboard sin login.
- Puede ver destacados y abrir una ficha con score explicable.
- Puede comparar dos fondos y usar la calculadora con avisos visibles.
- Ninguna superficie sugiere “compra este fondo” como consejo personalizado.

## Ver también

- [user-stories-index.md](./user-stories-index.md) — listado de HUs por épica
- [architecture/mvp-feature-map.md](../architecture/mvp-feature-map.md) — estado de implementación

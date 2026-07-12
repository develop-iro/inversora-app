# Alcance del MVP

Resumen alineado con el documento oficial y con `README.md` / `AGENTS.md`. Ante duda, prevalece el documento oficial; este archivo es la referencia rápida en el repo.

Propuesta de valor (§6): [value-proposition.md](./value-proposition.md).

El **objetivo de validación del MVP** y los **requisitos mínimos** del documento oficial (§2.2) están detallados con estado de implementación en [objectives.md](./objectives.md).

Leyenda de cumplimiento (§3.1):

| Símbolo | Significado |
|--------|-------------|
| ✅ | Cumplido |
| 🟡 | Cumplido con matices o cierre parcial |
| ⬜ | No cumplido |

---

## 3.1 Funcionalidades incluidas en el MVP

| Funcionalidad (documento oficial) | Estado | Notas |
|-----------------------------------|--------|-------|
| Onboarding inicial sin necesidad de registro | ✅ | Dashboard `/` accesible sin login; en **nativo** gate a `/learn?mode=initial` en primera visita |
| Identificación básica del nivel de conocimiento financiero | ✅ | Cuestionario `/learn` (`knowledgeLevel`); obligatorio en app, invitado en web |
| Perfilado básico (horizonte, riesgo, objetivo) | ✅ | `build-educational-profile.ts`, persistencia local; onboarding = cuestionario de perfilado |
| Dashboard principal de fondos indexados | ✅ | `home-screen.tsx`, destacados, ranking, búsqueda |
| Clasificación de fondos por categorías | ✅ | Catálogo con secciones y filtro por categoría |
| Ranking según criterios objetivos | ✅ | `/rankings` + `/rankings/[benchmarkKey]`, grupos RN-02, home alineado |
| Ficha individual resumida de cada fondo | ✅ | `/funds/[isin]` |
| Explicación simplificada por el Asistente Inversora | ✅ | SORA inline en ficha, home, catálogo, comparación; guardrails HU-40 |
| Buscador por nombre, ISIN o categoría | ✅ | `FundCatalogSearchField`, búsqueda en home |
| Filtros por comisión, riesgo, categoría y rentabilidad histórica | ✅ | Filtros TER/riesgo/categoría + umbral `minReturn1y`/`minReturn3y` y ordenación |
| Comparador básico entre fondos | ✅ | `/compare`, máx. 2 fondos (`MAX_COMPARE_FUNDS`) |
| Calculadora de interés compuesto | ✅ | `/calculator`, 3 escenarios educativos |
| Favoritos sin cuenta (almacenamiento local) | ✅ | `favorites-store.ts` (AsyncStorage / almacenamiento seguro local) |
| Avisos legales y mensajes de riesgo visibles | ✅ | `LegalNotice`, `/legal` |
| Métricas clave en lenguaje comprensible | ✅ | Glosario, badges, etiquetas de score |

**Resumen §3.1:** **15 de 15** ítems en ✅.

---

## 3.2 Funcionalidades excluidas del MVP

La app **no expone** ninguna de las funcionalidades excluidas del documento oficial:

| Exclusión | Estado en app | Nota |
|-----------|---------------|------|
| Registro, login, cuentas personales | ✅ Excluido | Sin flujos de auth en `invesora` |
| Órdenes de compra/venta | ✅ Excluido | |
| Conexión con brokers | ✅ Excluido | |
| Gestión real de carteras | ✅ Excluido | Favoritos ≠ cartera |
| Recomendaciones financieras con validez legal | ✅ Excluido | Solo copy educativo |
| Acciones, cripto, gestión activa, planes de pensiones | ✅ Excluido | Catálogo limitado a fondos indexados |
| Optimización fiscal personalizada | ✅ Excluido | |
| Panel de administración (producto usuario) | ✅ Excluido | No hay panel en la app |
| Gestión interna avanzada de fuentes de datos | ✅ Excluido en app | Existe tooling interno en `inversora-api` (`admin/`, CLI sync), no visible al usuario |
| Alertas avanzadas, comunidad, marketplace | ✅ Excluido | |

**Resumen §3.2:** **Cumplimiento total** en la superficie de producto (app). El backend incluye herramientas operativas internas que no forman parte del MVP de usuario.

---

## 3.3 Supuestos del MVP

| Supuesto | Estado | Evidencia |
|----------|--------|-----------|
| Datos de fuentes externas o datasets tratados | ✅ | FMP vía `inversora-api`; mock en dev/CI |
| Ranking calculado por motor determinista, no por IA | ✅ | Scoring `rn-04` en API; SORA solo explica |
| Asistente solo como capa explicativa y educativa | ✅ | Guardrails HU-40 en API y cliente; SORA no altera scores |
| Usuario no opera desde la plataforma | ✅ | Sin broker ni órdenes |
| Calculadora orientativa y educativa | ✅ | Disclaimers + escenarios ilustrativos |
| Desarrollo inicial como aplicación web responsive | 🟡 | **Expo mobile-first** + `react-native-web`; web soportada, no es el único target del repo |
| Favoritos locales sin sincronización entre dispositivos | ✅ | Solo almacenamiento local |
| Experiencia prioriza principiante con filtros para avanzados | ✅ | Glosario, HU-16, filtros TER/score/riesgo |

**Resumen §3.3:** **6 de 8** supuestos en ✅; **2 en 🟡** (guardrails del asistente; formulación «web responsive» vs stack Expo multiplataforma).

---

## Incluido en el MVP (resumen operativo)

| Área | Descripción |
|------|-------------|
| Dashboard inicial | Hero, fondos destacados del trimestre, teaser de ranking, búsqueda, avisos |
| Modo “Quiero aprender” | Flujo educativo y perfilado sin registro; gate obligatorio en app nativa, invitación en web |
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

## Excluido del MVP (resumen operativo)

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
| `/rankings` | Rankings por benchmark comparable |
| `/rankings/[benchmarkKey]` | Detalle de ranking por grupo |

**Deuda conocida:** `/explore` (alias oculto de fondos) — deprecar en favor de `/funds` o `/learn` (ver ADR-001).

## Datos y privacidad (MVP)

- Sin datos personales identificables en backend.
- Favoritos: **almacenamiento local** del dispositivo.
- Perfil educativo: **local-first**; el cliente puede sincronizar una **copia anónima resumida** (dimensiones derivadas, sin respuestas del cuestionario) vía `POST /anonymous-devices/register` + `PUT /anonymous-devices/me/educational-profile`.
- Analytics: solo **anónimos** y mínimos (HU-41), con `sessionId` de funnel y `deviceId` opcional para cruzar eventos con la instalación.
- Backend oficial: **inversora-api** (NestJS + PostgreSQL) — fondos, métricas, scores, validaciones DQ, explicaciones cacheadas del asistente, dispositivos anónimos.

## Criterios de éxito del MVP (orientativos)

- Un visitante entiende qué hace la app en el dashboard sin login.
- Puede ver destacados y abrir una ficha con score explicable.
- Puede comparar dos fondos y usar la calculadora con avisos visibles.
- Ninguna superficie sugiere “compra este fondo” como consejo personalizado.

## Ver también

- [objectives.md](./objectives.md) — objetivos específicos (§2.1) y objetivo del MVP (§2.2)
- [target-audience-and-profiles.md](./target-audience-and-profiles.md) — público objetivo y perfiles (§4)
- Este archivo — funcionalidades incluidas/excluidas (§3.1–3.2) y supuestos (§3.3)
- [user-stories-index.md](./user-stories-index.md) — listado de HUs por épica
- [architecture/mvp-feature-map.md](../architecture/mvp-feature-map.md) — estado de implementación

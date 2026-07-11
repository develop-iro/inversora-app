# Objetivos de producto (documento oficial §2)

Resumen de las secciones **2.1 Objetivos específicos** y **2.2 Objetivo del MVP** del documento oficial (*Documentación de Proyecto: Inversora*, v1.0), con **estado de implementación** en el ecosistema (app + API) a julio de 2026.

**Alineación ecosistema:** Las reglas de producto derivan del documento oficial. El estado del **cliente** se refleja en este archivo y en [mvp-feature-map.md](../architecture/mvp-feature-map.md). El estado del **backend** en `inversora-api/docs/purpose-and-scope.md`. Ante conflicto, prevalece el documento oficial.

Para alcance detallado, historias de usuario y código, ver también:

- [problem-statement.md](./problem-statement.md)
- [mvp-scope.md](./mvp-scope.md)
- [user-stories-index.md](./user-stories-index.md)
- [architecture/mvp-feature-map.md](../architecture/mvp-feature-map.md)

## Leyenda de estado

| Símbolo | Significado |
|--------|-------------|
| ✅ | Cubierto de forma usable |
| 🟡 | Parcial / depende de API o cierre de criterios |
| ⬜ | No iniciado o fuera del MVP actual |

---

## 2.1 Objetivos específicos

### 1. Facilitar la comparación mediante rankings organizados por categorías

**Objetivo:** que el usuario compare fondos indexados con criterios homogéneos, agrupados por categoría o benchmark comparable.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Comparador de hasta 2 fondos | ✅ | `/compare`, `features/comparison/` |
| Rankings por benchmark en API | ✅ | `GET /rankings` (RN-02), `inversora-api` |
| Catálogo con categorías y ordenación | ✅ | `/funds`, filtros y secciones por categoría |
| Pantalla dedicada de ranking por categoría | ✅ | `/rankings`, `/rankings/[benchmarkKey]` (HU-14) |
| Advertencia si la comparación no es homogénea | ✅ | `CompareFairnessBanner` (HU-27) |

**HUs relacionadas:** HU-04, HU-08, HU-14, HU-25–27.

**Pendiente:** exponer rankings agrupados por benchmark/categoría como superficie propia (no solo catálogo + home).

---

### 2. Ayudar a principiantes a entender conceptos financieros básicos

**Objetivo:** reducir la barrera de entrada con explicaciones accesibles de conceptos financieros.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Modo educativo «Quiero aprender» | ✅ | `/learn`, `features/learn/` |
| Glosario en lenguaje llano | ✅ | `shared/constants/fund-glossary.ts`, `InfoHint` |
| Contenido educativo en dashboard | ✅ | Hero, noticias, respuestas a búsqueda en home |
| Asistente explicativo (SORA) | ✅ | Home, catálogo, ficha (`FundDetailScoreExplain` HU-23), comparación; glosario + cache API |

**HUs relacionadas:** HU-17–21, HU-22.

**Notas:** HU-22 cubierto vía `explainAssistant`, glosario estático y mocks educativos en home.

---

### 3. Ofrecer un proceso de perfilado inicial

**Objetivo:** identificar de forma orientativa el tipo de usuario y sus objetivos sin registro.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Cuestionario sin teclado (tarjetas/botones) | ✅ | `learn-questionnaire-screen.tsx` |
| Perfil orientativo (riesgo, horizonte, conocimiento) | ✅ | `build-educational-profile.ts` |
| Persistencia local sin cuenta | ✅ | `core/storage/educational-profile-store.ts` |
| Detección de respuestas inconsistentes | ✅ | HU-21 |
| Sugerencias en catálogo según perfil | ✅ | `map-profile-to-catalog-hints.ts` |

**HUs relacionadas:** HU-17–21.

---

### 4. Mostrar explicaciones claras sobre por qué un fondo está mejor posicionado

**Objetivo:** que el usuario entienda el motivo de la posición de un fondo dentro de su categoría.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Score Inversora con etiquetas accesibles | ✅ | HU-15, `ScorePill`, badges editoriales |
| Desglose del score en ficha | ✅ | `FundScoreBreakdown` (HU-10) |
| Explicación narrativa vía asistente | ✅ | `FundDetailScoreExplain` (HU-23), SORA en ficha/home/compare |
| Copy educativo en destacados | ✅ | Carousel y cards en home |

**HUs relacionadas:** HU-10, HU-11, HU-15, HU-23.

**Pendiente:** disponibilidad estable del runtime de asistente en staging/producción.

---

### 5. Evitar lenguaje excesivamente técnico para principiantes

**Objetivo:** priorizar claridad cognitiva en la experiencia para usuarios sin experiencia financiera.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Etiquetas cualitativas frente a métricas crudas | ✅ | Badges, `efficiencyLabel`, glosario |
| Secciones técnicas colapsables | ✅ | Ficha de fondo, descripción larga |
| Filtro «ideal para principiantes» | ✅ | Catálogo y destacados |
| Exclusión de scores &lt; 30 en superficies principiantes | ✅ | HU-16, `beginner-eligibility.ts` (destacados, home, `/rankings`; condicionado a `knowledgeLevel`) |
| Modo UI adaptativo según nivel de conocimiento | 🟡 | `knowledgeLevel` condiciona guards HU-16 y filtros de catálogo; no oculta métricas avanzadas en ficha |

**HUs relacionadas:** HU-15, HU-16, HU-19.

---

### 6. Permitir a usuarios avanzados acceder a métricas técnicas y filtros

**Objetivo:** ofrecer profundidad a quienes buscan detalle sin sacrificar la experiencia principiante.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Ficha con rentabilidad, ratios y exposición | ✅ | Secciones Información, Rentabilidad, Ratios, Exposición |
| Filtros por riesgo, TER, score y categoría | ✅ | `fund-catalog-filters.tsx`, sheet de filtros |
| Ordenación por score, comisión e histórico | ✅ | HU-08 |
| Cotización y fecha de actualización | ✅ | `market-snapshot`, `asOf` |
| Vista «modo avanzado» explícita por perfil | ⬜ | `knowledgeLevel: advanced` no altera la UI hoy |

**HUs relacionadas:** HU-07, HU-08, HU-09.

---

### 7. Actuar como herramienta informativa y educativa, no asesoramiento personalizado

**Objetivo:** dejar claro que Inversora informa y educa; no asesora ni ejecuta operaciones.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Avisos de no asesoramiento en superficies sensibles | ✅ | `LegalNotice`, `disclaimer-snippets.ts` |
| Página legal centralizada | ✅ | `/legal` |
| Sin login, broker ni órdenes | ✅ | Alcance MVP respetado |
| Reglas del asistente (no recomendar compra/venta) | ✅ | `product/assistant.md`, copy en UI |
| Bloqueo automático de lenguaje de recomendación | ✅ | HU-40; guardrails en API + cliente (`assistant-output-guardrails.ts`) |

**HUs relacionadas:** HU-38, HU-39, HU-40.

---

### 8. Mantener trazabilidad sobre datos, rankings y explicaciones

**Objetivo:** que datos, rankings y explicaciones sean auditables y reproducibles.

| Aspecto | Estado | Implementación |
|---------|--------|----------------|
| Versión del algoritmo de scoring | ✅ | `rn-04` en API (`scoring.service.ts`) |
| Fecha de actualización (`asOf`) en ficha y mercado | ✅ | `FundDetailSheetFreshness`, snapshots |
| Estados de calidad de datos en UI | 🟡 | `scoringStatus`, banners; validaciones HU-34–37 ⬜ |
| Analytics anónimos | ✅ | HU-41, `core/analytics/` |
| Auditoría admin de visibilidad de catálogo | ✅ | API `admin/funds` |
| Trazabilidad de explicaciones de IA al usuario | 🟡 | Caché en API; sin superficie de auditoría en app |

**HUs relacionadas:** HU-12, HU-34–37, HU-41.

**Pendiente:** pipeline de validación DQ (ISIN, TER, benchmark) y trazabilidad visible de explicaciones generadas.

---

## 2.2 Objetivo del MVP

### Propósito de validación

El MVP debe validar si una plataforma de **ranking y explicación de fondos indexados** ayuda a usuarios con poca experiencia financiera a **comprender mejor sus opciones de inversión**, sin sustituir el criterio personal ni el asesoramiento profesional.

### Requisitos mínimos del MVP

| Requisito | Estado | Ruta / módulo | Notas |
|-----------|--------|---------------|-------|
| Dashboard principal de fondos indexados | ✅ | `/`, `features/onboarding/` | Destacados, ranking, búsqueda, SORA |
| Categorías básicas de fondos | ✅ | `/funds` | Agrupación y filtros por categoría |
| Ranking por categoría | ✅ | Home + `GET /rankings` + UI `/rankings` (HU-14); API agrupa por benchmark |
| Perfilado básico del usuario | ✅ | `/learn` | Local, sin registro |
| Visualización de ficha resumida del fondo | ✅ | `/funds/[isin]` | Métricas, score, exposición, avisos |
| Explicación generada por el Asistente Inversora | ✅ | SORA en home, catálogo, ficha, comparación; cache + glosario API |
| Advertencias legales y educativas | ✅ | `LegalNotice`, `/legal` | HU-38, HU-39 |
| Comparador básico entre fondos | ✅ | `/compare` | Máx. 2 fondos (`MAX_COMPARE_FUNDS`), fairness, métricas |
| Sistema inicial de favoritos o seguimiento | ✅ | `/favorites` | AsyncStorage local; HU-31–33 |

### Criterio de validación del MVP

El MVP se considera **validable para usuarios principiantes** cuando se cumplen simultáneamente:

1. Un visitante entiende el propósito de la app en el dashboard **sin login**.
2. Puede explorar el catálogo, ver un ranking orientativo y abrir una ficha con score explicable.
3. Puede comparar dos fondos y guardar favoritos locales con avisos legales visibles.
4. Ninguna superficie presenta una recomendación personalizada de compra o venta.

Estado global estimado (julio 2026): **~95 % de los requisitos mínimos cubiertos**; el hueco principal restante es trazabilidad DQ en producción (HU-34–37).

---

## Trazabilidad objetivo → documentación → código

| Objetivo §2.1 | Docs de producto | Código principal |
|---------------|------------------|------------------|
| Rankings por categorías | [scoring.md](./scoring.md) | `get-rankings.ts`, `comparison-screen.tsx` |
| Educación conceptos | [vision-and-principles.md](./vision-and-principles.md) | `fund-glossary.ts`, `features/learn/` |
| Perfilado | [user-stories-index.md](./user-stories-index.md) EP-04 | `educational-profile-store.ts` |
| Explicar posición en ranking | [assistant.md](./assistant.md) | `use-assistant-explain.ts`, `FundScoreBreakdown` |
| Lenguaje no técnico | [legal-and-disclaimers.md](./legal-and-disclaimers.md) | `InfoHint`, badges, HU-16 |
| Métricas avanzadas | [mvp-scope.md](./mvp-scope.md) | Ficha, filtros catálogo |
| No asesoramiento | [legal-and-disclaimers.md](./legal-and-disclaimers.md) | `LegalNotice`, `/legal` |
| Trazabilidad | [scoring.md](./scoring.md) | API scoring `version`, `asOf`, analytics |

---

## Mantenimiento

Al cerrar un objetivo o requisito mínimo del MVP:

1. Actualizar la columna **Estado** en este archivo.
2. Actualizar las HUs correspondientes en [user-stories-index.md](./user-stories-index.md).
3. Actualizar el mapa de features en [mvp-feature-map.md](../architecture/mvp-feature-map.md).

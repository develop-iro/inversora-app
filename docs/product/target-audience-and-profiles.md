# Público objetivo y perfiles de usuario (documento oficial §4)

Resumen de la sección **4. Público objetivo y perfiles de usuario** del documento oficial (*Documentación de Proyecto: Inversora*, v1.0), con **trazabilidad a funcionalidades del MVP** en el ecosistema (app + API).

**Alineación ecosistema:** Perfiles y necesidades derivan del documento oficial. La app cubre onboarding, educación y UI; `inversora-api` cubre catálogo, scoring, analytics anónimos y sync del perfil educativo derivado (`anonymous-devices`). Ante conflicto, prevalece el documento oficial.

Para alcance, objetivos y principios, ver también:

- [problem-statement.md](./problem-statement.md)
- [vision-and-principles.md](./vision-and-principles.md)
- [objectives.md](./objectives.md)
- [mvp-scope.md](./mvp-scope.md)
- [user-stories-index.md](./user-stories-index.md)

---

## Público objetivo principal

El público objetivo principal de Inversora está formado por personas interesadas en empezar a invertir en vehículos indexados como fondos o ETFs, pero que no cuentan con conocimientos financieros suficientes para interpretar con facilidad la información técnica disponible en bancos, brokers o gestoras.

La plataforma busca reducir la barrera de entrada a la inversión, ofreciendo una experiencia guiada, visual y comprensible. Aunque el foco principal del MVP será el usuario principiante, también se contemplan perfiles con mayor conocimiento que deseen comparar fondos de forma rápida y objetiva.

| Prioridad en el MVP | Perfil | Rol en las decisiones de producto |
|---------------------|--------|-----------------------------------|
| **Principal** | Inversor principiante | Condiciona copy, onboarding, educación y progresión de la UI |
| **Secundario** | Inversor con conocimientos intermedios | Condiciona buscador, filtros, comparador y ficha técnica resumida |
| **No prioritario** | Inversor avanzado | Evolución futura; no bloquea entregas del MVP |

---

## 4.1 Perfil principal: Inversor principiante

El inversor principiante representa el usuario prioritario del MVP.

Se trata de una persona que quiere empezar a invertir, pero no sabe cómo comparar fondos, qué métricas mirar ni cómo interpretar conceptos como TER, volatilidad, tracking error, rentabilidad histórica o riesgo. Este usuario suele buscar seguridad, claridad y confianza antes de tomar cualquier decisión.

### Características

- Tiene conocimientos financieros nulos o básicos.
- No entiende la mayoría de términos técnicos de inversión.
- Puede sentir inseguridad o miedo a equivocarse.
- Busca una forma sencilla de comparar opciones.
- Necesita explicaciones claras y sin exceso de tecnicismos.
- Valora mucho la transparencia y la confianza.
- No quiere operar desde la plataforma, sino entender mejor sus opciones.

### Necesidades

- Saber qué es un fondo indexado.
- Entender qué factores hacen que un fondo pueda ser interesante.
- Comparar fondos sin tener que interpretar documentos técnicos complejos.
- Recibir explicaciones sencillas sobre costes, riesgo y rentabilidad.
- Identificar fondos que encajen con su perfil general.
- Aprender conceptos básicos mientras usa la aplicación.
- Evitar errores comunes derivados de la falta de conocimiento.

### Funcionalidades asociadas

| Funcionalidad | Estado MVP | Implementación |
|---------------|------------|----------------|
| Onboarding guiado | ✅ | **App nativa:** gate a `/learn?mode=initial`. **Web:** invitación (hero, banner) sin gate |
| Perfilado básico | ✅ | `/learn`, `build-educational-profile.ts` |
| Ranking simplificado | ✅ | Home + `/rankings` (HU-14) |
| Explicaciones del Asistente Inversora | ✅ | SORA en home, catálogo, ficha (HU-23), comparación; guardrails HU-40 |
| Fichas resumidas de fondos | ✅ | `/funds/[isin]`, secciones colapsables |
| Calculadora de interés compuesto | ✅ | `/calculator` |
| Favoritos locales | ✅ | `/favorites`, almacenamiento local |
| Mensajes educativos y advertencias de riesgo | ✅ | `LegalNotice`, glosario, `InfoHint` |

**HUs relacionadas:** HU-01, HU-17–21, HU-10, HU-15–16, HU-28, HU-31–33, HU-38–39.

---

## 4.2 Perfil secundario: Inversor con conocimientos intermedios

Este usuario ya conoce algunos conceptos básicos de inversión y puede haber invertido anteriormente en fondos, roboadvisors o productos similares. No necesita tanta guía como el principiante, pero valora poder comparar fondos de forma rápida y ordenada.

### Características

- Entiende conceptos como comisión, rentabilidad y riesgo.
- Puede conocer plataformas de inversión digital, roboadvisors o bancos tradicionales, pero no necesariamente entiende sus métricas.
- Busca comparar fondos antes de tomar una decisión.
- Valora los filtros y métricas objetivas.
- Puede querer validar si un fondo es competitivo frente a otros similares.

### Necesidades

- Buscar fondos por nombre, categoría o ISIN.
- Comparar comisiones y métricas clave.
- Ver rankings por categoría.
- Entender diferencias entre fondos similares.
- Guardar fondos para revisarlos más tarde.
- Consultar información de forma rápida y estructurada.

### Funcionalidades asociadas

| Funcionalidad | Estado MVP | Implementación |
|---------------|------------|----------------|
| Buscador de fondos | ✅ | `FundCatalogSearchField`, búsqueda en home |
| Filtros básicos | ✅ | `fund-catalog-filters.tsx`, sheet de filtros |
| Comparador | ✅ | `/compare`, máx. 2 fondos |
| Ranking por categoría | ✅ | API `GET /rankings` + `/rankings` (benchmark); API sin agrupación por `investmentTheme` |
| Ficha técnica resumida | ✅ | Secciones Rentabilidad, Ratios, Exposición en ficha |
| Favoritos locales | ✅ | `/favorites` |

**HUs relacionadas:** HU-04, HU-07–09, HU-14, HU-25–27, HU-31–33.

---

## 4.3 Perfil no prioritario para el MVP: Inversor avanzado

El inversor avanzado no será el foco principal del MVP. Aunque algunas funcionalidades pueden resultar útiles, la plataforma no estará inicialmente orientada a análisis financiero profundo ni a herramientas profesionales.

### Características

- Comprende métricas financieras avanzadas.
- Puede analizar fondos por su cuenta.
- Busca datos detallados, históricos y comparativas complejas.
- Puede requerir exportaciones, gráficos avanzados o análisis cuantitativo.

### Necesidades futuras

- Filtros avanzados.
- Análisis por ratios financieros.
- Comparativas históricas complejas.
- Exportación de datos.
- Integración con fuentes financieras más completas.
- Análisis de tracking difference, benchmark y composición detallada.

### Estado en el MVP

Este perfil queda contemplado como posible evolución futura, pero **no condiciona las decisiones principales del MVP**.

La ficha actual expone métricas técnicas (rentabilidad, ratios, exposición) accesibles a cualquier usuario, pero no existe un «modo avanzado» explícito ni filtros de exportación. Ver objetivo §2.1.6 en [objectives.md](./objectives.md).

---

## Implicaciones de diseño

| Decisión de producto | Principiante | Intermedio | Avanzado |
|----------------------|--------------|------------|----------|
| Progresión de información (resumen → detalle) | Prioritaria | Útil | Secundaria |
| Glosario y `InfoHint` | Obligatorio | Complementario | Opcional |
| Filtros TER, score, riesgo | Disponibles con contexto | Prioritarios | Insuficientes a largo plazo |
| Exclusión de scores bajos en superficies principiantes (HU-16) | Obligatoria (`knowledgeLevel` beginner o sin perfil) | Desactivada (ranking completo) | No aplica |
| Asistente explicativo vs. datos crudos | Prioriza explicación | Valida con datos | Preferiría exportación |

---

## Trazabilidad perfil → documentación → código

| Perfil | Docs de producto | Código principal |
|--------|------------------|------------------|
| Principiante | [vision-and-principles.md](./vision-and-principles.md), [assistant.md](./assistant.md) | `features/learn/`, `fund-glossary.ts`, `beginner-eligibility.ts` |
| Intermedio | [scoring.md](./scoring.md), [mvp-scope.md](./mvp-scope.md) | `features/funds/`, `features/comparison/` |
| Avanzado | [mvp-scope.md](./mvp-scope.md) (exclusiones) | Ficha técnica; sin modo avanzado dedicado |

---

## Mantenimiento

Al añadir una superficie nueva o cambiar la progresión de la UI:

1. Identificar qué perfil(es) condicionan la decisión (principiante por defecto).
2. Actualizar las tablas de **Funcionalidades asociadas** en este archivo si cambia el estado del MVP.
3. Actualizar [mvp-feature-map.md](../architecture/mvp-feature-map.md) y las HUs en [user-stories-index.md](./user-stories-index.md).

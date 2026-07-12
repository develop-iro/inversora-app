# Propuesta de valor (documento oficial §6)

Resumen de la sección **6. Propuesta de valor** del documento oficial (*Documentación de Proyecto: Inversora*, v1.0), con **trazabilidad al MVP** en el ecosistema (app + API).

**Alineación ecosistema:** La propuesta de valor proviene del documento oficial. Este archivo matiza la implementación MVP (proceso guiado, no obligatorio lineal; política web vs nativo). Ante conflicto, prevalece el documento oficial.

Para problema, perfiles, alcance y principios, ver también:

- [problem-statement.md](./problem-statement.md)
- [vision-and-principles.md](./vision-and-principles.md)
- [target-audience-and-profiles.md](./target-audience-and-profiles.md)
- [mvp-scope.md](./mvp-scope.md)

---

## 6. Propuesta de valor

Inversora ofrece una plataforma educativa y visual que ayuda a usuarios principiantes a comprender los fundamentos de la inversión en productos de inversión antes de enfrentarse a rankings, comparativas o métricas técnicas.

Su propuesta de valor se basa en transformar información financiera compleja en una experiencia clara, guiada y accesible. En lugar de presentar directamente una lista de fondos, Inversora acompaña al usuario en un **proceso progresivo** donde primero aprende conceptos básicos, identifica su perfil general y luego explora fondos indexados con mayor criterio.

El valor diferencial de Inversora no está únicamente en ordenar fondos, sino en explicar por qué ciertos criterios son importantes y cómo deben interpretarse de forma responsable.

### Proceso progresivo: guiado, no obligatorio lineal

El documento oficial describe un recorrido educativo previo a la comparación. En el MVP esto se materializa como **experiencia guiada**, no como un camino único bloqueado:

| Plataforma | Enfoque | Implementación |
|------------|---------|----------------|
| **Web** | Exploración libre + invitaciones educativas | Sin gate de rutas; hero, banner «Entiende antes de comparar», `/learn` voluntario |
| **iOS / Android** | Experiencia más personalizada | Gate a `/learn?mode=initial` en primera visita; escape «Omitir» en header |

**Matiz §6.1:** «Acceso a rankings y comparativas tras contexto educativo» significa **acceso contextualizado**: en web el contexto es invitado; en nativo se prioriza el perfilado inicial, con posibilidad de omitir.

Ver detalle en [problem-statement.md](./problem-statement.md) §5.2.1.

---

## 6.1 Valor para usuarios principiantes

| Aporte | Estado MVP | Implementación |
|--------|------------|----------------|
| Comprensión básica antes de decidir | ✅ | `/learn`, concept cards, tab Aprendizaje (curriculum) para perfil principiante |
| Explicaciones sencillas de conceptos | ✅ | Glosario, `InfoHint`, Asistente Inversora |
| Reducción del miedo inicial | ✅ | Copy prudente, avisos legales, sin urgencia |
| Claridad sobre riesgos, costes y horizonte | ✅ | Cuestionario de perfil, métricas con etiquetas |
| Acompañamiento del Asistente | ✅ | SORA en home, catálogo, ficha, comparación |
| Experiencia menos intimidante | ✅ | Progresión UI, secciones colapsables |
| Rankings/comparativas con contexto | 🟡 | Gate nativo + invitación web; omitir permite acceso directo |
| Calculadora de interés compuesto | ✅ | `/calculator` |

---

## 6.2 Valor para usuarios intermedios

| Aporte | Estado MVP | Implementación |
|--------|------------|----------------|
| Visualización ordenada de fondos | ✅ | `/funds`, categorías |
| Rankings por categorías | ✅ | `/rankings`, home |
| Filtros básicos | ✅ | Sheet de filtros |
| Comparador simple | ✅ | `/compare` (máx. 2 fondos) |
| Fichas resumidas | ✅ | `/funds/[isin]` |
| Explicaciones rápidas de métricas | ✅ | `InfoHint`, asistente |
| Favoritos locales | ✅ | Tab Favoritos (perfil intermedio/avanzado) |

---

## 6.3 Diferenciación frente a plataformas tradicionales

Inversora no se limita a mostrar datos: añade capa educativa (glosario, desglose de score, asistente explicativo, avisos sobre rentabilidad pasada).

| Aspecto | Plataforma tradicional | Inversora |
|---------|------------------------|-----------|
| Métricas | TER, volatilidad, benchmark sin contexto | Etiquetas cualitativas + explicación |
| Ranking | A menudo por rentabilidad | Score multidimensional RN-04 |
| Tono | Técnico | Educativo y prudente |

---

## 6.4 Diferenciación frente a roboadvisors

Inversora **no** ejecuta inversiones, **no** custodia capital y **no** crea carteras personalizadas con validez de asesoramiento financiero.

Su propuesta es **anterior** a ese momento: aprender, orientarse y comparar fondos indexados de forma responsable.

Ver [mvp-scope.md](./mvp-scope.md) §3.2 (exclusiones).

---

## 6.5 Frase de valor resumida

> Inversora ayuda a las personas a entender la inversión en fondos indexados antes de comparar opciones, combinando educación financiera, visualización clara y asistencia inteligente.

Copy alineado en app: hero «Entiende antes de comparar», banner web `HomeLearnInvitationBanner`, principio rector en [vision-and-principles.md](./vision-and-principles.md).

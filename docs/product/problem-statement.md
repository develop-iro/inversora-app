# Problema que resuelve Inversora (documento oficial §5)

Resumen de la sección **5. Problema que resuelve Inversora** del documento oficial (*Documentación de Proyecto: Inversora*, v1.0), con **trazabilidad a funcionalidades del MVP** en el ecosistema (app + API).

**Alineación ecosistema:** El planteamiento del problema y el principio derivado provienen del documento oficial. La app materializa la capa educativa e interpretativa; `inversora-api` aporta catálogo, scoring objetivo y datos de mercado sin recomendaciones personalizadas. Ante conflicto, prevalece el documento oficial.

Para alcance, objetivos, perfiles y principios, ver también:

- [vision-and-principles.md](./vision-and-principles.md)
- [objectives.md](./objectives.md)
- [target-audience-and-profiles.md](./target-audience-and-profiles.md)
- [mvp-scope.md](./mvp-scope.md)
- [user-stories-index.md](./user-stories-index.md)

---

## 5. Problema central

El acceso a productos de inversión como los fondos indexados o ETFs se ha vuelto cada vez más sencillo gracias a bancos digitales, brokers y plataformas de inversión. Sin embargo, para una persona principiante, la información disponible sigue siendo compleja, técnica y difícil de interpretar.

Muchos usuarios quieren empezar a invertir, pero se enfrentan a barreras como:

- Desconocimiento financiero.
- Exceso de información.
- Miedo a perder dinero.
- Dificultad para entender el riesgo.
- Falta de claridad sobre qué factores deberían analizar antes de comparar fondos.

Inversora busca resolver este problema actuando como una **capa educativa e interpretativa** entre los datos financieros y el usuario. Antes de mostrar rankings o comparativas, la plataforma guía al usuario para que comprenda conceptos básicos como:

- Qué es un fondo indexado.
- Qué significa invertir a largo plazo.
- Qué son las comisiones.
- Cómo funciona el interés compuesto.
- Qué implica la volatilidad.
- Por qué la rentabilidad pasada no garantiza resultados futuros.

El problema principal que resuelve Inversora **no es únicamente encontrar fondos**, sino ayudar al usuario a entender lo suficiente para poder compararlos con mayor criterio.

---

## 5.1 Problemas principales identificados

| # | Problema | Implicación para el producto |
|---|----------|------------------------------|
| 1 | La información financiera suele estar escrita en lenguaje técnico | Glosario, etiquetas cualitativas y progresión de detalle en ficha |
| 2 | Los usuarios principiantes no saben por dónde empezar | Recorrido guiado `/learn` y gate de perfil inicial |
| 3 | Muchos usuarios quieren invertir, pero no comprenden bien qué es el riesgo | Cuestionario de perfil orientativo y copy prudente en métricas |
| 4 | Las plataformas tradicionales muestran datos, pero no siempre explican su significado | `InfoHint`, asistente explicativo y desglose de score |
| 5 | El usuario principiante puede sentirse intimidado por métricas como TER, volatilidad, tracking error o rentabilidad anualizada | Badges editoriales, secciones colapsables y filtro «ideal para principiantes» |
| 6 | Existe una barrera emocional asociada al miedo a perder dinero | Tono educativo, avisos de riesgo y sin lenguaje de urgencia |
| 7 | Muchos principiantes comparan productos únicamente por rentabilidad pasada | Rankings por score multidimensional; copy que advierte sobre rentabilidad histórica |
| 8 | La abundancia de información puede generar parálisis por análisis | Onboarding progresivo antes del catálogo denso |
| 9 | Los usuarios pueden confundir una herramienta informativa con una recomendación personalizada | Avisos legales visibles y reglas del asistente (no compra/venta) |
| 10 | La falta de educación financiera dificulta una toma de decisiones consciente | Modo «Quiero aprender», calculadora y contenido educativo en home |

---

## 5.2 Enfoque de solución

Inversora plantea una experiencia donde el usuario principiante **no entra directamente a una tabla de fondos**, sino a un recorrido guiado de aprendizaje y orientación.

El sistema debe ayudar primero a responder preguntas como:

| Pregunta orientativa | Cobertura en el MVP |
|----------------------|---------------------|
| ¿Qué es un fondo indexado? | Glosario, pasos informativos en `/learn`, asistente |
| ¿Para qué sirve invertir a largo plazo? | Cuestionario (horizonte temporal), concept cards en learn |
| ¿Qué significa asumir riesgo? | Perfil orientativo de riesgo, avisos legales |
| ¿Qué diferencia hay entre ahorrar e invertir? | Contenido educativo en learn y home |
| ¿Por qué importan las comisiones? | Métricas TER en ficha y comparador; glosario |
| ¿Qué es el interés compuesto? | Calculadora `/calculator` |
| ¿Por qué no debería elegir un fondo solo por su rentabilidad pasada? | Copy en rankings, score multidimensional, avisos |
| ¿Qué tipo de perfil inversor podría tener? | Cuestionario `/learn`, `build-educational-profile.ts` |
| ¿Qué categorías de fondos existen y para qué sirven? | Catálogo por categorías, filtros y home |

Una vez completada esta etapa educativa inicial, el usuario podrá acceder al visualizador de fondos, rankings por categoría y comparador básico **con mayor contexto**.

### Leyenda de cobertura

| Símbolo | Significado |
|--------|-------------|
| ✅ | Cubierto de forma usable |
| 🟡 | Parcial / depende de cierre de criterios |
| ⬜ | No iniciado o fuera del MVP actual |

| Aspecto del enfoque | Estado | Implementación |
|---------------------|--------|----------------|
| Gate antes del catálogo (primera visita) | ✅ | `InitialProfileGate`, `learn-questionnaire-screen.tsx` |
| Recorrido guiado sin registro | ✅ | `/learn`, `LEARN_QUESTIONNAIRE_STEPS` |
| Bienvenida educativa | ✅ | `LearnWelcomeIntro`, hero «Quiero aprender» en home |
| Acceso posterior a catálogo y comparador | ✅ | `/funds`, `/compare`, `/favorites` |
| Explicación sistemática vía asistente | 🟡 | SORA en varias superficies; HU-22 ⬜ |
| Recorrido lineal que responda todas las preguntas anteriores | 🟡 | Disperso entre learn, glosario y calculadora |

**HUs relacionadas:** HU-17–21 (perfilado y educación), HU-22 (asistente conceptual), HU-38–40 (avisos y no asesoramiento).

---

## 5.3 Consecuencia para el usuario

Como resultado de la falta de educación financiera, muchos usuarios terminan:

- Posponiendo su decisión de inversión.
- Delegando completamente en terceros.
- Eligiendo productos sin comprender realmente sus costes, riesgos y funcionamiento.

Inversora busca **reducir esta fricción inicial** proporcionando claridad, orden y acompañamiento educativo. Su objetivo **no es empujar al usuario a invertir rápidamente**, sino ayudarle a comprender antes de comparar.

### Indicadores de éxito alineados (MVP)

| Consecuencia negativa que se evita | Señal positiva en producto |
|-----------------------------------|----------------------------|
| Posponer por desconocimiento | Usuario completa learn o explora catálogo con perfil |
| Delegar sin criterio | Usuario usa comparador y lee desglose de score |
| Elegir solo por rentabilidad pasada | Usuario ve score, TER y avisos antes de decidir fuera de la app |
| Confundir información con asesoramiento | Avisos legales visibles en superficies sensibles |

---

## 5.4 Principio funcional derivado

El MVP de Inversora debe seguir el principio:

> **Educar primero, comparar después.**

Este principio afecta al diseño de la experiencia de usuario, el orden de las funcionalidades, la forma de presentar los rankings y el papel del Asistente Inversora dentro del sistema.

### Implicaciones prácticas

1. **Orden de la experiencia:** contexto educativo → perfil orientativo → exploración y comparación.
2. **Presentación de rankings:** score explicable y multidimensional; no solo rentabilidad histórica.
3. **Asistente Inversora:** capa explicativa sobre datos existentes; no genera métricas ni recomienda operaciones.
4. **Tono y UX:** sin urgencia ni gamificación de decisiones reales de inversión.

Detalle ampliado del principio y límites no negociables: [vision-and-principles.md](./vision-and-principles.md).

---

## Trazabilidad problema → documentación → código

| Tema §5 | Docs de producto | Código principal |
|---------|------------------|------------------|
| Capa educativa inicial | [vision-and-principles.md](./vision-and-principles.md) | `features/learn/`, `InitialProfileGate` |
| Lenguaje no técnico | [objectives.md](./objectives.md) §2.1.5 | `fund-glossary.ts`, `InfoHint` |
| No confundir con asesoramiento | [legal-and-disclaimers.md](./legal-and-disclaimers.md) | `LegalNotice`, `/legal` |
| Comparar con criterio | [scoring.md](./scoring.md) | `FundScoreBreakdown`, `comparison-screen.tsx` |
| Interés compuesto | [mvp-scope.md](./mvp-scope.md) | `features/calculator/` |
| Datos objetivos (backend) | `inversora-api/docs/purpose-and-scope.md` | `funds`, `scoring`, `bff` |

---

## Mantenimiento

Al cerrar una HU o funcionalidad que aborde un problema de §5.1 o una pregunta de §5.2:

1. Actualizar la tabla de cobertura en este archivo.
2. Actualizar el estado en [objectives.md](./objectives.md) y las HUs en [user-stories-index.md](./user-stories-index.md).
3. Si el cambio afecta al orden de la experiencia, revisar [mvp-feature-map.md](../architecture/mvp-feature-map.md).

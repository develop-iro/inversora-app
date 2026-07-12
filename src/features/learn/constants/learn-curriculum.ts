import type { LearnLesson, LearnModule } from '@/features/learn/entities/learn-curriculum.schema';

/** Ordered beginner curriculum modules. */
export const LEARN_CURRICULUM_MODULES: readonly LearnModule[] = [
  {
    id: 'foundations',
    title: 'Fundamentos',
    description: 'Conceptos básicos antes de comparar fondos.',
    lessonIds: [
      'index-fund-basics',
      'save-vs-invest',
      'risk-volatility',
    ],
  },
  {
    id: 'costs-and-time',
    title: 'Costes y tiempo',
    description: 'Comisiones, interés compuesto y rentabilidad pasada.',
    lessonIds: ['ter-fees', 'compound-interest', 'past-performance'],
  },
  {
    id: 'compare-responsibly',
    title: 'Comparar con criterio',
    description: 'Score Inversora y perfil orientativo.',
    lessonIds: ['inversora-score', 'orientative-profile'],
  },
];

/** Flat lesson catalog keyed by id. */
export const LEARN_CURRICULUM_LESSONS: Record<string, LearnLesson> = {
  'index-fund-basics': {
    id: 'index-fund-basics',
    moduleId: 'foundations',
    eyebrow: 'Concepto clave',
    title: 'Qué es un fondo indexado',
    body:
      'Un fondo indexado replica un índice de mercado (por ejemplo, el IBEX 35 o el S&P 500) con reglas claras. No busca batir al mercado cada trimestre: intenta seguirlo con la menor desviación y coste posibles.',
    estimatedMinutes: 3,
    conceptCards: [
      {
        id: 'passive',
        title: 'Gestión pasiva',
        description: 'Sigue una cesta de valores predefinida en lugar de elegir acciones una a una.',
        icon: 'chart-line',
      },
      {
        id: 'diversification',
        title: 'Diversificación',
        description: 'Un solo fondo puede exponerte a muchas empresas o bonos a la vez.',
        icon: 'chart-pie',
      },
    ],
  },
  'save-vs-invest': {
    id: 'save-vs-invest',
    moduleId: 'foundations',
    eyebrow: 'Antes de invertir',
    title: 'Ahorrar e invertir no es lo mismo',
    body:
      'Ahorrar conserva liquidez para imprevistos. Invertir busca crecimiento a largo plazo, pero el valor puede bajar temporalmente. Conviene tener colchón de emergencia antes de asumir más riesgo.',
    estimatedMinutes: 3,
    conceptCards: [
      {
        id: 'emergency',
        title: 'Reserva de emergencia',
        description: 'Muchas fuentes sugieren cubrir entre 4 y 12 meses de gastos antes de invertir con calma.',
        icon: 'lifebuoy',
      },
    ],
  },
  'risk-volatility': {
    id: 'risk-volatility',
    moduleId: 'foundations',
    eyebrow: 'Riesgo',
    title: 'Riesgo y volatilidad',
    body:
      'La volatilidad son las subidas y bajadas normales del valor. A más plazo suele haber más margen para recuperar caídas temporales, pero nunca hay garantías.',
    estimatedMinutes: 4,
    conceptCards: [
      {
        id: 'horizon',
        title: 'Horizonte temporal',
        description: 'Cuánto tiempo puedes dejar el dinero invertido sin necesitarlo.',
        icon: 'calendar-clock',
      },
    ],
  },
  'ter-fees': {
    id: 'ter-fees',
    moduleId: 'costs-and-time',
    eyebrow: 'Costes',
    title: 'Comisiones (TER)',
    body:
      'El TER (Total Expense Ratio) resume los costes anuales del fondo. Comisiones más bajas dejan más rentabilidad neta a largo plazo, aunque no son el único criterio.',
    estimatedMinutes: 3,
  },
  'compound-interest': {
    id: 'compound-interest',
    moduleId: 'costs-and-time',
    eyebrow: 'Tiempo',
    title: 'Interés compuesto',
    body:
      'Reinvertir las ganancias hace que el capital base crezca con el tiempo. Es un concepto educativo: la calculadora te ayuda a visualizar escenarios ilustrativos, no predicciones.',
    estimatedMinutes: 3,
    link: {
      type: 'route',
      label: 'Abrir calculadora',
      href: '/calculator',
    },
  },
  'past-performance': {
    id: 'past-performance',
    moduleId: 'costs-and-time',
    eyebrow: 'Advertencia',
    title: 'Rentabilidad pasada ≠ futuro',
    body:
      'Un fondo puede haber ido bien en el pasado y sufrir periodos difíciles después. Comparar solo por rentabilidad histórica es uno de los errores más comunes.',
    estimatedMinutes: 3,
  },
  'inversora-score': {
    id: 'inversora-score',
    moduleId: 'compare-responsibly',
    eyebrow: 'Criterio',
    title: 'Cómo leer el Score Inversora',
    body:
      'El Score resume varios factores (comisiones, tracking error, tamaño, antigüedad, calidad de datos) con reglas objetivas. No es una recomendación de compra: te ayuda a comparar dentro de una categoría con criterios homogéneos.',
    estimatedMinutes: 4,
  },
  'orientative-profile': {
    id: 'orientative-profile',
    moduleId: 'compare-responsibly',
    eyebrow: 'Perfil',
    title: 'Perfil orientativo',
    body:
      'El cuestionario educativo recoge horizonte, tolerancia al riesgo y objetivos de aprendizaje. Es orientativo: no sustituye un test de idoneidad ni asesoramiento personalizado.',
    estimatedMinutes: 3,
    link: {
      type: 'questionnaire',
      label: 'Completar cuestionario',
    },
  },
};

/** All lessons in curriculum order. */
export const LEARN_CURRICULUM_LESSON_LIST: readonly LearnLesson[] = LEARN_CURRICULUM_MODULES.flatMap(
  (module) =>
    module.lessonIds.map((lessonId) => {
      const lesson = LEARN_CURRICULUM_LESSONS[lessonId];
      if (lesson === undefined) {
        throw new Error(`Missing curriculum lesson: ${lessonId}`);
      }

      return lesson;
    }),
);

export const LEARN_CURRICULUM_TOTAL_LESSONS = LEARN_CURRICULUM_LESSON_LIST.length;

import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type LearnQuestionOption = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
};

export type LearnConceptCard = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
};

export type LearnInfoStep = {
  readonly id: string;
  readonly kind: 'info';
  readonly title: string;
  readonly body: string;
  readonly eyebrow?: string;
  readonly conceptCards?: readonly LearnConceptCard[];
  /** When false, the step is shown before the questionnaire and excluded from progress. */
  readonly countsTowardProgress?: boolean;
};

export type LearnChoiceStep = {
  readonly id: string;
  readonly kind: 'choice';
  readonly title: string;
  readonly body?: string;
  readonly eyebrow?: string;
  readonly options: readonly LearnQuestionOption[];
  readonly countsTowardProgress?: boolean;
};

export type LearnQuestionStep = LearnInfoStep | LearnChoiceStep;

/** Ordered questionnaire for the educational profiling flow (HU-17–21). */
export const LEARN_QUESTIONNAIRE_STEPS: readonly LearnQuestionStep[] = [
  {
    id: 'welcome',
    kind: 'info',
    countsTowardProgress: false,
    title: 'Hola, futuro inversor',
    body:
      'Antes de explorar fondos indexados, conversemos un momento.\n\nEste cuestionario te orienta para comparar con más contexto. Guardamos tus preferencias solo en el dispositivo.\n\nEs orientativo: no sustituye un test de idoneidad ni una recomendación personalizada.',
  },
  {
    id: 'prerequisites-education',
    kind: 'info',
    eyebrow: 'Conceptos clave',
    title: 'Preparación antes de invertir',
    body:
      'Invertir busca rentabilidad a largo plazo, pero el valor puede subir o bajar. Antes de perseguir ganancias, conviene ordenar las bases: estos conceptos te ayudan a prepararte con calma.',
    conceptCards: [
      {
        id: 'emergency-cushion',
        title: 'Reserva de emergencia',
        description:
          'Ahorro líquido para imprevistos. Muchas fuentes sugieren cubrir entre 4 y 12 meses de gastos antes de asumir más riesgo.',
        icon: 'lifebuoy',
      },
      {
        id: 'high-interest-debt',
        title: 'Deudas con intereses altos',
        description:
          'Reducir créditos caros libera capacidad de ahorro y evita que los intereses se coman tu rentabilidad futura.',
        icon: 'credit-card-off-outline',
      },
      {
        id: 'time-horizon',
        title: 'Horizonte temporal',
        description:
          'Cuánto tiempo puedes dejar el dinero invertido sin necesitarlo. A más plazo, más margen suele haber para recuperar caídas temporales.',
        icon: 'calendar-clock',
      },
      {
        id: 'volatility',
        title: 'Variación del valor',
        description:
          'Subidas y bajadas son normales. Tu temperamento marca cuánta oscilación puedes tolerar sin tomar decisiones impulsivas.',
        icon: 'chart-line-variant',
      },
      {
        id: 'profitability-goal',
        title: 'Rentabilidad con paciencia',
        description:
          'El objetivo es que tu dinero crezca por encima de la inflación con el tiempo. No hay ganancias garantizadas ni resultados inmediatos.',
        icon: 'sprout-outline',
      },
    ],
  },
  {
    id: 'horizon',
    kind: 'choice',
    eyebrow: 'Horizonte',
    title: '¿Cuándo crees que podrías necesitar este dinero?',
    body: 'Es la variable más importante: a más plazo, más margen suele haber para recuperar caídas temporales.',
    options: [
      {
        id: 'short',
        label: 'Menos de 4 años',
        description: 'Podría necesitarlo pronto; conviene pensar en estabilidad.',
        icon: 'clock-fast',
      },
      {
        id: 'medium',
        label: 'Entre 5 y 10 años',
        description: 'Tengo un objetivo de mediano plazo.',
        icon: 'calendar-range',
      },
      {
        id: 'long',
        label: 'Más de 10 años',
        description: 'Es dinero que no tocaría durante mucho tiempo.',
        icon: 'calendar-clock',
      },
    ],
  },
  {
    id: 'cushion',
    kind: 'choice',
    eyebrow: 'Colchón',
    title: '¿Tienes ahorro para imprevistos aparte de lo que invertirías?',
    body: 'Un colchón de 4 a 12 meses de gastos reduce la presión de vender en mal momento.',
    options: [
      {
        id: 'none',
        label: 'No o muy justo',
        description: 'Cualquier imprevisto me obligaría a tocar la inversión.',
        icon: 'alert-circle-outline',
      },
      {
        id: 'partial',
        label: 'Cubre algunos meses',
        description: 'Tengo algo aparte, pero no me sentiría cómodo sin más.',
        icon: 'wallet-outline',
      },
      {
        id: 'solid',
        label: 'Cubre 4 meses o más',
        description: 'Tengo margen para no depender de la inversión a corto plazo.',
        icon: 'shield-check-outline',
      },
    ],
  },
  {
    id: 'debt',
    kind: 'choice',
    eyebrow: 'Deudas',
    title: '¿Tienes deudas con intereses altos (tarjetas, créditos al consumo)?',
    body: 'Muchas fuentes recomiendan reducir deuda cara antes de invertir, porque cuesta más que muchas rentabilidades sin riesgo.',
    options: [
      {
        id: 'high-debt',
        label: 'Sí, con intereses altos',
        description: 'Tengo deudas que me preocupan y cuesta pagarlas.',
        icon: 'credit-card-off-outline',
      },
      {
        id: 'manageable-debt',
        label: 'Algo de deuda, pero manejable',
        description: 'Tengo deudas, pero las controlo y no me ahogan.',
        icon: 'credit-card-outline',
      },
      {
        id: 'no-debt',
        label: 'No tengo deuda relevante',
        description: 'Estoy libre de deudas con intereses altos.',
        icon: 'check-circle-outline',
      },
    ],
  },
  {
    id: 'knowledge',
    kind: 'choice',
    eyebrow: 'Conocimientos',
    title: '¿Cuánto sabes sobre inversiones?',
    body: 'No hay respuestas correctas. Queremos adaptar el lenguaje a tu punto de partida.',
    options: [
      {
        id: 'beginner',
        label: 'Estoy empezando',
        description: 'Nunca he invertido o apenas conozco los conceptos básicos.',
        icon: 'sprout',
      },
      {
        id: 'intermediate',
        label: 'Tengo nociones',
        description: 'He leído algo, pero me cuesta comparar fondos con seguridad.',
        icon: 'book-open-page-variant',
      },
      {
        id: 'advanced',
        label: 'Entiendo lo esencial',
        description: 'Comprendo TER, diversificación y la idea del riesgo a largo plazo.',
        icon: 'lightbulb-on-outline',
      },
    ],
  },
  {
    id: 'investor-style',
    kind: 'choice',
    eyebrow: 'Estilo',
    title: '¿Cuánto tiempo y atención quieres dedicar a tus inversiones?',
    body: 'Benjamin Graham distingue al inversor defensivo, que busca simplicidad, del emprendedor, que disfruta investigando.',
    options: [
      {
        id: 'defensive',
        label: 'Piloto automático',
        description: 'Prefiero simplicidad, pocas decisiones y fondos de bajo coste.',
        icon: 'shield-home-outline',
      },
      {
        id: 'balanced',
        label: 'Algo de seguimiento',
        description: 'Quiero entender lo básico y revisar de vez en cuando.',
        icon: 'scale-balance',
      },
      {
        id: 'enterprising',
        label: 'Me gusta investigar',
        description: 'Disfruto comparando, leyendo y tomando decisiones activas.',
        icon: 'magnify-scan',
      },
    ],
  },
  {
    id: 'volatility',
    kind: 'choice',
    eyebrow: 'Tolerancia',
    title: 'Imagina que tu inversión cae un 25 % en tres meses. ¿Qué harías?',
    body: 'El riesgo real no está solo en el mercado, sino en cómo reaccionamos ante las caídas.',
    options: [
      {
        id: 'low',
        label: 'Reduciría o vendería',
        description: 'Preferiría limitar pérdidas aunque mi horizonte sea largo.',
        icon: 'shield-alert-outline',
      },
      {
        id: 'medium',
        label: 'Aguantaría, aunque me inquiete',
        description: 'Entiendo que puede pasar, aunque no me guste verlo en rojo.',
        icon: 'scale-balance',
      },
      {
        id: 'high',
        label: 'Lo vería con perspectiva',
        description: 'Lo consideraría normal si mi horizonte es largo y tengo colchón.',
        icon: 'chart-line',
      },
    ],
  },
  {
    id: 'goal',
    kind: 'choice',
    eyebrow: 'Objetivo',
    title: '¿Qué te gustaría entender primero?',
    options: [
      {
        id: 'learn-basics',
        label: 'Qué es un fondo indexado',
        description: 'Empezar por conceptos sencillos y sin prisa.',
        icon: 'school-outline',
      },
      {
        id: 'learn-compare',
        label: 'Cómo comparar con calma',
        description: 'Entender qué mirar antes de poner fondos uno al lado del otro.',
        icon: 'compare-horizontal',
      },
      {
        id: 'learn-fees-risk',
        label: 'Comisiones y riesgo',
        description: 'Profundizar en TER, volatilidad y qué significan para mí.',
        icon: 'percent-outline',
      },
    ],
  },
] as const;

export const LEARN_WELCOME_STEP_ID = 'welcome';

export const LEARN_QUESTIONNAIRE_TOTAL_STEPS = LEARN_QUESTIONNAIRE_STEPS.length;

/** Steps that advance the progress counter (excludes the welcome intro). */
export const LEARN_QUESTIONNAIRE_PROGRESS_TOTAL = LEARN_QUESTIONNAIRE_STEPS.filter(
  (step) => step.countsTowardProgress !== false,
).length;

/**
 * Returns the 1-based progress index for a questionnaire step, or null for the welcome intro.
 *
 * @param stepIndex - Zero-based index in {@link LEARN_QUESTIONNAIRE_STEPS}.
 */
export function getLearnQuestionnaireProgressIndex(stepIndex: number): number | null {
  const step = LEARN_QUESTIONNAIRE_STEPS[stepIndex];

  if (!step || step.countsTowardProgress === false) {
    return null;
  }

  return LEARN_QUESTIONNAIRE_STEPS.slice(0, stepIndex + 1).filter(
    (item) => item.countsTowardProgress !== false,
  ).length;
}

export function isLearnWelcomeStep(stepIndex: number): boolean {
  return LEARN_QUESTIONNAIRE_STEPS[stepIndex]?.id === LEARN_WELCOME_STEP_ID;
}

/** Stack header title for the educational profiling questionnaire. */
export const LEARN_QUESTIONNAIRE_SCREEN_TITLE = 'Perfil orientativo';

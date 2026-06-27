import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type LearnQuestionOption = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: IconName;
};

export type LearnInfoStep = {
  readonly id: string;
  readonly kind: 'info';
  readonly title: string;
  readonly body: string;
  readonly eyebrow?: string;
};

export type LearnChoiceStep = {
  readonly id: string;
  readonly kind: 'choice';
  readonly title: string;
  readonly body?: string;
  readonly eyebrow?: string;
  readonly options: readonly LearnQuestionOption[];
};

export type LearnQuestionStep = LearnInfoStep | LearnChoiceStep;

/** Ordered questionnaire for the educational profiling flow (HU-17–21). */
export const LEARN_QUESTIONNAIRE_STEPS: readonly LearnQuestionStep[] = [
  {
    id: 'welcome',
    kind: 'info',
    eyebrow: 'Modo educativo',
    title: 'Antes de comparar fondos, conversemos',
    body:
      'Este cuestionario es orientativo y educativo. No sustituye un test de idoneidad ni una recomendación personalizada. Tus respuestas se guardan solo en este dispositivo.',
  },
  {
    id: 'risk-education',
    kind: 'info',
    eyebrow: 'Concepto clave',
    title: '¿Qué significa el riesgo al invertir?',
    body:
      'Invertir implica que el valor puede subir o bajar. A más riesgo suele corresponder más volatilidad, pero también más incertidumbre a corto plazo. El horizonte temporal y tu colchón de ahorro influyen en cuánta variación puedes asumir con calma.',
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
    id: 'horizon',
    kind: 'choice',
    eyebrow: 'Horizonte',
    title: '¿Durante cuánto tiempo podrías mantener el dinero invertido?',
    body: 'Un horizonte más largo suele dar más margen para recuperar caídas temporales.',
    options: [
      {
        id: 'short',
        label: 'Menos de 3 años',
        description: 'Podría necesitar el dinero en el corto plazo.',
        icon: 'clock-fast',
      },
      {
        id: 'medium',
        label: 'Entre 3 y 7 años',
        description: 'Tengo un objetivo de mediano plazo.',
        icon: 'calendar-range',
      },
      {
        id: 'long',
        label: 'Más de 7 años',
        description: 'Pienso en objetivos lejanos, como jubilación o patrimonio.',
        icon: 'calendar-clock',
      },
    ],
  },
  {
    id: 'volatility',
    kind: 'choice',
    eyebrow: 'Tolerancia',
    title: 'Imagina que tu inversión baja un 15 % en un año. ¿Qué harías?',
    body: 'Esta pregunta ayuda a entender tu comodidad con las fluctuaciones.',
    options: [
      {
        id: 'low',
        label: 'Me incomodaría mucho',
        description: 'Preferiría reducir exposición para evitar más pérdidas.',
        icon: 'shield-alert-outline',
      },
      {
        id: 'medium',
        label: 'Me incomodaría, pero aguantaría',
        description: 'Entiendo que puede pasar, aunque no me guste.',
        icon: 'scale-balance',
      },
      {
        id: 'high',
        label: 'Lo vería con perspectiva',
        description: 'Lo consideraría normal si mi horizonte es largo.',
        icon: 'chart-line',
      },
    ],
  },
  {
    id: 'cushion',
    kind: 'choice',
    eyebrow: 'Colchón',
    title: '¿Tienes ahorro para imprevistos aparte de lo que invertirías?',
    body: 'Un colchón reduce la presión de vender en mal momento.',
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
        label: 'Cubre 6 meses o más',
        description: 'Tengo margen para no depender de la inversión a corto plazo.',
        icon: 'shield-check-outline',
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

export const LEARN_QUESTIONNAIRE_TOTAL_STEPS = LEARN_QUESTIONNAIRE_STEPS.length;

import type { AssistantResponseSource } from '@/features/assistant/types/assistant-context';

export type HomeSearchAnswer = {
  title: string;
  body: string;
  relatedFundIsin?: string;
  source: AssistantResponseSource;
  disclaimer?: string;
};

type HomeSearchAnswerRule = {
  keywords: string[];
  answer: HomeSearchAnswer;
};

/** Mock educational answers used as fallback when SORA API is unavailable (HU-22, HU-23). */
export const HOME_SEARCH_ANSWER_RULES: HomeSearchAnswerRule[] = [
  {
    keywords: ['largo plazo', 'largo', 'jubil', 'retiro', '20 años', '30 años'],
    answer: {
      title: 'Invertir a largo plazo con fondos indexados',
      body: 'A horizontes largos, muchos inversores combinan diversificación global y costes bajos. El MSCI World o el S&P 500 suelen aparecer en rankings por su amplitud, pero conviene revisar riesgo, comisiones y coherencia con tu objetivo antes de comparar.',
      relatedFundIsin: 'IE00B4L5Y983',
      source: 'mock',
    },
  },
  {
    keywords: ['compar', 'versus', 'vs', 'diferencia entre'],
    answer: {
      title: 'Cómo comparar fondos en Inversora',
      body: 'Compara como máximo dos fondos de la misma familia o categoría cuando sea posible. Mira el Score Inversora, la comisión (TER), el riesgo y el benchmark. Si las categorías no son homogéneas, la comparación es orientativa, no una recomendación.',
      source: 'mock',
    },
  },
  {
    keywords: ['tranquil', 'bajo riesgo', 'conservad', 'seguro', 'estable'],
    answer: {
      title: 'Fondos con perfil más contenido',
      body: 'Los fondos de renta fija global o mixtos moderados suelen mostrar volatilidad más baja que los de renta variable pura. En el ranking puedes filtrar por riesgo bajo o medio y revisar la comisión antes de profundizar en la ficha.',
      relatedFundIsin: 'IE00B3F81R35',
      source: 'mock',
    },
  },
  {
    keywords: ['comisión', 'comision', 'ter', 'coste', 'gasto'],
    answer: {
      title: 'Qué es la comisión (TER)',
      body: 'El TER refleja el coste anual total del fondo. En fondos indexados, un TER más bajo suele favorecer la eficiencia a largo plazo, aunque no garantiza mejores resultados. Compara siempre con fondos de la misma categoría.',
      source: 'mock',
    },
  },
  {
    keywords: ['msci', 'world'],
    answer: {
      title: 'Qué es un fondo MSCI World',
      body: 'Replica un índice de empresas de países desarrollados. Ofrece diversificación geográfica amplia con sesgo a renta variable. Es un concepto educativo frecuente para entender exposición global, no una sugerencia de compra.',
      relatedFundIsin: 'IE00B4L5Y983',
      source: 'mock',
    },
  },
  {
    keywords: ['s&p', 'sp500', '500'],
    answer: {
      title: 'Qué es un fondo S&P 500',
      body: 'Sigue las 500 mayores empresas cotizadas en EE. UU. Concentra geográficamente en un solo mercado, con alta liquidez y referencia mediática. Úsalo para aprender sesgo regional, no como consejo personalizado.',
      relatedFundIsin: 'IE00B5BMR087',
      source: 'mock',
    },
  },
  {
    keywords: ['score', 'puntu', 'ranking', 'inversora'],
    answer: {
      title: 'Cómo leer el Score Inversora',
      body: 'Es una puntuación técnica 0–100 basada en criterios objetivos como comisión, tracking, tamaño y calidad de datos. La IA puede explicar el resultado, pero no modifica el cálculo ni sustituye tu propio criterio.',
      source: 'mock',
    },
  },
  {
    keywords: ['empezar', 'principiante', 'novato', 'no sé', 'no se'],
    answer: {
      title: 'Por dónde empezar',
      body: 'Antes de comparar fondos, aclara horizonte temporal y tolerancia al riesgo. Puedes explorar el catálogo, guardar favoritos locales y usar la guía educativa. Nada de esto constituye asesoramiento financiero personalizado.',
      source: 'mock',
    },
  },
];

export const HOME_SEARCH_DEFAULT_ANSWER: HomeSearchAnswer = {
  title: 'Explora el catálogo con criterio',
  body: 'Puedes buscar por nombre o ISIN para ver coincidencias en el ranking, o preguntar sobre conceptos como comisiones, riesgo o tipos de índice. Las respuestas son orientativas y educativas.',
  source: 'mock',
};

export function matchHomeSearchAnswer(query: string): HomeSearchAnswer {
  const normalized = query.trim().toLowerCase();

  for (const rule of HOME_SEARCH_ANSWER_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.answer;
    }
  }

  return HOME_SEARCH_DEFAULT_ANSWER;
}

import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type CompareIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type CompareSuggestedPair = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly isins: readonly [string, string];
  readonly icon: CompareIconName;
};

/** Educational starter pairs for the compare empty state. */
export const COMPARE_SUGGESTED_PAIRS: readonly CompareSuggestedPair[] = [
  {
    id: 'global-vs-usa',
    label: 'Mundo vs EE.UU.',
    description: 'Mercado total frente a S&P 500',
    isins: ['IE00B4L5Y983', 'IE00B5BMR087'],
    icon: 'earth',
  },
  {
    id: 'world-vs-all-world',
    label: 'World vs All-World',
    description: 'MSCI World frente a FTSE All-World',
    isins: ['IE00B4L5Y983', 'IE00BK5BQT80'],
    icon: 'chart-line',
  },
  {
    id: 'usa-ishares-vs-vanguard',
    label: 'S&P 500 iShares vs Vanguard',
    description: 'Misma referencia, distinta gestora',
    isins: ['IE00B5BMR087', 'IE00B3XXRP09'],
    icon: 'scale-balance',
  },
] as const;

export type CompareMetricTip = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: CompareIconName;
};

/** Short educational hints shown before the user starts comparing. */
export const COMPARE_METRIC_TIPS: readonly CompareMetricTip[] = [
  {
    id: 'ter',
    title: 'TER',
    description: 'Comisión anual del fondo',
    icon: 'percent-outline',
  },
  {
    id: 'score',
    title: 'Score',
    description: 'Resumen educativo Inversora',
    icon: 'chart-timeline-variant',
  },
  {
    id: 'risk',
    title: 'Riesgo',
    description: 'Perfil orientativo del fondo',
    icon: 'shield-half-full',
  },
] as const;

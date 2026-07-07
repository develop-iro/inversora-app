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
    isins: ['US9229087690', 'US78462F1030'],
    icon: 'earth',
  },
  {
    id: 'sp500-low-cost',
    label: 'S&P 500: dos estilos',
    description: 'SPDR frente a iShares Core',
    isins: ['US78462F1030', 'US4642872000'],
    icon: 'chart-line',
  },
  {
    id: 'usa-broad-vs-core',
    label: 'USA amplio vs núcleo',
    description: 'Total market frente a S&P 500',
    isins: ['US9229087690', 'US4642872000'],
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

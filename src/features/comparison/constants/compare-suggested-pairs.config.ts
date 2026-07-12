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
    id: 'global-vs-balanced',
    label: 'Global vs equilibrado',
    description: 'Renta variable frente a mixto moderado',
    isins: ['IE00B4L5Y983', 'IE00BYVJRP78'],
    icon: 'chart-line',
  },
  {
    id: 'usa-vs-europe',
    label: 'EE.UU. vs Europa',
    description: 'S&P 500 frente a calidad europea',
    isins: ['IE00B5BMR087', 'LU1781541179'],
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
    description: 'Comision anual del fondo',
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

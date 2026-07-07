import { Size } from '@/shared/theme/sizes';
import { Spacing } from '@/shared/theme/spacing';

/**
 * Shared chart layout constants for bar and line charts.
 */
export const ChartMetrics = {
  height: 200,
  barMaxHeight: 160,
  yAxisPaddingTop: Spacing.xlMinus,
  yAxisPaddingBottom: Spacing['3xl'],
  labelAreaHeight: 56,
  barTrackMaxWidth: 44,
  barMinWidth: Size.legendSwatch,
  barMinHeight: Spacing.xs,
  yAxisWidth: Size.chartYAxis,
} as const;

import type {
  FundPerformancePoint,
  FundPerformanceSeries,
  FundPerformanceTimeframe,
} from '@/core/domain/fund-market';

const TIMEFRAME_LABELS: Record<FundPerformanceTimeframe, string> = {
  '1d': '1 día',
  '1w': '1 semana',
  '1m': '1 mes',
};

const TIMEFRAME_PERIOD_LABELS: Record<FundPerformanceTimeframe, string> = {
  '1d': 'hoy',
  '1w': 'esta semana',
  '1m': 'este mes',
};

export function getTimeframeLabel(timeframe: FundPerformanceTimeframe): string {
  return TIMEFRAME_LABELS[timeframe];
}

export function getPerformanceChangePercent(series: FundPerformanceSeries): number {
  const first = series.points[0]?.value ?? 100;
  const last = series.points.at(-1)?.value ?? 100;
  if (first === 0) {
    return 0;
  }
  return Number((((last - first) / first) * 100).toFixed(2));
}

export function formatPerformanceChange(changePercent: number): string {
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}

export function getPerformancePeriodLabel(timeframe: FundPerformanceTimeframe): string {
  return TIMEFRAME_PERIOD_LABELS[timeframe];
}

/** Downsample for rendering while preserving shape (max 48 points). */
export function downsamplePerformancePoints(
  points: FundPerformancePoint[],
  maxPoints = 48,
): FundPerformancePoint[] {
  if (points.length <= maxPoints) {
    return points;
  }

  const step = Math.ceil(points.length / maxPoints);
  const sampled: FundPerformancePoint[] = [];

  for (let index = 0; index < points.length; index += step) {
    sampled.push(points[index]);
  }

  const last = points.at(-1);
  if (last && sampled.at(-1)?.date !== last.date) {
    sampled.push(last);
  }

  return sampled;
}

export type ChartCoordinate = {
  x: number;
  y: number;
};

export function buildPerformanceChartCoordinates(
  points: FundPerformancePoint[],
  width: number,
  height: number,
  padding = 8,
): { coordinates: ChartCoordinate[]; baselineY: number } {
  if (points.length === 0 || width <= 0 || height <= 0) {
    return { coordinates: [], baselineY: height };
  }

  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(maxValue - minValue, 0.6);
  const innerWidth = Math.max(width - padding * 2, 1);
  const innerHeight = Math.max(height - padding * 2, 1);
  const baselineY = padding + innerHeight;

  const coordinates = points.map((point, index) => ({
    x: padding + (index / Math.max(points.length - 1, 1)) * innerWidth,
    y: padding + innerHeight - ((point.value - minValue) / range) * innerHeight,
  }));

  return { coordinates, baselineY };
}

export function buildPerformanceA11yLabel(
  fundName: string,
  series: FundPerformanceSeries,
): string {
  const change = getPerformanceChangePercent(series);
  const direction =
    change > 0.05 ? 'subida' : change < -0.05 ? 'bajada' : 'lateral';
  const period = getPerformancePeriodLabel(series.timeframe);

  return `${fundName}. Evolución ilustrativa en ${getTimeframeLabel(series.timeframe)}: variación ${formatPerformanceChange(change)} ${period}, tendencia ${direction}. Datos de ${series.sourceLabel}, actualizado ${series.asOf.slice(0, 10)}.`;
}

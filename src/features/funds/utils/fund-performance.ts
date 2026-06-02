import type {
  FundPerformancePoint,
  FundPerformanceSeries,
  FundPerformanceTimeframe,
} from '@/core/domain/fund-market';

export const PERFORMANCE_TIMEFRAME_OPTIONS: {
  value: FundPerformanceTimeframe;
  label: string;
}[] = [
  { value: 'ytd', label: 'YTD' },
  { value: '1y', label: '1A' },
  { value: '3y', label: '3A' },
  { value: '5y', label: '5A' },
  { value: 'max', label: 'Todo' },
];

const TIMEFRAME_LABELS: Record<FundPerformanceTimeframe, string> = {
  ytd: 'lo que va de año',
  '1y': '1 año',
  '3y': '3 años',
  '5y': '5 años',
  max: 'histórico completo',
};

const TIMEFRAME_PERIOD_LABELS: Record<FundPerformanceTimeframe, string> = {
  ytd: 'en lo que va de año',
  '1y': 'en el último año',
  '3y': 'en 3 años',
  '5y': 'en 5 años',
  max: 'en el histórico mostrado',
};

const WEEKDAY_LABELS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const;

const MONTH_SHORT_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

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

/** Deterministic illustrative NAV anchor (EUR) for MVP charts. */
export function getIllustrativeNavBase(isin: string): number {
  let hash = 0;
  for (let index = 0; index < isin.length; index += 1) {
    hash = (hash * 31 + isin.charCodeAt(index)) >>> 0;
  }
  const seed = hash || 1;
  return Number((7 + (seed % 500) / 100).toFixed(2));
}

export function indexedValueToNav(indexedValue: number, navBase: number): number {
  return Number(((indexedValue / 100) * navBase).toFixed(2));
}

export function formatNavCurrency(nav: number): string {
  return `${nav.toFixed(2).replace('.', ',')} €`;
}

export function formatChartAxisDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  const month = MONTH_SHORT_LABELS[date.getUTCMonth()] ?? '';
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${month} '${year}`;
}

export function formatChartTooltipDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  const weekday = WEEKDAY_LABELS[date.getUTCDay()] ?? '';
  const day = date.getUTCDate();
  const month = MONTH_SHORT_LABELS[date.getUTCMonth()] ?? '';
  const year = date.getUTCFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export function buildYAxisTicks(minValue: number, maxValue: number, tickCount = 4): number[] {
  if (tickCount < 2) {
    return [minValue, maxValue];
  }

  const range = Math.max(maxValue - minValue, 0.01);
  const step = range / (tickCount - 1);

  return Array.from({ length: tickCount }, (_, index) =>
    Number((maxValue - step * index).toFixed(2)),
  );
}

export function pickAxisLabelIndices(pointCount: number, labelCount = 5): number[] {
  if (pointCount <= 1) {
    return [0];
  }

  const safeCount = Math.min(labelCount, pointCount);
  const indices: number[] = [];

  for (let index = 0; index < safeCount; index += 1) {
    const ratio = index / Math.max(safeCount - 1, 1);
    indices.push(Math.round(ratio * (pointCount - 1)));
  }

  return [...new Set(indices)].sort((a, b) => a - b);
}

export function getNearestPointIndex(
  locationX: number,
  pointCount: number,
  plotWidth: number,
  padding: number,
): number {
  if (pointCount <= 1 || plotWidth <= 0) {
    return 0;
  }

  const innerWidth = Math.max(plotWidth - padding * 2, 1);
  const clampedX = Math.max(padding, Math.min(locationX, plotWidth - padding));
  const ratio = (clampedX - padding) / innerWidth;
  return Math.round(ratio * (pointCount - 1));
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

export type PerformanceChartGeometry = {
  coordinates: ChartCoordinate[];
  baselineY: number;
  minValue: number;
  maxValue: number;
};

export function buildPerformanceChartCoordinates(
  points: FundPerformancePoint[],
  width: number,
  height: number,
  padding = 8,
): PerformanceChartGeometry {
  if (points.length === 0 || width <= 0 || height <= 0) {
    return { coordinates: [], baselineY: height, minValue: 0, maxValue: 0 };
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

  return { coordinates, baselineY, minValue, maxValue };
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

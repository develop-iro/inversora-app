import type { FundDetail } from '@/core/domain/catalog';
import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import {
  getPerformanceChangePercent,
  getTimeframeLabel,
} from '@/features/funds/utils/fund-performance';

/** Derived annual rate metadata for fund-based simulations. */
export type IllustrativeFundRate = {
  readonly annualRatePercent: number;
  readonly grossRatePercent: number;
  readonly terPercent: number;
  readonly timeframe: FundPerformanceTimeframe;
  readonly timeframeLabel: string;
  readonly sourceLabel: string;
  readonly fundName: string;
  readonly isin: string;
};

const TIMEFRAME_PRIORITY: readonly FundPerformanceTimeframe[] = [
  '5y',
  '3y',
  '1y',
  'ytd',
  'max',
];

const TIMEFRAME_YEARS: Partial<Record<FundPerformanceTimeframe, number>> = {
  '1y': 1,
  '3y': 3,
  '5y': 5,
};

/**
 * Converts a total return over several years into an annualized percentage.
 *
 * @param totalReturnPercent - Total return over the window.
 * @param years - Window length in years.
 */
export function annualizeTotalReturn(totalReturnPercent: number, years: number): number {
  if (years <= 0) {
    return 0;
  }

  const growthFactor = 1 + totalReturnPercent / 100;

  if (growthFactor <= 0) {
    return 0;
  }

  return (Math.pow(growthFactor, 1 / years) - 1) * 100;
}

function estimateSeriesYears(
  timeframe: FundPerformanceTimeframe,
  firstDate: string,
  lastDate: string,
): number {
  const fixedYears = TIMEFRAME_YEARS[timeframe];

  if (fixedYears !== undefined) {
    return fixedYears;
  }

  const start = new Date(`${firstDate}T12:00:00.000Z`).getTime();
  const end = new Date(`${lastDate}T12:00:00.000Z`).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.max((end - start) / (1000 * 60 * 60 * 24 * 365.25), 0.25);
}

/**
 * Derives an illustrative annual rate from historical fund performance.
 *
 * The rate is annualized from the longest reliable window and adjusted by TER
 * for educational purposes only.
 *
 * @param detail - Aggregated fund detail payload.
 */
export function deriveIllustrativeFundRate(
  detail: FundDetail,
): IllustrativeFundRate | null {
  const terPercent = detail.fund.terPercent ?? 0;

  for (const timeframe of TIMEFRAME_PRIORITY) {
    const series = detail.market.performanceByTimeframe[timeframe];
    const firstPoint = series?.points[0];
    const lastPoint = series?.points.at(-1);

    if (
      series === undefined ||
      firstPoint === undefined ||
      lastPoint === undefined ||
      series.points.length < 2
    ) {
      continue;
    }

    const years = estimateSeriesYears(timeframe, firstPoint.date, lastPoint.date);

    if (years <= 0) {
      continue;
    }

    const totalReturn = getPerformanceChangePercent(series);
    const grossRatePercent = annualizeTotalReturn(totalReturn, years);
    const annualRatePercent = Math.max(0, Number((grossRatePercent - terPercent).toFixed(2)));

    return {
      annualRatePercent,
      grossRatePercent: Number(grossRatePercent.toFixed(2)),
      terPercent,
      timeframe,
      timeframeLabel: getTimeframeLabel(timeframe),
      sourceLabel: series.sourceLabel,
      fundName: detail.fund.name,
      isin: detail.fund.isin,
    };
  }

  return null;
}

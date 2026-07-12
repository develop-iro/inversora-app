import type { FundDetail } from '@/core/domain/catalog';
import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import type { FundHistoricalReturns } from '@/core/scoring/types';
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
  /** True when the estimate uses less than one full year of price history. */
  readonly isPartialHistory: boolean;
};

const TIMEFRAME_PRIORITY: readonly FundPerformanceTimeframe[] = [
  '5y',
  '3y',
  '1y',
  'ytd',
  'max',
];

const RETURN_SNAPSHOT_PRIORITY: readonly {
  key: keyof Pick<FundHistoricalReturns, 'oneYear' | 'threeYear' | 'ytd'>;
  timeframe: FundPerformanceTimeframe;
  years: number | null;
}[] = [
  { key: 'oneYear', timeframe: '1y', years: 1 },
  { key: 'threeYear', timeframe: '3y', years: 3 },
  { key: 'ytd', timeframe: 'ytd', years: null },
];

const TIMEFRAME_YEARS: Partial<Record<FundPerformanceTimeframe, number>> = {
  '1y': 1,
  '3y': 3,
  '5y': 5,
};

/** Minimum history window (~90 days) before annualizing short series. */
const MIN_HISTORY_YEARS = 90 / 365.25;

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

  return estimateYearsBetweenDates(firstDate, lastDate);
}

function estimateYearsBetweenDates(firstDate: string, lastDate: string): number {
  const start = new Date(`${firstDate}T12:00:00.000Z`).getTime();
  const end = new Date(`${lastDate}T12:00:00.000Z`).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.max((end - start) / (1000 * 60 * 60 * 24 * 365.25), 0);
}

function resolveYtdYears(asOf: string | null): number {
  if (asOf === null) {
    return 0;
  }

  const yearStart = `${asOf.slice(0, 4)}-01-01`;
  return estimateYearsBetweenDates(yearStart, asOf);
}

function buildIllustrativeRate(input: {
  detail: FundDetail;
  terPercent: number;
  totalReturnPercent: number;
  years: number;
  timeframe: FundPerformanceTimeframe;
  timeframeLabel?: string;
  sourceLabel: string;
}): IllustrativeFundRate | null {
  if (input.years < MIN_HISTORY_YEARS) {
    return null;
  }

  const grossRatePercent = annualizeTotalReturn(input.totalReturnPercent, input.years);
  const annualRatePercent = Math.max(
    0,
    Number((grossRatePercent - input.terPercent).toFixed(2)),
  );

  return {
    annualRatePercent,
    grossRatePercent: Number(grossRatePercent.toFixed(2)),
    terPercent: input.terPercent,
    timeframe: input.timeframe,
    timeframeLabel: input.timeframeLabel ?? getTimeframeLabel(input.timeframe),
    sourceLabel: input.sourceLabel,
    fundName: input.detail.fund.name,
    isin: input.detail.fund.isin,
    isPartialHistory: input.years < 1,
  };
}

function deriveFromPerformanceSeries(detail: FundDetail, terPercent: number): IllustrativeFundRate | null {
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

    if (years < MIN_HISTORY_YEARS) {
      continue;
    }

    const totalReturn = getPerformanceChangePercent(series);

    return buildIllustrativeRate({
      detail,
      terPercent,
      totalReturnPercent: totalReturn,
      years,
      timeframe,
      sourceLabel: series.sourceLabel,
    });
  }

  return null;
}

function deriveFromReturnSnapshot(detail: FundDetail, terPercent: number): IllustrativeFundRate | null {
  const returns = detail.fund.returns;
  const sourceLabel = detail.profile.sourceLabel;

  for (const candidate of RETURN_SNAPSHOT_PRIORITY) {
    const totalReturnPercent = returns[candidate.key];

    if (totalReturnPercent === null) {
      continue;
    }

    const years =
      candidate.years ?? resolveYtdYears(returns.asOf ?? detail.profile.asOf.slice(0, 10));

    const rate = buildIllustrativeRate({
      detail,
      terPercent,
      totalReturnPercent,
      years,
      timeframe: candidate.timeframe,
      sourceLabel,
    });

    if (rate !== null) {
      return rate;
    }
  }

  return null;
}

function deriveFromReturnsByPeriod(detail: FundDetail, terPercent: number): IllustrativeFundRate | null {
  const sourceLabel = detail.profile.sourceLabel;
  const periodPriority: readonly {
    id: string;
    timeframe: FundPerformanceTimeframe;
    years: number | null;
  }[] = [
    { id: '1y', timeframe: '1y', years: 1 },
    { id: '3y', timeframe: '3y', years: 3 },
    { id: '5y', timeframe: '5y', years: 5 },
    { id: 'ytd', timeframe: 'ytd', years: null },
  ];

  for (const candidate of periodPriority) {
    const row = detail.profile.returnsByPeriod.find((entry) => entry.id === candidate.id);

    if (row === undefined || row.percent === null) {
      continue;
    }

    const years =
      candidate.years ??
      resolveYtdYears(detail.fund.returns.asOf ?? detail.profile.asOf.slice(0, 10));

    const rate = buildIllustrativeRate({
      detail,
      terPercent,
      totalReturnPercent: row.percent,
      years,
      timeframe: candidate.timeframe,
      sourceLabel,
    });

    if (rate !== null) {
      return rate;
    }
  }

  return null;
}

/**
 * Derives an illustrative annual rate from historical fund performance.
 *
 * The rate is annualized from the longest reliable window and adjusted by TER
 * for educational purposes only. Falls back to API return snapshots (FMP-backed
 * price history) when chart series are sparse.
 *
 * @param detail - Aggregated fund detail payload.
 */
export function deriveIllustrativeFundRate(
  detail: FundDetail,
): IllustrativeFundRate | null {
  const terPercent = detail.fund.terPercent ?? 0;

  return (
    deriveFromPerformanceSeries(detail, terPercent) ??
    deriveFromReturnSnapshot(detail, terPercent) ??
    deriveFromReturnsByPeriod(detail, terPercent)
  );
}

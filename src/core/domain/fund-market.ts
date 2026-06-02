/** Historical NAV / index points for educational charts (not live trading data). */
export type FundPerformanceTimeframe = '1d' | '1w' | '1m';

export type FundPerformancePoint = {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Indexed level; 100 = start of the visible window. */
  value: number;
};

export type FundPerformanceSeries = {
  timeframe: FundPerformanceTimeframe;
  points: FundPerformancePoint[];
  /** ISO timestamp of the last point. */
  asOf: string;
  /** Human-readable data source for disclaimers. */
  sourceLabel: string;
};

export type FundRegionSlice = {
  label: string;
  percent: number;
};

export type FundMarketSnapshot = {
  performanceByTimeframe: Record<FundPerformanceTimeframe, FundPerformanceSeries>;
  regions: FundRegionSlice[];
  stabilityLabel: string;
  /** Optional change vs previous period, for display only. */
  stabilityChangePercent?: number;
};

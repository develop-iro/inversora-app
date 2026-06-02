import type {
  FundMarketSnapshot,
  FundPerformancePoint,
  FundPerformanceSeries,
  FundPerformanceTimeframe,
} from '@/core/domain/fund-market';

const MOCK_AS_OF = '2026-03-31T18:00:00.000Z';
const MOCK_SOURCE = 'Serie ilustrativa MVP (no cotización en tiempo real)';

/** Deterministic pseudo-random from ISIN for stable mock charts. */
function seedFromIsin(isin: string): number {
  let hash = 0;
  for (let i = 0; i < isin.length; i += 1) {
    hash = (hash * 31 + isin.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildDailySeries(isin: string, dayCount: number): FundPerformancePoint[] {
  const seed = seedFromIsin(isin);
  const points: FundPerformancePoint[] = [];
  let level = 100;
  const end = new Date('2026-03-31T12:00:00.000Z');

  for (let day = dayCount - 1; day >= 0; day -= 1) {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - day);
    const drift = (pseudoRandom(seed, day) - 0.48) * 0.9;
    level = Math.max(92, Math.min(108, level + drift));
    points.push({
      date: date.toISOString().slice(0, 10),
      value: Number(level.toFixed(2)),
    });
  }

  return points;
}

function sliceSeries(
  daily: FundPerformancePoint[],
  take: number,
  timeframe: FundPerformanceTimeframe,
): FundPerformanceSeries {
  const points = daily.slice(-take);
  const base = points[0]?.value ?? 100;
  const normalized = points.map((point) => ({
    date: point.date,
    value: Number(((point.value / base) * 100).toFixed(2)),
  }));

  return {
    timeframe,
    points: normalized,
    asOf: MOCK_AS_OF,
    sourceLabel: MOCK_SOURCE,
  };
}

function buildPerformance(isin: string): FundMarketSnapshot['performanceByTimeframe'] {
  const daily = buildDailySeries(isin, 90);

  return {
    '1d': sliceSeries(daily, 2, '1d'),
    '1w': sliceSeries(daily, 7, '1w'),
    '1m': sliceSeries(daily, 30, '1m'),
  };
}

const REGION_PRESETS: Record<string, FundMarketSnapshot['regions']> = {
  IE00B5BMR087: [
    { label: 'Norteamérica', percent: 100 },
  ],
  IE00B4L5Y983: [
    { label: 'Norteamérica', percent: 62 },
    { label: 'Europa', percent: 18 },
    { label: 'Asia-Pacífico', percent: 12 },
    { label: 'Otros', percent: 8 },
  ],
  IE00B1YZSC51: [
    { label: 'Europa', percent: 72 },
    { label: 'Reino Unido', percent: 14 },
    { label: 'Otros', percent: 14 },
  ],
};

function defaultRegions(isin: string): FundMarketSnapshot['regions'] {
  const preset = REGION_PRESETS[isin.toUpperCase()];
  if (preset) {
    return preset;
  }

  return [
    { label: 'Desarrollados', percent: 55 },
    { label: 'Emergentes', percent: 25 },
    { label: 'Otros', percent: 20 },
  ];
}

function stabilityFromSeries(series: FundPerformanceSeries): {
  label: string;
  changePercent?: number;
} {
  const first = series.points[0]?.value ?? 100;
  const last = series.points.at(-1)?.value ?? 100;
  const change = ((last - first) / first) * 100;
  const absChange = Math.abs(change);

  if (absChange < 0.35) {
    return { label: 'Estable', changePercent: Number(change.toFixed(2)) };
  }
  if (absChange < 1.2) {
    return { label: 'Moderada', changePercent: Number(change.toFixed(2)) };
  }
  return { label: 'Variable', changePercent: Number(change.toFixed(2)) };
}

export function getFundMarketSnapshotMock(isin: string): FundMarketSnapshot {
  const performanceByTimeframe = buildPerformance(isin);
  const monthSeries = performanceByTimeframe['1m'];
  const stability = stabilityFromSeries(monthSeries);

  return {
    performanceByTimeframe,
    regions: defaultRegions(isin),
    stabilityLabel: stability.label,
    stabilityChangePercent: stability.changePercent,
  };
}

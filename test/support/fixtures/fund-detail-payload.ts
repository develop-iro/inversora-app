import type { FundPerformanceTimeframe } from '@/core/domain/fund-market';
import type { ScoreBreakdown } from '@/core/scoring/types';

import { buildFeaturedFund } from './featured-fund';

const TIMEFRAMES: FundPerformanceTimeframe[] = ['ytd', '1y', '3y', '5y', 'max'];

/**
 * Builds the six-criterion score breakdown required by the fund-detail BFF contract.
 */
export function buildScoreBreakdownFixture(): ScoreBreakdown {
  return [
    { id: 'ter', label: 'Comisión (TER)', points: 34, maxPoints: 40 },
    { id: 'tracking', label: 'Tracking error', points: 32, maxPoints: 40 },
    { id: 'aum', label: 'Patrimonio (AUM)', points: 8, maxPoints: 10 },
    { id: 'age', label: 'Antigüedad', points: 7, maxPoints: 10 },
    { id: 'consistency', label: 'Consistencia', points: 0, maxPoints: 0 },
    { id: 'dataQuality', label: 'Calidad de datos', points: 0, maxPoints: 0 },
  ];
}

function buildSeries(timeframe: FundPerformanceTimeframe) {
  return {
    timeframe,
    points: [
      { date: '2026-01-01', value: 100 },
      { date: '2026-06-01', value: 108 },
    ],
    asOf: '2026-06-30',
    sourceLabel: 'Serie ilustrativa de test',
  };
}

/**
 * Builds a minimal valid `GET /funds/:isin` payload for parser contracts.
 */
export function buildFundDetailPayload(overrides: Record<string, unknown> = {}) {
  const fund = buildFeaturedFund();

  return {
    fund,
    inversoraScore: 86,
    rank: 1,
    scoringStatus: 'ok',
    scoredBreakdown: buildScoreBreakdownFixture(),
    market: {
      performanceByTimeframe: Object.fromEntries(
        TIMEFRAMES.map((timeframe) => [timeframe, buildSeries(timeframe)]),
      ),
      regions: [
        { label: 'EE. UU.', percent: 70 },
        { label: 'Europa', percent: 20 },
        { label: 'Otros', percent: 10 },
      ],
      stabilityLabel: 'Estable',
      stabilityChangePercent: 1.2,
    },
    profile: {
      asOf: '2026-06-30',
      sourceLabel: 'Perfil educativo de test',
      description: 'Fondo indexado global para tests.',
      manager: 'Inversora Asset',
      benchmark: 'MSCI World',
      tracksIndex: true,
      fundAum: '10.000M€',
      inceptionDate: '2010-01-01',
      currencyNote: 'EUR',
      methodNote: 'Método ilustrativo',
      summaryRows: [{ label: 'ISIN', value: fund.isin }],
      feeRows: [{ label: 'TER', value: '0,12%' }],
      documents: [{ label: 'KIID', url: 'https://example.com/kiid.pdf' }],
      returnsByPeriod: [{ id: '1y', label: 'Un año', percent: 11.5 }],
      returnsByYear: [{ year: 2025, percent: 12.1 }],
      ratiosByHorizon: {
        '1y': [{ label: 'Volatilidad', value: '12%' }],
      },
      exposureByTab: {
        regions: [{ label: 'EE. UU.', percent: 70 }],
      },
      distributors: [{ name: 'Broker demo', url: 'https://example.com' }],
    },
    ...overrides,
  };
}

import type { MockApiFund } from './catalog-funds';

function mapRiskLevel(riskLevel: number): 'low' | 'medium' | 'high' {
  if (riskLevel <= 2) {
    return 'low';
  }

  if (riskLevel <= 5) {
    return 'medium';
  }

  return 'high';
}

const TIMEFRAMES = ['ytd', '1y', '3y', '5y', 'max'] as const;

/**
 * Builds a `GET /funds/:isin` payload accepted by the app detail parser.
 *
 * @param fund - Catalog mock fund used by Playwright doubles.
 */
export function toFundDetailPayload(fund: MockApiFund) {
  const riskLevel = mapRiskLevel(fund.riskLevel);

  return {
    fund: {
      id: fund.id,
      isin: fund.isin,
      symbol: fund.symbol,
      issuer: fund.issuer,
      logoUrl: null,
      name: fund.name,
      categoryLabel: fund.benchmark,
      investmentTheme: fund.investmentTheme,
      themeLabel: fund.benchmark,
      badge: 'Catalogo',
      idealForBeginners: fund.idealForBeginners,
      efficiencyScore: fund.score,
      terPercent: fund.ter,
      riskLevel,
      diversification: 'high',
      quarterTag: 'Q1 2026',
      periodStart: '2026-01-01',
      periodEnd: '2026-03-31',
      benefitSummary: 'Fondo indexado educativo para journeys e2e.',
      featuredReason: 'Fixture Playwright',
      isFeatured: true,
      returns: {
        ytd: 2,
        oneYear: fund.oneYearReturn,
        threeYear: fund.threeYearReturn,
        asOf: '2026-06-30',
      },
    },
    inversoraScore: fund.score,
    rank: 1,
    scoringStatus: 'ok',
    scoredBreakdown: [
      { id: 'ter', label: 'Comisión (TER)', points: 34, maxPoints: 40 },
      { id: 'tracking', label: 'Tracking error', points: 32, maxPoints: 40 },
      { id: 'aum', label: 'Patrimonio (AUM)', points: 8, maxPoints: 10 },
      { id: 'age', label: 'Antigüedad', points: 7, maxPoints: 10 },
      { id: 'consistency', label: 'Consistencia', points: 0, maxPoints: 0 },
      { id: 'dataQuality', label: 'Calidad de datos', points: 0, maxPoints: 0 },
    ],
    market: {
      performanceByTimeframe: Object.fromEntries(
        TIMEFRAMES.map((timeframe) => [
          timeframe,
          {
            timeframe,
            points: [
              { date: '2026-01-01', value: 100 },
              { date: '2026-06-01', value: 108 },
            ],
            asOf: '2026-06-30',
            sourceLabel: 'Serie ilustrativa e2e',
          },
        ]),
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
      sourceLabel: 'Perfil educativo e2e',
      description: 'Fondo indexado global para journeys Playwright.',
      manager: 'Inversora Asset',
      benchmark: fund.benchmark,
      tracksIndex: true,
      fundAum: '10.000M€',
      inceptionDate: '2010-01-01',
      currencyNote: 'EUR',
      methodNote: 'Método ilustrativo',
      summaryRows: [
        { id: 'isin', label: 'ISIN', value: fund.isin },
        { id: 'currency', label: 'Divisa', value: 'EUR' },
        { id: 'vehicle', label: 'Vehículo', value: 'Fondo' },
      ],
      feeRows: [{ id: 'ter', label: 'TER', value: `${fund.ter}%` }],
      documents: [{ id: 'kiid', label: 'KIID', status: 'available', url: 'https://example.com/kiid.pdf' }],
      returnsByPeriod: [
        { id: 'ytd', label: 'YTD', percent: 2 },
        { id: '1y', label: 'Un año', percent: fund.oneYearReturn },
        { id: '3y', label: 'Tres años', percent: fund.threeYearReturn },
      ],
      returnsByYear: [{ year: 2025, percent: 12.1 }],
      ratiosByHorizon: {
        '12m': [{ id: 'trackingError', label: 'Tracking error', value: '0,12%' }],
        '3y': [],
        '5y': [],
      },
      exposureByTab: {
        sectorial: [],
        regional: [{ label: 'EE. UU.', percent: 70 }],
        assetAllocation: [],
        capitalization: [],
        portfolio: [],
      },
      distributors: [{ id: 'demo', name: 'Broker demo', kind: 'broker' }],
    },
  };
}

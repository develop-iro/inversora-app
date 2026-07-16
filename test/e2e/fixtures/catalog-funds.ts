/**
 * Minimal fund fixture used by Playwright API doubles.
 */
export type MockApiFund = {
  id: string;
  symbol: string;
  isin: string;
  name: string;
  issuer: string;
  benchmark: string;
  investmentTheme: string;
  riskLevel: number;
  score: number;
  ter: number;
  idealForBeginners: boolean;
  oneYearReturn: number;
  threeYearReturn: number;
};

/**
 * Default catalog funds for e2e journeys (filters, profile hints, listing).
 */
export const MOCK_CATALOG_FUNDS: MockApiFund[] = [
  {
    id: 'fund-global-low',
    symbol: 'LOW-A',
    isin: 'IE0000000001',
    name: 'Inversora Global Low Risk',
    issuer: 'Inversora',
    benchmark: 'MSCI World',
    investmentTheme: 'global-equity',
    riskLevel: 2,
    score: 86,
    ter: 0.12,
    idealForBeginners: true,
    oneYearReturn: 7.2,
    threeYearReturn: 21.4,
  },
  {
    id: 'fund-global-mid',
    symbol: 'MID-A',
    isin: 'IE0000000002',
    name: 'Inversora Global Balanced',
    issuer: 'Inversora',
    benchmark: 'MSCI World',
    investmentTheme: 'global-equity',
    riskLevel: 4,
    score: 81,
    ter: 0.18,
    idealForBeginners: true,
    oneYearReturn: 8.4,
    threeYearReturn: 23.1,
  },
  {
    id: 'fund-usa-high',
    symbol: 'USA-A',
    isin: 'IE0000000003',
    name: 'Inversora USA Equity',
    issuer: 'Inversora',
    benchmark: 'S&P 500',
    investmentTheme: 'us-equity',
    riskLevel: 6,
    score: 89,
    ter: 0.09,
    idealForBeginners: false,
    oneYearReturn: 11.2,
    threeYearReturn: 30.5,
  },
];

/**
 * Maps a mock fund to the API list/detail shape expected by the app.
 */
export function toApiFund(fund: MockApiFund) {
  return {
    id: fund.id,
    symbol: fund.symbol,
    isin: fund.isin,
    name: fund.name,
    issuer: fund.issuer,
    logoUrl: null,
    benchmark: fund.benchmark,
    investmentTheme: fund.investmentTheme,
    assetClass: 'equity',
    domicile: 'IE',
    metrics: {
      ter: fund.ter,
      aum: 1000000000,
      volatility: null,
      drawdown: null,
      per: null,
      dividendYield: null,
      trackingError: null,
    },
    riskLevel: fund.riskLevel,
    score: fund.score,
    editorial: {
      badge: 'Catalogo',
      themeLabel: fund.benchmark,
      idealForBeginners: fund.idealForBeginners,
    },
    catalogVisibility: 'visible',
    returns: {
      ytd: 2,
      oneYear: fund.oneYearReturn,
      threeYear: fund.threeYearReturn,
      asOf: '2026-06-30',
    },
  };
}

/**
 * Ranking groups fixture for the educational rankings dashboard.
 */
export const MOCK_RANKING_GROUPS = [
  {
    benchmark: 'MSCI World',
    benchmarkKey: 'msci-world',
    total: 2,
    funds: [
      {
        rank: 1,
        id: 'fund-msci-world-a',
        symbol: 'WORLD-A',
        isin: 'ES0000000001',
        name: 'Inversora MSCI World Index',
        score: 91,
        benchmark: 'MSCI World',
        currency: 'EUR',
        riskLevel: 4,
        ter: 0.12,
        returns: { ytd: 4.8, oneYear: 11.2, threeYear: 28.6, asOf: '2026-06-30' },
      },
      {
        rank: 2,
        id: 'fund-msci-world-b',
        symbol: 'WORLD-B',
        isin: 'ES0000000002',
        name: 'Global World Index Clase A',
        score: 84,
        benchmark: 'MSCI World',
        currency: 'EUR',
        riskLevel: 4,
        ter: 0.18,
        returns: { ytd: 3.6, oneYear: 9.4, threeYear: 24.1, asOf: '2026-06-30' },
      },
    ],
  },
  {
    benchmark: 'S&P 500',
    benchmarkKey: 'sp-500',
    total: 1,
    funds: [
      {
        rank: 1,
        id: 'fund-sp500-a',
        symbol: 'SP500-A',
        isin: 'ES0000000003',
        name: 'Inversora S&P 500 Index',
        score: 88,
        benchmark: 'S&P 500',
        currency: 'EUR',
        riskLevel: 5,
        ter: 0.1,
        returns: { ytd: 5.1, oneYear: 12.3, threeYear: 31.4, asOf: '2026-06-30' },
      },
    ],
  },
];

/** ISINs used by the suggested comparison cards when detail endpoints should 404. */
export const SUGGESTED_COMPARISON_ISINS = ['IE00B4L5Y983', 'IE00B5BMR087'] as const;

import type { ApiFund } from '@/core/api/map-api-fund';

const DEFAULT_API_FUND: ApiFund = {
  id: 'fund-a',
  symbol: 'TEST',
  isin: 'IE00TEST0001',
  name: 'Global Index Fund',
  issuer: 'Inversora',
  logoUrl: null,
  benchmark: 'MSCI World',
  investmentTheme: 'global-equity',
  assetClass: 'equity',
  domicile: 'IE',
  metrics: {
    ter: 0.12,
    aum: 1_000_000_000,
    volatility: null,
    drawdown: null,
    per: null,
    dividendYield: null,
    trackingError: null,
  },
  riskLevel: 3,
  score: 85,
  editorial: {
    badge: 'Catalogo',
    themeLabel: 'Global',
    idealForBeginners: true,
  },
  catalogVisibility: 'visible',
  returns: {
    ytd: 2,
    oneYear: 8,
    threeYear: 20,
    asOf: '2026-06-30',
  },
};

/**
 * Builds a raw API fund fixture for contract specs (list/detail mappers).
 */
export function buildApiFund(overrides: Partial<ApiFund> = {}): ApiFund {
  return {
    ...DEFAULT_API_FUND,
    ...overrides,
    metrics: {
      ...DEFAULT_API_FUND.metrics,
      ...overrides.metrics,
    },
    editorial: {
      ...DEFAULT_API_FUND.editorial,
      ...overrides.editorial,
    },
    returns: {
      ...DEFAULT_API_FUND.returns,
      ...overrides.returns,
    },
  };
}

/**
 * Minimal valid `GET /funds` list payload for parser contracts.
 */
export function buildFundListPayload(funds: ApiFund[], metaOverrides: Record<string, number> = {}) {
  return {
    data: funds,
    meta: {
      page: 1,
      limit: 20,
      total: funds.length,
      totalPages: funds.length === 0 ? 0 : 1,
      ...metaOverrides,
    },
  };
}

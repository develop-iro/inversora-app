import type { FeaturedFund } from '@/core/domain/fund';

import { resolveMockFundReturns } from '@/features/funds/mocks/mock-fund-returns';

const BRANDFETCH_RENDER_PATH = '/w/64/h/64/theme/dark/fallback/lettermark';
const BRANDFETCH_CLIENT_ID =
  process.env.EXPO_PUBLIC_BRANDFETCH_CLIENT_ID?.trim() ?? '';

/**
 * Builds a Brandfetch CDN logo URL for local mocks (matches API shape).
 *
 * @param domain - Asset manager domain (e.g. `ishares.com`).
 */
function brandfetchDomainLogo(domain: string): string {
  if (BRANDFETCH_CLIENT_ID.length === 0) {
    return `https://cdn.brandfetch.io/domain/${domain}${BRANDFETCH_RENDER_PATH}`;
  }

  return `https://cdn.brandfetch.io/domain/${domain}${BRANDFETCH_RENDER_PATH}?c=${BRANDFETCH_CLIENT_ID}`;
}

const FEATURED_FUNDS_MOCK_BASE: Omit<FeaturedFund, 'returns'>[] = [
  {
    id: 'msci-world-core',
    isin: 'IE00B4L5Y983',
    symbol: 'IWDA',
    issuer: 'iShares',
    logoUrl: brandfetchDomainLogo('ishares.com'),
    name: 'MSCI World Index Core',
    categoryLabel: 'Renta Variable Global',
    investmentTheme: 'global-equity',
    themeLabel: 'Multisector global',
    badge: 'Ideal para empezar',
    idealForBeginners: true,
    efficiencyScore: 86,
    terPercent: 0.12,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary:
      'Invierte en más de 1.500 empresas globales en una sola posición.',
    featuredReason: 'Bajo coste + alta diversificación',
    isFeatured: true,
  },
  {
    id: 'sp500-acc',
    isin: 'IE00B5BMR087',
    symbol: 'CSPX',
    issuer: 'iShares',
    logoUrl: brandfetchDomainLogo('ishares.com'),
    name: 'S&P 500 Acc',
    categoryLabel: 'Renta Variable USA',
    investmentTheme: 'us-equity',
    themeLabel: 'Tecnología y mega caps',
    badge: 'Núcleo de cartera',
    idealForBeginners: true,
    efficiencyScore: 84,
    terPercent: 0.07,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary:
      'Ideal para diversificación a largo plazo con sesgo a grandes empresas de EE. UU.',
    featuredReason: 'Comisión mínima + referencia global',
    isFeatured: true,
  },
  {
    id: 'europe-quality',
    isin: 'LU1781541179',
    symbol: 'EQQQ',
    issuer: 'Amundi',
    logoUrl: brandfetchDomainLogo('amundi.com'),
    name: 'Europe Quality ESG',
    categoryLabel: 'Renta Variable Europa',
    investmentTheme: 'esg',
    themeLabel: 'Renovables y ESG',
    badge: 'Filtro calidad ESG',
    idealForBeginners: false,
    efficiencyScore: 81,
    terPercent: 0.18,
    riskLevel: 'medium',
    diversification: 'medium',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary:
      'Exposición a empresas europeas consolidadas con criterios de sostenibilidad.',
    featuredReason: 'Calidad empresarial + enfoque responsable',
    isFeatured: true,
  },
  {
    id: 'global-balanced',
    isin: 'IE00BYVJRP78',
    symbol: 'VAGF',
    issuer: 'Vanguard',
    logoUrl: brandfetchDomainLogo('vanguard.com'),
    name: 'Global Balanced Index',
    categoryLabel: 'Mixto Moderado',
    investmentTheme: 'multi-asset',
    themeLabel: 'Multiactivo equilibrado',
    badge: 'Volatilidad contenida',
    idealForBeginners: true,
    efficiencyScore: 79,
    terPercent: 0.21,
    riskLevel: 'low',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary:
      'Combina renta fija y variable para suavizar oscilaciones del mercado.',
    featuredReason: 'Estabilidad relativa + diversificación multiactivo',
    isFeatured: true,
  },
];

export const FEATURED_FUNDS_MOCK: FeaturedFund[] = FEATURED_FUNDS_MOCK_BASE.map((fund) => ({
  ...fund,
  returns: resolveMockFundReturns(fund.isin),
}));

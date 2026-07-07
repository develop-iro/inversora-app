import type { CatalogFund, CatalogVisibility } from '@/core/domain/catalog';
import type { FeaturedFund, RiskLevel } from '@/core/domain/fund';
import type { InvestmentTheme } from '@/core/domain/investment-theme';
import { parseInvestmentTheme } from '@/core/domain/investment-theme';

import { resolveCurrentQuarterMetadata } from '@/core/api/quarter-metadata';
export type ApiFundMetrics = {
  ter: number | null;
  aum: number | null;
  volatility: number | null;
  drawdown: number | null;
  per: number | null;
  dividendYield: number | null;
  trackingError: number | null;
};

export type ApiFundEditorial = {
  badge: string;
  themeLabel: string;
  idealForBeginners: boolean;
};

/** Raw fund entity returned by `GET /funds`. */
export type ApiFund = {
  id: string;
  symbol: string;
  isin: string | null;
  name: string;
  issuer: string | null;
  logoUrl: string | null;
  benchmark: string | null;
  investmentTheme: InvestmentTheme | null;
  assetClass: string | null;
  domicile: string | null;
  metrics: ApiFundMetrics;
  riskLevel: number | null;
  score: number | null;
  editorial: ApiFundEditorial;
  catalogVisibility: CatalogVisibility;
  returns: FeaturedFund['returns'];
};

const CATALOG_VISIBILITY = new Set<CatalogVisibility>(['visible', 'quarantined', 'blocked']);

/**
 * Maps a numeric backend risk level to the app risk label.
 *
 * @param riskLevel - Persisted risk level between 1 and 7.
 */
export function mapApiRiskLevelToApp(riskLevel: number | null): RiskLevel {
  if (riskLevel === null) {
    return 'medium';
  }

  if (riskLevel <= 2) {
    return 'low';
  }

  if (riskLevel <= 5) {
    return 'medium';
  }

  return 'high';
}

/**
 * Builds the category label shown in catalog cards.
 *
 * @param fund - Raw API fund entity.
 */
export function buildApiCategoryLabel(fund: ApiFund): string {
  if (fund.benchmark !== null && fund.benchmark.trim().length > 0) {
    return `Índice ${fund.benchmark}`;
  }

  return 'Fondo indexado';
}

const INVESTMENT_THEME_LABELS: Record<InvestmentTheme, string> = {
  'global-equity': 'Renta variable global',
  'us-equity': 'Renta variable USA',
  'europe-equity': 'Renta variable Europa',
  'emerging-equity': 'Mercados emergentes',
  'fixed-income': 'Renta fija',
  'multi-asset': 'Multiactivo',
  technology: 'Tecnología',
  esg: 'ESG y sostenibilidad',
  'sector-other': 'Sectorial',
  unclassified: 'Sin clasificar',
};

/**
 * Resolves the Spanish label for a canonical investment theme code.
 *
 * @param theme - Canonical investment theme from the API.
 */
export function buildApiThemeLabel(theme: InvestmentTheme): string {
  return INVESTMENT_THEME_LABELS[theme];
}

export { parseInvestmentTheme };

function hasPersistedEditorialContent(fund: ApiFund): boolean {
  return fund.editorial.badge.trim() !== '' || fund.editorial.themeLabel.trim() !== '';
}

function resolveIdealForBeginners(fund: ApiFund): boolean {
  if (hasPersistedEditorialContent(fund)) {
    return fund.editorial.idealForBeginners;
  }

  const terPercent = fund.metrics.ter ?? 0;
  const riskLevel = mapApiRiskLevelToApp(fund.riskLevel);
  const score = Math.round(fund.score ?? 0);

  return score >= 70 && riskLevel !== 'high' && terPercent <= 0.5;
}

/**
 * Maps a raw API fund entity to a catalog card.
 *
 * @param fund - Raw fund from `GET /funds`.
 */
export function mapApiFundToCatalogFund(fund: ApiFund): CatalogFund | null {
  if (fund.isin === null || fund.isin.trim().length === 0) {
    return null;
  }

  if (!CATALOG_VISIBILITY.has(fund.catalogVisibility)) {
    return null;
  }

  const quarter = resolveCurrentQuarterMetadata();
  const score = Math.round(fund.score ?? 0);
  const featuredFields = mapApiFundToFeaturedFields(fund, quarter);

  return {
    ...featuredFields,
    inversoraScore: score,
    catalogVisibility: fund.catalogVisibility,
  };
}

/**
 * Maps a raw API fund entity to featured-fund card fields.
 *
 * @param fund - Raw fund from `GET /funds`.
 * @param quarter - Quarter metadata for display labels.
 */
export function mapApiFundToFeaturedFields(
  fund: ApiFund,
  quarter = resolveCurrentQuarterMetadata(),
): FeaturedFund {
  const isin = fund.isin ?? '';
  const score = Math.round(fund.score ?? 0);

  return {
    id: fund.id,
    isin,
    symbol: fund.symbol,
    issuer: fund.issuer,
    logoUrl: fund.logoUrl,
    name: fund.name,
    categoryLabel: buildApiCategoryLabel(fund),
    investmentTheme: fund.investmentTheme,
    themeLabel:
      fund.editorial.themeLabel.trim().length > 0
        ? fund.editorial.themeLabel
        : fund.investmentTheme !== null
          ? buildApiThemeLabel(fund.investmentTheme)
          : '',
    badge: fund.editorial.badge || 'En catálogo',
    idealForBeginners: resolveIdealForBeginners(fund),
    efficiencyScore: score,
    terPercent: fund.metrics.ter ?? 0,
    riskLevel: mapApiRiskLevelToApp(fund.riskLevel),
    diversification: 'medium',
    quarterTag: quarter.quarterTag,
    periodStart: quarter.periodStart,
    periodEnd: quarter.periodEnd,
    benefitSummary:
      'Fondo indexado disponible en el catálogo educativo de Inversora.',
    featuredReason: 'Incluido en el ranking por criterios objetivos',
    isFeatured: false,
    returns: fund.returns,
  };
}

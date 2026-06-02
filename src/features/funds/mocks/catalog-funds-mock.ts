import type { CatalogFund } from '@/core/domain/catalog';
import type { FeaturedFund, FundScoringInput } from '@/core/domain/fund';
import { scoreFund } from '@/core/scoring/score-fund';

import { FEATURED_FUNDS_MOCK } from '@/features/funds/mocks/featured-funds-mock';
import { RANKING_SOURCES_MOCK } from '@/features/funds/mocks/ranking-sources-mock';

function rankingSourceToFeatured(source: FundScoringInput): FeaturedFund {
  const scored = scoreFund(source);

  return {
    id: `catalog-${source.isin}`,
    isin: source.isin,
    name: source.name,
    categoryLabel: source.categoryLabel,
    badge: 'En catálogo',
    idealForBeginners: source.riskLevel === 'low',
    efficiencyScore: scored.score,
    terPercent: source.terPercent,
    riskLevel: source.riskLevel,
    diversification: 'medium',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Fondo indexado disponible en el catálogo educativo de Inversora.',
    featuredReason: 'Incluido en el ranking por criterios objetivos',
    isFeatured: false,
  };
}

function buildCatalogBase(): FeaturedFund[] {
  const byIsin = new Map<string, FeaturedFund>();

  for (const fund of FEATURED_FUNDS_MOCK) {
    byIsin.set(fund.isin, fund);
  }

  for (const source of RANKING_SOURCES_MOCK) {
    if (!byIsin.has(source.isin)) {
      byIsin.set(source.isin, rankingSourceToFeatured(source));
    }
  }

  return [...byIsin.values()];
}

const CATALOG_BASE = buildCatalogBase();

export const CATALOG_FUNDS_MOCK: CatalogFund[] = CATALOG_BASE.map((fund) => ({
  ...fund,
  inversoraScore: fund.efficiencyScore,
}));

export const CATALOG_CATEGORIES = [
  ...new Set(CATALOG_FUNDS_MOCK.map((fund) => fund.categoryLabel)),
].sort();

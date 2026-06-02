import type { CatalogFund, CatalogVisibility } from '@/core/domain/catalog';
import type { FeaturedFund, FundScoringInput } from '@/core/domain/fund';
import { scoreFund } from '@/core/scoring/score-fund';

import { FEATURED_FUNDS_MOCK } from '@/features/funds/mocks/featured-funds-mock';
import { RANKING_SOURCES_MOCK } from '@/features/funds/mocks/ranking-sources-mock';

type CatalogFundDraft = FeaturedFund & {
  catalogVisibility: CatalogVisibility;
};

function rankingSourceToFeatured(
  source: FundScoringInput,
  catalogVisibility: CatalogVisibility = 'visible',
): CatalogFundDraft {
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
    catalogVisibility,
  };
}

/** Funds excluded from the public catalog (quarantine / block) for mock QA. */
const HIDDEN_CATALOG_DRAFTS: CatalogFundDraft[] = [
  {
    id: 'catalog-stale-data',
    isin: 'IE00B8GKDB10',
    name: 'Global Equity Stale Data',
    categoryLabel: 'Renta Variable Global',
    badge: 'Datos pendientes',
    idealForBeginners: false,
    efficiencyScore: 62,
    terPercent: 0.35,
    riskLevel: 'medium',
    diversification: 'high',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Fondo con datos inconsistentes en revisión.',
    featuredReason: 'En cuarentena por validación de datos',
    isFeatured: false,
    catalogVisibility: 'quarantined',
  },
  {
    id: 'catalog-active-mgmt',
    isin: 'LU1234567890',
    name: 'Active Global Opportunities',
    categoryLabel: 'Renta Variable Global',
    badge: 'Fuera de alcance MVP',
    idealForBeginners: false,
    efficiencyScore: 55,
    terPercent: 1.2,
    riskLevel: 'high',
    diversification: 'medium',
    quarterTag: 'Q1 2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    benefitSummary: 'Fondo de gestión activa, excluido del catálogo indexado.',
    featuredReason: 'Bloqueado: no es fondo indexado',
    isFeatured: false,
    catalogVisibility: 'blocked',
  },
];

function buildCatalogBase(): CatalogFundDraft[] {
  const byIsin = new Map<string, CatalogFundDraft>();

  for (const fund of FEATURED_FUNDS_MOCK) {
    byIsin.set(fund.isin, { ...fund, catalogVisibility: 'visible' });
  }

  for (const source of RANKING_SOURCES_MOCK) {
    if (!byIsin.has(source.isin)) {
      byIsin.set(source.isin, rankingSourceToFeatured(source));
    }
  }

  for (const hidden of HIDDEN_CATALOG_DRAFTS) {
    byIsin.set(hidden.isin, hidden);
  }

  return [...byIsin.values()];
}

const CATALOG_BASE = buildCatalogBase();

export const CATALOG_FUNDS_MOCK: CatalogFund[] = CATALOG_BASE.map((fund) => ({
  ...fund,
  inversoraScore: fund.efficiencyScore,
}));

export const CATALOG_CATEGORIES = [
  ...new Set(
    CATALOG_FUNDS_MOCK.filter((fund) => fund.catalogVisibility === 'visible').map(
      (fund) => fund.categoryLabel,
    ),
  ),
].sort((a, b) => a.localeCompare(b, 'es'));

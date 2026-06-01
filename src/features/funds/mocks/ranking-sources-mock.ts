import type { FundScoringInput } from '@/core/domain/fund';

/** Single source of truth for ranking inputs until a backend feed exists. */
export const RANKING_SOURCES_MOCK: FundScoringInput[] = [
  {
    isin: 'IE00B4L5Y983',
    name: 'MSCI World Index Core',
    categoryLabel: 'Renta Variable Global',
    riskLevel: 'medium',
    terPercent: 0.12,
    referenceScore: 86,
  },
  {
    isin: 'IE00B5BMR087',
    name: 'S&P 500 Acc',
    categoryLabel: 'Renta Variable USA',
    riskLevel: 'medium',
    terPercent: 0.07,
    referenceScore: 84,
  },
  {
    isin: 'IE00B1YZSC51',
    name: 'Europe Quality ESG',
    categoryLabel: 'Renta Variable Europa',
    riskLevel: 'medium',
    terPercent: 0.18,
    referenceScore: 81,
  },
  {
    isin: 'ES0123456789',
    name: 'Global Balanced Index',
    categoryLabel: 'Mixto Moderado',
    riskLevel: 'low',
    terPercent: 0.21,
    referenceScore: 79,
  },
  {
    isin: 'IE00B3F81R35',
    name: 'Global Bond Index',
    categoryLabel: 'Renta Fija Global',
    riskLevel: 'low',
    terPercent: 0.1,
    referenceScore: 76,
  },
];

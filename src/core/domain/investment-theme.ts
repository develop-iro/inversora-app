/** Canonical investment theme codes returned by the API. */
export type InvestmentTheme =
  | 'global-equity'
  | 'us-equity'
  | 'europe-equity'
  | 'emerging-equity'
  | 'fixed-income'
  | 'multi-asset'
  | 'technology'
  | 'esg'
  | 'sector-other'
  | 'unclassified';

const INVESTMENT_THEMES = new Set<InvestmentTheme>([
  'global-equity',
  'us-equity',
  'europe-equity',
  'emerging-equity',
  'fixed-income',
  'multi-asset',
  'technology',
  'esg',
  'sector-other',
  'unclassified',
]);

/**
 * Parses an API investment theme code.
 *
 * @param value - Raw theme value from the API.
 */
export function parseInvestmentTheme(value: unknown): InvestmentTheme | null {
  if (typeof value !== 'string') {
    return null;
  }

  return INVESTMENT_THEMES.has(value as InvestmentTheme)
    ? (value as InvestmentTheme)
    : null;
}

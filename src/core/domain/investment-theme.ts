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

/** Spanish display labels for each investment theme. */
export const INVESTMENT_THEME_LABELS: Readonly<Record<InvestmentTheme, string>> = {
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
 * Resolves the Spanish label for a canonical investment theme code.
 *
 * @param theme - Canonical investment theme.
 */
export function resolveInvestmentThemeLabel(theme: InvestmentTheme): string {
  return INVESTMENT_THEME_LABELS[theme];
}

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

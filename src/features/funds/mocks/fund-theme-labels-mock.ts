/** Theme labels for funds not defined in featured mocks (catalog-only entries). */
export const FUND_THEME_BY_ISIN: Record<string, string> = {
  IE00B1YZSC51: 'Calidad europea',
  ES0123456789: 'Multiactivo equilibrado',
  IE00B3F81R35: 'Renta fija global',
  IE00B8GKDB10: 'Multisector global',
  LU1234567890: 'Gestión activa',
};

export function resolveFundThemeLabel(isin: string, fallback = 'General'): string {
  return FUND_THEME_BY_ISIN[isin.toUpperCase()] ?? fallback;
}

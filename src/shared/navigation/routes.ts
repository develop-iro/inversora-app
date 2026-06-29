import type { Href } from 'expo-router';

/** Helpers for expo-router typed routes (funds stack). */
export const routes = {
  home: '/' as Href,
  learn: '/learn' as Href,
  fundsCatalog: '/funds' as Href,
  compare: '/compare' as Href,
  compareWithIsins: (isins: readonly string[]): Href =>
    ({
      pathname: '/compare',
      params: { isins: [...new Set(isins.map((isin) => isin.trim().toUpperCase()))].join(',') },
    }) as Href,
  fundDetail: (isin: string): Href =>
    ({
      pathname: '/funds/[isin]',
      params: { isin },
    }) as Href,
  calculator: '/calculator' as Href,
  calculatorWithFund: (isin: string): Href =>
    ({
      pathname: '/calculator',
      params: { isin: isin.trim().toUpperCase() },
    }) as Href,
};

import type { Href } from 'expo-router';

/** Helpers for expo-router typed routes (funds stack). */
export const routes = {
  home: '/' as Href,
  learn: '/learn' as Href,
  learnInitial: {
    pathname: '/learn',
    params: { mode: 'initial' },
  } as Href,
  fundsCatalog: '/funds' as Href,
  fundsCatalogWithProfileHints: {
    pathname: '/funds',
    params: { applyProfileHints: 'true' },
  } as Href,
  compare: '/compare' as Href,
  compareWithIsins: (isins: readonly string[]): Href => {
    const joined = [...new Set(isins.map((isin) => isin.trim().toUpperCase()))].join(',');
    return {
      pathname: '/compare',
      params: { isins: joined },
    } as Href;
  },
  fundDetail: (isin: string): Href =>
    ({
      pathname: '/funds/[isin]',
      params: { isin },
    }) as Href,
  calculator: '/calculator' as Href,
  calculatorWithFund: (isin: string): Href => {
    const normalized = isin.trim().toUpperCase();
    return {
      pathname: '/calculator',
      params: { isin: normalized },
    } as Href;
  },
  legal: '/legal' as Href,
  rankings: '/rankings' as Href,
  rankingBenchmark: (benchmarkKey: string): Href =>
    ({
      pathname: '/rankings/[benchmarkKey]',
      params: { benchmarkKey },
    }) as unknown as Href,
};

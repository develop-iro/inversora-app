import type { Href } from 'expo-router';

/** Helpers for expo-router typed routes (funds stack). */
export const routes = {
  home: '/' as Href,
  fundsCatalog: '/funds' as Href,
  compare: '/compare' as Href,
  fundDetail: (isin: string): Href =>
    ({
      pathname: '/funds/[isin]',
      params: { isin },
    }) as Href,
};

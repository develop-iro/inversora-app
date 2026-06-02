import type { CatalogFund, CatalogVisibility } from '@/core/domain/catalog';

const HIDDEN_VISIBILITY: ReadonlySet<CatalogVisibility> = new Set(['quarantined', 'blocked']);

/** Returns true when the fund may be listed in the public catalog. */
export function isCatalogVisible(fund: Pick<CatalogFund, 'catalogVisibility'>): boolean {
  return !HIDDEN_VISIBILITY.has(fund.catalogVisibility);
}

/** Keeps only funds that are visible in the catalog. */
export function filterCatalogVisible<T extends Pick<CatalogFund, 'catalogVisibility'>>(
  funds: T[],
): T[] {
  return funds.filter(isCatalogVisible);
}

import type { CatalogFund } from '@/core/domain/catalog';

/**
 * Derives sorted unique category labels from loaded catalog funds.
 *
 * @param funds - Catalog funds returned by the API.
 */
export function deriveCatalogCategories(funds: readonly CatalogFund[]): string[] {
  const categories = new Set<string>();

  for (const fund of funds) {
    if (fund.categoryLabel.trim().length > 0) {
      categories.add(fund.categoryLabel);
    }
  }

  return [...categories].sort((left, right) => left.localeCompare(right, 'es'));
}

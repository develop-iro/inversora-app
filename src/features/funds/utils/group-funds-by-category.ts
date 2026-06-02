import type { CatalogFund } from '@/core/domain/catalog';

export type CatalogCategoryGroup = {
  categoryLabel: string;
  funds: CatalogFund[];
};

/** Groups catalog funds by category label, sorted alphabetically. */
export function groupFundsByCategory(funds: CatalogFund[]): CatalogCategoryGroup[] {
  const byCategory = new Map<string, CatalogFund[]>();

  for (const fund of funds) {
    const existing = byCategory.get(fund.categoryLabel) ?? [];
    existing.push(fund);
    byCategory.set(fund.categoryLabel, existing);
  }

  return [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([categoryLabel, categoryFunds]) => ({
      categoryLabel,
      funds: categoryFunds.sort((a, b) => b.inversoraScore - a.inversoraScore),
    }));
}

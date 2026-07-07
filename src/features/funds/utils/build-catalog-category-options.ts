import type { ComponentProps } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import type { CatalogFund } from '@/core/domain/catalog';
import {  formatRankingThemeLabel,
  resolveRankingThemeIcon,
} from '@/features/onboarding/utils/build-ranking-theme-options';
type ThemeIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type CatalogCategoryOption = {
  readonly id: string;
  readonly label: string;
  readonly icon: ThemeIconName;
  readonly fundCount: number;
  readonly topScore: number;
};

/**
 * Builds thematic category cards for the catalog browse surface.
 */
export function buildCatalogCategoryOptions(
  funds: readonly CatalogFund[],
): CatalogCategoryOption[] {
  const groups = new Map<string, { label: string; funds: CatalogFund[] }>();

  for (const fund of funds) {
    const groupId = fund.investmentTheme ?? fund.categoryLabel.trim();
    const groupLabel =
      fund.themeLabel.trim().length > 0
        ? fund.themeLabel
        : fund.investmentTheme !== null
          ? formatRankingThemeLabel(fund.investmentTheme)
          : formatRankingThemeLabel(fund.categoryLabel);

    if (groupId.length === 0) {
      continue;
    }

    const existing = groups.get(groupId) ?? { label: groupLabel, funds: [] };
    existing.funds.push(fund);
    groups.set(groupId, existing);
  }

  return [...groups.entries()]
    .map(([groupId, group]) => ({
      id: groupId,
      label: group.label,
      icon: resolveRankingThemeIcon(group.label),
      fundCount: group.funds.length,
      topScore: Math.max(...group.funds.map((entry) => entry.inversoraScore)),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'es'));
}

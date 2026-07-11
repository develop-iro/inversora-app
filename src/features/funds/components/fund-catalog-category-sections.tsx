import { View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogGrid } from '@/features/funds/components/fund-catalog-grid';
import type { CatalogCategoryGroup } from '@/features/funds/utils/group-funds-by-category';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundCatalogCategorySectionsProps = {
  groups: CatalogCategoryGroup[];
  onFundPress: (fund: CatalogFund) => void;
  className?: string;
};

export function FundCatalogCategorySections({
  groups,
  onFundPress,
  className,
}: FundCatalogCategorySectionsProps) {
  return (
    <View className={cn('gap-xl', className)}>
      {groups.map((group) => (
        <View
          key={group.categoryLabel}
          className="gap-md"
          accessibilityRole="none"
          accessibilityLabel={`Categoría ${group.categoryLabel}, ${group.funds.length} fondos`}
        >
          <View className="flex-row flex-wrap items-baseline justify-between gap-sm">
            <TextParagraph variant="emphasis">{group.categoryLabel}</TextParagraph>
            <TextLabel variant="meta" themeColor="textSecondary">
              {group.funds.length} fondo{group.funds.length === 1 ? '' : 's'}
            </TextLabel>
          </View>
          <FundCatalogGrid funds={group.funds} onFundPress={onFundPress} />
        </View>
      ))}
    </View>
  );
}

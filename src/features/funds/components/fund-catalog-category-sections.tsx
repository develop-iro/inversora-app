import { StyleSheet, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import { FundCatalogGrid } from '@/features/funds/components/fund-catalog-grid';
import type { CatalogCategoryGroup } from '@/features/funds/utils/group-funds-by-category';
import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/theme/theme';

export type FundCatalogCategorySectionsProps = {
  groups: CatalogCategoryGroup[];
  onFundPress: (fund: CatalogFund) => void;
};

export function FundCatalogCategorySections({
  groups,
  onFundPress,
}: FundCatalogCategorySectionsProps) {
  return (
    <View style={styles.wrapper}>
      {groups.map((group) => (
        <View
          key={group.categoryLabel}
          style={styles.section}
          accessibilityRole="none"
          accessibilityLabel={`Categoría ${group.categoryLabel}, ${group.funds.length} fondos`}
        >
          <View style={styles.sectionHeader}>
            <ThemedText type="bodyBold">{group.categoryLabel}</ThemedText>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              {group.funds.length} fondo{group.funds.length === 1 ? '' : 's'}
            </ThemedText>
          </View>
          <FundCatalogGrid funds={group.funds} onFundPress={onFundPress} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
});

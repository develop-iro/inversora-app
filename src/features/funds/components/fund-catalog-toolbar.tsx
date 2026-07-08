import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  CATALOG_SORT_OPTIONS,
  isCatalogSortOptionActive,
  type CatalogSortOption,
  type CatalogSortState,
} from '@/features/funds/types/catalog-sort';
import { TextHeading, TextLabel } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogToolbarProps = {
  headline: string;
  activeFilterCount: number;
  sort: CatalogSortState;
  onSortChange: (option: CatalogSortOption) => void;
  onOpenFilters: () => void;
};

/**
 * Compact results header with filter and sort actions.
 */
export function FundCatalogToolbar({
  headline,
  activeFilterCount,
  sort,
  onSortChange,
  onOpenFilters,
}: FundCatalogToolbarProps) {
  const theme = useTheme();
  const hasActiveFilters = activeFilterCount > 0;
  const activeSort =
    CATALOG_SORT_OPTIONS.find((option) => isCatalogSortOptionActive(sort, option)) ??
    CATALOG_SORT_OPTIONS[0];

  return (
    <View style={styles.wrapper}>
      <TextHeading variant="card" themeColor="deepOcean">
        {headline}
      </TextHeading>

      <View
        style={[
          styles.actionBar,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <ToolbarAction
          icon="filter-variant"
          label="Filtrar"
          badge={hasActiveFilters ? activeFilterCount : undefined}
          onPress={onOpenFilters}
          accessibilityLabel={
            hasActiveFilters
              ? `Filtrar, ${activeFilterCount} filtro${activeFilterCount === 1 ? '' : 's'} activo${activeFilterCount === 1 ? '' : 's'}`
              : 'Abrir filtros del catálogo'
          }
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <ToolbarAction
          icon="sort"
          label={activeSort.label}
          onPress={() => {
            const currentIndex = CATALOG_SORT_OPTIONS.findIndex((option) =>
              isCatalogSortOptionActive(sort, option),
            );
            const nextOption =
              CATALOG_SORT_OPTIONS[(currentIndex + 1) % CATALOG_SORT_OPTIONS.length] ??
              CATALOG_SORT_OPTIONS[0];
            onSortChange(nextOption);
          }}
          accessibilityLabel={`Ordenar por ${activeSort.label}`}
        />
      </View>
    </View>
  );
}

type ToolbarActionProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  badge?: number;
  onPress: () => void;
  accessibilityLabel: string;
};

function ToolbarAction({
  icon,
  label,
  badge,
  onPress,
  accessibilityLabel,
}: ToolbarActionProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      <View style={styles.actionContent}>
        <MaterialCommunityIcons name={icon} size={18} color={theme.deepOcean} />
        <TextLabel variant="meta" themeColor="deepOcean" style={styles.actionLabel}>
          {label}
        </TextLabel>
        {badge != null ? (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <TextLabel variant="meta" style={{ color: theme.textOnDark }}>
              {badge}
            </TextLabel>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  actionBar: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  action: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionPressed: {
    opacity: 0.88,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  actionLabel: {
    textTransform: 'none',
    letterSpacing: 0,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';

import {
  CATALOG_SORT_OPTIONS,
  isCatalogSortOptionActive,
  type CatalogSortOption,
  type CatalogSortState,
} from '@/features/funds/types/catalog-sort';
import { TextHeading, TextLabel } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundCatalogToolbarProps = {
  headline: string;
  activeFilterCount: number;
  sort: CatalogSortState;
  onSortChange: (option: CatalogSortOption) => void;
  onOpenFilters: () => void;
  className?: string;
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
  className,
}: FundCatalogToolbarProps) {
  const hasActiveFilters = activeFilterCount > 0;
  const activeSort =
    CATALOG_SORT_OPTIONS.find((option) => isCatalogSortOptionActive(sort, option)) ??
    CATALOG_SORT_OPTIONS[0];

  return (
    <View className={cn('gap-sm', className)}>
      <TextHeading variant="card" themeColor="deepOcean">
        {headline}
      </TextHeading>

      <View className="flex-row overflow-hidden rounded-card border border-border bg-surface">
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
        <View className="w-px self-stretch bg-border" />
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
      className="min-h-[44px] flex-1 items-center justify-center px-md py-sm active:opacity-[0.88]"
    >
      <View className="flex-row items-center justify-center gap-xs">
        <MaterialCommunityIcons name={icon} size={18} color={theme.deepOcean} />
        <TextLabel variant="meta" themeColor="deepOcean" className="normal-case tracking-normal">
          {label}
        </TextLabel>
        {badge != null ? (
          <View className="h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-xs">
            <TextLabel variant="meta" themeColor="textOnDark">
              {badge}
            </TextLabel>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

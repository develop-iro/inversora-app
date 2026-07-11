import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, View } from 'react-native';

import type { CatalogActiveFilterChip } from '@/features/funds/utils/catalog-filter-presentation';
import { TextLabel } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type FundCatalogActiveFilterChipsProps = {
  chips: readonly CatalogActiveFilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll: () => void;
  className?: string;
};

/**
 * Horizontal row of removable active-filter chips below the catalog toolbar.
 */
export function FundCatalogActiveFilterChips({
  chips,
  onRemoveChip,
  onClearAll,
  className,
}: FundCatalogActiveFilterChipsProps) {
  const theme = useTheme();

  if (chips.length === 0) {
    return null;
  }

  return (
    <View className={cn('gap-xs', className)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-sm pr-md"
        accessibilityRole="list"
        accessibilityLabel="Filtros activos"
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            accessibilityLabel={`Quitar filtro ${chip.label}`}
            onPress={() => onRemoveChip(chip.id)}
            className="max-w-[220px] flex-row items-center gap-xs rounded-pill border border-primary-border bg-primary-surface px-md py-xs active:opacity-[0.88]"
          >
            <TextLabel variant="meta" themeColor="deepOcean" numberOfLines={1}>
              {chip.label}
            </TextLabel>
            <MaterialCommunityIcons name="close" size={14} color={theme.deepOcean} />
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Borrar todos los filtros"
        onPress={onClearAll}
        className="min-h-8 justify-center self-start active:opacity-[0.85]"
      >
        <TextLabel variant="meta" themeColor="primary">
          Borrar filtros
        </TextLabel>
      </Pressable>
    </View>
  );
}

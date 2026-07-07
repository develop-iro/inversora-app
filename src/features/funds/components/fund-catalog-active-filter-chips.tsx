import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { CatalogActiveFilterChip } from '@/features/funds/utils/catalog-filter-presentation';
import { TextLabel } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogActiveFilterChipsProps = {
  chips: readonly CatalogActiveFilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll: () => void;
};

/**
 * Horizontal row of removable active-filter chips below the catalog toolbar.
 */
export function FundCatalogActiveFilterChips({
  chips,
  onRemoveChip,
  onClearAll,
}: FundCatalogActiveFilterChipsProps) {
  const theme = useTheme();

  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityRole="list"
        accessibilityLabel="Filtros activos"
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            accessibilityLabel={`Quitar filtro ${chip.label}`}
            onPress={() => onRemoveChip(chip.id)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: theme.primarySurface,
                borderColor: theme.primaryBorder,
              },
              pressed && styles.chipPressed,
            ]}
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
        style={({ pressed }) => [styles.clearAll, pressed && styles.clearAllPressed]}
      >
        <TextLabel variant="meta" style={{ color: theme.primary }}>
          Borrar filtros
        </TextLabel>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    maxWidth: 220,
  },
  chipPressed: {
    opacity: 0.88,
  },
  clearAll: {
    alignSelf: 'flex-start',
    minHeight: 32,
    justifyContent: 'center',
  },
  clearAllPressed: {
    opacity: 0.85,
  },
});

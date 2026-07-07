import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { CatalogCategoryOption } from '@/features/funds/utils/build-catalog-category-options';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { palette } from '@/shared/theme/palette';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogCategoryFilterChipsProps = {
  categories: readonly CatalogCategoryOption[];
  selectedCategoryId: string | 'all';
  totalFundCount: number;
  onCategoryChange: (categoryId: string | 'all') => void;
};

/**
 * Compact horizontal chips for category selection inside the filters sheet.
 */
export function FundCatalogCategoryFilterChips({
  categories,
  selectedCategoryId,
  totalFundCount,
  onCategoryChange,
}: FundCatalogCategoryFilterChipsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
      accessibilityRole="tablist"
      accessibilityLabel="Filtrar por índice o categoría"
    >
      <CategoryChip
        label="Todos"
        count={totalFundCount}
        selected={selectedCategoryId === 'all'}
        onPress={() => onCategoryChange('all')}
      />

      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.label}
          count={category.fundCount}
          selected={selectedCategoryId === category.id}
          onPress={() => onCategoryChange(category.id)}
        />
      ))}
    </ScrollView>
  );
}

type CategoryChipProps = {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

function CategoryChip({ label, count, selected, onPress }: CategoryChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${count} fondos`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.primarySurface : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
        pressed && styles.chipPressed,
      ]}
    >
      <TextLabel variant="meta" themeColor="deepOcean" numberOfLines={1}>
        {label}
      </TextLabel>
      <TextLabel variant="meta" themeColor="textSecondary">
        {count}
      </TextLabel>
    </Pressable>
  );
}

export type FundCatalogCategoryFiltersProps = {
  categories: readonly CatalogCategoryOption[];
  selectedCategoryId: string | 'all';
  totalFundCount: number;
  onCategoryChange: (categoryId: string | 'all') => void;
};

/**
 * Horizontal category cards for the fund catalog (index / benchmark themes).
 */
export function FundCatalogCategoryFilters({
  categories,
  selectedCategoryId,
  totalFundCount,
  onCategoryChange,
}: FundCatalogCategoryFiltersProps) {
  const theme = useTheme();

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TextParagraph variant="emphasis">Explora por índice</TextParagraph>
        <TextLabel variant="meta" themeColor="textSecondary">
          Toca una categoría para filtrar
        </TextLabel>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityRole="tablist"
        accessibilityLabel="Filtrar catálogo por índice o categoría"
      >
        <CategoryFilterCard
          label="Todos"
          icon="view-grid-outline"
          valueLabel={`${totalFundCount}`}
          valueCaption="fondos"
          selected={selectedCategoryId === 'all'}
          onPress={() => onCategoryChange('all')}
        />

        {categories.map((category) => (
          <CategoryFilterCard
            key={category.id}
            label={category.label}
            icon={category.icon}
            valueLabel={`${category.fundCount}`}
            valueCaption="fondos"
            selected={selectedCategoryId === category.id}
            onPress={() => onCategoryChange(category.id)}
          />
        ))}
      </ScrollView>

      {selectedCategoryId !== 'all' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver todos los índices del catálogo"
          onPress={() => onCategoryChange('all')}
          style={({ pressed }) => [styles.viewAll, pressed && styles.viewAllPressed]}
        >
          <TextParagraph variant="emphasis" style={{ color: theme.primary }}>
            Ver todos los índices
          </TextParagraph>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

type CategoryFilterCardProps = {
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  valueLabel: string;
  valueCaption: string;
  selected: boolean;
  onPress: () => void;
};

function CategoryFilterCard({
  label,
  icon,
  valueLabel,
  valueCaption,
  selected,
  onPress,
}: CategoryFilterCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${valueLabel} ${valueCaption}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? theme.backgroundSoft : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: selected ? palette.mintAccent : theme.backgroundSoft,
          },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={22} color={theme.primary} />
      </View>

      <TextLabel variant="listMeta" themeColor="textSecondary" numberOfLines={2} style={styles.cardLabel}>
        {label}
      </TextLabel>

      <TextHeading variant="hero" themeColor="deepOcean" style={styles.cardValue}>
        {valueLabel}
      </TextHeading>
      <TextLabel variant="meta" themeColor="textSecondary" style={styles.cardCaption}>
        {valueCaption}
      </TextLabel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chipRow: {
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
    paddingVertical: Spacing.sm,
    maxWidth: 220,
  },
  chipPressed: {
    opacity: 0.9,
  },
  wrapper: {
    gap: Spacing.sm,
  },
  header: {
    gap: Spacing.xs,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  card: {
    width: 112,
    minHeight: 132,
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    textAlign: 'center',
    minHeight: 36,
  },
  cardValue: {
    marginTop: Spacing.half,
  },
  cardCaption: {
    textAlign: 'center',
    letterSpacing: 0.2,
    textTransform: 'lowercase',
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 36,
  },
  viewAllPressed: {
    opacity: 0.85,
  },
});

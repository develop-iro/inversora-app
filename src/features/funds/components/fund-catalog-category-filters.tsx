import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import type { CatalogCategoryOption } from '@/features/funds/utils/build-catalog-category-options';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

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
      contentContainerClassName="gap-sm pr-md"
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
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${count} fondos`}
      onPress={onPress}
      className={cn(
        'max-w-[220px] flex-row items-center gap-xs rounded-pill border px-md py-sm active:opacity-90',
        selected ? 'border-primary bg-primary-surface' : 'border-border bg-surface',
      )}
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
  className?: string;
};

/**
 * Horizontal category cards for the fund catalog (index / benchmark themes).
 */
export function FundCatalogCategoryFilters({
  categories,
  selectedCategoryId,
  totalFundCount,
  onCategoryChange,
  className,
}: FundCatalogCategoryFiltersProps) {
  const theme = useTheme();

  if (categories.length === 0) {
    return null;
  }

  return (
    <View className={cn('gap-sm', className)}>
      <View className="gap-xs">
        <TextParagraph variant="emphasis">Explora por índice</TextParagraph>
        <TextLabel variant="meta" themeColor="textSecondary">
          Toca una categoría para filtrar
        </TextLabel>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-sm pr-md"
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
          className="min-h-9 flex-row items-center gap-xs self-start active:opacity-[0.85]"
        >
          <TextParagraph variant="emphasis" themeColor="primary">
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
      className={cn(
        'h-[132px] w-28 items-center gap-xs rounded-card border px-sm py-md active:opacity-90',
        selected ? 'border-primary bg-background-soft' : 'border-border bg-surface',
      )}
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-full',
          selected ? 'bg-mint-accent' : 'bg-background-soft',
        )}
      >
        <MaterialCommunityIcons name={icon} size={22} color={theme.primary} />
      </View>

      <TextLabel
        variant="listMeta"
        themeColor="textSecondary"
        numberOfLines={2}
        className="min-h-9 text-center"
      >
        {label}
      </TextLabel>

      <TextHeading variant="hero" themeColor="deepOcean" className="mt-half">
        {valueLabel}
      </TextHeading>
      <TextLabel variant="meta" themeColor="textSecondary" className="text-center lowercase tracking-[0.2px]">
        {valueCaption}
      </TextLabel>
    </Pressable>
  );
}

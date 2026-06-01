import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { RiskLevel } from '@/core/domain/fund';
import type { FundCatalogFilters } from '@/features/funds/services/get-funds';
import { CATALOG_CATEGORIES } from '@/features/funds/mocks/catalog-funds-mock';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogFiltersState = {
  query: string;
  riskLevel: RiskLevel | 'all';
  categoryLabel: string | 'all';
  maxTerPercent: number | null;
  minScore: number | null;
  idealForBeginnersOnly: boolean;
};

export const DEFAULT_CATALOG_FILTERS: FundCatalogFiltersState = {
  query: '',
  riskLevel: 'all',
  categoryLabel: 'all',
  maxTerPercent: null,
  minScore: null,
  idealForBeginnersOnly: false,
};

export function toServiceFilters(state: FundCatalogFiltersState): FundCatalogFilters {
  return {
    query: state.query,
    riskLevel: state.riskLevel,
    categoryLabel: state.categoryLabel,
    maxTerPercent: state.maxTerPercent,
    minScore: state.minScore,
    idealForBeginnersOnly: state.idealForBeginnersOnly,
  };
}

type FundCatalogFiltersBarProps = {
  value: FundCatalogFiltersState;
  onChange: (next: FundCatalogFiltersState) => void;
};

type ChipOption<T extends string> = {
  value: T;
  label: string;
};

const RISK_OPTIONS: ChipOption<RiskLevel | 'all'>[] = [
  { value: 'all', label: 'Riesgo: todos' },
  { value: 'low', label: 'Bajo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
];

const TER_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Comisión: todas' },
  { value: 0.15, label: '≤ 0,15%' },
  { value: 0.25, label: '≤ 0,25%' },
];

const SCORE_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Score: todos' },
  { value: 80, label: '≥ 80' },
  { value: 75, label: '≥ 75' },
];

export function FundCatalogFiltersBar({ value, onChange }: FundCatalogFiltersBarProps) {
  const theme = useTheme();

  const categoryOptions: ChipOption<string | 'all'>[] = [
    { value: 'all', label: 'Categoría: todas' },
    ...CATALOG_CATEGORIES.map((category) => ({ value: category, label: category })),
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {RISK_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={value.riskLevel === option.value}
            onPress={() => onChange({ ...value, riskLevel: option.value })}
            theme={theme}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {categoryOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={value.categoryLabel === option.value}
            onPress={() => onChange({ ...value, categoryLabel: option.value })}
            theme={theme}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TER_OPTIONS.map((option) => (
          <FilterChip
            key={option.label}
            label={option.label}
            selected={value.maxTerPercent === option.value}
            onPress={() => onChange({ ...value, maxTerPercent: option.value })}
            theme={theme}
          />
        ))}
        {SCORE_OPTIONS.map((option) => (
          <FilterChip
            key={option.label}
            label={option.label}
            selected={value.minScore === option.value}
            onPress={() => onChange({ ...value, minScore: option.value })}
            theme={theme}
          />
        ))}
        <FilterChip
          label="Para empezar"
          selected={value.idealForBeginnersOnly}
          onPress={() =>
            onChange({ ...value, idealForBeginnersOnly: !value.idealForBeginnersOnly })
          }
          theme={theme}
        />
      </ScrollView>
    </View>
  );
}

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
};

function FilterChip({ label, selected, onPress, theme }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText
        type="caption"
        style={{ color: selected ? theme.textOnDark : theme.textSecondary }}
        numberOfLines={1}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: 220,
  },
});

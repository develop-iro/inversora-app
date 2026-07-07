import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RiskLevel } from '@/core/domain/fund';
import type { FundCatalogFilters } from '@/features/funds/types/fund-catalog-filters';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { TabChip } from '@/shared/components/tabs/tab-chip';
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

const RISK_TABS = [
  { value: 'all' as const, label: 'Todos' },
  { value: 'low' as const, label: 'Bajo' },
  { value: 'medium' as const, label: 'Medio' },
  { value: 'high' as const, label: 'Alto' },
];

const TER_TABS = [
  { value: null, label: 'Todas' },
  { value: 0.15, label: '≤ 0,15%' },
  { value: 0.25, label: '≤ 0,25%' },
];

const SCORE_TABS = [
  { value: null, label: 'Todos' },
  { value: 80, label: '≥ 80' },
  { value: 75, label: '≥ 75' },
];

export function FundCatalogFiltersForm({ value, onChange }: FundCatalogFiltersBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <FilterSection
        title="Perfil de riesgo"
        hint="Filtra por nivel educativo de riesgo"
      >
        <TabChip
          tabs={RISK_TABS}
          value={value.riskLevel}
          onChange={(riskLevel) => onChange({ ...value, riskLevel })}
          accessibilityLabel="Filtrar por perfil de riesgo"
          tabAccessibilityPrefix="Riesgo"
        />
      </FilterSection>

      <FilterSection title="Comisión (TER)" hint="Coste anual del fondo">
        <TabChip
          tabs={TER_TABS.map((option) => ({
            value: String(option.value ?? 'all'),
            label: option.label,
          }))}
          value={String(value.maxTerPercent ?? 'all')}
          onChange={(nextValue) =>
            onChange({
              ...value,
              maxTerPercent: nextValue === 'all' ? null : Number(nextValue),
            })
          }
          accessibilityLabel="Filtrar por comisión"
          tabAccessibilityPrefix="Comisión"
        />
      </FilterSection>

      <FilterSection title="Inversora Score" hint="Puntuación objetiva del fondo">
        <View style={styles.scoreRow}>
          <View style={styles.scoreTabs}>
            <TabChip
              tabs={SCORE_TABS.map((option) => ({
                value: String(option.value ?? 'all'),
                label: option.label,
              }))}
              value={String(value.minScore ?? 'all')}
              onChange={(nextValue) =>
                onChange({
                  ...value,
                  minScore: nextValue === 'all' ? null : Number(nextValue),
                })
              }
              accessibilityLabel="Filtrar por Inversora Score"
              tabAccessibilityPrefix="Score"
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: value.idealForBeginnersOnly }}
            accessibilityLabel="Mostrar solo fondos recomendados para empezar"
            onPress={() =>
              onChange({ ...value, idealForBeginnersOnly: !value.idealForBeginnersOnly })
            }
            style={[
              styles.beginnerChip,
              {
                backgroundColor: value.idealForBeginnersOnly ? theme.primary : theme.surface,
                borderColor: value.idealForBeginnersOnly ? theme.primary : theme.border,
              },
            ]}
          >
            <TextParagraph
              variant="secondary"
              style={{
                color: value.idealForBeginnersOnly ? theme.textOnDark : theme.text,
              }}
            >
              Para empezar
            </TextParagraph>
          </Pressable>
        </View>
      </FilterSection>
    </View>
  );
}

/** @deprecated Use {@link FundCatalogFiltersForm} inside the filters sheet. */
export const FundCatalogFiltersBar = FundCatalogFiltersForm;

type FilterSectionProps = {
  title: string;
  hint: string;
  children: ReactNode;
};

function FilterSection({ title, hint, children }: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TextParagraph variant="emphasis">{title}</TextParagraph>
        <TextLabel variant="meta" themeColor="textSecondary">
          {hint}
        </TextLabel>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    gap: Spacing.xs,
  },
  scoreRow: {
    gap: Spacing.sm,
  },
  scoreTabs: {
    alignSelf: 'stretch',
  },
  beginnerChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
});

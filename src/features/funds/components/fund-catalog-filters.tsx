import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import type { FundCatalogFiltersState } from '@/features/funds/types/fund-catalog-filters';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { TabChip } from '@/shared/components/tabs/tab-chip';
import { cn } from '@/shared/utils/cn';

export type { FundCatalogFiltersState } from '@/features/funds/types/fund-catalog-filters';
export { DEFAULT_CATALOG_FILTERS, toServiceFilters } from '@/features/funds/types/fund-catalog-filters';

type FundCatalogFiltersBarProps = {
  value: FundCatalogFiltersState;
  onChange: (next: FundCatalogFiltersState) => void;
  className?: string;
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

const RETURN_PERIOD_TABS = [
  { value: '1y' as const, label: '1 año' },
  { value: '3y' as const, label: '3 años' },
];

const RETURN_TABS = [
  { value: null, label: 'Todas' },
  { value: 0, label: '≥ 0%' },
  { value: 5, label: '≥ 5%' },
  { value: 10, label: '≥ 10%' },
];

export function FundCatalogFiltersForm({
  value,
  onChange,
  className,
}: FundCatalogFiltersBarProps) {
  return (
    <View className={cn('gap-lg py-xs', className)}>
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
        <View className="gap-sm">
          <View className="self-stretch">
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
            className={cn(
              'min-h-10 justify-center self-start rounded-pill border px-md py-sm',
              value.idealForBeginnersOnly
                ? 'border-primary bg-primary'
                : 'border-border bg-surface',
            )}
          >
            <TextParagraph
              variant="secondary"
              themeColor={value.idealForBeginnersOnly ? 'textOnDark' : 'text'}
            >
              Para empezar
            </TextParagraph>
          </Pressable>
        </View>
      </FilterSection>

      <FilterSection
        title="Rentabilidad histórica mínima"
        hint="Filtra por rentabilidad pasada (orientativa, no garantiza resultados futuros)"
      >
        <View className="gap-sm">
          <TabChip
            tabs={RETURN_PERIOD_TABS}
            value={value.returnPeriod}
            onChange={(returnPeriod) => onChange({ ...value, returnPeriod })}
            accessibilityLabel="Periodo de rentabilidad histórica"
            tabAccessibilityPrefix="Periodo"
          />
          <TabChip
            tabs={RETURN_TABS.map((option) => ({
              value: String(option.value ?? 'all'),
              label: option.label,
            }))}
            value={String(value.minReturnPercent ?? 'all')}
            onChange={(nextValue) =>
              onChange({
                ...value,
                minReturnPercent: nextValue === 'all' ? null : Number(nextValue),
              })
            }
            accessibilityLabel="Filtrar por rentabilidad histórica mínima"
            tabAccessibilityPrefix="Rentabilidad"
          />
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
    <View className="gap-sm">
      <View className="gap-xs">
        <TextParagraph variant="emphasis">{title}</TextParagraph>
        <TextLabel variant="meta" themeColor="textSecondary">
          {hint}
        </TextLabel>
      </View>
      {children}
    </View>
  );
}

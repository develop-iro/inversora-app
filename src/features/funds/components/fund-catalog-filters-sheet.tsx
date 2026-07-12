import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import type { CatalogFund } from '@/core/domain/catalog';
import type { CatalogCategoryOption } from '@/features/funds/utils/build-catalog-category-options';
import { FundCatalogCategoryFilterChips } from '@/features/funds/components/fund-catalog-category-filters';
import {
  DEFAULT_CATALOG_FILTERS,
  FundCatalogFiltersForm,
  type FundCatalogFiltersState,
} from '@/features/funds/components/fund-catalog-filters';
import { useCatalogFilterPreviewCount } from '@/features/funds/hooks/use-catalog-filter-preview-count';
import { formatCatalogFiltersApplyLabel } from '@/features/funds/utils/catalog-filter-presentation';
import { ScreenFooter } from '@/shared/components/layout';
import { AppModalShell } from '@/shared/components/overlay';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui';

export type FundCatalogFiltersSheetProps = {
  visible: boolean;
  sessionKey: number;
  value: FundCatalogFiltersState;
  searchQuery: string;
  catalogFunds: readonly CatalogFund[];
  categories: readonly CatalogCategoryOption[];
  totalFundCount: number;
  appliedResultCount: number | null;
  onClose: () => void;
  onApply: (next: FundCatalogFiltersState) => void;
};

/**
 * Full-screen filters panel inspired by idealista's mobile filter sheet.
 */
export function FundCatalogFiltersSheet({
  visible,
  sessionKey,
  value,
  searchQuery,
  catalogFunds,
  categories,
  totalFundCount,
  appliedResultCount,
  onClose,
  onApply,
}: FundCatalogFiltersSheetProps) {
  return visible ? (
    <FundCatalogFiltersSheetInner
      key={sessionKey}
      initialValue={value}
      searchQuery={searchQuery}
      catalogFunds={catalogFunds}
      categories={categories}
      totalFundCount={totalFundCount}
      appliedResultCount={appliedResultCount}
      onClose={onClose}
      onApply={onApply}
    />
  ) : null;
}

type FundCatalogFiltersSheetInnerProps = {
  initialValue: FundCatalogFiltersState;
  searchQuery: string;
  catalogFunds: readonly CatalogFund[];
  categories: readonly CatalogCategoryOption[];
  totalFundCount: number;
  appliedResultCount: number | null;
  onClose: () => void;
  onApply: (next: FundCatalogFiltersState) => void;
};

function FundCatalogFiltersSheetInner({
  initialValue,
  searchQuery,
  catalogFunds,
  categories,
  totalFundCount,
  appliedResultCount,
  onClose,
  onApply,
}: FundCatalogFiltersSheetInnerProps) {
  const [draft, setDraft] = useState<FundCatalogFiltersState>(initialValue);
  const { count: previewCount } = useCatalogFilterPreviewCount(catalogFunds, draft, searchQuery, {
    enabled: true,
    initialCount: appliedResultCount,
  });

  const handleApply = useCallback(() => {
    onApply(draft);
    onClose();
  }, [draft, onApply, onClose]);

  const handleClearFilters = useCallback(() => {
    setDraft((current) => ({
      ...DEFAULT_CATALOG_FILTERS,
      query: current.query,
    }));
  }, []);

  const hasDraftSecondaryFilters =
    draft.categoryLabel !== 'all' ||
    draft.riskLevel !== 'all' ||
    draft.maxTerPercent != null ||
    draft.minScore != null ||
    draft.idealForBeginnersOnly;

  return (
    <AppModalShell
      visible
      onClose={onClose}
      title="Filtros"
      body={
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-lg px-lg pb-xl pt-md"
        >
          <FilterSheetSection
            title="Índice o categoría"
            hint="Filtra por el índice de referencia del fondo"
          >
            <FundCatalogCategoryFilterChips
              categories={categories}
              selectedCategoryId={draft.categoryLabel}
              totalFundCount={totalFundCount}
              onCategoryChange={(categoryLabel) =>
                setDraft((current) => ({ ...current, categoryLabel }))
              }
            />
          </FilterSheetSection>

          <FundCatalogFiltersForm value={draft} onChange={setDraft} />
        </ScrollView>
      }
      footer={
        <ScreenFooter>
          <Button
            label={formatCatalogFiltersApplyLabel(previewCount)}
            onPress={handleApply}
            fullWidth
          />
          {hasDraftSecondaryFilters ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Borrar filtros del catálogo"
              onPress={handleClearFilters}
              className="min-h-9 justify-center self-center px-sm active:opacity-[0.85]"
            >
              <TextLabel variant="meta" themeColor="primary" className="text-center">
                Borrar filtros
              </TextLabel>
            </Pressable>
          ) : null}
        </ScreenFooter>
      }
    />
  );
}

type FilterSheetSectionProps = {
  title: string;
  hint: string;
  children: ReactNode;
};

function FilterSheetSection({ title, hint, children }: FilterSheetSectionProps) {
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

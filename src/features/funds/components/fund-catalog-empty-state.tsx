import { Pressable, View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FundCatalogEmptyStateProps = {
  query: string;
  hasActiveFilters: boolean;
  onClearSearch?: () => void;
  onResetFilters?: () => void;
  className?: string;
};

export function FundCatalogEmptyState({
  query,
  hasActiveFilters,
  onClearSearch,
  onResetFilters,
  className,
}: FundCatalogEmptyStateProps) {
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const title = hasQuery
    ? `Sin resultados para «${trimmedQuery}»`
    : 'Sin resultados con estos filtros';

  const body = hasQuery
    ? 'Comprueba el nombre del fondo o el ISIN. Puedes escribir solo una parte del código.'
    : 'Ningún fondo coincide con los filtros seleccionados. Prueba a ampliarlos o reinícialos.';

  return (
    <View className={cn('gap-sm py-xl', className)} accessibilityRole="text">
      <TextParagraph variant="emphasis">{title}</TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {body}
      </TextParagraph>

      {hasQuery && onClearSearch ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          onPress={onClearSearch}
          className="mt-xs self-start rounded-pill border border-border bg-surface px-md py-sm active:opacity-[0.88]"
        >
          <TextLabel variant="meta" themeColor="primary">
            Limpiar búsqueda
          </TextLabel>
        </Pressable>
      ) : null}

      {!hasQuery && hasActiveFilters && onResetFilters ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reiniciar filtros"
          onPress={onResetFilters}
          className="mt-xs self-start rounded-pill border border-border bg-surface px-md py-sm active:opacity-[0.88]"
        >
          <TextLabel variant="meta" themeColor="primary">
            Reiniciar filtros
          </TextLabel>
        </Pressable>
      ) : null}
    </View>
  );
}

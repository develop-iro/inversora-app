import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export type FundCatalogLoadMoreFooterProps = {
  loadedCount: number;
  totalCount: number | null;
  isLoadingMore: boolean;
  hasMore: boolean;
  errorMessage?: string | null;
  onLoadMore: () => void;
  className?: string;
};

/**
 * Footer shown at the bottom of the catalog list for infinite scroll.
 */
export function FundCatalogLoadMoreFooter({
  loadedCount,
  totalCount,
  isLoadingMore,
  hasMore,
  errorMessage,
  onLoadMore,
  className,
}: FundCatalogLoadMoreFooterProps) {
  if (isLoadingMore) {
    return (
      <View className={cn('items-center gap-sm py-lg', className)}>
        <Spinner
          size="sm"
          label="Cargando más fondos…"
          accessibilityLabel="Cargando más fondos"
        />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className={cn('items-center gap-sm py-lg', className)}>
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {errorMessage}
        </TextParagraph>
        {hasMore ? (
          <Button
            label="Reintentar carga"
            variant="secondary"
            size="sm"
            onPress={onLoadMore}
          />
        ) : null}
      </View>
    );
  }

  if (!hasMore) {
    if (loadedCount === 0) {
      return null;
    }

    return (
      <View className={cn('items-center gap-sm py-lg', className)}>
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {totalCount != null
            ? `${loadedCount} de ${totalCount} fondos mostrados`
            : `${loadedCount} fondo${loadedCount === 1 ? '' : 's'} mostrados`}
        </TextParagraph>
      </View>
    );
  }

  return (
    <View className={cn('items-center gap-sm py-lg', className)}>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {totalCount != null
          ? `${loadedCount} de ${totalCount} fondos cargados`
          : `${loadedCount} fondos cargados`}
      </TextParagraph>
      <Button label="Cargar más" variant="secondary" size="sm" onPress={onLoadMore} />
    </View>
  );
}

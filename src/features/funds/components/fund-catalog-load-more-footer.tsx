import { ActivityIndicator, View } from 'react-native';

import { TextLabel, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui';
import { useTheme } from '@/shared/hooks/use-theme';
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
  const theme = useTheme();

  if (isLoadingMore) {
    return (
      <View
        className={cn('flex-row items-center justify-center gap-sm py-lg', className)}
        accessibilityLabel="Cargando más fondos"
      >
        <ActivityIndicator color={theme.primary} size="small" />
        <TextLabel variant="meta" themeColor="textSecondary">
          Cargando más fondos…
        </TextLabel>
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
            ? `${loadedCount.toLocaleString('es-ES')} de ${totalCount.toLocaleString('es-ES')} fondos mostrados`
            : `${loadedCount.toLocaleString('es-ES')} fondo${loadedCount === 1 ? '' : 's'} mostrados`}
        </TextParagraph>
      </View>
    );
  }

  return (
    <View className={cn('items-center gap-sm py-lg', className)}>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {totalCount != null
          ? `${loadedCount.toLocaleString('es-ES')} de ${totalCount.toLocaleString('es-ES')} fondos cargados`
          : `${loadedCount.toLocaleString('es-ES')} fondos cargados`}
      </TextParagraph>
      <Button label="Cargar más" variant="secondary" size="sm" onPress={onLoadMore} />
    </View>
  );
}

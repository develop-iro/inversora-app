import { StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { Button, Spinner } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

export type FundCatalogLoadMoreFooterProps = {
  loadedCount: number;
  totalCount: number | null;
  isLoadingMore: boolean;
  hasMore: boolean;
  errorMessage?: string | null;
  onLoadMore: () => void;
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
}: FundCatalogLoadMoreFooterProps) {
  if (isLoadingMore) {
    return (
      <Spinner
        size="sm"
        label="Cargando más fondos…"
        accessibilityLabel="Cargando más fondos"
        style={styles.wrapper}
      />
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.wrapper}>
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
      <View style={styles.wrapper}>
        <TextParagraph variant="secondary" themeColor="textSecondary">
          {totalCount != null
            ? `${loadedCount} de ${totalCount} fondos mostrados`
            : `${loadedCount} fondo${loadedCount === 1 ? '' : 's'} mostrados`}
        </TextParagraph>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {totalCount != null
          ? `${loadedCount} de ${totalCount} fondos cargados`
          : `${loadedCount} fondos cargados`}
      </TextParagraph>
      <Button label="Cargar más" variant="secondary" size="sm" onPress={onLoadMore} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
});

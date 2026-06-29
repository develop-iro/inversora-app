import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
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
  const theme = useTheme();

  if (isLoadingMore) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator color={theme.primary} />
        <ThemedText type="caption" themeColor="textSecondary">
          Cargando más fondos…
        </ThemedText>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.wrapper}>
        <ThemedText type="caption" themeColor="textSecondary">
          {errorMessage}
        </ThemedText>
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
        <ThemedText type="caption" themeColor="textSecondary">
          {totalCount != null
            ? `${loadedCount} de ${totalCount} fondos mostrados`
            : `${loadedCount} fondo${loadedCount === 1 ? '' : 's'} mostrados`}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ThemedText type="caption" themeColor="textSecondary">
        {totalCount != null
          ? `${loadedCount} de ${totalCount} fondos cargados`
          : `${loadedCount} fondos cargados`}
      </ThemedText>
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

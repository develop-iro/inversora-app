import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogEmptyStateProps = {
  query: string;
  hasActiveFilters: boolean;
  onClearSearch?: () => void;
  onResetFilters?: () => void;
};

export function FundCatalogEmptyState({
  query,
  hasActiveFilters,
  onClearSearch,
  onResetFilters,
}: FundCatalogEmptyStateProps) {
  const theme = useTheme();
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const title = hasQuery
    ? `Sin resultados para «${trimmedQuery}»`
    : 'Sin resultados con estos filtros';

  const body = hasQuery
    ? 'Comprueba el nombre del fondo o el ISIN. Puedes escribir solo una parte del código.'
    : 'Ningún fondo coincide con los filtros seleccionados. Prueba a ampliarlos o reinícialos.';

  return (
    <View style={styles.wrapper} accessibilityRole="text">
      <ThemedText type="bodyBold">{title}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {body}
      </ThemedText>

      {hasQuery && onClearSearch ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          onPress={onClearSearch}
          style={({ pressed }) => [
            styles.action,
            { borderColor: theme.border, backgroundColor: theme.surface },
            pressed && styles.actionPressed,
          ]}
        >
          <ThemedText type="metaLabel" style={{ color: theme.primary }}>
            Limpiar búsqueda
          </ThemedText>
        </Pressable>
      ) : null}

      {!hasQuery && hasActiveFilters && onResetFilters ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reiniciar filtros"
          onPress={onResetFilters}
          style={({ pressed }) => [
            styles.action,
            { borderColor: theme.border, backgroundColor: theme.surface },
            pressed && styles.actionPressed,
          ]}
        >
          <ThemedText type="metaLabel" style={{ color: theme.primary }}>
            Reiniciar filtros
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionPressed: {
    opacity: 0.88,
  },
});

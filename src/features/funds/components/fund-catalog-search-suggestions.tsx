import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { FundSearchSuggestion } from '@/features/funds/utils/fund-search';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/shared/theme/theme';

export type FundCatalogSearchSuggestionsProps = {
  suggestions: FundSearchSuggestion[];
  onSelect: (suggestion: FundSearchSuggestion) => void;
};

export function FundCatalogSearchSuggestions({
  suggestions,
  onSelect,
}: FundCatalogSearchSuggestionsProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        Shadows.card,
      ]}
      accessibilityRole="list"
      accessibilityLabel={`${suggestions.length} sugerencias de fondos`}
    >
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={suggestion.isin}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${suggestion.name}, ISIN ${suggestion.isin}`}
          accessibilityHint="Completa la búsqueda con este fondo"
          onPress={() => onSelect(suggestion)}
          style={({ pressed }) => [
            styles.row,
            index < suggestions.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: theme.border,
            },
            pressed && styles.rowPressed,
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={theme.textSecondary}
            style={styles.icon}
          />
          <View style={styles.copy}>
            <ThemedText type="bodyBold" numberOfLines={1}>
              {suggestion.name}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {suggestion.isin}
              {suggestion.categoryLabel ? ` · ${suggestion.categoryLabel}` : ''}
            </ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={theme.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rowPressed: {
    opacity: 0.88,
  },
  icon: {
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});

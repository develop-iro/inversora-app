import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type FundCatalogSoraChipProps = {
  query: string;
  onPress: () => void;
};

export function FundCatalogSoraChip({ query, onPress }: FundCatalogSoraChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Preguntar a SORA sobre ${query}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: 'rgba(0, 191, 166, 0.24)',
          backgroundColor: 'rgba(234, 248, 246, 0.66)',
        },
        pressed && styles.chipPressed,
      ]}
    >
      <MaterialCommunityIcons name="robot-outline" size={16} color={theme.deepOcean} />
      <ThemedText type="caption" themeColor="deepOcean">
        Preguntar a SORA: «{query.trim()}»
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  chipPressed: {
    opacity: 0.88,
  },
});

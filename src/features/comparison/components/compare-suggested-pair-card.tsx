import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { CompareSuggestedPair } from '@/features/comparison/constants/compare-suggested-pairs.config';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareSuggestedPairCardProps = {
  pair: CompareSuggestedPair;
  onPress: () => void;
};

/**
 * Compact card for a suggested two-fund comparison.
 */
export function CompareSuggestedPairCard({ pair, onPress }: CompareSuggestedPairCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Comparar ${pair.label}: ${pair.description}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundSoft }]}>
        <MaterialCommunityIcons name={pair.icon} size={20} color={theme.deepOcean} />
      </View>

      <View style={styles.copy}>
        <ThemedText type="bodyBold" numberOfLines={1}>
          {pair.label}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
          {pair.description}
        </ThemedText>
      </View>

      <ThemedText type="caption" themeColor="primary">
        Comparar
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    minHeight: 118,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: Spacing.xs,
    flex: 1,
  },
});

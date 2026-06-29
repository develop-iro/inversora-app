import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { CompareFairnessResult } from '@/features/comparison/models/compare-fund-entry';
import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareFairnessBannerProps = {
  fairness: CompareFairnessResult;
};

/**
 * Warns when an educational comparison may not be technically homogeneous.
 */
export function CompareFairnessBanner({ fairness }: CompareFairnessBannerProps) {
  const theme = useTheme();

  if (fairness.isFair || fairness.warnings.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.banner,
        {
          backgroundColor: 'rgba(250, 204, 21, 0.14)',
          borderColor: 'rgba(245, 158, 11, 0.35)',
        },
      ]}
    >
      <MaterialCommunityIcons name="information-outline" size={20} color={theme.deepOcean} />
      <View style={styles.copy}>
        <ThemedText type="bodyBold">
          {fairness.warnings.length === 1
            ? fairness.warnings[0]
            : 'Comparación con matices'}
        </ThemedText>
        {fairness.warnings.length > 1
          ? fairness.warnings.map((warning) => (
              <ThemedText key={warning} type="caption" themeColor="textSecondary">
                {warning}
              </ThemedText>
            ))
          : (
            <ThemedText type="caption" themeColor="textSecondary">
              Interpreta los resultados con cautela.
            </ThemedText>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
});

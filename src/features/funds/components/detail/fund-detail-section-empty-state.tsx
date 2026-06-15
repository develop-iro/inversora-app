import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Spacing } from '@/shared/theme/theme';

export type FundDetailSectionEmptyStateProps = {
  message: string;
};

/**
 * Inline placeholder for fund detail sections without enough data to render charts or lists.
 */
export function FundDetailSectionEmptyState({
  message,
}: FundDetailSectionEmptyStateProps) {
  return (
    <View style={styles.wrapper} accessibilityRole="text">
      <ThemedText type="caption" themeColor="textSecondary">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: Spacing.md,
  },
});

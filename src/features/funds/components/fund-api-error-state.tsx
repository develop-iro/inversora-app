import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui';
import { Spacing } from '@/shared/theme/theme';

export type FundApiErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function FundApiErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Reintentar',
}: FundApiErrorStateProps) {
  return (
    <View style={styles.wrapper} accessibilityRole="alert">
      <ThemedText type="bodyBold">{title}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {message}
      </ThemedText>
      {onRetry ? (
        <Button label={retryLabel} variant="outline" onPress={onRetry} style={styles.retry} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
});

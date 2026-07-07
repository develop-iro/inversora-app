import { StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
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
      <TextParagraph variant="emphasis">{title}</TextParagraph>
      <TextParagraph variant="secondary" themeColor="textSecondary">
        {message}
      </TextParagraph>
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

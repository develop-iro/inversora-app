import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { TextParagraph } from '@/shared/components/text/text-paragraph';
import type { InputVariant } from '@/shared/components/inputs/input-utils';
import { Spacing } from '@/shared/theme/theme';

export type InputMessageProps = {
  message?: string;
  variant?: InputVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Helper or validation copy below an input field.
 */
export function InputMessage({ message, variant = 'default', style }: InputMessageProps) {
  if (!message) {
    return null;
  }

  const isError = variant === 'error';

  return (
    <View style={[styles.root, style]}>
      <TextParagraph
        variant="secondary"
        themeColor={isError ? 'warningBadgeLabel' : 'textSecondary'}
        accessibilityRole={isError ? 'alert' : undefined}
      >
        {message}
      </TextParagraph>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: Spacing.xs,
  },
});

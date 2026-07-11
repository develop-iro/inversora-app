import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { InputVariant } from '@/shared/components/inputs/input-utils';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { cn } from '@/shared/utils/cn';

export type InputMessageProps = {
  message?: string;
  variant?: InputVariant;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Helper or validation copy below an input field.
 */
export function InputMessage({ message, variant = 'default', className, style }: InputMessageProps) {
  if (!message) {
    return null;
  }

  const isError = variant === 'error';

  return (
    <View className={cn('pt-xs', className)} style={style}>
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

import type { TextProps } from 'react-native';

import { ThemedText, type TypographyToken } from '@/shared/components/themed-text';
import type { ThemeColor } from '@/shared/theme/theme';

export type TextParagraphVariant = 'default' | 'emphasis' | 'secondary';

export type TextParagraphProps = TextProps & {
  variant?: TextParagraphVariant;
  themeColor?: ThemeColor;
};

const variantToThemedType: Record<TextParagraphVariant, TypographyToken> = {
  default: 'body',
  emphasis: 'bodyBold',
  secondary: 'caption',
};

/**
 * Semantic paragraph text with a small set of weight and size presets.
 */
export function TextParagraph({
  variant = 'default',
  themeColor,
  ...rest
}: TextParagraphProps) {
  return <ThemedText type={variantToThemedType[variant]} themeColor={themeColor} {...rest} />;
}

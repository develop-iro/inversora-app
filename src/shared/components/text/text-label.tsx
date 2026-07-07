import type { TextProps } from 'react-native';

import { ThemedText, type TypographyToken } from '@/shared/components/themed-text';
import type { ThemeColor } from '@/shared/theme/theme';

export type TextLabelVariant = 'meta' | 'listMeta' | 'chip';

export type TextLabelProps = TextProps & {
  variant?: TextLabelVariant;
  themeColor?: ThemeColor;
};

const variantToThemedType: Record<TextLabelVariant, TypographyToken> = {
  meta: 'metaLabel',
  listMeta: 'listMeta',
  chip: 'chip',
};

/**
 * Uppercase meta labels, list metadata, and compact chip numerals.
 */
export function TextLabel({
  variant = 'meta',
  themeColor,
  ...rest
}: TextLabelProps) {
  return <ThemedText type={variantToThemedType[variant]} themeColor={themeColor} {...rest} />;
}

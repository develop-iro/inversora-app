import type { TextProps } from 'react-native';

import { ThemedText, type TypographyToken } from '@/shared/components/themed-text';
import type { ThemeColor } from '@/shared/theme/theme';

export type TextHeadingVariant = 'section' | 'nav' | 'card' | 'hero';

export type TextHeadingProps = TextProps & {
  variant?: TextHeadingVariant;
  themeColor?: ThemeColor;
};

const variantToThemedType: Record<TextHeadingVariant, TypographyToken> = {
  section: 'sectionTitle',
  nav: 'navTitle',
  card: 'cardTitle',
  hero: 'hero',
};

/**
 * Semantic heading text for sections, navigation chrome, cards, and hero surfaces.
 */
export function TextHeading({
  variant = 'section',
  themeColor,
  ...rest
}: TextHeadingProps) {
  return <ThemedText type={variantToThemedType[variant]} themeColor={themeColor} {...rest} />;
}

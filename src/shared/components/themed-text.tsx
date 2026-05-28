import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { FontFamily, Typography, type ThemeColor } from '@/shared/theme/theme';

export type ThemedTextType =
  | 'default'
  | 'title'
  | 'hero'
  | 'sectionTitle'
  | 'navTitle'
  | 'small'
  | 'smallBold'
  | 'caption'
  | 'chip'
  | 'cardTitle'
  | 'bodyBold'
  | 'subtitle'
  | 'link'
  | 'linkPrimary'
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

const typeStyles = StyleSheet.create({
  hero: Typography.hero,
  sectionTitle: Typography.sectionTitle,
  navTitle: Typography.navTitle,
  default: Typography.body,
  title: Typography.hero,
  subtitle: Typography.sectionTitle,
  small: Typography.caption,
  smallBold: Typography.bodyBold,
  caption: Typography.caption,
  bodyBold: Typography.bodyBold,
  cardTitle: Typography.cardTitle,
  chip: Typography.chip,
  link: Typography.caption,
  linkPrimary: Typography.caption,
  code: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        typeStyles[type],
        type === 'linkPrimary' && { color: theme.primary },
        style,
      ]}
      {...rest}
    />
  );
}

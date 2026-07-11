import { Text, type TextProps } from 'react-native';

import {
  legacyTypographyClassNames,
  themeColorClassNames,
  typographyClassNames,
} from '@/shared/nativewind/theme-classes';
import { Typography, type ThemeColor, type TypographyToken } from '@/shared/theme/theme';
import { cn } from '@/shared/utils/cn';

export type { TypographyToken };

/**
 * Legacy `type` values kept for backward compatibility.
 * Prefer {@link TypographyToken} keys aligned with `Typography`.
 */
const LEGACY_TYPE_ALIASES = {
  default: 'body',
  title: 'hero',
  subtitle: 'sectionTitle',
  small: 'caption',
  smallBold: 'bodyBold',
  link: 'caption',
  linkPrimary: 'caption',
} as const satisfies Record<string, TypographyToken>;

export type ThemedTextLegacyType = keyof typeof LEGACY_TYPE_ALIASES;

export type ThemedTextType = TypographyToken | ThemedTextLegacyType;

/**
 * Resolves a themed text type to a canonical typography token.
 *
 * @param type - Typography token or legacy alias.
 * @returns Canonical typography token name.
 */
export function resolveTypographyToken(type: ThemedTextType): TypographyToken {
  if (type in Typography) {
    return type as TypographyToken;
  }

  return LEGACY_TYPE_ALIASES[type as ThemedTextLegacyType];
}

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
  className?: string;
};

export function ThemedText({
  className,
  type = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  const resolvedType = resolveTypographyToken(type);
  const typographyClass =
    resolvedType in typographyClassNames
      ? typographyClassNames[resolvedType]
      : legacyTypographyClassNames[type as ThemedTextLegacyType];

  return (
    <Text
      className={cn(
        typographyClass,
        themeColor ? themeColorClassNames[themeColor] : themeColorClassNames.text,
        type === 'linkPrimary' && 'text-primary',
        className,
      )}
      {...rest}
    />
  );
}

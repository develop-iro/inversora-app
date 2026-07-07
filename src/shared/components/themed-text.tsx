import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import {
  Typography,
  type ThemeColor,
  type TypographyToken,
} from "@/shared/theme/theme";

export type { TypographyToken };

/**
 * Legacy `type` values kept for backward compatibility.
 * Prefer {@link TypographyToken} keys aligned with `Typography`.
 */
const LEGACY_TYPE_ALIASES = {
  default: "body",
  title: "hero",
  subtitle: "sectionTitle",
  small: "caption",
  smallBold: "bodyBold",
  link: "caption",
  linkPrimary: "caption",
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

const typographyStyles = Object.fromEntries(
  (Object.keys(Typography) as TypographyToken[]).map((token) => [
    token,
    Typography[token],
  ]),
) as Record<TypographyToken, TextStyle>;

const legacyStyles = Object.fromEntries(
  Object.entries(LEGACY_TYPE_ALIASES).map(([alias, token]) => [
    alias,
    Typography[token],
  ]),
) as Record<ThemedTextLegacyType, TextStyle>;

const typeStyles = StyleSheet.create({
  ...typographyStyles,
  ...legacyStyles,
});

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const resolvedType = resolveTypographyToken(type);

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "text"] },
        typeStyles[resolvedType],
        type === "linkPrimary" && { color: theme.primary },
        style,
      ]}
      {...rest}
    />
  );
}

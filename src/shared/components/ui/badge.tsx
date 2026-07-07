import type { ReactNode } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Size, Spacing, Typography } from "@/shared/theme/theme";

export type BadgeVariant = "soft" | "muted" | "warning" | "danger" | "mint";

export type BadgeProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: BadgeVariant;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Badge({
  label,
  variant = "soft",
  icon,
  style,
  disabled,
  onPress,
  ...pressableProps
}: BadgeProps) {
  const theme = useTheme();
  const variantStyles = getVariantStyles(variant, theme);

  const content = (
    <>
      <Text style={[styles.label, { color: variantStyles.labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: variantStyles.backgroundColor },
          pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
        {...pressableProps}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.base,
        { backgroundColor: variantStyles.backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </View>
  );
}

type BadgeVariantStyles = {
  backgroundColor: string;
  labelColor: string;
};

function getVariantStyles(
  variant: BadgeVariant,
  theme: ReturnType<typeof useTheme>,
): BadgeVariantStyles {
  switch (variant) {
    case "muted":
      return {
        backgroundColor: theme.surfaceMuted,
        labelColor: theme.text,
      };
    case "warning":
      return {
        backgroundColor: theme.surfaceMuted,
        labelColor: theme.warningBadgeLabel,
      };
    case "danger":
      return {
        backgroundColor: theme.surfaceMuted,
        labelColor: theme.dangerBadgeLabel,
      };
    case "mint":
      return {
        backgroundColor: theme.surfaceMuted,
        labelColor: theme.deepOcean,
      };
    case "soft":
    default:
      return {
        backgroundColor: theme.surfaceMuted,
        labelColor: theme.deepOcean,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.xs,
    minHeight: Size.badgeMinHeight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.smPlus,
    borderRadius: Radius.chip,
  },
  label: {
    ...Typography.metaLabel,
  },
  icon: {
    width: Size.iconXs,
    height: Size.iconXs,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});

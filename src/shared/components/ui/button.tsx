import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Pressable,
    StyleSheet,
    Text,
    type PressableProps,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing, Typography } from "@/shared/theme/theme";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "onDark";
export type ButtonSize = "sm" | "md";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  labelStyle,
  onPressIn: externalPressIn,
  onPressOut: externalPressOut,
  onHoverIn: externalHoverIn,
  onHoverOut: externalHoverOut,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  /*
   * Un único Animated.Value controla la escala del botón.
   *
   * Hover (solo web):  1 → 1.04  spring suave (stiffness baja)
   * Press (todas las plataformas): valor actual → 0.96  spring rápida
   * Release:  0.96 → target (1.04 si hover activo, 1 si no)
   *
   * Buenas prácticas:
   * - useNativeDriver: true → la animación corre en el hilo nativo.
   * - spring en lugar de timing → feedback táctil natural.
   * - isHovered ref sincrónica para no crear dependencias de closure.
   */
  // useState con lazy initializer: compatible con React Compiler (no accede a .current durante render).
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const isHovered = useRef(false);

  const springTo = useCallback(
    (toValue: number, stiffness = 350) => {
      Animated.spring(scaleAnim, {
        toValue,
        damping: 20,
        stiffness,
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim],
  );

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      if (!isDisabled) springTo(0.96, 420);
      externalPressIn?.(e);
    },
    [isDisabled, springTo, externalPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      springTo(isHovered.current ? 1.04 : 1, 300);
      externalPressOut?.(e);
    },
    [springTo, externalPressOut],
  );

  const handleHoverIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onHoverIn"]>>[0]) => {
      isHovered.current = true;
      if (!isDisabled) springTo(1.04, 220);
      externalHoverIn?.(e);
    },
    [isDisabled, springTo, externalHoverIn],
  );

  const handleHoverOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onHoverOut"]>>[0]) => {
      isHovered.current = false;
      springTo(1, 220);
      externalHoverOut?.(e);
    },
    [springTo, externalHoverOut],
  );

  const variantStyles = getVariantStyles(variant, theme, isDisabled);
  const sizeStyles = size === "sm" ? styles.sizeSm : styles.sizeMd;

  return (
    /*
     * Animated.View aplica la escala al botón completo (visual + área táctil)
     * mientras el Pressable interior gestiona el estado de accesibilidad y eventos.
     */
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={[
          styles.base,
          sizeStyles,
          variantStyles.container,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        {...pressableProps}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.label.color} size="small" />
        ) : (
          <Text
            style={[styles.label, variantStyles.label, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

function getVariantStyles(
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
  disabled?: boolean,
) {
  const mutedText = disabled ? theme.textSecondary : theme.text;

  switch (variant) {
    case "onDark":
      return {
        container: { backgroundColor: theme.surface },
        label: { color: theme.text, ...Typography.button },
      };
    case "secondary":
      return {
        container: { backgroundColor: theme.backgroundSoft },
        label: { color: mutedText, ...Typography.button },
      };
    case "ghost":
      return {
        container: { backgroundColor: "transparent" },
        label: {
          color: disabled ? theme.textSecondary : theme.primary,
          ...Typography.button,
        },
      };
    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.border,
        },
        label: { color: mutedText, ...Typography.button },
      };
    case "primary":
    default:
      return {
        container: {
          backgroundColor: disabled ? theme.backgroundElement : theme.primary,
        },
        label: { color: theme.textOnPrimary, ...Typography.button },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
  },
  sizeSm: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 11,
    minHeight: 40,
  },
  sizeMd: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  label: {
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

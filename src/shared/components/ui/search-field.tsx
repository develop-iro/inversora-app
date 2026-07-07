import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    type StyleProp,
    type TextInputProps,
    type TextStyle,
    type ViewStyle,
} from "react-native";

import { AnimatedPlaceholder } from "@/shared/components/ui/search/animated-placeholder";
import { AuroraBorder } from "@/shared/components/ui/search/aurora-border";
import { SearchOrb } from "@/shared/components/ui/search/search-orb";
import { isWeb } from "@/shared/platform/capabilities";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing, Typography } from "@/shared/theme/theme";

const SEARCH_FIELD_MIN_HEIGHT = 44;

const DEFAULT_SUGGESTIONS = [
  "What do you want to achieve?",
  "I want to invest for the long term",
  "Show me low-risk funds",
  "Help me understand MSCI World",
  "I don't know where to start",
] as const;

const DEFAULT_ACCESSIBILITY_LABEL =
  "Buscar fondos, categorías u objetivos de inversión";

const CLEAR_BUTTON_ACCESSIBILITY_LABEL = "Borrar búsqueda";

const CLEAR_BUTTON_HIT_SLOP = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
} as const;

const webInputStyle: TextStyle | null = isWeb
  ? ({
      outlineWidth: 0,
      outlineStyle: "none",
      borderWidth: 0,
      boxShadow: "none",
    } as unknown as TextStyle)
  : null;

export type SearchFieldVariant = "premium" | "plain";

export type SearchBarProps = Omit<TextInputProps, "style"> & {
  leadingIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  suggestions?: string[];
  variant?: SearchFieldVariant;
  /** Called after the field value is cleared via the clear button. */
  onClear?: () => void;
};

type SearchFieldClearButtonProps = {
  visible: boolean;
  onPress: () => void;
  iconColor: string;
};

/** Clear control shown when the search field has a non-empty value. */
function SearchFieldClearButton({
  visible,
  onPress,
  iconColor,
}: SearchFieldClearButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={CLEAR_BUTTON_ACCESSIBILITY_LABEL}
      hitSlop={CLEAR_BUTTON_HIT_SLOP}
      onPress={onPress}
      style={({ pressed }) => [
        styles.clearButton,
        pressed && styles.clearButtonPressed,
      ]}
    >
      <MaterialCommunityIcons name="close-circle" size={20} color={iconColor} />
    </Pressable>
  );
}

function PlainSearchBar({
  leadingIcon,
  containerStyle,
  editable = true,
  placeholder = "Buscar conceptos o fondos...",
  value,
  defaultValue,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  ...inputProps
}: SearchBarProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? "",
  );

  const isControlled = value !== undefined;
  const inputValue = String(isControlled ? (value ?? "") : uncontrolledValue);
  const showClearButton = inputValue.length > 0;

  const handleChangeText = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChangeText?.(nextValue);
    },
    [isControlled, onChangeText],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onChangeText?.("");
    onClear?.();
  }, [isControlled, onChangeText, onClear]);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = useCallback(
    (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = useCallback(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return (
    <View
      style={[
        styles.plainShell,
        {
          backgroundColor: theme.surface,
          borderColor: isFocused ? theme.primary : theme.border,
        },
        !editable && styles.disabled,
        containerStyle,
      ]}
    >
      <View style={styles.icon}>
        {leadingIcon ?? (
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={isFocused ? theme.primary : theme.textSecondary}
          />
        )}
      </View>

      <TextInput
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel}
        editable={editable}
        cursorColor={theme.primary}
        selectionColor={theme.primary}
        underlineColorAndroid="transparent"
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, webInputStyle, { color: theme.text }]}
        {...inputProps}
      />

      <SearchFieldClearButton
        visible={showClearButton}
        onPress={handleClear}
        iconColor={theme.deepOcean}
      />
    </View>
  );
}

/** Premium search surface with calm motion and educational prompt guidance. */
function PremiumSearchBar({
  leadingIcon,
  containerStyle,
  editable = true,
  placeholder,
  value,
  defaultValue,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
  suggestions,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  ...inputProps
}: SearchBarProps) {
  const theme = useTheme();
  const reducedMotionEnabled = useReducedMotion();
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? "",
  );

  const isControlled = value !== undefined;
  const inputValue = String(isControlled ? (value ?? "") : uncontrolledValue);
  const showClearButton = inputValue.length > 0;
  const suggestionMessages = useMemo(() => {
    if (suggestions?.length) {
      return suggestions;
    }
    if (placeholder && placeholder.trim().length > 0) {
      return [placeholder, ...DEFAULT_SUGGESTIONS];
    }
    return [...DEFAULT_SUGGESTIONS];
  }, [placeholder, suggestions]);

  const isTyping = inputValue.length > 0;
  const placeholderPaused = isFocused || isTyping;
  const auroraPaused = isTyping;

  const handleChangeText = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChangeText?.(nextValue);
    },
    [isControlled, onChangeText],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onChangeText?.("");
    onClear?.();
  }, [isControlled, onChangeText, onClear]);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = useCallback(
    (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = useCallback(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return (
    <AuroraBorder
      focused={isFocused}
      paused={auroraPaused}
      reducedMotionEnabled={reducedMotionEnabled}
      borderColor={theme.border}
      surfaceColor={theme.surfaceMuted}
    >
      <View
        style={[
          styles.container,
          !editable && styles.disabled,
          containerStyle,
        ]}
      >
        {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
        <SearchOrb
          color={theme.primary}
          reducedMotionEnabled={reducedMotionEnabled}
        />

        <View style={styles.inputWrapper}>
          {!isTyping ? (
            <AnimatedPlaceholder
              messages={suggestionMessages}
              paused={placeholderPaused}
              reducedMotionEnabled={reducedMotionEnabled}
              color={isFocused ? theme.primary : theme.textSecondary}
            />
          ) : null}

          <TextInput
            accessibilityRole="search"
            accessibilityLabel={accessibilityLabel}
            editable={editable}
            cursorColor={theme.primary}
            selectionColor={theme.primary}
            underlineColorAndroid="transparent"
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            placeholderTextColor={
              isFocused ? theme.primary : theme.textSecondary
            }
            style={[styles.input, webInputStyle, { color: theme.text }]}
            {...inputProps}
          />
        </View>

        <SearchFieldClearButton
          visible={showClearButton}
          onPress={handleClear}
          iconColor={theme.primary}
        />
      </View>
    </AuroraBorder>
  );
}

export function SearchBar({ variant = "premium", ...props }: SearchBarProps) {
  if (variant === "plain") {
    return <PlainSearchBar {...props} />;
  }

  return <PremiumSearchBar {...props} />;
}

export type SearchFieldProps = SearchBarProps;

export function SearchField(props: SearchFieldProps) {
  return <SearchBar {...props} />;
}

const styles = StyleSheet.create({
  plainShell: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
    minHeight: SEARCH_FIELD_MIN_HEIGHT,
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.field,
    paddingHorizontal: Spacing.md,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
    minHeight: SEARCH_FIELD_MIN_HEIGHT,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    minHeight: 22,
    justifyContent: "center",
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    padding: 0,
    margin: 0,
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    lineHeight: 20,
  },
  disabled: {
    opacity: 0.6,
  },
  clearButton: {
    width: SEARCH_FIELD_MIN_HEIGHT,
    height: SEARCH_FIELD_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: -Spacing.sm,
  },
  clearButtonPressed: {
    opacity: 0.72,
  },
});

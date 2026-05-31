import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
    Platform,
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
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useTheme } from "@/shared/hooks/use-theme";
import { Spacing, Typography } from "@/shared/theme/theme";

const DEFAULT_SUGGESTIONS = [
  "What do you want to achieve?",
  "I want to invest for the long term",
  "Show me low-risk funds",
  "Help me understand MSCI World",
  "I don't know where to start",
] as const;

export type SearchBarProps = Omit<TextInputProps, "style"> & {
  leadingIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  suggestions?: string[];
};

/** Premium search surface with calm motion and educational prompt guidance. */
export function SearchBar({
  leadingIcon,
  containerStyle,
  editable = true,
  placeholder,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  suggestions,
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
  const webInputStyle =
    Platform.OS === "web" ? ({ outlineWidth: 0 } as TextStyle) : null;

  const handleChangeText = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChangeText?.(nextValue);
    },
    [isControlled, onChangeText],
  );

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
        style={[styles.container, !editable && styles.disabled, containerStyle]}
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
            accessibilityLabel="Search funds, categories or investment goals"
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
      </View>
    </AuroraBorder>
  );
}

export type SearchFieldProps = SearchBarProps;

export function SearchField(props: SearchFieldProps) {
  return <SearchBar {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    alignSelf: "stretch",
  },
  inputWrapper: {
    flex: 1,
    minHeight: 24,
    justifyContent: "center",
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    padding: 0,
    ...Typography.body,
  },
  disabled: {
    opacity: 0.6,
  },
});

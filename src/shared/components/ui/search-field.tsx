import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
    Pressable,
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
import { typographyClassNames } from "@/shared/nativewind/theme-classes";
import { isWeb } from "@/shared/platform/capabilities";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { useTheme } from "@/shared/hooks/use-theme";
import { cn } from "@/shared/utils/cn";

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
  className?: string;
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
      className="h-11 w-11 shrink-0 -mr-sm items-center justify-center active:opacity-[0.72]"
    >
      <MaterialCommunityIcons name="close-circle" size={20} color={iconColor} />
    </Pressable>
  );
}

function PlainSearchBar({
  leadingIcon,
  className,
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
  const theme = useTheme(); // tailwind-exception: icon, cursor, selection, and text input colors
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
      className={cn(
        'min-h-[44px] w-full flex-row items-center gap-sm self-stretch rounded-field border bg-surface px-md',
        isFocused ? 'border-primary' : 'border-border',
        !editable && 'opacity-60',
        className,
      )}
      style={containerStyle}
    >
      <View className="h-[18px] w-[18px] shrink-0 items-center justify-center">
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
        className={cn(typographyClassNames.body, 'm-0 min-w-0 flex-1 p-0 leading-5 text-text')}
        style={webInputStyle}
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
  className,
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
  const theme = useTheme(); // tailwind-exception: icon, cursor, selection, and text input colors
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
        className={cn(
          'min-h-[44px] w-full flex-row items-center gap-sm self-stretch',
          !editable && 'opacity-60',
          className,
        )}
        style={containerStyle}
      >
        {leadingIcon ? (
          <View className="h-[18px] w-[18px] shrink-0 items-center justify-center">{leadingIcon}</View>
        ) : null}
        <SearchOrb
          color={theme.primary}
          reducedMotionEnabled={reducedMotionEnabled}
        />

        <View className="min-h-[22px] min-w-0 flex-1 justify-center self-stretch">
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
            className={cn(typographyClassNames.body, 'm-0 min-w-0 w-full flex-1 p-0 leading-5 text-text')}
            style={webInputStyle}
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

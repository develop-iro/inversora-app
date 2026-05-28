import type { ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing, Typography } from '@/shared/theme/theme';

export type SearchFieldProps = Omit<TextInputProps, 'style'> & {
  leadingIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

/** Figma: Text Field with Icon — buscador redondeado con icono a la izquierda. */
export function SearchField({
  leadingIcon,
  containerStyle,
  placeholder = 'Buscar fondos',
  editable = true,
  ...inputProps
}: SearchFieldProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surfaceMuted },
        !editable && styles.disabled,
        containerStyle,
      ]}>
      {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
      <TextInput
        accessibilityRole="search"
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.field,
    paddingHorizontal: 13,
    paddingVertical: 13.5,
    alignSelf: 'stretch',
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
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

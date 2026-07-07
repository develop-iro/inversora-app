import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type {
  HeaderActionId,
  HeaderActionPresentation,
} from '@/shared/components/headers/header-types';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Size, Spacing, Typography } from '@/shared/theme/theme';

const HEADER_ACTION_ICON_SIZE = Size.headerActionIcon;
const HEADER_ACTION_GLYPH_SIZE = Size.headerActionGlyph;
const HEADER_CAPTION_GAP = Spacing.threeQuarter;

type HeaderActionIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const ACTION_ICON: Record<HeaderActionId, HeaderActionIconName> = {
  back: 'arrow-left',
  close: 'close',
  learn: 'book-open-page-variant-outline',
  sora: 'robot-outline',
};

const ACTION_CAPTION: Record<HeaderActionId, string> = {
  back: 'Atrás',
  close: 'Cerrar',
  learn: 'Aprender',
  sora: 'SORA',
};

const ACTION_A11Y_LABEL: Record<HeaderActionId, string> = {
  back: 'Volver',
  close: 'Cerrar',
  learn: 'Aprender',
  sora: 'Abrir asistente SORA',
};

export type HeaderActionProps = {
  action: HeaderActionId;
  onPress: () => void;
  presentation?: HeaderActionPresentation;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Single operational header action (back, close, learn, SORA).
 */
export function HeaderAction({
  action,
  onPress,
  presentation = 'compact',
  accessibilityLabel,
  style,
}: HeaderActionProps) {
  const theme = useTheme();
  const label = accessibilityLabel ?? ACTION_A11Y_LABEL[action];
  const hint =
    action === 'learn'
      ? 'Inicia el cuestionario para aprender sobre fondos indexados'
      : action === 'sora'
        ? 'Abre el asistente educativo SORA'
        : undefined;

  if (presentation === 'caption') {
    return (
      <View style={[styles.actionColumn, style]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={hint}
          onPress={onPress}
          hitSlop={8}
          style={({ pressed }) => [styles.captionRoot, pressed && styles.pressed]}
        >
          <View style={[styles.captionIconCircle, { backgroundColor: theme.deepOceanSurfaceSubtle }]}>
            <MaterialCommunityIcons
              name={ACTION_ICON[action]}
              size={HEADER_ACTION_GLYPH_SIZE}
              color={theme.deepOcean}
            />
          </View>
        </Pressable>
        <Text
          style={[styles.actionCaption, { color: theme.deepOcean }]}
          importantForAccessibility="no"
          accessibilityElementsHidden
        >
          {ACTION_CAPTION[action]}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.compactButton,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={ACTION_ICON[action]}
        size={action === 'back' ? 22 : 20}
        color={theme.deepOcean}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionRoot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionIconCircle: {
    width: HEADER_ACTION_ICON_SIZE,
    height: HEADER_ACTION_ICON_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionColumn: {
    alignItems: 'center',
    gap: HEADER_CAPTION_GAP,
    flexShrink: 0,
  },
  actionCaption: {
    ...Typography.micro,
    lineHeight: Typography.chartAxis.lineHeight,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.82,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type {
  HeaderActionId,
  HeaderActionPresentation,
} from '@/shared/components/headers/header-types';
import { useTheme } from '@/shared/hooks/use-theme';
import { Size } from '@/shared/theme/theme';
import { typographyClassNames } from '@/shared/nativewind/theme-classes';
import { cn } from '@/shared/utils/cn';

const HEADER_ACTION_GLYPH_SIZE = Size.headerActionGlyph;

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
  className?: string;
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
  className,
  style,
}: HeaderActionProps) {
  const theme = useTheme(); // tailwind-exception: icon colors
  const label = accessibilityLabel ?? ACTION_A11Y_LABEL[action];
  const hint =
    action === 'learn'
      ? 'Inicia el cuestionario para aprender sobre fondos indexados'
      : action === 'sora'
        ? 'Abre el asistente educativo SORA'
        : undefined;

  if (presentation === 'caption') {
    return (
      <View className={cn('shrink-0 items-center gap-[3px]', className)} style={style}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={hint}
          onPress={onPress}
          hitSlop={8}
          className="items-center justify-center active:opacity-[0.82]"
        >
          <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-deep-ocean-surface-subtle">
            <MaterialCommunityIcons
              name={ACTION_ICON[action]}
              size={HEADER_ACTION_GLYPH_SIZE}
              color={theme.deepOcean}
            />
          </View>
        </Pressable>
        <Text
          className={cn(typographyClassNames.micro, 'text-center text-deep-ocean leading-3')}
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
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full border border-border bg-surface active:opacity-[0.82]',
        className,
      )}
      style={style}
    >
      <MaterialCommunityIcons
        name={ACTION_ICON[action]}
        size={action === 'back' ? 22 : 20}
        color={theme.deepOcean}
      />
    </Pressable>
  );
}

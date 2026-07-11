import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import type { ToastEntry, ToastVariant } from '@/core/overlay/overlay.types';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type ToastViewProps = {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
};

type ToastVisual = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColorKey: 'success' | 'danger' | 'primary' | 'warning';
  surfaceClassName: string;
};

const TOAST_VISUALS: Record<ToastVariant, ToastVisual> = {
  success: {
    icon: 'check-circle-outline',
    accentColorKey: 'success',
    surfaceClassName: 'bg-primary-surface-subtle',
  },
  error: {
    icon: 'alert-circle-outline',
    accentColorKey: 'danger',
    surfaceClassName: 'bg-danger-banner-surface',
  },
  info: {
    icon: 'information-outline',
    accentColorKey: 'primary',
    surfaceClassName: 'bg-soft-teal-surface',
  },
  warning: {
    icon: 'alert-outline',
    accentColorKey: 'warning',
    surfaceClassName: 'bg-warning-banner-surface',
  },
};

/**
 * Single toast card with auto-dismiss timer.
 */
export function ToastView({ entry, onDismiss }: ToastViewProps) {
  const theme = useTheme(); // tailwind-exception: icon accent colors
  const visual = TOAST_VISUALS[entry.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(entry.id);
    }, entry.durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [entry.durationMs, entry.id, onDismiss]);

  return (
    <Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutUp.duration(180)} className="w-full">
      <Pressable
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={[entry.title, entry.message].filter(Boolean).join('. ')}
        onPress={() => {
          onDismiss(entry.id);
        }}
        className="flex-row items-start gap-sm rounded-card border border-border-subtle bg-surface px-md py-sm shadow-card"
      >
        <View
          className={cn(
            'mt-[2px] h-8 w-8 items-center justify-center rounded-chip',
            visual.surfaceClassName,
          )}
        >
          <MaterialCommunityIcons
            name={visual.icon}
            size={20}
            color={theme[visual.accentColorKey]}
          />
        </View>

        <View className="flex-1 gap-[2px]">
          {entry.title ? (
            <TextLabel variant="meta" themeColor="deepOcean">
              {entry.title}
            </TextLabel>
          ) : null}
          <TextParagraph variant="secondary" themeColor="textSecondary">
            {entry.message}
          </TextParagraph>
        </View>
      </Pressable>
    </Animated.View>
  );
}

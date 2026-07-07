import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import type { ToastEntry, ToastVariant } from '@/core/overlay/overlay.types';
import { TextLabel, TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius, Spacing } from '@/shared/theme/theme';

export type ToastViewProps = {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
};

type ToastVisual = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accentColorKey: 'success' | 'danger' | 'primary' | 'warning';
  surfaceColorKey: 'primarySurfaceSubtle' | 'dangerBannerSurface' | 'softTealSurface' | 'warningBannerSurface';
};

const TOAST_VISUALS: Record<ToastVariant, ToastVisual> = {
  success: {
    icon: 'check-circle-outline',
    accentColorKey: 'success',
    surfaceColorKey: 'primarySurfaceSubtle',
  },
  error: {
    icon: 'alert-circle-outline',
    accentColorKey: 'danger',
    surfaceColorKey: 'dangerBannerSurface',
  },
  info: {
    icon: 'information-outline',
    accentColorKey: 'primary',
    surfaceColorKey: 'softTealSurface',
  },
  warning: {
    icon: 'alert-outline',
    accentColorKey: 'warning',
    surfaceColorKey: 'warningBannerSurface',
  },
};

/**
 * Single toast card with auto-dismiss timer.
 */
export function ToastView({ entry, onDismiss }: ToastViewProps) {
  const theme = useTheme();
  const shadows = useThemeShadows();
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
    <Animated.View
      entering={FadeInUp.duration(220)}
      exiting={FadeOutUp.duration(180)}
      style={styles.wrapper}
    >
      <Pressable
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={[entry.title, entry.message].filter(Boolean).join('. ')}
        onPress={() => {
          onDismiss(entry.id);
        }}
        style={[
          styles.card,
          shadows.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme[visual.surfaceColorKey] },
          ]}
        >
          <MaterialCommunityIcons
            name={visual.icon}
            size={20}
            color={theme[visual.accentColorKey]}
          />
        </View>

        <View style={styles.copy}>
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

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderRadius: Radius.card,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});

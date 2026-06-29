import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type ContentEmptyStateProps = {
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Calm illustrated empty state for failed or missing content loads.
 */
export function ContentEmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: ContentEmptyStateProps) {
  const theme = useTheme();
  const reducedMotionEnabled = useReducedMotion();
  const [floatAnim] = useState(() => new Animated.Value(0));
  const [orbitAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotionEnabled) {
      return;
    }

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const orbitLoop = Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    floatLoop.start();
    orbitLoop.start();

    return () => {
      floatLoop.stop();
      orbitLoop.stop();
    };
  }, [floatAnim, orbitAnim, reducedMotionEnabled]);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const orbitRotate = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${message}`}
      style={[
        styles.card,
        {
          backgroundColor: 'rgba(234, 248, 246, 0.55)',
          borderColor: 'rgba(0, 191, 166, 0.14)',
        },
        style,
      ]}
    >
      <View style={styles.illustrationWrap}>
        <Animated.View
          style={[
            styles.orbitRing,
            { borderColor: 'rgba(0, 191, 166, 0.18)', transform: [{ rotate: orbitRotate }] },
          ]}
        >
          <View style={[styles.orbitDot, styles.orbitDotTop]} />
          <View style={[styles.orbitDot, styles.orbitDotRight]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.iconBubble,
            { backgroundColor: theme.surface, transform: [{ translateY: floatTranslateY }] },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={28} color={theme.primary} />
        </Animated.View>
      </View>

      <ThemedText type="bodyBold" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>

      {actionLabel && onAction ? (
        <Button
          variant="outline"
          size="sm"
          label={actionLabel}
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  illustrationWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  orbitRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderRadius: Radius.full,
    borderStyle: 'dashed',
  },
  orbitDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 191, 166, 0.55)',
  },
  orbitDotTop: {
    top: -4,
    alignSelf: 'center',
  },
  orbitDotRight: {
    right: -4,
    top: '50%',
    marginTop: -4,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    lineHeight: 22,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  action: {
    marginTop: Spacing.sm,
  },
});

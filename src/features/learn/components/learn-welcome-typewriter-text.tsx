import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useTheme } from '@/shared/hooks/use-theme';
import { Typography } from '@/shared/theme/tokens';
import { cn } from '@/shared/utils/cn';

export type LearnWelcomeTypewriterTextProps = {
  readonly text: string;
  readonly showCaret: boolean;
  readonly variant: 'title' | 'body' | 'caption';
  readonly className?: string;
};

/**
 * Welcome copy that retains layout while a typewriter sequence fills it in.
 * Keeps a blinking caret on the active line without putting className on Animated.Text.
 */
export function LearnWelcomeTypewriterText({
  text,
  showCaret,
  variant,
  className,
}: LearnWelcomeTypewriterTextProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const caretOpacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion || !showCaret) {
      caretOpacity.value = showCaret ? 1 : 0;
      return;
    }

    caretOpacity.value = withRepeat(
      withTiming(0, { duration: 420, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [caretOpacity, reducedMotion, showCaret]);

  const caretStyle = useAnimatedStyle(() => ({
    opacity: showCaret ? caretOpacity.value : 0,
  }));

  const color =
    variant === 'title' ? theme.deepOcean : theme.textSecondary;

  return (
    <View className={cn('w-full flex-row flex-wrap items-end', className)}>
      <Text
        // tailwind-exception: typewriter measured line uses Typography tokens
        style={[
          variant === 'title'
            ? styles.title
            : variant === 'body'
              ? styles.body
              : styles.caption,
          { color },
        ]}
      >
        {text}
      </Text>
      {showCaret ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no"
          // tailwind-exception: caret blink driven by Reanimated opacity
          style={[
            variant === 'title' ? styles.caretTitle : styles.caretBody,
            { backgroundColor: color },
            caretStyle,
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.hero,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
    flexShrink: 1,
  },
  body: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
  },
  caption: {
    ...Typography.caption,
    flexShrink: 1,
  },
  caretTitle: {
    width: 2,
    height: 28,
    marginBottom: 6,
    marginLeft: 2,
    borderRadius: 1,
  },
  caretBody: {
    width: 2,
    height: 18,
    marginBottom: 4,
    marginLeft: 2,
    borderRadius: 1,
  },
});

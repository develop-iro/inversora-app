import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import {
  LAUNCH_SPLASH_LETTER_DURATION_MS,
  LAUNCH_SPLASH_LETTER_STAGGER_MS,
  LAUNCH_SPLASH_WORDMARK,
} from '@/shared/components/brand/app-launch-splash.constants';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { palette } from '@/shared/theme/palette';
import { Typography } from '@/shared/theme/tokens';

const WORDMARK_LETTERS = [...LAUNCH_SPLASH_WORDMARK];

/**
 * Staggered letter entrance for the launch splash wordmark.
 */
export function AppLaunchSplashWordmark() {
  const reducedMotionEnabled = useReducedMotion();
  const [letterAnims] = useState(() =>
    WORDMARK_LETTERS.map(() => new Animated.Value(0)),
  );

  useEffect(() => {
    if (reducedMotionEnabled) {
      letterAnims.forEach((anim) => {
        anim.setValue(1);
      });
      return;
    }

    const entrance = Animated.stagger(
      LAUNCH_SPLASH_LETTER_STAGGER_MS,
      letterAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: LAUNCH_SPLASH_LETTER_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    );

    entrance.start();

    return () => {
      entrance.stop();
    };
  }, [letterAnims, reducedMotionEnabled]);

  return (
    <View style={styles.wordmarkRow} accessibilityElementsHidden importantForAccessibility="no">
      {WORDMARK_LETTERS.map((letter, index) => (
        <Animated.Text
          key={`${letter}-${index}`}
          style={[
            styles.wordmarkLetter,
            {
              opacity: letterAnims[index],
              transform: [
                {
                  translateY: letterAnims[index]!.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkLetter: {
    ...Typography.brandWordmarkSplash,
    color: palette.white,
    marginHorizontal: -0.5,
  },
});

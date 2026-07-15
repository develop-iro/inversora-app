import { useCallback, useEffect, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { LearnWelcomeTypewriterText } from '@/features/learn/components/learn-welcome-typewriter-text';
import type { LearnInfoStep } from '@/features/learn/constants/learn-questionnaire';
import { useTypewriterSequence } from '@/features/learn/hooks/use-typewriter-sequence';
import {
  buildWelcomeTypewriterSegments,
  resolveWelcomeBodySegments,
} from '@/features/learn/services/welcome-typewriter';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';

const learnWelcomeIllustration = require('../../../../assets/images/learn-welcome-investor.png');

/** Compact hero height so title + body fit above the primary CTA on small phones. */
const ILLUSTRATION_HEIGHT = 168;

const SKIP_HINT =
  'Sin perfil verás contenido genérico. Puedes completarlo más tarde desde Inicio o pulsar Omitir.';

export type LearnWelcomeIntroProps = {
  step: LearnInfoStep;
  /** When true, shows a discreet hint about skipping the orientative profile. */
  readonly showSkipHint?: boolean;
  /** Fires when the entrance sequence finishes or the user skips it. */
  readonly onRevealComplete?: () => void;
};

/**
 * Full-screen orientative welcome before the profiling questionnaire begins.
 * Not counted as a questionnaire step.
 */
export function LearnWelcomeIntro({
  step,
  showSkipHint = false,
  onRevealComplete,
}: LearnWelcomeIntroProps) {
  const gradients = useThemeGradients();
  const illustrationFade = gradients.heroSlideIllustrationFade;
  const reducedMotion = useReducedMotion();

  const bodySegments = useMemo(
    () => resolveWelcomeBodySegments(step.body),
    [step.body],
  );

  const typewriterSegments = useMemo(
    () =>
      buildWelcomeTypewriterSegments({
        title: step.title,
        body: step.body,
        skipHint: showSkipHint ? SKIP_HINT : undefined,
      }),
    [showSkipHint, step.body, step.title],
  );

  const handleComplete = useCallback(() => {
    onRevealComplete?.();
  }, [onRevealComplete]);

  const { visibleSegments, activeSegmentIndex, isComplete, skip } =
    useTypewriterSequence({
      segments: typewriterSegments,
      startDelayMs: 420,
      charDelayMs: 22,
      segmentPauseMs: 260,
      reducedMotion,
      onComplete: handleComplete,
    });

  const illustrationOpacity = useSharedValue(reducedMotion ? 1 : 0);
  const illustrationScale = useSharedValue(reducedMotion ? 1 : 0.94);

  useEffect(() => {
    if (reducedMotion) {
      illustrationOpacity.value = 1;
      illustrationScale.value = 1;
      return;
    }

    illustrationOpacity.value = withTiming(1, {
      duration: 720,
      easing: Easing.out(Easing.cubic),
    });
    illustrationScale.value = withTiming(1, {
      duration: 820,
      easing: Easing.out(Easing.cubic),
    });
  }, [illustrationOpacity, illustrationScale, reducedMotion]);

  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [{ scale: illustrationScale.value }],
  }));

  const titleText = visibleSegments[0] ?? '';
  const bodyVisible = visibleSegments.slice(1, 1 + bodySegments.length);
  const skipHintText = showSkipHint
    ? (visibleSegments[1 + bodySegments.length] ?? '')
    : '';
  const skipHintIndex = showSkipHint ? 1 + bodySegments.length : -1;

  const content = (
    <>
      <Animated.View
        className="w-full overflow-hidden rounded-card border border-border-subtle bg-background-soft shadow-card"
        // tailwind-exception: fixed illustration height + Reanimated entrance
        style={[{ height: ILLUSTRATION_HEIGHT }, illustrationAnimatedStyle]}
      >
        <Image
          source={learnWelcomeIllustration}
          // tailwind-exception: cover sizing for hero illustration
          style={styles.illustrationImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel="Ilustración de una persona revisando opciones de inversión con calma en su dispositivo"
        />
        <LinearGradient
          colors={[...illustrationFade.colors]}
          locations={illustrationFade.locations ? [...illustrationFade.locations] : undefined}
          // tailwind-exception: gradient fade anchor at illustration bottom edge
          style={styles.illustrationFade}
          pointerEvents="none"
        />
      </Animated.View>

      <View className="w-full gap-md">
        <LearnWelcomeTypewriterText
          variant="title"
          text={titleText}
          showCaret={activeSegmentIndex === 0}
        />

        <View className="w-full gap-sm">
          {bodySegments.map((segment, index) => {
            const segmentIndex = index + 1;
            const visible = bodyVisible[index] ?? '';

            if (!visible && activeSegmentIndex < segmentIndex) {
              return null;
            }

            return (
              <LearnWelcomeTypewriterText
                key={segment}
                variant="body"
                text={visible}
                showCaret={activeSegmentIndex === segmentIndex}
              />
            );
          })}
        </View>

        {showSkipHint && (skipHintText.length > 0 || activeSegmentIndex === skipHintIndex) ? (
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.duration(420).easing(Easing.out(Easing.cubic))
            }
          >
            <LearnWelcomeTypewriterText
              variant="caption"
              text={skipHintText}
              showCaret={activeSegmentIndex === skipHintIndex}
            />
          </Animated.View>
        ) : null}
      </View>
    </>
  );

  if (isComplete) {
    return (
      <View
        className="flex-1 gap-lg pt-sm"
        accessibilityLabel={`${step.title}. ${step.body}`}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${step.title}. ${step.body}`}
      accessibilityHint="Toca para mostrar el texto completo de la bienvenida"
      onPress={skip}
      className="flex-1 gap-lg pt-sm"
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  illustrationImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  illustrationFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
});

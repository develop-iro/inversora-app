import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import type { LearnInfoStep } from '@/features/learn/constants/learn-questionnaire';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';

const learnWelcomeIllustration = require('../../../../assets/images/learn-welcome-investor.png');

const ILLUSTRATION_HEIGHT = 220;

export type LearnWelcomeIntroProps = {
  step: LearnInfoStep;
  /** When true, shows a discreet hint about skipping the orientative profile. */
  readonly showSkipHint?: boolean;
};

/**
 * Full-screen orientative welcome before the profiling questionnaire begins.
 * Not counted as a questionnaire step.
 */
export function LearnWelcomeIntro({ step, showSkipHint = false }: LearnWelcomeIntroProps) {
  const gradients = useThemeGradients();
  const illustrationFade = gradients.heroSlideIllustrationFade;

  return (
    <View
      className="flex-1 gap-xl pt-md"
      accessibilityLabel={`${step.title}. ${step.body}`}
    >
      <View
        className="w-full overflow-hidden rounded-card border border-border-subtle bg-background-soft shadow-card"
        // tailwind-exception: fixed illustration height from onboarding hero spec
        style={{ height: ILLUSTRATION_HEIGHT }}
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
      </View>

      <View className="w-full gap-md">
        <TextHeading
          variant="hero"
          themeColor="deepOcean"
          className="w-full text-[36px] leading-[44px] tracking-[-0.36px]"
        >
          {step.title}
        </TextHeading>

        <TextParagraph
          variant="secondary"
          themeColor="textSecondary"
          className="w-full text-[17px] leading-7"
        >
          {step.body}
        </TextParagraph>

        {showSkipHint ? (
          <TextParagraph
            variant="secondary"
            themeColor="textSecondary"
            className="w-full text-caption leading-5"
          >
            Sin perfil orientativo verás contenido genérico. Puedes completar el cuestionario más
            tarde desde Inicio o pulsar Omitir arriba a la derecha.
          </TextParagraph>
        ) : null}
      </View>
    </View>
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
    height: 48,
  },
});

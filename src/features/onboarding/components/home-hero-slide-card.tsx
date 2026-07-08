import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import type { HomeHeroSlide } from '@/features/onboarding/constants/home-hero-slides';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';

const ILLUSTRATION_HEIGHT = 140;

export type HomeHeroSlideCardProps = {
  slide: HomeHeroSlide;
  onCtaPress?: () => void;
};

/**
 * Single educational slide inside the home hero carousel.
 * Illustration strip on top, copy and CTA below.
 */
export function HomeHeroSlideCard({ slide, onCtaPress }: HomeHeroSlideCardProps) {
  const theme = useTheme();
  const gradients = useThemeGradients();
  const shadows = useThemeShadows();
  const illustrationFade = gradients.heroSlideIllustrationFade;

  return (
    <View
      accessibilityLabel={`${slide.headline}. ${slide.subtitle}`}
      className="flex-1 overflow-hidden rounded-card border"
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        shadows.card,
      ]}
    >
      <View
        className="w-full overflow-hidden"
        style={{ height: ILLUSTRATION_HEIGHT, backgroundColor: theme.backgroundSoft }}
      >
        <Image
          source={slide.illustration}
          style={styles.illustrationImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={slide.illustrationLabel}
        />
        <View
          style={[styles.illustrationScrim, { backgroundColor: theme.borderSubtle }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[...illustrationFade.colors]}
          locations={illustrationFade.locations ? [...illustrationFade.locations] : undefined}
          style={styles.illustrationFade}
          pointerEvents="none"
        />
      </View>

      <View className="flex-1 justify-center gap-sm px-lg pb-xl pt-md">
        <TextHeading variant="card" className="max-w-[320px] tracking-[-0.36px]">
          {slide.headline}
        </TextHeading>
        <TextParagraph
          variant="secondary"
          themeColor="textSecondary"
          className="max-w-[340px] leading-6"
        >
          {slide.subtitle}
        </TextParagraph>
        <View className="mt-sm self-start">
          <Button
            variant="primary"
            size="md"
            label={slide.ctaLabel}
            accessibilityLabel={`${slide.ctaLabel}, ${slide.headline}`}
            onPress={onCtaPress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 320,
  },
  illustrationImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  illustrationScrim: {
    ...StyleSheet.absoluteFill,
  },
  illustrationFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import type { HomeHeroSlide } from '@/features/onboarding/constants/home-hero-slides';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useThemeGradients } from '@/shared/hooks/use-theme-gradients';

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
  const gradients = useThemeGradients();
  const illustrationFade = gradients.heroSlideIllustrationFade;

  return (
    <View
      accessibilityLabel={`${slide.headline}. ${slide.subtitle}`}
      className="min-h-[320px] flex-1 overflow-hidden rounded-card border border-border bg-surface shadow-card"
    >
      <View
        className="w-full overflow-hidden bg-background-soft"
        // tailwind-exception: fixed illustration strip height from design spec
        style={{ height: ILLUSTRATION_HEIGHT }}
      >
        <Image
          source={slide.illustration}
          // tailwind-exception: NativeWind does not size absolute-fill hero images reliably on web
          style={styles.illustrationImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={slide.illustrationLabel}
        />
        <View
          // tailwind-exception: absolute scrim over illustration strip
          style={styles.illustrationScrim}
          className="bg-border-subtle"
          pointerEvents="none"
        />
        <LinearGradient
          colors={[...illustrationFade.colors]}
          locations={illustrationFade.locations ? [...illustrationFade.locations] : undefined}
          // tailwind-exception: gradient fade anchor at illustration bottom edge
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

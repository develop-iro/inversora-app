import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import type { HomeHeroSlide } from '@/features/onboarding/constants/home-hero-slides';
import { ThemedText } from '@/shared/components/themed-text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

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

  return (
    <View
      accessibilityLabel={`${slide.headline}. ${slide.subtitle}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: 'rgba(0, 191, 166, 0.12)',
        },
      ]}
    >
      <View style={styles.illustrationWrap}>
        <Image
          source={slide.illustration}
          style={styles.illustrationImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={slide.illustrationLabel}
        />
        <View style={styles.illustrationScrim} pointerEvents="none" />
        <LinearGradient
          colors={['rgba(234, 248, 246, 0)', theme.backgroundSoft]}
          locations={[0.35, 1]}
          style={styles.illustrationFade}
          pointerEvents="none"
        />
      </View>

      <View style={styles.body}>
        <ThemedText type="cardTitle" style={styles.headline}>
          {slide.headline}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary" style={styles.subtitle}>
          {slide.subtitle}
        </ThemedText>
        <Button
          variant="primary"
          size="md"
          label={slide.ctaLabel}
          accessibilityLabel={`${slide.ctaLabel}, ${slide.headline}`}
          onPress={onCtaPress}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
    minHeight: 320,
  },
  illustrationWrap: {
    width: '100%',
    height: ILLUSTRATION_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#D4F0EB',
  },
  illustrationImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  illustrationScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 46, 54, 0.06)',
  },
  illustrationFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  headline: {
    letterSpacing: -0.36,
    maxWidth: 320,
  },
  subtitle: {
    lineHeight: 24,
    maxWidth: 340,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
});

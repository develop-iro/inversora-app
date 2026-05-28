import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/shared/components/ui/button';
import { ThemedText } from '@/shared/components/themed-text';
import { Layout, Shadows, Spacing } from '@/shared/theme/theme';

const heroBackground = require('@/assets/images/background-hero.png');

const HERO_HEIGHT = 472;

export type HomeHeroProps = {
  onLearnPress?: () => void;
};

export function HomeHero({ onLearnPress }: HomeHeroProps) {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={heroBackground}
        style={styles.image}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="Ilustración de crecimiento financiero con tonos verde azulado">
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(11, 46, 54, 0.55)']}
          style={styles.gradient}
          locations={[0.45, 1]}>
          <View style={styles.content}>
            <ThemedText
              type="bodyBold"
              themeColor="textOnDark"
              style={[styles.eyebrow, Shadows.heroText]}>
              Explora fondos indexados sin complicaciones técnicas.
            </ThemedText>
            <ThemedText type="hero" themeColor="textOnDark" style={[styles.headline, Shadows.heroText]}>
              Hola, ¿por dónde quieres comenzar?
            </ThemedText>
            <View style={styles.ctaRow}>
              <Button variant="onDark" size="sm" label="Quiero aprender" onPress={onLearnPress} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: HERO_HEIGHT,
    justifyContent: 'flex-end',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing['3xl'],
    paddingTop: Spacing.xl,
  },
  content: {
    gap: Spacing.md,
    alignSelf: 'stretch',
  },
  eyebrow: {
    fontSize: 17,
    lineHeight: 22,
  },
  headline: {
    maxWidth: 340,
  },
  ctaRow: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
});

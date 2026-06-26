import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    ImageBackground,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";

import { ThemedText } from "@/shared/components/themed-text";
import { Button } from "@/shared/components/ui/button";
import { Layout, Shadows, Spacing } from "@/shared/theme/theme";

const heroBackground = require("@/assets/images/background-hero.png");

const HERO_MOBILE_HEIGHT = 460;
const HERO_WIDE_HEIGHT = 436;
const WIDE_HERO_BREAKPOINT = 768;

export type HomeHeroProps = {
  onLearnPress?: () => void;
};

export function HomeHero({ onLearnPress }: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const isWideLayout = width >= WIDE_HERO_BREAKPOINT;
  const heroHeight = isWideLayout ? HERO_WIDE_HEIGHT : HERO_MOBILE_HEIGHT;

  // Ken Burns: la imagen arranca ligeramente ampliada y se contrae suavemente.
  // useState con lazy initializer: crea el Animated.Value una sola vez y devuelve
  // una referencia estable, sin acceder a .current durante el render (React Compiler).
  const [bgScale] = useState(() => new Animated.Value(1.08));

  // Valores de entrada escalonada para cada bloque de texto y el CTA
  const [eyebrowAnim] = useState(() => new Animated.Value(0));
  const [headlineAnim] = useState(() => new Animated.Value(0));
  const [ctaAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const easeOut = Easing.out(Easing.quad);

    Animated.parallel([
      // Fondo: Ken Burns suave — 2400 ms para no distraer
      Animated.timing(bgScale, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Texto: fade-in + slide-up escalonado, arranca 200 ms después del fondo
      Animated.sequence([
        Animated.delay(200),
        Animated.stagger(130, [
          Animated.timing(eyebrowAnim, {
            toValue: 1,
            duration: 500,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(headlineAnim, {
            toValue: 1,
            duration: 520,
            easing: easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(ctaAnim, {
            toValue: 1,
            duration: 420,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [bgScale, eyebrowAnim, headlineAnim, ctaAnim]);

  const makeEntrance = (anim: Animated.Value, offsetY: number) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [offsetY, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.wrapper, { height: heroHeight }]}>
      {/*
       * Animated.View aplica la escala del Ken Burns al contenedor completo.
       * overflow: 'hidden' en el wrapper asegura que el exceso de imagen no se vea.
       */}
      <Animated.View
        style={[
          styles.imageContainer,
          { height: heroHeight, transform: [{ scale: bgScale }] },
        ]}
      >
        <ImageBackground
          source={heroBackground}
          style={[styles.image, { height: heroHeight }]}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel="Ilustración de crecimiento financiero con tonos verde azulado"
        >
          {/*
           * Capa 1 — Scrim base uniforme (22 % de negro).
           * Patrón "Luminosity Scrim": garantiza que el texto sea legible
           * independientemente de la zona de la imagen que quede expuesta,
           * sin que el degradado inferior tenga que ser demasiado agresivo.
           */}
          <View style={styles.baseScrim} pointerEvents="none" />

          {/*
           * Capa 2 — Gradiente bottom-heavy de 3 stops.
           * Stop 1 (0 %): transparente — preserva el detalle visual superior.
           * Stop 2 (65 %): 68 % opacidad — transición suave hacia la zona de texto.
           * Stop 3 (100 %): 94 % opacidad — contraste WCAG AA garantizado bajo el texto.
           */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0)",
              "rgba(11,46,54,0.68)",
              "rgba(11,46,54,0.94)",
            ]}
            locations={[0.0, 0.65, 1]}
            style={[styles.gradient, isWideLayout && styles.gradientWide]}
          >
            <View style={styles.content}>
              <Animated.View style={makeEntrance(eyebrowAnim, 10)}>
                <ThemedText
                  type="metaLabel"
                  themeColor="textOnDark"
                  style={[styles.eyebrow, Shadows.heroText]}
                >
                  Aprende, compara y decide con calma.
                </ThemedText>
              </Animated.View>

              <Animated.View style={makeEntrance(headlineAnim, 16)}>
                <ThemedText
                  type="hero"
                  themeColor="textOnDark"
                  style={[styles.headline, Shadows.heroText]}
                >
                  Hola, ¿por dónde quieres comenzar?
                </ThemedText>
              </Animated.View>

              <Animated.View style={[styles.ctaRow, makeEntrance(ctaAnim, 22)]}>
                <Button
                  variant="onDark"
                  size="sm"
                  label="Quiero aprender"
                  accessibilityLabel="Quiero aprender, abrir guía educativa"
                  onPress={onLearnPress}
                />
              </Animated.View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    justifyContent: "flex-end",
  },
  baseScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.22)",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingBottom: Spacing["3xl"],
    paddingTop: Spacing.xl,
  },
  gradientWide: {
    paddingBottom: Spacing["2xl"],
  },
  content: {
    gap: Spacing.lg,
    alignSelf: "stretch",
  },
  eyebrow: {
    letterSpacing: 0.35,
  },
  headline: {
    maxWidth: 360,
  },
  ctaRow: {
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
  },
});

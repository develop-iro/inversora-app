import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useAuroraBorder } from "@/shared/components/ui/search/hooks/use-aurora-border";
import { useThemeGradients } from "@/shared/hooks/use-theme-gradients";
import { useThemeShadows } from "@/shared/hooks/use-theme-shadows";
import { Radius, Spacing } from "@/shared/theme/theme";

type AuroraBorderProps = {
  children: ReactNode;
  focused: boolean;
  paused: boolean;
  reducedMotionEnabled: boolean;
  borderColor: string;
  surfaceColor: string;
};

export function AuroraBorder({
  children,
  focused,
  paused,
  reducedMotionEnabled,
  borderColor,
  surfaceColor,
}: AuroraBorderProps) {
  const gradients = useThemeGradients();
  const shadows = useThemeShadows();
  const auroraSweep = gradients.searchAuroraSweep;
  const { auraStyle } = useAuroraBorder({
    focused,
    paused,
    reducedMotionEnabled,
  });

  return (
    <View style={[styles.frame, shadows.focusAura, { borderColor }]}>
      <Animated.View pointerEvents="none" style={[styles.auraLayer, auraStyle]}>
        <LinearGradient
          colors={[...auroraSweep.colors]}
          start={auroraSweep.start}
          end={auroraSweep.end}
          style={styles.auraGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.content, { backgroundColor: surfaceColor }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: "stretch",
    width: "100%",
    borderWidth: 1,
    borderRadius: Radius.field + Spacing.half,
    overflow: "hidden",
  },
  auraLayer: {
    ...StyleSheet.absoluteFill,
  },
  auraGradient: {
    ...StyleSheet.absoluteFill,
    width: "170%",
    marginLeft: "-35%",
  },
  content: {
    borderRadius: Radius.field,
    margin: Spacing['2xs'],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});

import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useAuroraBorder } from "@/shared/components/ui/search/hooks/use-aurora-border";
import { Radius } from "@/shared/theme/theme";

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
  const { auraStyle, containerStyle } = useAuroraBorder({
    focused,
    paused,
    reducedMotionEnabled,
  });

  return (
    <View style={[styles.frame, { borderColor }]}>
      <Animated.View pointerEvents="none" style={[styles.auraLayer, auraStyle]}>
        <LinearGradient
          colors={[
            "rgba(0, 191, 166, 0.02)",
            "rgba(0, 191, 166, 0.18)",
            "rgba(11, 46, 54, 0.08)",
            "rgba(0, 191, 166, 0.02)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.auraGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          { backgroundColor: surfaceColor },
          containerStyle,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderRadius: Radius.field + 2,
    overflow: "hidden",
    shadowColor: "rgba(11, 46, 54, 0.45)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
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
    margin: 1,
    paddingHorizontal: 16,
  },
});

import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useSearchOrb } from "@/shared/components/ui/search/hooks/use-search-orb";

type SearchOrbProps = {
  color: string;
  reducedMotionEnabled: boolean;
};

export function SearchOrb({ color, reducedMotionEnabled }: SearchOrbProps) {
  const { animatedStyle } = useSearchOrb({ reducedMotionEnabled });

  return (
    <Animated.View
      style={[styles.orb, { backgroundColor: color }, animatedStyle]}
    >
      <View style={styles.core} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    width: 12,
    height: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

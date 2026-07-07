import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useSearchOrb } from "@/shared/components/ui/search/hooks/use-search-orb";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius } from "@/shared/theme/theme";

type SearchOrbProps = {
  color: string;
  reducedMotionEnabled: boolean;
};

export function SearchOrb({ color, reducedMotionEnabled }: SearchOrbProps) {
  const theme = useTheme();
  const { animatedStyle } = useSearchOrb({ reducedMotionEnabled });

  return (
    <Animated.View
      style={[styles.orb, { backgroundColor: color }, animatedStyle]}
    >
      <View style={[styles.core, { backgroundColor: theme.onPrimarySurfaceStrong }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: 3,
    height: 3,
    borderRadius: Radius.full,
  },
});

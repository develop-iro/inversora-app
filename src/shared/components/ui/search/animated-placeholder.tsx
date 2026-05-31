import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

import { useAnimatedPlaceholder } from "@/shared/components/ui/search/hooks/use-animated-placeholder";
import { Typography } from "@/shared/theme/theme";

type AnimatedPlaceholderProps = {
  messages: string[];
  paused: boolean;
  reducedMotionEnabled: boolean;
  color: string;
};

export function AnimatedPlaceholder({
  messages,
  paused,
  reducedMotionEnabled,
  color,
}: AnimatedPlaceholderProps) {
  const { currentMessage, animatedStyle } = useAnimatedPlaceholder({
    messages,
    paused,
    reducedMotionEnabled,
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, animatedStyle]}
    >
      <Text numberOfLines={1} style={[styles.text, { color }]}>
        {currentMessage}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
  },
  text: {
    ...Typography.body,
  },
});

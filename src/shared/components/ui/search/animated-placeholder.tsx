import { Text } from "react-native";
import Animated from "react-native-reanimated";

import { useAnimatedPlaceholder } from "@/shared/components/ui/search/hooks/use-animated-placeholder";
import { typographyClassNames } from "@/shared/nativewind/theme-classes";
import { cn } from "@/shared/utils/cn";

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
      className="absolute inset-0 justify-center"
      style={animatedStyle}
    >
      <Text
        numberOfLines={1}
        className={cn(typographyClassNames.body, 'leading-5')}
        // tailwind-exception: focus-aware placeholder color prop
        style={{ color }}
      >
        {currentMessage}
      </Text>
    </Animated.View>
  );
}

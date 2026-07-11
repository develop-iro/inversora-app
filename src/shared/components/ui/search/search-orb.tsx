import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useSearchOrb } from '@/shared/components/ui/search/hooks/use-search-orb';

type SearchOrbProps = {
  color: string;
  reducedMotionEnabled: boolean;
};

export function SearchOrb({ color, reducedMotionEnabled }: SearchOrbProps) {
  const { animatedStyle } = useSearchOrb({ reducedMotionEnabled });

  return (
    <Animated.View
      className="h-3 w-3 items-center justify-center rounded-full"
      // tailwind-exception: orb color prop and animated transform
      style={[{ backgroundColor: color }, animatedStyle]}
    >
      <View className="h-[3px] w-[3px] rounded-full bg-on-primary-surface-strong" />
    </Animated.View>
  );
}

import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { useAuroraBorder } from "@/shared/components/ui/search/hooks/use-aurora-border";
import { useThemeGradients } from "@/shared/hooks/use-theme-gradients";
import { cn } from "@/shared/utils/cn";

type AuroraBorderProps = {
  children: ReactNode;
  focused: boolean;
  paused: boolean;
  reducedMotionEnabled: boolean;
  borderColor: string;
  surfaceColor: string;
  className?: string;
};

export function AuroraBorder({
  children,
  focused,
  paused,
  reducedMotionEnabled,
  borderColor,
  surfaceColor,
  className,
}: AuroraBorderProps) {
  const gradients = useThemeGradients();
  const auroraSweep = gradients.searchAuroraSweep;
  const { auraStyle } = useAuroraBorder({
    focused,
    paused,
    reducedMotionEnabled,
  });

  return (
    <View
      className={cn('w-full self-stretch overflow-hidden rounded-[17px] border shadow-focus-aura', className)}
      // tailwind-exception: border color prop from parent theme
      style={{ borderColor }}
    >
      <Animated.View pointerEvents="none" className="absolute inset-0" style={auraStyle}>
        <LinearGradient
          colors={[...auroraSweep.colors]}
          start={auroraSweep.start}
          end={auroraSweep.end}
          className="absolute inset-0 -ml-[35%] w-[170%]"
        />
      </Animated.View>

      <Animated.View
        className="m-[1px] rounded-field px-md py-sm"
        // tailwind-exception: surface color prop from parent theme
        style={{ backgroundColor: surfaceColor }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

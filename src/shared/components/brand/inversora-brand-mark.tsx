import { Image, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

const brandMarkImage = require('@/assets/images/inversora-brand-mark.png');

interface InversoraBrandMarkProps {
  /** Side length of the mark in density-independent pixels. */
  size?: number;
  className?: string;
}

/**
 * Inversora logomark sourced from the brand asset so header and app icon stay aligned.
 */
export function InversoraBrandMark({ size = 36, className }: InversoraBrandMarkProps) {
  return (
    <View
      className={cn('shrink-0 overflow-hidden', className)}
      // tailwind-exception: dynamic mark size and corner radius
      style={{ width: size, height: size, borderRadius: size * 0.22 }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Image
        source={brandMarkImage}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

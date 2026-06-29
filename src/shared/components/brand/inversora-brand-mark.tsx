import { Image, StyleSheet, View } from 'react-native';

const brandMarkImage = require('@/assets/images/inversora-brand-mark.png');

interface InversoraBrandMarkProps {
  /** Side length of the mark in density-independent pixels. */
  size?: number;
}

/**
 * Inversora logomark sourced from the brand asset so header and app icon stay aligned.
 */
export function InversoraBrandMark({ size = 36 }: InversoraBrandMarkProps) {
  return (
    <View
      style={[styles.frame, { width: size, height: size, borderRadius: size * 0.22 }]}
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

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    flexShrink: 0,
  },
});

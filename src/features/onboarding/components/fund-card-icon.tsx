import { useState } from 'react';
import { Image, StyleSheet, View, type ImageProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';

export type FundCardIconProps = ViewProps & {
  symbol: string;
  logoUrl?: string | null;
  accessibilityLabel?: string;
};

export function FundCardIcon({
  symbol,
  logoUrl = null,
  accessibilityLabel,
  style,
  ...viewProps
}: FundCardIconProps) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const showRemoteLogo = logoUrl !== null && logoUrl.length > 0 && !imageFailed;
  const label = accessibilityLabel ?? `Logo gestora ${symbol}`;

  const handleImageError: NonNullable<ImageProps['onError']> = () => {
    setImageFailed(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSoft, borderColor: theme.border },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={label}
      {...viewProps}>
      {showRemoteLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={styles.logoImage}
          resizeMode="contain"
          onError={handleImageError}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <ThemedText type="bodyBold" style={styles.symbol}>
          {symbol}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: Radius.image,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  symbol: {
    fontSize: 16,
    lineHeight: 18,
  },
});

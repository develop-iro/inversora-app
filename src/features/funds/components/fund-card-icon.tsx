import { useState } from 'react';
import { Image, StyleSheet, View, type ImageProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Size, type TypographyToken } from '@/shared/theme/theme';

export type FundCardIconSize = 'sm' | 'md';

export type FundCardIconProps = ViewProps & {
  symbol: string;
  logoUrl?: string | null;
  size?: FundCardIconSize;
  accessibilityLabel?: string;
};

type FundCardIconLayout = {
  container: number;
  logo: number;
  symbol: TypographyToken;
};

const ICON_LAYOUT: Record<FundCardIconSize, FundCardIconLayout> = {
  sm: {
    container: Size.iconLg,
    logo: Size.iconSlot,
    symbol: 'iconSymbolSm',
  },
  md: {
    container: Size.iconXxl,
    logo: Size.iconXl,
    symbol: 'iconSymbolMd',
  },
};

/**
 * Fund issuer logo or symbol fallback for fund cards and comparison rows.
 */
export function FundCardIcon({
  symbol,
  logoUrl = null,
  size = 'sm',
  accessibilityLabel,
  style,
  ...viewProps
}: FundCardIconProps) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const showRemoteLogo = logoUrl !== null && logoUrl.length > 0 && !imageFailed;
  const label = accessibilityLabel ?? `Logo gestora ${symbol}`;
  const layout = ICON_LAYOUT[size];

  const handleImageError: NonNullable<ImageProps['onError']> = () => {
    setImageFailed(true);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: layout.container,
          height: layout.container,
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.border,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={label}
      {...viewProps}
    >
      {showRemoteLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: layout.logo, height: layout.logo }}
          resizeMode="contain"
          onError={handleImageError}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <ThemedText type={layout.symbol}>{symbol}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.image,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
});

import { useState } from 'react';
import { Image, View, type ImageProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { cn } from '@/shared/utils/cn';
import type { TypographyToken } from '@/shared/theme/theme';

export type FundCardIconSize = 'sm' | 'md';

export type FundCardIconProps = ViewProps & {
  symbol: string;
  logoUrl?: string | null;
  size?: FundCardIconSize;
  accessibilityLabel?: string;
  className?: string;
};

type FundCardIconLayout = {
  containerClassName: string;
  logoSize: number;
  symbol: TypographyToken;
};

const ICON_LAYOUT: Record<FundCardIconSize, FundCardIconLayout> = {
  sm: {
    containerClassName: 'h-8 w-8',
    logoSize: 28,
    symbol: 'iconSymbolSm',
  },
  md: {
    containerClassName: 'h-12 w-12',
    logoSize: 40,
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
  className,
  style,
  ...viewProps
}: FundCardIconProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showRemoteLogo = logoUrl !== null && logoUrl.length > 0 && !imageFailed;
  const label = accessibilityLabel ?? `Logo gestora ${symbol}`;
  const layout = ICON_LAYOUT[size];

  const handleImageError: NonNullable<ImageProps['onError']> = () => {
    setImageFailed(true);
  };

  return (
    <View
      className={cn(
        'shrink-0 items-center justify-center overflow-hidden rounded-image border border-border bg-background-soft',
        layout.containerClassName,
        className,
      )}
      style={style}
      accessibilityRole="image"
      accessibilityLabel={label}
      {...viewProps}
    >
      {showRemoteLogo ? (
        <Image
          source={{ uri: logoUrl }}
          // tailwind-exception: logo dimensions depend on icon size variant
          style={{ width: layout.logoSize, height: layout.logoSize }}
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

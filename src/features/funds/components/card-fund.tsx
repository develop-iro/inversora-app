import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { FavoriteToggleButton } from '@/features/funds/components/favorite-toggle-button';
import { FundCardIcon } from '@/features/funds/components/fund-card-icon';
import { FundMetricBlock } from '@/features/funds/components/fund-metric-block';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import {
  buildFundCardA11yLabel,
  getFundScore,
  type FundSummarySource,
} from '@/features/funds/utils/fund-summary';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Badge, Card, FundReturnChip, ScorePill, SkeletonBone, SkeletonPanel, SkeletonShimmerProvider, SkeletonTextBlock } from '@/shared/components/ui';
import { usePlatformCapabilities } from '@/shared/hooks/use-platform-capabilities';
import { useWebHover } from '@/shared/hooks/use-web-hover';
import { useTheme } from '@/shared/hooks/use-theme';
import { isWeb } from '@/shared/platform/capabilities';
import { getEfficiencyBadgeVariant, getEfficiencyLabel } from '@/shared/utils/fund-efficiency';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { cn } from '@/shared/utils/cn';
import type { WithLoading } from '@/shared/types/component-loading';

type CardFundLayout = 'default' | 'compact';

type CardFundContentProps = {
  fund: FundSummarySource;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  showFavorite?: boolean;
  /** Compact placeholder for compare headers and tight layouts. */
  layout?: CardFundLayout;
};

export type CardFundProps = WithLoading<
  CardFundContentProps,
  Pick<CardFundContentProps, 'className' | 'style' | 'layout'>
>;

function CardFundLoading({
  className,
  style,
  layout = 'default',
}: Pick<CardFundContentProps, 'className' | 'style' | 'layout'>) {
  if (layout === 'compact') {
    return (
      <View accessibilityLabel="Cargando ficha de fondo" className={className} style={style}>
        <SkeletonPanel style={{ flex: 1, minHeight: 118 }}>
          <View className="flex-row items-start justify-between">
            <SkeletonBone width={36} height={36} borderRadius={6} />
            <SkeletonBone width={18} height={18} borderRadius={9999} />
          </View>
          <SkeletonTextBlock
            gap={4}
            lines={[
              { width: '56%', height: 14 },
              { width: '88%', height: 10 },
            ]}
          />
          <SkeletonBone width={52} height={24} borderRadius={9999} />
        </SkeletonPanel>
      </View>
    );
  }

  return (
    <SkeletonShimmerProvider>
      <Card
        variant="elevated"
        className={cn('min-h-[420px] flex-1 rounded-card border border-border', className)}
        contentClassName="p-0"
        style={style}
        accessibilityLabel="Cargando ficha de fondo"
      >
        <View className="gap-lg p-lg">
          <SkeletonBone width={40} height={40} borderRadius={6} />
          <View className="gap-sm">
            <SkeletonBone width="72%" height={18} />
            <SkeletonBone width="48%" height={14} />
          </View>
          <View className="flex-row gap-md">
            <SkeletonBone width={72} height={36} />
            <SkeletonBone width={88} height={28} borderRadius={16} />
          </View>
          <SkeletonBone width="55%" height={14} />
        </View>
      </Card>
    </SkeletonShimmerProvider>
  );
}

export function CardFund(props: CardFundProps) {
  if (props.loading) {
    return <CardFundLoading className={props.className} style={props.style} layout={props.layout} />;
  }

  return <CardFundContent {...props} />;
}

function CardFundContent({
  fund,
  className,
  style,
  onPress,
  onInteractionStart,
  onInteractionEnd,
  showFavorite = true,
}: CardFundContentProps) {
  const theme = useTheme();
  const { supportsPointerHover } = usePlatformCapabilities();
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [hovered, setHovered] = useState(false);
  const { isFavorite, isLoading: isFavoriteLoading, toggle } = useFavorite(fund.isin);

  const score = getFundScore(fund);
  const efficiencyLabel = getEfficiencyLabel(score);
  const riskLabel = getRiskLabel(fund.riskLevel);
  const useNativeDriver = Platform.OS !== 'web';

  const animateTo = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(scaleAnim, {
        toValue,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver,
      }).start();
    },
    [scaleAnim, useNativeDriver],
  );

  const handleHoverIn = useCallback(() => {
    setHovered(true);
    if (supportsPointerHover) {
      animateTo(0.985, 180);
    }
    onInteractionStart?.();
  }, [animateTo, onInteractionStart, supportsPointerHover]);

  const handleHoverOut = useCallback(() => {
    setHovered(false);
    if (supportsPointerHover) {
      animateTo(1, 180);
    }
    onInteractionEnd?.();
  }, [animateTo, onInteractionEnd, supportsPointerHover]);

  const cardHoverProps = useWebHover({
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
  });

  const handlePressIn = useCallback(() => {
    animateTo(0.97, 90);
    onInteractionStart?.();
  }, [animateTo, onInteractionStart]);

  const handlePressOut = useCallback(() => {
    animateTo(hovered && supportsPointerHover ? 0.985 : 1, 140);
    onInteractionEnd?.();
  }, [animateTo, hovered, onInteractionEnd, supportsPointerHover]);

  const handleFocus = useCallback(() => {
    animateTo(0.985, 160);
    onInteractionStart?.();
  }, [animateTo, onInteractionStart]);

  const handleBlur = useCallback(() => {
    animateTo(hovered && supportsPointerHover ? 0.985 : 1, 160);
    onInteractionEnd?.();
  }, [animateTo, hovered, onInteractionEnd, supportsPointerHover]);

  const favoriteControl =
    showFavorite ? (
      <View pointerEvents={onPress && isWeb ? 'auto' : undefined} className="shrink-0">
        <FavoriteToggleButton
          isin={fund.isin}
          isFavorite={isFavorite}
          isLoading={isFavoriteLoading}
          onToggle={toggle}
        />
      </View>
    ) : null;

  const cardBody = (
    <Card
      variant="elevated"
      className={cn(
        'min-h-[420px] flex-1 rounded-card border border-border',
        hovered && 'shadow-elevated',
        supportsPointerHover && 'overflow-visible',
      )}
      contentClassName="p-0"
    >
      <View className="flex-1 flex-col gap-md p-lg">
        <View className="flex-row items-center gap-sm">
          <View className="h-1 min-w-0 flex-1 rounded-full bg-primary" />
          {favoriteControl}
        </View>

        <View className="flex-row items-center gap-md">
          <FundCardIcon
            size="md"
            symbol={fund.symbol}
            logoUrl={fund.logoUrl}
            accessibilityLabel={`Logo gestora de ${fund.name}`}
          />
          <View className="min-w-0 flex-1 gap-xs">
            <TextHeading variant="card" numberOfLines={2}>
              {fund.name}
            </TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
              {fund.categoryLabel}
            </TextParagraph>
          </View>
        </View>

        <View className="flex-row items-stretch gap-sm">
          <View className="min-w-0 flex-1">
            <ScorePill score={score} className="w-full self-stretch" />
          </View>
          <View className="min-w-0 flex-1">
            <FundReturnChip
              variant="surface"
              label="1A hist."
              value={fund.returns.oneYear}
              className="w-full self-stretch"
            />
          </View>
        </View>

        <View className="gap-sm">
          <FundMetricBlock
            icon="tag-text-outline"
            label="Temática"
            surface="dashboard"
            value={fund.themeLabel.trim() || '—'}
          />

          <View className="flex-row items-start gap-sm">
            <View className="min-w-0 flex-1 items-start gap-xs">
              <TextLabel variant="meta" themeColor="textSecondary">
                Riesgo
              </TextLabel>
              <Badge
                label={riskLabel}
                variant={getRiskBadgeVariant(fund.riskLevel)}
                className="max-w-full self-stretch"
              />
            </View>
            <View className="min-w-0 flex-1 items-start gap-xs">
              <TextLabel variant="meta" themeColor="textSecondary">
                Eficiencia
              </TextLabel>
              <Badge
                label={efficiencyLabel}
                variant={getEfficiencyBadgeVariant(score)}
                className="max-w-full self-stretch"
              />
            </View>
          </View>
        </View>

        <View className="mt-auto flex-row items-center justify-end">
          <View className="flex-row items-center gap-xs">
            <TextLabel variant="meta" themeColor="primary" className="tracking-[0.8px]">
              Ver detalle
            </TextLabel>
            <MaterialCommunityIcons name="arrow-right" size={16} color={theme.primary} />
          </View>
        </View>
      </View>
    </Card>
  );

  const pressableA11y = {
    accessibilityRole: 'button' as const,
    accessibilityLabel: buildFundCardA11yLabel(fund, efficiencyLabel),
    accessibilityHint: 'Abre la ficha resumida del fondo',
  };

  return (
    <Animated.View
      className={cn('grow self-stretch', className)}
      // tailwind-exception: Animated scale feedback requires transform
      style={[{ transform: [{ scale: scaleAnim }] }, style]}
    >
      {onPress ? (
        isWeb ? (
          <View
            {...(supportsPointerHover ? cardHoverProps : {})}
            className={cn(
              'relative flex-1 self-stretch',
              supportsPointerHover && 'cursor-pointer',
            )}
          >
            <Pressable
              {...pressableA11y}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="absolute inset-0 z-0 active:opacity-[0.97]"
            />
            <View pointerEvents="none" className="z-[1] flex-1">
              {cardBody}
            </View>
          </View>
        ) : (
          <Pressable
            {...pressableA11y}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 self-stretch active:opacity-[0.97]"
          >
            {cardBody}
          </Pressable>
        )
      ) : (
        cardBody
      )}
    </Animated.View>
  );
}

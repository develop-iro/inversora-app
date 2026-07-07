import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
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
import { Radius, Size, Spacing } from '@/shared/theme/theme';
import type { WithLoading } from '@/shared/types/component-loading';

const CARD_INSET = Spacing.lg;
const SECTION_GAP = Spacing.md;
const METRICS_GAP = Spacing.sm;

type CardFundLayout = 'default' | 'compact';

type CardFundContentProps = {
  fund: FundSummarySource;
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
  Pick<CardFundContentProps, 'style' | 'layout'>
>;

function CardFundLoading({
  style,
  layout = 'default',
}: Pick<CardFundContentProps, 'style' | 'layout'>) {
  if (layout === 'compact') {
    return (
      <SkeletonShimmerProvider>
        <View accessibilityLabel="Cargando ficha de fondo" style={style}>
          <SkeletonPanel style={styles.loadingCompactCard}>
            <View style={styles.loadingCompactTopRow}>
              <SkeletonBone width={36} height={36} borderRadius={Radius.image} />
              <SkeletonBone width={18} height={18} borderRadius={Radius.full} />
            </View>
            <SkeletonTextBlock
              gap={Spacing.xs}
              lines={[
                { width: '56%', height: 14 },
                { width: '88%', height: 10 },
              ]}
            />
            <SkeletonBone width={52} height={24} borderRadius={Radius.full} />
          </SkeletonPanel>
        </View>
      </SkeletonShimmerProvider>
    );
  }

  return (
    <SkeletonShimmerProvider>
      <Card
        variant="elevated"
        style={[styles.card, styles.loadingCard, style]}
        contentStyle={styles.cardContent}
        accessibilityLabel="Cargando ficha de fondo"
      >
        <View style={styles.loadingDefaultBody}>
          <SkeletonBone width={Size.iconXl} height={Size.iconXl} borderRadius={Radius.image} />
          <View style={styles.loadingDefaultText}>
            <SkeletonBone width="72%" height={18} />
            <SkeletonBone width="48%" height={14} />
          </View>
          <View style={styles.loadingMetricsRow}>
            <SkeletonBone width={72} height={36} />
            <SkeletonBone width={88} height={28} borderRadius={Radius.chip} />
          </View>
          <SkeletonBone width="55%" height={14} />
        </View>
      </Card>
    </SkeletonShimmerProvider>
  );
}

export function CardFund(props: CardFundProps) {
  if (props.loading) {
    return <CardFundLoading style={props.style} layout={props.layout} />;
  }

  return <CardFundContent {...props} />;
}

function CardFundContent({
  fund,
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
      <View
        pointerEvents={onPress && isWeb ? 'auto' : undefined}
        style={styles.favoriteSlot}
      >
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
      style={[
        styles.card,
        {
          borderWidth: 1,
          borderColor: theme.border,
        },
        hovered && styles.cardHovered,
        supportsPointerHover && styles.cardWeb,
      ]}
      contentStyle={styles.cardContent}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.toneBar, { backgroundColor: theme.primary }]} />
          {favoriteControl}
        </View>

        <View style={styles.headerTitleRow}>
          <FundCardIcon
            size="md"
            symbol={fund.symbol}
            logoUrl={fund.logoUrl}
            accessibilityLabel={`Logo gestora de ${fund.name}`}
          />
          <View style={styles.headerText}>
            <TextHeading variant="card" numberOfLines={2}>
              {fund.name}
            </TextHeading>
            <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={1}>
              {fund.categoryLabel}
            </TextParagraph>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.metricPillSlot}>
            <ScorePill score={score} style={styles.metricPill} />
          </View>
          <View style={styles.metricPillSlot}>
            <FundReturnChip
              variant="surface"
              label="1A hist."
              value={fund.returns.oneYear}
              style={styles.metricPill}
            />
          </View>
        </View>

        <View style={styles.metricsSection}>
          <FundMetricBlock
            icon="tag-text-outline"
            label="Temática"
            surface="dashboard"
            value={fund.themeLabel.trim() || '—'}
          />

          <View style={styles.badgesRow}>
            <View style={styles.badgeColumn}>
              <TextLabel variant="meta" themeColor="textSecondary">
                Riesgo
              </TextLabel>
              <Badge
                label={riskLabel}
                variant={getRiskBadgeVariant(fund.riskLevel)}
                style={styles.badge}
              />
            </View>
            <View style={styles.badgeColumn}>
              <TextLabel variant="meta" themeColor="textSecondary">
                Eficiencia
              </TextLabel>
              <Badge
                label={efficiencyLabel}
                variant={getEfficiencyBadgeVariant(score)}
                style={styles.badge}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.moreWrap}>
            <TextLabel variant="meta" style={[styles.more, { color: theme.primary }]}>
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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.fill, style]}>
      {onPress ? (
        isWeb ? (
          <View
            {...(supportsPointerHover ? cardHoverProps : {})}
            style={[
              styles.pressableRoot,
              supportsPointerHover && styles.cardWebCursor,
            ]}
          >
            <Pressable
              {...pressableA11y}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={({ pressed }) => [styles.detailHitArea, pressed && styles.pressablePressed]}
            />
            <View pointerEvents="none" style={styles.cardContentLayer}>
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
            style={({ pressed }) => [
              styles.nativePressable,
              pressed && styles.pressablePressed,
            ]}
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

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
    alignSelf: 'stretch',
  },
  card: {
    flex: 1,
    minHeight: 420,
    borderRadius: Radius.card,
  },
  cardHovered: {
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    padding: 0,
  },
  pressableRoot: {
    flex: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  nativePressable: {
    flex: 1,
    alignSelf: 'stretch',
  },
  detailHitArea: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  cardContentLayer: {
    flex: 1,
    zIndex: 1,
  },
  favoriteSlot: {
    flexShrink: 0,
  },
  pressablePressed: {
    opacity: 0.97,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: CARD_INSET,
    gap: SECTION_GAP,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toneBar: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    minWidth: 0,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.sm,
  },
  metricPillSlot: {
    flex: 1,
    minWidth: 0,
  },
  metricPill: {
    alignSelf: 'stretch',
    width: '100%',
  },
  metricsSection: {
    gap: METRICS_GAP,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  badgeColumn: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
    alignItems: 'flex-start',
  },
  badge: {
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  cardWeb: {
    overflow: 'visible',
  },
  cardWebCursor: Platform.select({
    web: { cursor: 'pointer' as const },
    default: {},
  }),
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 'auto',
  },
  more: {
    letterSpacing: 0.8,
  },
  moreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  loadingCompactCard: {
    flex: 1,
    minHeight: 118,
  },
  loadingCompactTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  loadingCard: {
    minHeight: 420,
  },
  loadingDefaultBody: {
    gap: Spacing.lg,
    padding: CARD_INSET,
  },
  loadingDefaultText: {
    gap: Spacing.sm,
  },
  loadingMetricsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});

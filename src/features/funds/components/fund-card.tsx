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
import { FundMetricBlock } from '@/features/funds/components/fund-metric-block';
import { useFavorite } from '@/features/funds/hooks/use-favorite';
import {
  buildFundCardA11yLabel,
  getFundScore,
  type FundSummarySource,
} from '@/features/funds/utils/fund-summary';
import { ThemedText } from '@/shared/components/themed-text';
import { Badge, Card, ScorePill } from '@/shared/components/ui';
import { usePlatformCapabilities } from '@/shared/hooks/use-platform-capabilities';
import { useWebHover } from '@/shared/hooks/use-web-hover';
import { useTheme } from '@/shared/hooks/use-theme';
import { isWeb } from '@/shared/platform/capabilities';
import { getEfficiencyBadgeVariant, getEfficiencyLabel } from '@/shared/utils/fund-efficiency';
import { getRiskBadgeVariant, getRiskLabel } from '@/shared/utils/fund-risk';
import { Radius, Spacing } from '@/shared/theme/theme';

/** Reserved height for title (2 lines) + category + gaps. */
const HEADER_BLOCK_MIN_HEIGHT = 30 * 2 + 19 + Spacing.sm;

export type FundCardProps = {
  fund: FundSummarySource;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  showFavorite?: boolean;
};

export function FundCard({
  fund,
  style,
  onPress,
  onInteractionStart,
  onInteractionEnd,
  showFavorite = true,
}: FundCardProps) {
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
          borderColor: hovered
            ? 'rgba(0, 191, 166, 0.55)'
            : 'rgba(0, 191, 166, 0.35)',
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

        <View style={styles.header}>
          <ThemedText type="cardTitle" numberOfLines={2}>
            {fund.name}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
            {fund.categoryLabel}
          </ThemedText>
        </View>

        <View style={styles.scoreRow}>
          <ScorePill score={score} />
        </View>

        <View style={styles.metricsRow}>
          <FundMetricBlock
            icon="tag-text-outline"
            label="Temática"
            surface="dashboard"
            value={fund.themeLabel}
          />
          <View style={styles.riskBadgeWrap}>
            <ThemedText type="metaLabel" themeColor="textSecondary">
              Riesgo
            </ThemedText>
            <Badge label={riskLabel} variant={getRiskBadgeVariant(fund.riskLevel)} />
          </View>
        </View>

        <View style={styles.efficiencyWrap}>
          <ThemedText type="metaLabel" themeColor="textSecondary">
            Eficiencia
          </ThemedText>
          <Badge label={efficiencyLabel} variant={getEfficiencyBadgeVariant(score)} />
        </View>

        <View style={styles.footer}>
          <View style={styles.moreWrap}>
            <ThemedText type="metaLabel" style={[styles.more, { color: theme.primary }]}>
              Ver detalle
            </ThemedText>
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
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
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
    gap: Spacing.md,
    paddingTop: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 40,
  },
  toneBar: {
    flex: 1,
    height: 5,
    borderRadius: Radius.full,
    minWidth: 0,
  },
  header: {
    gap: Spacing.sm,
    minHeight: HEADER_BLOCK_MIN_HEIGHT,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardWeb: {
    overflow: 'visible',
  },
  cardWebCursor: Platform.select({
    web: { cursor: 'pointer' as const },
    default: {},
  }),
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  riskBadgeWrap: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  efficiencyWrap: {
    gap: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: 'auto',
    paddingTop: Spacing.xs,
  },
  more: {
    letterSpacing: 0.8,
  },
  moreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});

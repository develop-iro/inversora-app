import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    View,
    useWindowDimensions,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import type { FeaturedFund } from "@/features/funds/models/fund";
import { ThemedText } from "@/shared/components/themed-text";
import { Badge, Card, ScorePill } from "@/shared/components/ui";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing } from "@/shared/theme/theme";

export type FundCardProps = {
  fund: FeaturedFund;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
};

export function FundCard({
  fund,
  style,
  onPress,
  onInteractionStart,
  onInteractionEnd,
}: FundCardProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [hovered, setHovered] = useState(false);
  const isCompact = width < 360;

  const animateTo = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(scaleAnim, {
        toValue,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim],
  );

  const handleHoverIn = useCallback(() => {
    if (Platform.OS !== "web") {
      return;
    }
    setHovered(true);
    animateTo(0.985, 180);
    onInteractionStart?.();
  }, [animateTo, onInteractionStart]);

  const handleHoverOut = useCallback(() => {
    if (Platform.OS !== "web") {
      return;
    }
    setHovered(false);
    animateTo(1, 180);
    onInteractionEnd?.();
  }, [animateTo, onInteractionEnd]);

  const handlePressIn = useCallback(() => {
    animateTo(0.97, 90);
    onInteractionStart?.();
  }, [animateTo, onInteractionStart]);

  const handlePressOut = useCallback(() => {
    animateTo(hovered && Platform.OS === "web" ? 0.985 : 1, 140);
    onInteractionEnd?.();
  }, [animateTo, hovered, onInteractionEnd]);

  const handleFocus = useCallback(() => {
    animateTo(0.985, 160);
    onInteractionStart?.();
  }, [animateTo, onInteractionStart]);

  const handleBlur = useCallback(() => {
    animateTo(hovered && Platform.OS === "web" ? 0.985 : 1, 160);
    onInteractionEnd?.();
  }, [animateTo, hovered, onInteractionEnd]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Card
        onPress={onPress}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityRole="button"
        accessibilityLabel={`${fund.name}. ${fund.categoryLabel}. ${fund.benefitSummary}. Score Invesora ${fund.efficiencyScore} sobre 100. Comisión ${fund.terPercent.toFixed(2)} por ciento. Riesgo ${getRiskLabel(fund.riskLevel)}. ${fund.featuredReason}.`}
        style={[
          styles.card,
          hovered && styles.cardHovered,
          { borderColor: "rgba(0, 191, 166, 0.35)" },
        ]}
        contentStyle={styles.content}
      >
        <View style={[styles.toneBar, { backgroundColor: theme.primary }]} />

        <View
          style={[styles.topMeta, isCompact ? styles.topMetaCompact : null]}
        >
          <Badge label={fund.badge} variant="mint" />
          <Badge label={`Actualizado ${fund.quarterTag}`} variant="muted" />
        </View>

        <View style={styles.header}>
          <ThemedText type="cardTitle" numberOfLines={2}>
            {fund.name}
          </ThemedText>
          <ThemedText
            type="caption"
            themeColor="textSecondary"
            numberOfLines={1}
          >
            {fund.categoryLabel}
          </ThemedText>
          <ThemedText
            type="caption"
            themeColor="textSecondary"
            numberOfLines={isCompact ? 3 : 2}
          >
            {fund.benefitSummary}
          </ThemedText>
        </View>

        <ScorePill score={fund.efficiencyScore} />

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons
              name="percent-circle-outline"
              size={16}
              color={theme.deepOcean}
            />
            <View style={styles.metricTextBlock}>
              <ThemedText type="metaLabel" themeColor="textSecondary">
                Comisión
              </ThemedText>
              <ThemedText type="bodyBold" style={styles.metricValue}>
                {fund.terPercent.toFixed(2)}%
              </ThemedText>
            </View>
          </View>
          <View style={styles.riskBadgeWrap}>
            <Badge
              label={`Riesgo ${getRiskLabel(fund.riskLevel)}`}
              variant={getRiskBadgeVariant(fund.riskLevel)}
            />
          </View>
        </View>

        <View style={styles.reasonWrap}>
          <Badge
            label={getDiversificationLabel(fund.diversification)}
            variant="soft"
          />
          <ThemedText
            type="caption"
            themeColor="textSecondary"
            numberOfLines={1}
          >
            {fund.featuredReason}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={styles.moreWrap}>
            <ThemedText
              type="metaLabel"
              style={[styles.more, { color: theme.primary }]}
            >
              Ver más
            </ThemedText>
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color={theme.primary}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

function getRiskLabel(riskLevel: FeaturedFund["riskLevel"]) {
  switch (riskLevel) {
    case "low":
      return "Bajo";
    case "high":
      return "Alto";
    case "medium":
    default:
      return "Medio";
  }
}

function getRiskBadgeVariant(riskLevel: FeaturedFund["riskLevel"]) {
  switch (riskLevel) {
    case "low":
      return "mint" as const;
    case "high":
      return "danger" as const;
    case "medium":
    default:
      return "warning" as const;
  }
}

function getDiversificationLabel(
  diversification: FeaturedFund["diversification"],
) {
  switch (diversification) {
    case "high":
      return "Diversificación alta";
    case "low":
      return "Diversificación baja";
    case "medium":
    default:
      return "Diversificación media";
  }
}

const styles = StyleSheet.create({
  card: {
    minHeight: 240,
    borderWidth: 1,
    borderRadius: Radius.card,
  },
  cardHovered: {
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    gap: Spacing.md,
    paddingTop: Spacing.lg,
  },
  toneBar: {
    height: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.xs,
  },
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
    alignItems: "center",
    flexWrap: "wrap",
  },
  topMetaCompact: {
    justifyContent: "flex-start",
  },
  header: {
    gap: Spacing.sm,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.half,
  },
  metricTextBlock: {
    gap: 1,
    alignItems: "flex-start",
  },
  metricValue: {
    lineHeight: 22,
  },
  riskBadgeWrap: {
    alignItems: "flex-end",
  },
  reasonWrap: {
    gap: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.sm,
  },
  more: {
    letterSpacing: 0.8,
  },
  moreWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});

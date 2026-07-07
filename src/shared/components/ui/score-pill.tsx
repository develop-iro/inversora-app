import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { TextLabel } from "@/shared/components/text";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing, Typography } from "@/shared/theme/theme";

/** Shared sizing for score / return pills on fund cards. */
export const METRIC_PILL_MIN_HEIGHT = 52;

export type ScorePillProps = {
  score: number;
  /** En detalle el título de sección ya nombra el score; solo muestra la cifra. */
  variant?: 'default' | 'compact';
  style?: StyleProp<ViewStyle>;
};

export function ScorePill({ score, variant = 'default', style }: ScorePillProps) {
  const theme = useTheme();
  const isCompact = variant === 'compact';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Score Inversora ${score} sobre 100`}
      style={[
        styles.wrapper,
        isCompact && styles.wrapperCompact,
        {
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {!isCompact ? (
        <TextLabel
          variant="meta"
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Score Inversora
        </TextLabel>
      ) : null}
      <TextLabel
        variant="chip"
        themeColor="deepOcean"
        style={[
          styles.score,
          isCompact && styles.scoreCompact,
        ]}
      >
        {score}/100
      </TextLabel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    minHeight: METRIC_PILL_MIN_HEIGHT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.half,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  wrapperCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    letterSpacing: 1,
  },
  score: {
    ...Typography.scoreHero,
  },
  scoreCompact: {
    ...Typography.scoreHeroCompact,
  },
});

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing } from "@/shared/theme/theme";

export type ScorePillProps = {
  score: number;
  /** En detalle el título de sección ya nombra el score; solo muestra la cifra. */
  variant?: 'default' | 'compact';
};

export function ScorePill({ score, variant = 'default' }: ScorePillProps) {
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
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.primary,
        },
      ]}
    >
      {!isCompact ? (
        <ThemedText
          type="metaLabel"
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Score Inversora
        </ThemedText>
      ) : null}
      <ThemedText
        type="chip"
        style={[
          styles.score,
          isCompact && styles.scoreCompact,
          { color: theme.deepOcean },
        ]}
      >
        {score}/100
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.half,
    alignSelf: "flex-start",
  },
  wrapperCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    letterSpacing: 1,
  },
  score: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.24,
  },
  scoreCompact: {
    fontSize: 26,
    lineHeight: 30,
  },
});

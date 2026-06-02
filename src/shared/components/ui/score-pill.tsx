import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text";
import { useTheme } from "@/shared/hooks/use-theme";
import { Radius, Spacing } from "@/shared/theme/theme";

export type ScorePillProps = {
  score: number;
};

export function ScorePill({ score }: ScorePillProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Score Inversora ${score} sobre 100`}
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.backgroundSoft,
          borderColor: theme.primary,
        },
      ]}
    >
      <ThemedText
        type="metaLabel"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        Score Inversora
      </ThemedText>
      <ThemedText
        type="chip"
        style={[styles.score, { color: theme.deepOcean }]}
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
  label: {
    letterSpacing: 1,
  },
  score: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.24,
  },
});

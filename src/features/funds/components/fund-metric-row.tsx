import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/shared/components/themed-text";
import { useTheme } from "@/shared/hooks/use-theme";
import { Spacing } from "@/shared/theme/theme";

export type FundMetricRowProps = {
  icon: string;
  label: string;
};

export function FundMetricRow({ icon, label }: FundMetricRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <ThemedText type="chip" style={styles.icon}>
        {icon}
      </ThemedText>
      <ThemedText
        type="metaLabel"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  icon: {
    minWidth: 16,
    textAlign: "center",
  },
  label: {
    flexShrink: 1,
  },
});

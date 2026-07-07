import { StyleSheet, View } from "react-native";

import { TextLabel } from "@/shared/components/text";
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
      <TextLabel variant="chip" style={styles.icon}>
        {icon}
      </TextLabel>
      <TextLabel
        variant="meta"
        style={[styles.label, { color: theme.textSecondary }]}
      >
        {label}
      </TextLabel>
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

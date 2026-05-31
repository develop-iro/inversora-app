import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/shared/components/themed-text";
import { ThemedView } from "@/shared/components/themed-view";
import { useTheme } from "@/shared/hooks/use-theme";
import { BottomTabInset, Spacing } from "@/shared/theme/theme";

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + BottomTabInset,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.headerBlock}>
        <ThemedText type="sectionTitle">Calcular</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Simula el interés compuesto con escenarios claros y lenguaje sencillo.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.sm,
  },
});

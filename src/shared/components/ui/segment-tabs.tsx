import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Spacing } from '@/shared/theme/theme';

export type SegmentTabOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentTabsProps<T extends string> = {
  tabs: SegmentTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

export function SegmentTabs<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Pestañas de sección',
}: SegmentTabsProps<T>) {
  const theme = useTheme();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        contentContainerStyle={styles.tabRow}
      >
        {tabs.map((tab) => {
          const selected = tab.value === value;

          return (
            <Pressable
              key={tab.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
              onPress={() => onChange(tab.value)}
              style={styles.tabButton}
            >
              <ThemedText
                type="bodyBold"
                style={{
                  color: selected ? theme.text : theme.textSecondary,
                }}
              >
                {tab.label}
              </ThemedText>
              {selected ? (
                <View style={[styles.underline, { backgroundColor: theme.text }]} />
              ) : (
                <View style={styles.underlinePlaceholder} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.border, { backgroundColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  tabButton: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  underline: {
    height: 2,
    borderRadius: 1,
    alignSelf: 'stretch',
  },
  underlinePlaceholder: {
    height: 2,
  },
  border: {
    height: StyleSheet.hairlineWidth,
    minHeight: 1,
    marginTop: -1,
  },
});

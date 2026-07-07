import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { TextParagraph } from '@/shared/components/text/text-paragraph';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type { TabOption };

export type TabHeaderProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

/**
 * Underline tab row for switching content sections within a screen.
 */
export function TabHeader<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Pestañas de sección',
}: TabHeaderProps<T>) {
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
              <TextParagraph
                variant="emphasis"
                style={{
                  color: selected ? theme.text : theme.textSecondary,
                }}
              >
                {tab.label}
              </TextParagraph>
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
    borderRadius: Radius.hairline,
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

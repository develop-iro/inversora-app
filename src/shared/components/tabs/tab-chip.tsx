import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { TextLabel } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius, Spacing } from '@/shared/theme/theme';

export type { TabOption };

export type TabChipProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  /**
   * Prefix for each tab accessibility label. The tab label is appended.
   * @default 'Opción'
   */
  tabAccessibilityPrefix?: string;
};

/**
 * Horizontal chip tabs on a muted track for compact option switching.
 */
export function TabChip<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Opciones',
  tabAccessibilityPrefix = 'Opción',
}: TabChipProps<T>) {
  const theme = useTheme();
  const shadows = useThemeShadows();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.surfaceMuted }]}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${tabAccessibilityPrefix} ${tab.label}`}
            onPress={() => onChange(tab.value)}
            style={[
              styles.segment,
              selected && [
                shadows.segmentSelected,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ],
            ]}
          >
            <TextLabel
              variant="meta"
              style={[
                styles.segmentLabel,
                { color: selected ? theme.deepOcean : theme.textSecondary },
              ]}
            >
              {tab.label}
            </TextLabel>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: Spacing.threeQuarter,
    gap: Spacing.half,
  },
  segment: {
    minHeight: 36,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.md,
  },
  segmentLabel: {
    letterSpacing: 0.6,
  },
});

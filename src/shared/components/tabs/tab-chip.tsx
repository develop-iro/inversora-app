import { Pressable, ScrollView } from 'react-native';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { TextLabel } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

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
  className?: string;
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
  className,
}: TabChipProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      contentContainerClassName={cn(
        'flex-row gap-half rounded-pill bg-surface-muted p-[3px]',
        className,
      )}
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
            className={cn(
              'min-h-[36px] min-w-[52px] items-center justify-center rounded-pill border border-transparent px-md',
              selected && 'border-border bg-surface shadow-segment-selected',
            )}
          >
            <TextLabel
              variant="meta"
              themeColor={selected ? 'deepOcean' : 'textSecondary'}
              className={cn(selected && 'tracking-[0.6px]')}
            >
              {tab.label}
            </TextLabel>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

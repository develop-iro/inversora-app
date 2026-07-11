import { Pressable, ScrollView, View } from 'react-native';

import type { TabOption } from '@/shared/components/tabs/tab-option';
import { TextParagraph } from '@/shared/components/text/text-paragraph';

export type { TabOption };

export type TabHeaderProps<T extends string> = {
  tabs: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  className?: string;
};

/**
 * Underline tab row for switching content sections within a screen.
 */
export function TabHeader<T extends string>({
  tabs,
  value,
  onChange,
  accessibilityLabel = 'Pestañas de sección',
  className,
}: TabHeaderProps<T>) {
  return (
    <View className={className}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        contentContainerClassName="flex-row gap-lg pb-xs"
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
              className="gap-xs pb-xs"
            >
              <TextParagraph
                variant="emphasis"
                themeColor={selected ? 'text' : 'textSecondary'}
              >
                {tab.label}
              </TextParagraph>
              {selected ? (
                <View className="h-[2px] self-stretch rounded-hairline bg-text" />
              ) : (
                <View className="h-[2px]" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <View className="-mt-px h-px min-h-[1px] bg-border" />
    </View>
  );
}

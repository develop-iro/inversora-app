import { Pressable, View } from 'react-native';

import type { FeedbackOption } from '@/features/feedback/schemas/product-feedback.schema';
import { TextParagraph } from '@/shared/components/text';
import { cn } from '@/shared/utils/cn';

export type FeedbackOptionGroupProps<T extends string> = {
  readonly label: string;
  readonly options: readonly FeedbackOption<T>[];
  readonly value: T | null;
  readonly onChange: (value: T) => void;
};

/**
 * Single-choice chip group for anonymous product feedback questions.
 */
export function FeedbackOptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FeedbackOptionGroupProps<T>) {
  return (
    <View className="gap-sm">
      <TextParagraph variant="emphasis">{label}</TextParagraph>
      <View className="flex-row flex-wrap gap-sm">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label}: ${option.label}`}
              onPress={() => onChange(option.value)}
              className={cn(
                'rounded-chip border px-md py-sm',
                selected ? 'border-primary bg-background-soft' : 'border-border bg-surface',
              )}
            >
              <TextParagraph variant="secondary" themeColor={selected ? 'deepOcean' : 'text'}>
                {option.label}
              </TextParagraph>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

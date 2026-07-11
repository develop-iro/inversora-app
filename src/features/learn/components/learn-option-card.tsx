import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import type { LearnQuestionOption } from '@/features/learn/constants/learn-questionnaire';
import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type LearnOptionCardProps = {
  option: LearnQuestionOption;
  selected: boolean;
  onSelect: (optionId: string) => void;
};

/**
 * Tappable answer card for a single-choice profiling step.
 */
export function LearnOptionCard({ option, selected, onSelect }: LearnOptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={option.description ? `${option.label}. ${option.description}` : option.label}
      onPress={() => onSelect(option.id)}
      className={cn(
        'gap-xs rounded-card border px-md py-md active:opacity-90',
        selected ? 'border-primary bg-primary-surface-subtle' : 'border-border bg-surface',
      )}
    >
      <View className="flex-row items-center gap-sm">
        {option.icon ? (
          <View
            className={cn(
              'h-8 w-8 items-center justify-center rounded-full',
              selected ? 'bg-primary-icon-surface' : 'bg-background-soft',
            )}
          >
            <MaterialCommunityIcons
              name={option.icon}
              size={18}
              color={selected ? theme.primary : theme.textSecondary}
            />
          </View>
        ) : null}
        <TextParagraph variant="emphasis" className="flex-1">
          {option.label}
        </TextParagraph>
      </View>
      {option.description ? (
        <TextParagraph variant="secondary" themeColor="textSecondary" className="pl-3xl leading-[18px]">
          {option.description}
        </TextParagraph>
      ) : null}
    </Pressable>
  );
}

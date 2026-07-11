import { View } from 'react-native';

import { LearnConceptCardList } from '@/features/learn/components/learn-concept-card-list';
import type { LearnQuestionStep } from '@/features/learn/constants/learn-questionnaire';
import { LearnOptionCard } from '@/features/learn/components/learn-option-card';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';

export type LearnQuestionStepViewProps = {
  step: LearnQuestionStep;
  selectedOptionId?: string;
  onSelectOption?: (optionId: string) => void;
};

/**
 * Renders a single questionnaire step (info or single-choice).
 */
export function LearnQuestionStepView({
  step,
  selectedOptionId,
  onSelectOption,
}: LearnQuestionStepViewProps) {
  return (
    <View className="gap-md">
      {step.eyebrow ? (
        <TextLabel variant="meta" themeColor="deepOcean">
          {step.eyebrow}
        </TextLabel>
      ) : null}

      <TextHeading variant="section" className="text-[21px] leading-7 tracking-[-0.2px]">
        {step.title}
      </TextHeading>

      {step.kind === 'info' ? (
        <View className="gap-lg">
          <TextParagraph
            variant="secondary"
            themeColor="textSecondary"
            className="text-[17px] leading-7"
          >
            {step.body}
          </TextParagraph>
          {step.conceptCards && step.conceptCards.length > 0 ? (
            <LearnConceptCardList cards={step.conceptCards} />
          ) : null}
        </View>
      ) : (
        <>
          {step.body ? (
            <TextParagraph
              variant="secondary"
              themeColor="textSecondary"
              className="text-[17px] leading-7"
            >
              {step.body}
            </TextParagraph>
          ) : null}
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={step.title}
            className="gap-sm pt-xs"
          >
            {step.options.map((option) => (
              <LearnOptionCard
                key={option.id}
                option={option}
                selected={selectedOptionId === option.id}
                onSelect={(optionId) => onSelectOption?.(optionId)}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

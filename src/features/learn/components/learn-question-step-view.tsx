import { StyleSheet, View } from 'react-native';

import type { LearnQuestionStep } from '@/features/learn/constants/learn-questionnaire';
import { LearnOptionCard } from '@/features/learn/components/learn-option-card';
import { TextHeading, TextLabel, TextParagraph } from '@/shared/components/text';
import { Spacing } from '@/shared/theme/theme';

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
    <View style={styles.container}>
      {step.eyebrow ? (
        <TextLabel variant="meta" themeColor="deepOcean">
          {step.eyebrow}
        </TextLabel>
      ) : null}

      <TextHeading variant="section" style={styles.title}>
        {step.title}
      </TextHeading>

      {step.kind === 'info' ? (
        <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.body}>
          {step.body}
        </TextParagraph>
      ) : (
        <>
          {step.body ? (
            <TextParagraph variant="secondary" themeColor="textSecondary" style={styles.body}>
              {step.body}
            </TextParagraph>
          ) : null}
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={step.title}
            style={styles.options}
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

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  title: {
    letterSpacing: -0.2,
  },
  body: {
    lineHeight: 24,
  },
  options: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
});

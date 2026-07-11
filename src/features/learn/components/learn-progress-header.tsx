import { View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';

export type LearnProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
};

/**
 * Shows questionnaire progress as a calm step counter and bar.
 */
export function LearnProgressHeader({ currentStep, totalSteps }: LearnProgressHeaderProps) {
  const progress = Math.min(currentStep / totalSteps, 1);

  return (
    <View className="gap-sm">
      <TextParagraph variant="secondary" themeColor="textSecondary">
        Paso {currentStep} de {totalSteps}
      </TextParagraph>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Progreso del cuestionario, paso ${currentStep} de ${totalSteps}`}
        accessibilityValue={{
          min: 0,
          max: totalSteps,
          now: currentStep,
        }}
        className="h-[6px] overflow-hidden rounded-full bg-background-soft"
      >
        <View
          className="h-full rounded-full bg-primary"
          // tailwind-exception: progress fill width is computed at runtime
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    </View>
  );
}

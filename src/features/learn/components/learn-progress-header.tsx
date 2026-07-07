import { StyleSheet, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type LearnProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
};

/**
 * Shows questionnaire progress as a calm step counter and bar.
 */
export function LearnProgressHeader({ currentStep, totalSteps }: LearnProgressHeaderProps) {
  const theme = useTheme();
  const progress = Math.min(currentStep / totalSteps, 1);

  return (
    <View style={styles.container}>
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
        style={[styles.track, { backgroundColor: theme.backgroundSoft }]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.primary,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  track: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});

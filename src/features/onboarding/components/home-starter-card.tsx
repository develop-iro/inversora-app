import { Pressable, StyleSheet, View } from 'react-native';

import { HomeStarterIllustration } from '@/features/onboarding/components/home-starter-illustration';
import {
  HOME_STARTER_CARD_ILLUSTRATION_LABELS,
  type HomeStarterCardVariant,
} from '@/features/onboarding/constants/home-starter-cards';
import { TextParagraph } from '@/shared/components/text';

const ILLUSTRATION_PANEL_HEIGHT = 112;
const CARD_MIN_HEIGHT = 168;

export type HomeStarterCardProps = {
  variant: HomeStarterCardVariant;
  title: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress?: () => void;
};

/**
 * Compact entry card for the minimal home "Para empezar" section.
 * Soft illustration panel with surface card styling (educational / welcoming).
 */
export function HomeStarterCard({
  variant,
  title,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}: HomeStarterCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className="min-w-0 flex-1 gap-sm overflow-hidden rounded-card border border-border bg-surface p-md active:opacity-90"
      // tailwind-exception: portrait card min height for illustration + title stack
      style={styles.card}
    >
      <View
        className="w-full items-center justify-center overflow-hidden rounded-card bg-background-soft"
        // tailwind-exception: fixed illustration panel height from design spec
        style={styles.illustrationPanel}
      >
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <HomeStarterIllustration
            variant={variant}
            accessibilityLabel={HOME_STARTER_CARD_ILLUSTRATION_LABELS[variant]}
          />
        </View>
      </View>
      <TextParagraph variant="emphasis" className="leading-[22px]">
        {title}
      </TextParagraph>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: CARD_MIN_HEIGHT,
  },
  illustrationPanel: {
    height: ILLUSTRATION_PANEL_HEIGHT,
  },
});

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';

import { TextParagraph } from '@/shared/components/text';
import { useTheme } from '@/shared/hooks/use-theme';

export type HomeStarterCardProps = {
  title: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress?: () => void;
};

/**
 * Compact entry card for the minimal home "Para empezar" section.
 * Solid brand teal surface with white typography (promotional / educational).
 */
export function HomeStarterCard({
  title,
  iconName,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}: HomeStarterCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      className="min-h-[88px] min-w-0 flex-1 justify-center gap-sm rounded-card bg-primary px-md py-md active:bg-deep-ocean"
    >
      <View className="h-8 w-8 items-center justify-center rounded-full bg-on-primary-surface">
        <MaterialCommunityIcons name={iconName} size={18} color={theme.textOnPrimary} />
      </View>
      <TextParagraph variant="emphasis" themeColor="textOnPrimary" className="leading-[22px]">
        {title}
      </TextParagraph>
    </Pressable>
  );
}

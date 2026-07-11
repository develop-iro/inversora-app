import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { CompareSuggestedPair } from '@/features/comparison/constants/compare-suggested-pairs.config';
import { TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui/card';
import { useTheme } from '@/shared/hooks/use-theme';
import { cn } from '@/shared/utils/cn';

export type CompareSuggestedPairCardProps = {
  pair: CompareSuggestedPair;
  onPress: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Compact card for a suggested two-fund comparison.
 */
export function CompareSuggestedPairCard({
  pair,
  onPress,
  className,
  style,
}: CompareSuggestedPairCardProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Comparar ${pair.label}: ${pair.description}`}
      className={cn('w-full min-w-[200px]', className)}
      contentClassName="min-h-[118px] justify-between gap-sm p-md"
      style={style}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-background-soft">
        <MaterialCommunityIcons name={pair.icon} size={20} color={theme.deepOcean} />
      </View>

      <View className="flex-1 gap-xs">
        <TextParagraph variant="emphasis" numberOfLines={1}>
          {pair.label}
        </TextParagraph>
        <TextParagraph variant="secondary" themeColor="textSecondary" numberOfLines={2}>
          {pair.description}
        </TextParagraph>
      </View>

      <TextParagraph variant="secondary" themeColor="primary">
        Comparar
      </TextParagraph>
    </Card>
  );
}

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CompareSuggestedPair } from '@/features/comparison/constants/compare-suggested-pairs.config';
import { TextParagraph } from '@/shared/components/text';
import { Card } from '@/shared/components/ui/card';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius, Spacing } from '@/shared/theme/theme';

export type CompareSuggestedPairCardProps = {
  pair: CompareSuggestedPair;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Compact card for a suggested two-fund comparison.
 */
export function CompareSuggestedPairCard({ pair, onPress, style }: CompareSuggestedPairCardProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Comparar ${pair.label}: ${pair.description}`}
      style={[styles.card, style]}
      contentStyle={styles.content}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundSoft }]}>
        <MaterialCommunityIcons name={pair.icon} size={20} color={theme.deepOcean} />
      </View>

      <View style={styles.copy}>
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

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minWidth: 200,
    borderRadius: Radius.card,
  },
  content: {
    minHeight: 118,
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: Spacing.xs,
    flex: 1,
  },
});

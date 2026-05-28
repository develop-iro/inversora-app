import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/shared/components/themed-text';
import { useTheme } from '@/shared/hooks/use-theme';
import { Radius } from '@/shared/theme/theme';

export type FundCardIconProps = ViewProps & {
  symbol: string;
};

export function FundCardIcon({ symbol, style, ...viewProps }: FundCardIconProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSoft, borderColor: theme.border },
        style,
      ]}
      {...viewProps}>
      <ThemedText type="bodyBold" style={styles.symbol}>
        {symbol}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: Radius.image,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 16,
    lineHeight: 18,
  },
});

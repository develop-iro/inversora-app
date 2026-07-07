import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/hooks/use-theme';

export type ScreenShellProps = {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Canonical page structure: header, body, optional footer, optional overlay layer.
 */
export function ScreenShell({ header, body, footer, overlay, style }: ScreenShellProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          paddingBottom: footer === undefined ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {header}
      {body}
      {footer !== undefined ? (
        <View style={{ paddingBottom: insets.bottom }}>{footer}</View>
      ) : null}
      {overlay !== undefined ? <View style={styles.overlay} pointerEvents="box-none">{overlay}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});

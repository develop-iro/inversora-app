import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore } from '@/core/overlay/toast-store';
import { ToastView } from '@/shared/components/overlay/toast-view';
import { Spacing } from '@/shared/theme/theme';

/**
 * Root toast renderer. Mount once in `AppProviders`.
 */
export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          bottom: insets.bottom + Spacing.md,
        },
      ]}
    >
      {toasts.map((entry) => (
        <ToastView key={entry.id} entry={entry} onDismiss={dismiss} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    gap: Spacing.sm,
    zIndex: 1000,
    elevation: 1000,
  },
});

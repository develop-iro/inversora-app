import { View } from 'react-native';
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
      className="absolute left-md right-md z-[1000] gap-sm"
      // tailwind-exception: safe-area bottom inset is runtime-only
      style={{
        bottom: insets.bottom + Spacing.md,
        elevation: 1000,
      }}
    >
      {toasts.map((entry) => (
        <ToastView key={entry.id} entry={entry} onDismiss={dismiss} />
      ))}
    </View>
  );
}

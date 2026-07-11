import { BlurView } from 'expo-blur';
import { Platform, Pressable, View } from 'react-native';

import type { ModalAlertBackdrop } from '@/core/overlay/overlay.types';
import { isWeb } from '@/shared/platform/capabilities';

export type AppAlertDialogBackdropProps = {
  backdrop: ModalAlertBackdrop;
  onPress: () => void;
};

/**
 * Modal backdrop with optional blur for alert dialogs.
 */
export function AppAlertDialogBackdrop({ backdrop, onPress }: AppAlertDialogBackdropProps) {
  const useBlur = backdrop === 'blur-scrim' && !isWeb;

  if (useBlur) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar diálogo"
        onPress={onPress}
        className="absolute inset-0"
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 28 : 18}
          tint="light"
          className="absolute inset-0"
        />
        <View className="absolute inset-0 bg-overlay-scrim opacity-80" pointerEvents="none" />
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Cerrar diálogo"
      onPress={onPress}
      className="absolute inset-0 bg-overlay-scrim"
    />
  );
}

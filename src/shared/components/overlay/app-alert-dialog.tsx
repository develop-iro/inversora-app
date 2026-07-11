import { Modal, View } from 'react-native';

import type { ModalAlertEntry } from '@/core/overlay/overlay.types';
import { AppAlertDialogBackdrop } from '@/shared/components/overlay/app-alert-dialog-backdrop';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

export type AppAlertDialogProps = {
  entry: ModalAlertEntry;
  onClose: () => void;
};

/**
 * Centered alert dialog with shared visual language.
 */
export function AppAlertDialog({ entry, onClose }: AppAlertDialogProps) {
  const buttons = entry.buttons ?? [{ label: 'Entendido', variant: 'primary' as const }];
  const backdrop = entry.backdrop ?? 'blur-scrim';

  const handleButtonPress = (index: number) => {
    const button = buttons[index];
    button.onPress?.();
    onClose();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View className="flex-1 items-center justify-center p-lg">
        <AppAlertDialogBackdrop backdrop={backdrop} onPress={onClose} />

        <View
          accessibilityRole="alert"
          className="w-full max-w-[420px] gap-md rounded-card border border-border-subtle bg-surface p-lg shadow-card"
        >
          <TextHeading variant="section" themeColor="deepOcean">
            {entry.title}
          </TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            {entry.message}
          </TextParagraph>

          <View className="mt-xs flex-row flex-wrap justify-end gap-sm">
            {buttons.map((button, index) => {
              const isPrimary = button.variant === 'primary' || button.variant === undefined;
              const isDanger = button.variant === 'danger';

              return (
                <Button
                  key={`${button.label}-${index}`}
                  label={button.label}
                  variant={isDanger ? 'outline' : isPrimary ? 'primary' : 'secondary'}
                  fullWidth={buttons.length === 1}
                  onPress={() => {
                    handleButtonPress(index);
                  }}
                  className={cn(buttons.length > 1 && 'min-w-[120px]')}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

import { Modal, Pressable, StyleSheet, View } from 'react-native';

import type { ModalAlertEntry } from '@/core/overlay/overlay.types';
import { TextHeading, TextParagraph } from '@/shared/components/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeShadows } from '@/shared/hooks/use-theme-shadows';
import { Radius, Spacing } from '@/shared/theme/theme';

export type AppAlertDialogProps = {
  entry: ModalAlertEntry;
  onClose: () => void;
};

/**
 * Centered alert dialog with shared visual language.
 */
export function AppAlertDialog({ entry, onClose }: AppAlertDialogProps) {
  const theme = useTheme();
  const shadows = useThemeShadows();
  const buttons = entry.buttons ?? [{ label: 'Entendido', variant: 'primary' as const }];

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
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar diálogo"
          onPress={onClose}
          style={[styles.scrim, { backgroundColor: theme.overlayScrim }]}
        />

        <View
          accessibilityRole="alert"
          style={[
            styles.card,
            shadows.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderSubtle,
            },
          ]}
        >
          <TextHeading variant="section" themeColor="deepOcean">
            {entry.title}
          </TextHeading>
          <TextParagraph variant="secondary" themeColor="textSecondary">
            {entry.message}
          </TextParagraph>

          <View style={styles.actions}>
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
                  style={buttons.length > 1 ? styles.actionButton : undefined}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    minWidth: 120,
  },
});

import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, type ModalProps } from 'react-native';

import type {
  HeaderActionHandlers,
  HeaderActionSpec,
} from '@/shared/components/headers/header-types';
import { HeaderModal } from '@/shared/components/headers/header-modal';
import { ScreenShell } from '@/shared/components/layout/screen-shell';

export type AppModalShellProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  body: ReactNode;
  footer?: ReactNode;
  leadingActions?: readonly HeaderActionSpec[];
  trailingActions?: readonly HeaderActionSpec[];
  onAction?: HeaderActionHandlers;
  animationType?: ModalProps['animationType'];
  presentationStyle?: ModalProps['presentationStyle'];
  keyboardAvoiding?: boolean;
};

const DEFAULT_TRAILING_ACTIONS: readonly HeaderActionSpec[] = ['close'];

/**
 * Canonical full-screen sheet modal used across features and the global modal host.
 */
export function AppModalShell({
  visible,
  onClose,
  title,
  subtitle,
  body,
  footer,
  leadingActions = [],
  trailingActions = DEFAULT_TRAILING_ACTIONS,
  onAction,
  animationType = 'slide',
  presentationStyle = 'pageSheet',
  keyboardAvoiding = false,
}: AppModalShellProps) {
  const resolvedOnAction: HeaderActionHandlers = {
    close: onClose,
    ...onAction,
  };

  const shell = (
    <ScreenShell
      header={
        <HeaderModal
          title={title}
          subtitle={subtitle}
          leadingActions={leadingActions}
          trailingActions={trailingActions}
          onAction={resolvedOnAction}
        />
      }
      body={body}
      footer={footer}
    />
  );

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onClose}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          {shell}
        </KeyboardAvoidingView>
      ) : (
        shell
      )}
    </Modal>
  );
}

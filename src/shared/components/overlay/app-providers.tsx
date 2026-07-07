import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModalHost } from '@/shared/components/overlay/modal-host';
import { ToastHost } from '@/shared/components/overlay/toast-host';

export type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Global app shell providers for overlay UI (toast + modal hosts).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <View style={styles.root}>
      {children}
      <ModalHost />
      <ToastHost />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

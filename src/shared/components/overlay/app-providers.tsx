import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AnalyticsScreenTracker } from '@/core/analytics/analytics-screen-tracker';
import { InitialProfileGate } from '@/features/learn/components/initial-profile-gate';
import { ModalHost } from '@/shared/components/overlay/modal-host';
import { ToastHost } from '@/shared/components/overlay/toast-host';
import { ThemeRoot } from '@/shared/components/theme/theme-root';
import { useDeviceIdentity } from '@/shared/hooks/use-device-identity';

export type AppProvidersProps = {
  children: ReactNode;
  /** When false, the initial profile gate waits (e.g. during launch splash). */
  initialProfileGateEnabled?: boolean;
};

/**
 * Global app shell providers for overlay UI (toast + modal hosts).
 */
export function AppProviders({
  children,
  initialProfileGateEnabled = true,
}: AppProvidersProps) {
  useDeviceIdentity();

  return (
    <ThemeRoot>
      <View className="flex-1">
        <AnalyticsScreenTracker />
        <InitialProfileGate enabled={initialProfileGateEnabled} />
        {children}
        <ModalHost />
        <ToastHost />
      </View>
    </ThemeRoot>
  );
}

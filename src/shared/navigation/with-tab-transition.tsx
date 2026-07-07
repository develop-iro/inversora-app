import type { ReactNode } from 'react';

import { TabScreenTransition } from '@/shared/components/navigation/tab-screen-transition';

export type WithTabTransitionProps = {
  readonly children: ReactNode;
};

/**
 * Wraps a tab screen body with the shared cross-fade transition.
 */
export function WithTabTransition({ children }: WithTabTransitionProps) {
  return <TabScreenTransition>{children}</TabScreenTransition>;
}

/**
 * Wraps a default-export screen component for tab routes.
 */
export function withTabTransition<P extends object>(
  Screen: (props: P) => React.JSX.Element | null,
): (props: P) => React.JSX.Element {
  const WrappedTabScreen = (props: P) => (
    <TabScreenTransition>
      <Screen {...props} />
    </TabScreenTransition>
  );

  WrappedTabScreen.displayName = `WithTabTransition(${Screen.name || 'Screen'})`;

  return WrappedTabScreen;
}

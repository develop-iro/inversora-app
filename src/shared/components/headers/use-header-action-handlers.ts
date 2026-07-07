import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import type { HeaderActionHandlers, HeaderActionId } from '@/shared/components/headers/header-types';
import { routes } from '@/shared/navigation/routes';

/**
 * Supplies default navigation handlers for built-in header actions.
 */
export function useHeaderActionHandlers(
  overrides?: HeaderActionHandlers,
): Required<Pick<HeaderActionHandlers, 'back' | 'learn'>> & HeaderActionHandlers {
  const router = useRouter();

  return useMemo(
    () => ({
      back: () => {
        router.back();
      },
      learn: () => {
        router.push(routes.learn);
      },
      ...overrides,
    }),
    [overrides, router],
  );
}

/**
 * Resolves the press handler for a built-in header action.
 */
export function resolveHeaderActionPress(
  action: HeaderActionId,
  handlers: HeaderActionHandlers,
  override?: () => void,
): (() => void) | undefined {
  if (override) {
    return override;
  }

  const handler = handlers[action];

  if (handler) {
    return handler;
  }

  if (action === 'close' || action === 'sora') {
    return undefined;
  }

  return undefined;
}

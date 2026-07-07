import { Stack } from 'expo-router';

import {
  ROOT_STACK_SCREEN_OPTIONS,
  STACK_PUSH_ANIMATION,
} from '@/shared/navigation/stack-screen-options';

/**
 * Nested stack for fund catalog → detail with native push transitions.
 */
export default function FundsLayout() {
  return (
    <Stack screenOptions={ROOT_STACK_SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen
        name="[isin]"
        options={{
          animation: STACK_PUSH_ANIMATION,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}

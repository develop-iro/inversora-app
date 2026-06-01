import { Stack } from 'expo-router';

export default function FundsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[isin]" />
    </Stack>
  );
}

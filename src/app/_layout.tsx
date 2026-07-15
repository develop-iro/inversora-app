import '@/global.css';
import '@/shared/nativewind/css-interop';

import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initSentry } from '@/core/observability/sentry';

import { AppLaunchSplash } from '@/shared/components/brand/app-launch-splash';
import { AppProviders } from '@/shared/components/overlay';
import { useAppLaunchSplash } from '@/shared/hooks/use-app-launch-splash';
import { useNavigationTheme } from '@/shared/hooks/use-navigation-theme';
import { ROOT_FLOW_SCREEN_OPTIONS, ROOT_STACK_SCREEN_OPTIONS } from '@/shared/navigation/stack-screen-options';

const IS_SERVER_RENDER = typeof window === 'undefined';

initSentry();

SplashScreen.preventAutoHideAsync();

/**
 * Root native stack: tab shell plus push routes (learn, legal) with platform transitions.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });
  const { isLaunchSplashVisible, launchSplashOpacity } = useAppLaunchSplash(fontsLoaded);
  const navigationTheme = useNavigationTheme();

  if (!fontsLoaded && !IS_SERVER_RENDER) {
    return null;
  }

  const showLaunchSplash = isLaunchSplashVisible && !IS_SERVER_RENDER;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <AppProviders initialProfileGateEnabled={!showLaunchSplash}>
          <StatusBar barStyle={showLaunchSplash ? 'light-content' : 'dark-content'} />
          <Stack screenOptions={ROOT_STACK_SCREEN_OPTIONS}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="questionnaire" options={ROOT_FLOW_SCREEN_OPTIONS} />
            <Stack.Screen name="legal" options={ROOT_FLOW_SCREEN_OPTIONS} />
            <Stack.Screen name="feedback" options={ROOT_FLOW_SCREEN_OPTIONS} />
            <Stack.Screen name="rankings" options={ROOT_FLOW_SCREEN_OPTIONS} />
          </Stack>
          {showLaunchSplash ? (
            <AppLaunchSplash opacity={launchSplashOpacity} />
          ) : null}
        </AppProviders>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

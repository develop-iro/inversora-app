import '@/global.css';
import '@/shared/nativewind/css-interop';

import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initSentry } from '@/core/observability/sentry';

import { AppLaunchSplash } from '@/shared/components/brand/app-launch-splash';
import { LAUNCH_SPLASH_BACKGROUND } from '@/shared/components/brand/app-launch-splash.constants';
import { AppProviders } from '@/shared/components/overlay';
import { LAUNCH_SPLASH_FADE_OUT_MS, useAppLaunchSplash } from '@/shared/hooks/use-app-launch-splash';
import { useNavigationTheme } from '@/shared/hooks/use-navigation-theme';
import { ROOT_FLOW_SCREEN_OPTIONS, ROOT_STACK_SCREEN_OPTIONS } from '@/shared/navigation/stack-screen-options';

const IS_SERVER_RENDER = typeof window === 'undefined';

initSentry();

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: LAUNCH_SPLASH_FADE_OUT_MS,
  fade: true,
});

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
  const showLaunchSplash = isLaunchSplashVisible && !IS_SERVER_RENDER;
  const isAppReady = fontsLoaded || IS_SERVER_RENDER;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        {isAppReady ? (
          <AppProviders initialProfileGateEnabled={!showLaunchSplash}>
            <StatusBar barStyle={showLaunchSplash ? 'light-content' : 'dark-content'} />
            <Stack screenOptions={ROOT_STACK_SCREEN_OPTIONS}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="learn" options={ROOT_FLOW_SCREEN_OPTIONS} />
              <Stack.Screen name="legal" options={ROOT_FLOW_SCREEN_OPTIONS} />
              <Stack.Screen name="feedback" options={ROOT_FLOW_SCREEN_OPTIONS} />
              <Stack.Screen name="rankings" options={ROOT_FLOW_SCREEN_OPTIONS} />
            </Stack>
          </AppProviders>
        ) : (
          <View style={{ flex: 1, backgroundColor: LAUNCH_SPLASH_BACKGROUND }} />
        )}
        {showLaunchSplash ? (
          <AppLaunchSplash opacity={launchSplashOpacity} />
        ) : null}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

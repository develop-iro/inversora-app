import '@/global.css';
import '@/shared/nativewind/css-interop';

import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';

import { AppLaunchSplash } from '@/shared/components/brand/app-launch-splash';
import { AppProviders } from '@/shared/components/overlay';
import { useAppLaunchSplash } from '@/shared/hooks/use-app-launch-splash';
import { useNavigationTheme } from '@/shared/hooks/use-navigation-theme';
import { ROOT_FLOW_SCREEN_OPTIONS, ROOT_STACK_SCREEN_OPTIONS } from '@/shared/navigation/stack-screen-options';

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <AppProviders>
        <StatusBar barStyle={isLaunchSplashVisible ? 'light-content' : 'dark-content'} />
        <Stack screenOptions={ROOT_STACK_SCREEN_OPTIONS}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="learn" options={ROOT_FLOW_SCREEN_OPTIONS} />
          <Stack.Screen name="legal" options={ROOT_FLOW_SCREEN_OPTIONS} />
        </Stack>
        {isLaunchSplashVisible ? (
          <AppLaunchSplash opacity={launchSplashOpacity} />
        ) : null}
      </AppProviders>
    </ThemeProvider>
  );
}

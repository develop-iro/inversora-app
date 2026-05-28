import '@/global.css';

import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Nunito_400Regular, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

import { semanticColors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/theme';

SplashScreen.preventAutoHideAsync();

const colors = semanticColors.light;

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    Nunito_400Regular,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar barStyle="dark-content" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: Typography.tab,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            ...(Platform.OS === 'web'
              ? {
                  maxWidth: 480,
                  width: '100%',
                  alignSelf: 'center',
                }
              : null),
          },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
        <Tabs.Screen name="explore" options={{ title: 'Buscar' }} />
      </Tabs>
    </ThemeProvider>
  );
}

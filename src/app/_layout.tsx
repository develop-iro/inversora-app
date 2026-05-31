import "@/global.css";

import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { DefaultTheme, Tabs, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

import { semanticColors } from "@/shared/theme/colors";
import { Typography } from "@/shared/theme/theme";

SplashScreen.preventAutoHideAsync();

const colors = semanticColors.light;

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
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
            ...(Platform.OS === "web"
              ? {
                  maxWidth: 480,
                  width: "100%",
                  alignSelf: "center",
                }
              : null),
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Inicio" }} />
        <Tabs.Screen name="funds" options={{ title: "Fondos" }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </ThemeProvider>
  );
}

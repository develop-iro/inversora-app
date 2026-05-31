import "@/global.css";

import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { DefaultTheme, Tabs, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderLogo } from "@/shared/components/brand/header-logo";
import { FloatingTabBar } from "@/shared/components/navigation/floating-tab-bar";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });
  const insets = useSafeAreaInsets();

  const safeBottomInset =
    Platform.OS === "ios" ? Math.min(Math.max(insets.bottom, 8), 28) : 0;

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
          headerShown: true,
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#FFFFFF",
            borderBottomColor: "rgba(11, 46, 54, 0.06)",
            borderBottomWidth: StyleSheet.hairlineWidth,
            height: 60,
          },
          headerTitleContainerStyle: {
            minWidth: 230,
            alignItems: "center",
          },
        }}
        tabBar={(props) => (
          <FloatingTabBar {...props} bottomInset={safeBottomInset} />
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarAccessibilityLabel: "Ir a Inicio",
          }}
        />
        <Tabs.Screen
          name="funds"
          options={{
            title: "Fondos",
            tabBarAccessibilityLabel: "Explorar fondos",
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favoritos",
            tabBarAccessibilityLabel: "Ver favoritos",
          }}
        />
        <Tabs.Screen
          name="compare"
          options={{
            title: "Comparar",
            tabBarAccessibilityLabel: "Comparar fondos",
          }}
        />
        <Tabs.Screen
          name="calculator"
          options={{
            title: "Calcular",
            tabBarAccessibilityLabel: "Abrir calculadora",
          }}
        />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </ThemeProvider>
  );
}

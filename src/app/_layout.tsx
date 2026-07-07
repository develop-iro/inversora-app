import "@/global.css";

import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { DefaultTheme, Tabs, ThemeProvider, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { Platform, StatusBar, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppHeaderBrand,
  AppHeaderLearnAction,
  useHeaderHorizontalInset,
} from "@/shared/components/brand/app-header-bar";
import { FloatingTabBar } from "@/shared/components/navigation/floating-tab-bar";
import { AppProviders } from "@/shared/components/overlay";
import { isFundDetailPath } from "@/shared/navigation/tab-route-state";
import { semanticColors } from "@/shared/theme/colors";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const segments = useSegments();
  const isFundDetailScreen = useMemo(() => isFundDetailPath(segments), [segments]);
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  });
  const insets = useSafeAreaInsets();

  const safeBottomInset =
    Platform.OS === "ios" ? Math.min(Math.max(insets.bottom, 8), 28) : 0;
  const headerHorizontalInset = useHeaderHorizontalInset();

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
      <AppProviders>
        <StatusBar barStyle="dark-content" />
        <Tabs
        screenOptions={{
          tabBarStyle: {
            display: "none",
            height: 0,
          },
          headerShown: true,
          headerTitle: () => <AppHeaderBrand />,
          headerTitleAlign: "left",
          headerRight: () => <AppHeaderLearnAction />,
          headerTitleContainerStyle: {
            flexGrow: 1,
            flexShrink: 1,
            marginLeft: headerHorizontalInset,
            paddingHorizontal: 0,
            alignItems: "flex-start",
            justifyContent: "center",
          },
          headerLeftContainerStyle: {
            width: 0,
          },
          headerRightContainerStyle: {
            paddingRight: headerHorizontalInset,
            justifyContent: "center",
            alignItems: "center",
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: semanticColors.light.background,
            borderBottomColor: "rgba(11, 46, 54, 0.06)",
            borderBottomWidth: StyleSheet.hairlineWidth,
            height: 64,
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
            headerShown: !isFundDetailScreen,
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
        <Tabs.Screen
          name="learn"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
      </AppProviders>
    </ThemeProvider>
  );
}

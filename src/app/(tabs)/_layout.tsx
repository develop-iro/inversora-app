import { Tabs, useSegments } from 'expo-router';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeaderWithSora } from '@/features/assistant/components/app-header-with-sora';
import { NavTabBar } from '@/shared/components/navigation/nav-tab-bar';
import {
  FUNDS_CATALOG_SCREEN,
  isFundDetailPath,
} from '@/shared/navigation/tab-route-state';

/**
 * Primary tab shell: home, funds stack, favorites, compare, calculator.
 */
export default function TabsLayout() {
  const segments = useSegments();
  const isFundDetailScreen = useMemo(() => isFundDetailPath(segments), [segments]);
  const insets = useSafeAreaInsets();

  const safeBottomInset =
    Platform.OS === 'ios' ? Math.min(Math.max(insets.bottom, 8), 28) : 0;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: 'none',
          height: 0,
        },
        headerShown: true,
        header: () => <AppHeaderWithSora />,
        headerShadowVisible: false,
        headerStyle: {
          height: undefined,
        },
      }}
      tabBar={(props) => <NavTabBar {...props} bottomInset={safeBottomInset} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarAccessibilityLabel: 'Ir a Inicio',
        }}
      />
      <Tabs.Screen
        name="funds"
        listeners={({ navigation }) => ({
          blur: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: FUNDS_CATALOG_SCREEN }],
            });
          },
        })}
        options={{
          title: 'Fondos',
          tabBarAccessibilityLabel: 'Explorar fondos',
          headerShown: !isFundDetailScreen,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarAccessibilityLabel: 'Ver favoritos',
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Comparar',
          tabBarAccessibilityLabel: 'Comparar fondos',
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calcular',
          tabBarAccessibilityLabel: 'Abrir calculadora',
        }}
      />
    </Tabs>
  );
}

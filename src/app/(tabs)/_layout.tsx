import { Tabs, useSegments } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeaderWithSora } from '@/features/assistant/components/app-header-with-sora';
import { NavTabBar, resolveNavTabSafeBottomInset } from '@/shared/components/navigation/nav-tab-bar';
import {
  isFundDetailPath,
} from '@/shared/navigation/tab-route-state';
import { TAB_SCENE_STYLE } from '@/shared/navigation/stack-screen-options';

/**
 * Primary tab shell: home, funds, learn, favorites, compare, calculator.
 *
 * The floating tab bar shows either Aprendizaje (`/learn`) or Favoritos
 * (`/favorites`) in the middle slot — each keeps a dedicated route.
 */
export default function TabsLayout() {
  const segments = useSegments();
  const isFundDetailScreen = useMemo(() => isFundDetailPath(segments), [segments]);
  const insets = useSafeAreaInsets();

  const safeBottomInset = resolveNavTabSafeBottomInset(insets.bottom);

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
        sceneStyle: TAB_SCENE_STYLE,
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
        options={{
          title: 'Fondos',
          tabBarAccessibilityLabel: 'Explorar fondos',
          headerShown: !isFundDetailScreen,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Aprendizaje',
          tabBarAccessibilityLabel: 'Abrir aprendizaje',
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

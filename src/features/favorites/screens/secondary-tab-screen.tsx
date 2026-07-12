import FavoritesScreen from '@/features/favorites/screens/favorites-screen';
import LearnCurriculumScreen from '@/features/learn/screens/learn-curriculum-screen';
import { useSecondaryTabConfig } from '@/features/learn/hooks/use-secondary-tab-config';
import { Spinner } from '@/shared/components/ui';
import { View } from 'react-native';

/**
 * Renders Aprendizaje for beginner profiles or Favoritos for intermediate/advanced users.
 */
function SecondaryTabScreen() {
  const { mode, isLoading } = useSecondaryTabConfig();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner accessibilityLabel="Cargando pestaña secundaria" />
      </View>
    );
  }

  if (mode === 'learn') {
    return <LearnCurriculumScreen />;
  }

  return <FavoritesScreen />;
}

export default SecondaryTabScreen;

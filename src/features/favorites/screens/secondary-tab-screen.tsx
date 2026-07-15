import FavoritesScreen from '@/features/favorites/screens/favorites-screen';
import LearnCurriculumScreen from '@/features/learn/screens/learn-curriculum-screen';
import { useSecondaryTabConfig } from '@/features/learn/hooks/use-secondary-tab-config';

/**
 * Renders Aprendizaje for beginner profiles or Favoritos for intermediate/advanced users.
 *
 * While the educational profile is still resolving, beginners keep Aprendizaje visible
 * (mode resolves to `learn` when `profile` is null) instead of an indefinite spinner.
 */
function SecondaryTabScreen() {
  const { mode, isLoading } = useSecondaryTabConfig();

  if (isLoading || mode === 'learn') {
    return <LearnCurriculumScreen />;
  }

  return <FavoritesScreen />;
}

export default SecondaryTabScreen;

import LearnCurriculumScreen from '@/features/learn/screens/learn-curriculum-screen';
import { withTabTransition } from '@/shared/navigation/with-tab-transition';

/** Beginner curriculum tab at `/learn` (dedicated route, not Favoritos). */
export default withTabTransition(LearnCurriculumScreen);

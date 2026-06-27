import { SoraAnswerCard } from '@/features/assistant/components/sora-answer-card';
import type { HomeSearchAnswer } from '@/features/onboarding/mocks/home-search-answers-mock';

export type HomeSearchAnswerCardProps = {
  query: string;
  answer: HomeSearchAnswer;
};

export function HomeSearchAnswerCard({ query, answer }: HomeSearchAnswerCardProps) {
  return (
    <SoraAnswerCard
      query={query}
      title={answer.title}
      body={answer.body}
      source={answer.source}
      disclaimer={answer.disclaimer}
    />
  );
}

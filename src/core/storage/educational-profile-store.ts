import type {
  EducationalProfile,
  InvestmentHorizon,
  KnowledgeLevel,
  LearningGoal,
  RiskOrientation,
} from '@/core/domain/educational-profile';
import { AppError } from '@/core/errors/app-error';
import { EDUCATIONAL_PROFILE_STORAGE_KEY } from '@/core/storage/educational-profile-storage-key';
import {
  deleteSecureValue,
  migrateLegacyAsyncStorageValue,
  readSecureValue,
  writeSecureValue,
} from '@/core/storage/secure-storage';

type EducationalProfileListener = () => void;

const listeners = new Set<EducationalProfileListener>();

const KNOWLEDGE_LEVELS: KnowledgeLevel[] = ['beginner', 'intermediate', 'advanced'];
const RISK_ORIENTATIONS: RiskOrientation[] = ['conservative', 'moderate', 'dynamic'];
const INVESTMENT_HORIZONS: InvestmentHorizon[] = ['short', 'medium', 'long'];
const LEARNING_GOALS: LearningGoal[] = ['learn-basics', 'learn-compare', 'learn-fees-risk'];

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isKnowledgeLevel(value: unknown): value is KnowledgeLevel {
  return typeof value === 'string' && KNOWLEDGE_LEVELS.includes(value as KnowledgeLevel);
}

function isRiskOrientation(value: unknown): value is RiskOrientation {
  return typeof value === 'string' && RISK_ORIENTATIONS.includes(value as RiskOrientation);
}

function isInvestmentHorizon(value: unknown): value is InvestmentHorizon {
  return typeof value === 'string' && INVESTMENT_HORIZONS.includes(value as InvestmentHorizon);
}

function isLearningGoal(value: unknown): value is LearningGoal {
  return typeof value === 'string' && LEARNING_GOALS.includes(value as LearningGoal);
}

function parseAnswers(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) {
    return null;
  }

  const entries = Object.entries(value);

  if (entries.some(([, answer]) => typeof answer !== 'string')) {
    return null;
  }

  const parsed: Record<string, string> = {};

  for (const [key, answer] of entries) {
    if (typeof answer === 'string') {
      parsed[key] = answer;
    }
  }

  return parsed;
}

function parseEducationalProfile(value: unknown): EducationalProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    knowledgeLevel,
    riskOrientation,
    investmentHorizon,
    learningGoal,
    answers,
    completedAt,
  } = value;

  const parsedAnswers = parseAnswers(answers);

  if (
    !isKnowledgeLevel(knowledgeLevel) ||
    !isRiskOrientation(riskOrientation) ||
    !isInvestmentHorizon(investmentHorizon) ||
    !isLearningGoal(learningGoal) ||
    parsedAnswers === null ||
    typeof completedAt !== 'string'
  ) {
    return null;
  }

  return {
    knowledgeLevel,
    riskOrientation,
    investmentHorizon,
    learningGoal,
    answers: parsedAnswers,
    completedAt,
  };
}

export function subscribeEducationalProfile(listener: EducationalProfileListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const educationalProfileStore = {
  async getProfile(): Promise<EducationalProfile | null> {
    try {
      await migrateLegacyAsyncStorageValue(EDUCATIONAL_PROFILE_STORAGE_KEY);
      const raw = await readSecureValue(EDUCATIONAL_PROFILE_STORAGE_KEY);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as unknown;
      return parseEducationalProfile(parsed);
    } catch (cause) {
      throw new AppError(
        'STORAGE_READ_FAILED',
        'No se pudo leer el perfil educativo.',
        cause,
      );
    }
  },

  async saveProfile(profile: EducationalProfile): Promise<void> {
    try {
      await writeSecureValue(
        EDUCATIONAL_PROFILE_STORAGE_KEY,
        JSON.stringify(profile),
      );
      notifyListeners();
    } catch (cause) {
      throw new AppError(
        'STORAGE_WRITE_FAILED',
        'No se pudo guardar el perfil educativo.',
        cause,
      );
    }
  },

  async clearProfile(): Promise<void> {
    try {
      await deleteSecureValue(EDUCATIONAL_PROFILE_STORAGE_KEY);
      notifyListeners();
    } catch (cause) {
      throw new AppError(
        'STORAGE_WRITE_FAILED',
        'No se pudo borrar el perfil educativo.',
        cause,
      );
    }
  },
};

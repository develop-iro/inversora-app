import type { DiversificationLevel } from '@/core/domain/fund';

export function getDiversificationLabel(level: DiversificationLevel): string {
  switch (level) {
    case 'high':
      return 'Alta';
    case 'low':
      return 'Baja';
    case 'medium':
    default:
      return 'Media';
  }
}

/** Maps Score Inversora to beginner-friendly efficiency label (HU-15). */
export function getEfficiencyLabel(score: number): string {
  if (score >= 90) {
    return 'Líder de categoría';
  }
  if (score >= 75) {
    return 'Muy eficiente';
  }
  if (score >= 50) {
    return 'Consistente';
  }
  if (score >= 30) {
    return 'Mejorable';
  }
  return 'Bajo rendimiento técnico';
}

export function getEfficiencyBadgeVariant(
  score: number,
): 'mint' | 'soft' | 'warning' | 'danger' {
  if (score >= 75) {
    return 'mint';
  }
  if (score >= 50) {
    return 'soft';
  }
  if (score >= 30) {
    return 'warning';
  }
  return 'danger';
}

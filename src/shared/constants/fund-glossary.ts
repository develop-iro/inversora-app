export const FUND_GLOSSARY = {
  annualFee: {
    term: 'Comisión anual',
    explanation:
      'Coste anual del fondo (TER). Cuanto más baja, menos se resta de la rentabilidad bruta. No incluye comisiones de tu banco o bróker.',
  },
  orientativeRisk: {
    term: 'Riesgo orientativo',
    explanation:
      'Indicador simplificado de cuánto puede oscilar el fondo. Bajo suele moverse menos; alto, más. No describe tu tolerancia personal al riesgo.',
  },
  efficiencyLabel: {
    term: 'Etiqueta de eficiencia',
    explanation:
      'Resume el Score Inversora en palabras sencillas según su posición en la categoría. Es orientativa, no una recomendación de compra.',
  },
  inversoraScore: {
    term: 'Score Inversora',
    explanation:
      'Puntuación objetiva de 0 a 100 basada en comisiones, seguimiento del índice, tamaño y antigüedad. La IA solo explica este resultado; no lo calcula.',
  },
  isin: {
    term: 'ISIN',
    explanation:
      'Código internacional que identifica un fondo de forma única, como una matrícula. Sirve para buscarlo en tu bróker.',
  },
  ter: {
    term: 'TER',
    explanation:
      'Total Expense Ratio: comisión total anual del fondo expresada en porcentaje.',
  },
} as const;

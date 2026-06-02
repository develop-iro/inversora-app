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
  benchmark: {
    term: 'Benchmark',
    explanation:
      'Índice de referencia que el fondo intenta replicar. Sirve para comparar si el fondo sigue bien su objetivo de inversión.',
  },
  manager: {
    term: 'Gestora',
    explanation:
      'Entidad que administra el fondo. En fondos indexados suele centrarse en replicar el índice con el menor coste posible.',
  },
  fundAum: {
    term: 'Patrimonio',
    explanation:
      'Dinero total invertido en el fondo o en la clase concreta. Un tamaño razonable suele facilitar liquidez y estabilidad operativa.',
  },
  pastPerformance: {
    term: 'Rentabilidad pasada',
    explanation:
      'Resultado histórico en un periodo concreto. No garantiza resultados futuros; ayuda a entender cómo se ha comportado el fondo.',
  },
  volatility: {
    term: 'Volatilidad',
    explanation:
      'Mide cuánto oscila el valor del fondo. Una volatilidad más alta implica subidas y bajadas más pronunciadas.',
  },
  sharpeRatio: {
    term: 'Ratio de Sharpe',
    explanation:
      'Relaciona la rentabilidad obtenida con la volatilidad asumida. Valores más altos suelen indicar mejor compensación por riesgo, dentro del mismo contexto.',
  },
  maxDrawdown: {
    term: 'Máxima caída',
    explanation:
      'Mayor caída desde un pico hasta un valle en el periodo analizado. Ayuda a imaginar el peor episodio reciente.',
  },
  trackingError: {
    term: 'Tracking error',
    explanation:
      'Desviación respecto al índice de referencia. En fondos indexados, un error bajo suele indicar mejor réplica del benchmark.',
  },
  sectorExposure: {
    term: 'Exposición sectorial',
    explanation:
      'Reparto del fondo entre sectores económicos (tecnología, salud, etc.). Muestra en qué partes de la economía está invertido.',
  },
  fundAvailability: {
    term: 'Disponibilidad en plataformas',
    explanation:
      'Entidades donde el fondo suele poder contratarse en España. La lista es orientativa: comisiones, clases y disponibilidad cambian. Inversora no recibe comisiones ni recomienda dónde invertir.',
  },
} as const;

import type { FeaturedFund } from '@/core/domain/fund';
import type {
  AllocationSlice,
  ExposureTabId,
  FundDetailProfile,
  FundDistributor,
  FundRatioRow,
  FundReturnPeriod,
  FundReturnYear,
  RatioHorizon,
} from '@/core/domain/fund-detail-profile';

import { getFundMarketSnapshotMock } from '@/features/funds/mocks/fund-market-mock';

const MOCK_AS_OF = '2026-05-29';
const MOCK_SOURCE = 'Serie ilustrativa MVP (no cotización en tiempo real)';

function seedFromIsin(isin: string): number {
  let hash = 0;
  for (let i = 0; i < isin.length; i += 1) {
    hash = (hash * 31 + isin.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

function formatAum(millions: number): string {
  return `${millions.toLocaleString('es-ES', { maximumFractionDigits: 1 })}M€`;
}

const SECTORIAL_PRESETS: Record<string, AllocationSlice[]> = {
  IE00B4L5Y983: [
    { label: 'Tecnología', percent: 30.6, icon: 'chip' },
    { label: 'Servicios financieros', percent: 14.8, icon: 'cash-multiple' },
    { label: 'Industriales', percent: 10.7, icon: 'factory' },
    { label: 'Consumo cíclico', percent: 9.0, icon: 'shopping' },
    { label: 'Comunicación', percent: 8.8, icon: 'access-point' },
    { label: 'Salud', percent: 8.4, icon: 'medical-bag' },
    { label: 'Consumo defensivo', percent: 4.8, icon: 'cart-outline' },
    { label: 'Energía', percent: 3.7, icon: 'lightning-bolt' },
    { label: 'Materiales', percent: 3.2, icon: 'cube-outline' },
    { label: 'Servicios públicos', percent: 2.4, icon: 'flash' },
    { label: 'Inmobiliario', percent: 1.7, icon: 'home-city-outline' },
  ],
  IE00B5BMR087: [
    { label: 'Tecnología', percent: 32.1, icon: 'chip' },
    { label: 'Servicios financieros', percent: 13.2, icon: 'cash-multiple' },
    { label: 'Salud', percent: 12.4, icon: 'medical-bag' },
    { label: 'Consumo defensivo', percent: 6.8, icon: 'cart-outline' },
    { label: 'Industriales', percent: 8.1, icon: 'factory' },
    { label: 'Comunicación', percent: 9.5, icon: 'access-point' },
    { label: 'Consumo cíclico', percent: 10.2, icon: 'shopping' },
    { label: 'Energía', percent: 3.9, icon: 'lightning-bolt' },
    { label: 'Otros', percent: 3.8, icon: 'dots-horizontal' },
  ],
};

const ASSET_ALLOCATION_PRESETS: Record<string, AllocationSlice[]> = {
  IE00BYVJRP78: [
    { label: 'Renta variable', percent: 42 },
    { label: 'Renta fija', percent: 48 },
    { label: 'Efectivo y otros', percent: 10 },
  ],
};

function buildReturnsByPeriod(seed: number): FundReturnPeriod[] {
  const base = 8 + pseudoRandom(seed, 1) * 14;
  return [
    { id: 'ytd', label: 'Año actual', percent: Number((base * 0.7).toFixed(2)) },
    { id: '1y', label: 'Un año', percent: Number((base * 2.1).toFixed(2)) },
    { id: '2y', label: '2 años', percent: Number((base * 1.5).toFixed(2)) },
    { id: '3y', label: '3 años', percent: Number((base * 1.6).toFixed(2)) },
    { id: '5y', label: '5 años', percent: Number((base * 0.9).toFixed(2)) },
    { id: '10y', label: '10 años', percent: null },
  ];
}

function buildReturnsByYear(seed: number): FundReturnYear[] {
  const years = [2025, 2024, 2023, 2022, 2021];
  return years.map((year, index) => ({
    year,
    percent: Number((6 + pseudoRandom(seed, year) * 18 - index * 2).toFixed(2)),
  }));
}

function buildRatiosForHorizon(seed: number, horizon: RatioHorizon): FundRatioRow[] {
  const horizonIndex = horizon === '12m' ? 0 : horizon === '3y' ? 1 : 2;
  const returnPct = 12 + pseudoRandom(seed, 10 + horizonIndex) * 18;
  const vol = 8 + pseudoRandom(seed, 20 + horizonIndex) * 8;
  const drawdown = -(2 + pseudoRandom(seed, 30 + horizonIndex) * 6);

  return [
    { id: 'return', label: 'Rentabilidad', value: formatPercent(returnPct) },
    { id: 'volatility', label: 'Volatilidad', value: formatPercent(vol) },
    { id: 'maxDrawdown', label: 'Máxima caída', value: formatPercent(drawdown) },
    { id: 'alpha', label: 'Alpha', value: 'n/a' },
    { id: 'beta', label: 'Beta', value: 'n/a' },
    { id: 'sharpe', label: 'Ratio de Sharpe', value: (1.2 + pseudoRandom(seed, 40) * 1.2).toFixed(2) },
    { id: 'rSquared', label: 'R cuadrado', value: 'n/a' },
    { id: 'trackingError', label: 'Tracking error', value: 'n/a' },
    { id: 'correlation', label: 'Correlación', value: 'n/a' },
    { id: 'infoRatio', label: 'Ratio de información', value: 'n/a' },
  ];
}

function buildGenericSectorial(seed: number): AllocationSlice[] {
  const labels = [
    { label: 'Tecnología', icon: 'chip' },
    { label: 'Financieros', icon: 'cash-multiple' },
    { label: 'Industriales', icon: 'factory' },
    { label: 'Salud', icon: 'medical-bag' },
    { label: 'Otros', icon: 'dots-horizontal' },
  ];
  let remaining = 100;
  return labels.map((item, index) => {
    const isLast = index === labels.length - 1;
    const pct = isLast
      ? remaining
      : Math.round(12 + pseudoRandom(seed, index + 50) * 18);
    remaining -= pct;
    return { ...item, percent: Math.max(5, pct) };
  });
}

function regionsToAllocation(isin: string): AllocationSlice[] {
  return getFundMarketSnapshotMock(isin).regions.map((r) => ({
    label: r.label,
    percent: r.percent,
  }));
}

function buildExposure(isin: string, seed: number): Record<ExposureTabId, AllocationSlice[]> {
  const normalized = isin.toUpperCase();
  const sectorial =
    SECTORIAL_PRESETS[normalized] ?? buildGenericSectorial(seed);
  const regional = regionsToAllocation(isin);
  const assetAllocation =
    ASSET_ALLOCATION_PRESETS[normalized] ?? [
      { label: 'Renta variable', percent: 88 },
      { label: 'Efectivo', percent: 12 },
    ];

  return {
    sectorial,
    regional,
    assetAllocation,
    capitalization: [
      { label: 'Gran capitalización', percent: 72 + Math.round(pseudoRandom(seed, 60) * 8) },
      { label: 'Mediana capitalización', percent: 18 },
      { label: 'Pequeña capitalización', percent: 10 },
    ],
    portfolio: [
      { label: 'Top 10 emisores', percent: 24 + Math.round(pseudoRandom(seed, 61) * 6) },
      { label: 'Resto de la cartera', percent: 76 - Math.round(pseudoRandom(seed, 61) * 6) },
    ],
  };
}

const PROFILE_PRESETS: Partial<
  Record<
    string,
    Pick<
      FundDetailProfile,
      | 'description'
      | 'manager'
      | 'benchmark'
      | 'inceptionDate'
      | 'fundAum'
      | 'classAum'
    >
  >
> = {
  IE00B4L5Y983: {
    description:
      'Fondo indexado que replica el índice MSCI World, invirtiendo en una cartera diversificada de acciones de gran y mediana capitalización de mercados desarrollados. Está pensado para inversores que buscan exposición global a renta variable con costes contenidos.',
    manager: 'Gestora ilustrativa Global Index S.A.',
    benchmark: 'MSCI World NR USD',
    inceptionDate: '20/03/2018',
    fundAum: formatAum(2704.5),
    classAum: formatAum(446.2),
  },
  IE00B5BMR087: {
    description:
      'Fondo que sigue el índice S&P 500, concentrado en las mayores empresas cotizadas de Estados Unidos. Útil para entender el sesgo geográfico USA dentro de una estrategia indexada.',
    manager: 'Gestora ilustrativa US Index S.A.',
    benchmark: 'S&P 500 TR USD',
    inceptionDate: '15/06/2016',
    fundAum: formatAum(1820.3),
    classAum: formatAum(312.8),
  },
  LU1781541179: {
    description:
      'Fondo con enfoque en renta variable europea y criterios de calidad y sostenibilidad en la selección del índice de referencia. Complementa fondos globales con mayor peso regional.',
    manager: 'Gestora ilustrativa Europe Quality S.A.',
    benchmark: 'STOXX Europe 600 Quality',
    inceptionDate: '02/11/2019',
    fundAum: formatAum(890.1),
    classAum: formatAum(124.6),
  },
  IE00BYVJRP78: {
    description:
      'Fondo mixto indexado que combina renta variable y renta fija para reducir la volatilidad respecto a un fondo 100% acciones. Orientado a perfiles que priorizan estabilidad relativa.',
    manager: 'Gestora ilustrativa Balanced Index S.A.',
    benchmark: 'Índice mixto global ilustrativo',
    inceptionDate: '08/09/2017',
    fundAum: formatAum(540.7),
    classAum: formatAum(98.2),
  },
};

function buildSummaryRows(
  fund: FeaturedFund,
  preset: (typeof PROFILE_PRESETS)[string],
): FundDetailProfile['summaryRows'] {
  const p: Partial<NonNullable<(typeof PROFILE_PRESETS)[string]>> = preset ?? {};
  return [
    {
      id: 'manager',
      label: 'Gestora',
      value: p.manager ?? 'Gestora ilustrativa MVP',
      emphasis: 'link',
    },
    {
      id: 'category',
      label: 'Categoría',
      value: fund.categoryLabel,
      emphasis: 'link',
    },
    {
      id: 'benchmark',
      label: 'Benchmark',
      value: p.benchmark ?? 'Índice de referencia ilustrativo',
    },
    { id: 'indexed', label: 'Fondo indexado', value: 'Sí' },
    {
      id: 'fundAum',
      label: 'Patrimonio del fondo',
      value: p.fundAum ?? formatAum(500 + seedFromIsin(fund.isin) % 2000),
    },
    {
      id: 'classAum',
      label: 'Patrimonio de la clase',
      value: p.classAum ?? formatAum(80 + seedFromIsin(fund.isin) % 400),
    },
    {
      id: 'inception',
      label: 'Fecha de inicio',
      value: p.inceptionDate ?? '01/01/2018',
    },
    {
      id: 'currency',
      label: 'Divisa',
      value: fund.isin.startsWith('IE') ? 'EUR' : 'USD',
    },
    {
      id: 'vehicle',
      label: 'Vehículo',
      value: fund.isin.startsWith('LU') ? 'Fondo de inversión' : 'ETF',
    },
  ];
}

const DISTRIBUTOR_PRESETS: Record<string, FundDistributor[]> = {
  IE00B4L5Y983: [
    { id: 'myinvestor', name: 'MyInvestor', kind: 'broker', note: 'Clase acumulación EUR (ilustrativo)' },
    { id: 'indexa', name: 'Indexa Capital', kind: 'broker', note: 'En carteras indexadas' },
    { id: 'renta4', name: 'Renta 4 Banco', kind: 'broker' },
    { id: 'trade-republic', name: 'Trade Republic', kind: 'broker' },
    { id: 'ing', name: 'ING', kind: 'bank', note: 'Según catálogo del banco' },
    { id: 'openbank', name: 'Openbank', kind: 'bank' },
  ],
  IE00B5BMR087: [
    { id: 'myinvestor', name: 'MyInvestor', kind: 'broker' },
    { id: 'renta4', name: 'Renta 4 Banco', kind: 'broker' },
    { id: 'trade-republic', name: 'Trade Republic', kind: 'broker' },
    { id: 'interactive-brokers', name: 'Interactive Brokers', kind: 'broker' },
    { id: 'bbva', name: 'BBVA', kind: 'bank' },
  ],
  IE00BYVJRP78: [
    { id: 'renta4', name: 'Renta 4 Banco', kind: 'broker' },
    { id: 'myinvestor', name: 'MyInvestor', kind: 'broker' },
    { id: 'santander', name: 'Banco Santander', kind: 'bank' },
  ],
  LU1781541179: [
    { id: 'indexa', name: 'Indexa Capital', kind: 'broker' },
    { id: 'myinvestor', name: 'MyInvestor', kind: 'broker' },
    { id: 'openbank', name: 'Openbank', kind: 'bank' },
  ],
};

const DEFAULT_DISTRIBUTORS: FundDistributor[] = [
  { id: 'myinvestor', name: 'MyInvestor', kind: 'broker' },
  { id: 'renta4', name: 'Renta 4 Banco', kind: 'broker' },
  { id: 'ing', name: 'ING', kind: 'bank' },
  { id: 'trade-republic', name: 'Trade Republic', kind: 'broker' },
];

function buildDistributors(isin: string): FundDistributor[] {
  return DISTRIBUTOR_PRESETS[isin.toUpperCase()] ?? DEFAULT_DISTRIBUTORS;
}

function buildFeeRows(fund: FeaturedFund): FundDetailProfile['feeRows'] {
  return [
    { id: 'ter', label: 'Comisión de gestión (TER)', value: formatPercent(fund.terPercent) },
    { id: 'deposit', label: 'Comisión de depositaría', value: 'Incluida en TER (ilustrativo)' },
    { id: 'subscription', label: 'Comisión de suscripción', value: '0%' },
    { id: 'redemption', label: 'Comisión de reembolso', value: '0%' },
    { id: 'performance', label: 'Comisión de éxito', value: 'No aplica' },
  ];
}

export function getFundDetailProfileMock(fund: FeaturedFund): FundDetailProfile {
  const seed = seedFromIsin(fund.isin);
  const preset = PROFILE_PRESETS[fund.isin.toUpperCase()];
  const description =
    preset?.description ??
    `${fund.benefitSummary} Datos ampliados con fines educativos en el MVP de Inversora.`;

  const horizons: RatioHorizon[] = ['12m', '3y', '5y'];
  const ratiosByHorizon = horizons.reduce(
    (acc, horizon) => {
      acc[horizon] = buildRatiosForHorizon(seed, horizon);
      return acc;
    },
    {} as Record<RatioHorizon, FundRatioRow[]>,
  );

  return {
    asOf: MOCK_AS_OF,
    sourceLabel: MOCK_SOURCE,
    description,
    manager: preset?.manager ?? 'Gestora ilustrativa MVP',
    benchmark: preset?.benchmark ?? 'Índice de referencia ilustrativo',
    isIndexed: true,
    fundAum: preset?.fundAum ?? formatAum(500 + seed % 2000),
    classAum: preset?.classAum ?? formatAum(80 + (seed % 400)),
    inceptionDate: preset?.inceptionDate ?? '01/01/2018',
    summaryRows: buildSummaryRows(fund, preset),
    feeRows: buildFeeRows(fund),
    documents: [
      { id: 'kiid', label: 'KIID / Documento de datos fundamentales', status: 'coming_soon' },
      { id: 'annual', label: 'Informe anual del fondo', status: 'coming_soon' },
      { id: 'prospectus', label: 'Folleto informativo', status: 'coming_soon' },
    ],
    returnsByPeriod: buildReturnsByPeriod(seed),
    returnsByYear: buildReturnsByYear(seed),
    currencyNote: '* Calculada en euros',
    methodNote: 'Rentabilidades medias anuales en los periodos superiores a un año.',
    ratiosByHorizon,
    exposureByTab: buildExposure(fund.isin, seed),
    distributors: buildDistributors(fund.isin),
  };
}

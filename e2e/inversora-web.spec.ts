import { expect, test, type Page } from '@playwright/test';

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

async function expectPageToContain(page: Page, expected: string) {
  await expect
    .poll(async () => stripAccents(await page.locator('body').innerText()).toLowerCase())
    .toContain(stripAccents(expected).toLowerCase());
}

async function gotoRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

async function mockRankingsApi(page: Page) {
  const groups = [
    {
      benchmark: 'MSCI World',
      benchmarkKey: 'msci-world',
      total: 2,
      funds: [
        {
          rank: 1,
          id: 'fund-msci-world-a',
          symbol: 'WORLD-A',
          isin: 'ES0000000001',
          name: 'Inversora MSCI World Index',
          score: 91,
          benchmark: 'MSCI World',
          currency: 'EUR',
          riskLevel: 4,
          ter: 0.12,
          returns: { ytd: 4.8, oneYear: 11.2, threeYear: 28.6, asOf: '2026-06-30' },
        },
        {
          rank: 2,
          id: 'fund-msci-world-b',
          symbol: 'WORLD-B',
          isin: 'ES0000000002',
          name: 'Global World Index Clase A',
          score: 84,
          benchmark: 'MSCI World',
          currency: 'EUR',
          riskLevel: 4,
          ter: 0.18,
          returns: { ytd: 3.6, oneYear: 9.4, threeYear: 24.1, asOf: '2026-06-30' },
        },
      ],
    },
    {
      benchmark: 'S&P 500',
      benchmarkKey: 'sp-500',
      total: 1,
      funds: [
        {
          rank: 1,
          id: 'fund-sp500-a',
          symbol: 'SP500-A',
          isin: 'ES0000000003',
          name: 'Inversora S&P 500 Index',
          score: 88,
          benchmark: 'S&P 500',
          currency: 'EUR',
          riskLevel: 5,
          ter: 0.1,
          returns: { ytd: 5.1, oneYear: 12.3, threeYear: 31.4, asOf: '2026-06-30' },
        },
      ],
    },
  ];

  await page.route('**/rankings**', async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.port === '8099') {
      await route.continue();
      return;
    }

    const benchmark = requestUrl.searchParams.get('benchmark');
    const data = benchmark ? groups.filter((group) => group.benchmarkKey === benchmark) : groups;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({
        data,
        meta: {
          totalGroups: groups.length,
          returnedGroups: data.length,
          groupsLimit: groups.length,
          limit: 10,
          hasMoreGroups: false,
          totalEligibleFunds: 3,
        },
      }),
    });
  });
}

async function mockSuggestedComparisonDetailMisses(page: Page) {
  const suggestedIsins = ['IE00B4L5Y983', 'IE00B5BMR087'];

  for (const isin of suggestedIsins) {
    await page.route(`**/funds/${isin}`, async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': '*',
        },
        body: JSON.stringify({
          statusCode: 404,
          message: 'Not found',
        }),
      });
    });
  }
}

test.describe('Inversora web smoke', () => {
  test('web users land on the educational dashboard without the native onboarding gate', async ({ page }) => {
    await gotoRoute(page, '/');

    await expect(page.getByLabel(/Buscar conceptos o fondos/i)).toBeVisible();
    await expectPageToContain(page, 'Inversora no ofrece asesoramiento financiero personalizado');
  });

  test('completes the educational profiling questionnaire and opens suggested catalog filters', async ({
    page,
  }) => {
    await gotoRoute(page, '/learn');

    await page.getByRole('button', { name: /Empezar cuestionario/i }).click();
    await page.getByRole('button', { name: /Continuar/i }).click();

    await page.getByRole('radio', { name: /Mas de 10 anos|Más de 10 años/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /Cubre 4 meses o mas|Cubre 4 meses o más/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /No tengo deuda relevante/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /Estoy empezando/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /Piloto automatico|Piloto automático/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /Aguantaria|Aguantaría/i }).click();
    await page.getByRole('button', { name: /Siguiente/i }).click();

    await page.getByRole('radio', { name: /Como comparar con calma|Cómo comparar con calma/i }).click();
    await page.getByRole('button', { name: /Ver mi perfil/i }).click();

    await expectPageToContain(page, 'perfil orientativo');
    await page.getByRole('button', { name: /catalogo con filtros sugeridos|catálogo con filtros sugeridos/i }).click();

    await expect(page).toHaveURL(/\/funds\?applyProfileHints=true/);
    await expectPageToContain(page, 'Catalogo de fondos');
  });

  test('filters the fund catalog from the draft filter sheet', async ({ page }) => {
    await gotoRoute(page, '/funds');

    await expectPageToContain(page, 'Catalogo de fondos');
    await expectPageToContain(page, 'Resultados educativos');

    await page.getByRole('button', { name: /Abrir filtros del catalogo|Abrir filtros del catálogo/i }).click();
    await expectPageToContain(page, 'Filtros');

    await page.getByRole('tab', { name: /Riesgo Bajo/i }).click();
    await expect(page.getByRole('button', { name: /Ver \d+ fondos?/i })).toBeVisible();
    await page.getByRole('tab', { name: /Score .*80/i }).click();
    await page.getByRole('button', { name: /Mostrar solo fondos recomendados para empezar/i }).click();
    await page.getByRole('button', { name: /Ver fondos|Ver \d+ fondos/i }).click();

    await expect(
      page.getByRole('button', { name: /Filtrar, 3 filtros activos/i }),
    ).toBeVisible();
    await expectPageToContain(page, 'Riesgo bajo');
  });

  test('loads the rankings dashboard and opens a benchmark ranking dashboard', async ({
    page,
  }) => {
    await mockRankingsApi(page);
    await gotoRoute(page, '/rankings');

    await expectPageToContain(page, 'Comparables por indice');
    await expectPageToContain(page, 'MSCI World');
    await expectPageToContain(page, 'S&P 500');
    await expectPageToContain(page, 'Ranking educativo');

    await page.getByRole('button', { name: /Ver ranking de MSCI World/i }).click();

    await expect(page).toHaveURL(/\/rankings\/msci-world/);
    await expectPageToContain(page, 'Ranking comparable');
    await expectPageToContain(page, '2 fondos en el grupo');
    await expectPageToContain(page, 'Inversora MSCI World Index');
    await expectPageToContain(page, 'Score Inversora');
  });

  test('calculates a compound-interest educational simulation', async ({ page }) => {
    await gotoRoute(page, '/calculator');

    await expectPageToContain(page, 'Calcular');
    await expectPageToContain(page, 'Simula el interes compuesto');

    await page.getByLabel(/Balance inicial/i).fill('1000');
    await page.getByLabel(/Aportacion periodica|Aportación periódica/i).fill('150');
    await page.getByLabel(/Tipo de interes anual|Tipo de interés anual/i).fill('5');
    await page.getByLabel(/Duracion|Duración/i).fill('20');
    await page.getByRole('button', { name: /^Calcular$/i }).click();

    await expectPageToContain(page, 'Resultado ilustrativo');
    await expectPageToContain(page, 'Puedes acumular');
    await expect(page.getByRole('button', { name: /Ver detalle anual del balance/i })).toBeVisible();
  });

  test('starts a suggested two-fund comparison and shows comparative results', async ({ page }) => {
    await mockSuggestedComparisonDetailMisses(page);
    await gotoRoute(page, '/compare');

    await expectPageToContain(page, 'Comparar');
    await expectPageToContain(page, 'No es recomendacion de inversion');
    await expectPageToContain(page, 'Comparaciones sugeridas');

    await page
      .getByRole('button', { name: /Cargar comparacion sugerida|Cargar comparación sugerida/i })
      .click();

    await expectPageToContain(page, 'Fondos seleccionados');
    await expectPageToContain(page, '2 fondos en la comparacion');
    await expectPageToContain(page, 'Resultados comparativos');
    await expectPageToContain(page, 'Score Inversora');
    await expectPageToContain(page, 'Aviso educativo');
  });

  test('keeps legal notices available as a critical safety surface', async ({ page }) => {
    await gotoRoute(page, '/legal');

    await expectPageToContain(page, 'Avisos legales');
    await expectPageToContain(page, 'uso educativo de Inversora');
    await expectPageToContain(page, 'Sin asesoramiento personalizado');
    await expectPageToContain(page, 'No es un broker');
  });
});

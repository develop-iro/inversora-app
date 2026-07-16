import { expect, test } from '@playwright/test';

import {
  mockFundsApi,
  mockRankingsApi,
  mockSuggestedComparisonDetailMisses,
} from '../doubles/mock-api';
import { expectPageToContain, gotoRoute } from '../support/page-helpers';

test.describe('Inversora web smoke', () => {
  test('web users land on the educational dashboard without the native onboarding gate', async ({ page }) => {
    await gotoRoute(page, '/');

    await expect(page.getByLabel(/Buscar conceptos o fondos/i)).toBeVisible();
    await expectPageToContain(page, 'Inversora no ofrece asesoramiento financiero personalizado');
  });

  test('opens the dedicated Aprendizaje curriculum tab at /learn', async ({ page }) => {
    await gotoRoute(page, '/learn');

    await expect(page.getByText('Aprendizaje')).toBeVisible();
    await expectPageToContain(page, 'Mini-curriculum');
    await expect(page).toHaveURL(/\/learn$/);
  });

  test('completes the educational profiling questionnaire and opens suggested catalog filters', async ({
    page,
  }) => {
    await mockFundsApi(page);
    await gotoRoute(page, '/questionnaire');

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
    await expect(page.getByRole('button', { name: /^Ir al inicio$/i })).toBeVisible();
    await page.getByRole('button', { name: /catalogo con filtros sugeridos|catálogo con filtros sugeridos/i }).click();

    await expect(page).toHaveURL(/\/funds\?applyProfileHints=true/);
    await expectPageToContain(page, 'Catalogo de fondos');
  });

  test('filters the fund catalog from the draft filter sheet', async ({ page }) => {
    await mockFundsApi(page);
    await gotoRoute(page, '/funds');

    await expectPageToContain(page, 'Catalogo de fondos');
    await expectPageToContain(page, 'Resultados educativos');

    await page.getByRole('button', { name: /Abrir filtros del catalogo|Abrir filtros del catálogo/i }).click();
    await expectPageToContain(page, 'Filtros');

    await page.getByRole('tab', { name: /Riesgo Bajo/i }).click();
    await expect(page.getByRole('button', { name: /Ver \d+ fondos?/i })).toBeVisible();
    await page.getByRole('tab', { name: /Score .*80/i }).click();
    await page.getByRole('button', { name: /Mostrar solo fondos recomendados para empezar/i }).click();
    await page.getByRole('button', { name: /Ver fondos|Ver \d+ fondos?/i }).click();

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

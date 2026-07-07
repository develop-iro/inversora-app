export type LegalSection = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

/**
 * Long-form legal copy for the dedicated `/legal` screen.
 * Source: docs/product/legal-and-disclaimers.md
 */
export const LEGAL_SECTIONS: readonly LegalSection[] = [
  {
    id: 'purpose',
    title: 'Propósito de Inversora',
    body:
      'Inversora es una aplicación informativa y educativa sobre fondos indexados. ' +
      'Ayuda a entender conceptos, comparar métricas objetivas y explorar escenarios ' +
      'ilustrativos. No es un broker, roboadvisor ni servicio de asesoramiento financiero personalizado.',
  },
  {
    id: 'no-advice',
    title: 'Sin asesoramiento personalizado',
    body:
      'Nada de lo que ves en Inversora — rankings, scores, favoritos, comparaciones, ' +
      'calculadora o respuestas del asistente SORA — constituye una recomendación de ' +
      'inversión adaptada a tu situación personal. Debes valorar tu perfil, objetivos y ' +
      'horizonte con fuentes independientes antes de tomar decisiones.',
  },
  {
    id: 'past-performance',
    title: 'Rendimiento pasado',
    body:
      'El rendimiento pasado no garantiza resultados futuros. Los gráficos, rentabilidades ' +
      'históricas y simulaciones de la calculadora son orientativos y pueden basarse en datos ' +
      'parciales o ilustrativos del MVP.',
  },
  {
    id: 'risk',
    title: 'Riesgo de pérdida',
    body:
      'Toda inversión conlleva riesgo, incluida la posible pérdida del capital invertido. ' +
      'Los fondos indexados no están exentos de volatilidad ni de periodos de caída.',
  },
  {
    id: 'data-sources',
    title: 'Fuentes y actualización de datos',
    body:
      'Las métricas, precios y composiciones dependen de proveedores externos y de la ' +
      'sincronización con la API de Inversora. Revisa siempre la fecha de actualización ' +
      'mostrada en cada ficha. Ante datos incompletos o inconsistentes, la app puede ' +
      'mostrar avisos, excluir fondos del ranking o limitar conclusiones.',
  },
  {
    id: 'favorites',
    title: 'Favoritos y comparaciones',
    body:
      'Guardar un fondo en favoritos o añadirlo a una comparación es una herramienta de ' +
      'seguimiento educativo. No implica que Inversora sugiera comprar, vender o mantener ' +
      'ningún producto.',
  },
  {
    id: 'assistant',
    title: 'Asistente SORA',
    body:
      'SORA explica conceptos y resultados en lenguaje llano. No calcula rankings, no inventa ' +
      'métricas y no debe usarse como única base para decisiones de inversión. Evita ' +
      'imperativos del tipo «debes invertir» o garantías de rentabilidad.',
  },
  {
    id: 'privacy',
    title: 'Privacidad en el MVP',
    body:
      'El MVP no requiere registro. Favoritos, perfil educativo y preferencias se guardan de ' +
      'forma local en tu dispositivo salvo que el producto evolucione con cuentas explícitas.',
  },
];

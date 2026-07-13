import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import '@/global.css';

/**
 * Root HTML document for static web rendering.
 * Global CSS must load here so NativeWind tokens are available during SSR.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Inversora</title>
        <meta name="description" content="Educación financiera. Decide con calma: sin prisa, sin recomendaciones personalizadas." />
        <meta property="og:site_name" content="Inversora" />
        <meta property="og:title" content="Inversora" />
        <meta
          property="og:description"
          content="Educación financiera. Decide con calma: sin prisa, sin recomendaciones personalizadas."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inversora--inversora.expo.app/" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/develop-iro/invesora/main/assets/images/splash-icon.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inversora" />
        <meta
          name="twitter:description"
          content="Educación financiera. Decide con calma: sin prisa, sin recomendaciones personalizadas."
        />
        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/develop-iro/invesora/main/assets/images/splash-icon.png"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

# Visión y principios

## Qué es Inversora

Inversora es una aplicación **educativa e informativa** para que personas con poca experiencia financiera exploren y comparen **fondos indexados** con criterios objetivos, lenguaje claro y apoyo del **Asistente Inversora** (capa de IA explicativa).

No ejecuta inversiones, no sustituye a un asesor profesional ni conecta con brokers. El usuario toma decisiones fuera de la app (banco, broker, asesor).

## Cliente

- **Expo / React Native** con soporte **iOS, Android y web** (`react-native-web`).
- El documento oficial habla a veces de “aplicación web”; en este repo el diseño es **mobile-first** con la misma base de código para web.

## Principio rector

**Educar primero, comparar después.**

Implicaciones prácticas:

1. Antes de tablas densas o rankings, ofrecer contexto (modo “Quiero aprender”, explicaciones, perfil orientativo).
2. Mostrar métricas con progresión (tarjeta resumida → ficha → comparación).
3. Dejar claro en todo momento que la información **no es asesoramiento personalizado**.
4. No usar lenguaje de urgencia ni gamificación de decisiones reales de inversión.

## Público objetivo del MVP

- Usuarios **principiantes** y visitantes sin cuenta.
- Perfil educativo **orientativo**, no test MiFID ni recomendación regulada.

## Límites no negociables

| Inversora es | Inversora no es |
|-------------|----------------|
| Herramienta de información y comparación | Broker o roboadvisor |
| Ranking por reglas objetivas y explicables | Recomendación de compra/venta |
| Asistente que explica datos existentes | Generador de métricas o scores |
| Favoritos locales sin cuenta | Cartera real ni custodia |

## Módulos funcionales (visión de producto)

Alineado con la arquitectura funcional del documento oficial:

```text
Dashboard → Catálogo / Buscador → Ficha de fondo
                ↓
         Motor de scoring + validación DQ
                ↓
    Rankings · Destacados · Comparador · Calculadora
                ↓
    Asistente Inversora (explicación) · Favoritos · Avisos legales
```

## Relación con otras docs

- Alcance detallado: [mvp-scope.md](./mvp-scope.md)
- Score y rankings: [scoring.md](./scoring.md)
- IA: [assistant.md](./assistant.md)
- Historias de usuario: [user-stories-index.md](./user-stories-index.md)

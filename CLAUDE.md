@AGENTS.md

## Styling quick reference (NativeWind)

- **Default:** `className` + semantic tokens (`bg-surface`, `text-text-secondary`, `rounded-card`).
- **Compose:** `cn()` · **variants:** `src/shared/nativewind/theme-classes.ts`
- **Third-party colors:** `useTheme()` (icons, `TextInput`, charts).
- **StyleSheet:** only whitelist — `src/shared/nativewind/stylesheet-whitelist.ts`
- **After token changes:** `pnpm run generate:theme`
- **Docs:** `docs/architecture/tailwind-stylesheet-whitelist.md`, `styling-exceptions.md`, `stack-decisions.md`
- **Cursor rule:** `.cursor/rules/nativewind-styling.mdc`

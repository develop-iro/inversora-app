# Copilot instructions for Invesora

Use this repository's main guidance in [AGENTS.md](../AGENTS.md) and [README.md](../README.md) as the default source of truth.

Key points for AI coding agents:

- This is an Expo SDK 56 / React Native app; consult the versioned Expo docs before changing native or routing behavior.
- Keep the route layer in `src/app` thin and place feature work under `src/features/*`.
- Follow the MVP guardrails: educational, informational, non-personalized, and non-broker.
- Verify changes with `npm run lint` when possible.

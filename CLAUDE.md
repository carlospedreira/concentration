# concentration Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-28

## Active Technologies
- TypeScript (strict mode, ES2022 target) + React 18, Tailwind CSS v4, vite-plugin-pwa, Vitest + React Testing Library (002-custom-image-upload)
- In-memory React state (lifted above game cycle); `URL.createObjectURL` for image display URLs (002-custom-image-upload)
- TypeScript (strict mode, ES2022 target) + React 19, Tailwind CSS v4 (`@tailwindcss/vite`), `@fontsource-variable/fredoka` (NEW), `@fontsource-variable/nunito` (NEW) (003-ui-visual-redesign)
- N/A (no storage changes) (003-ui-visual-redesign)
- TypeScript 5.9 (strict mode, ES2022 target) + React 19, Tailwind CSS v4, Vite 7.3 (with `import.meta.glob` for image imports) (004-disney-default-cards)
- N/A (no storage changes — images are bundled static assets) (004-disney-default-cards)
- `localStorage` (new — first persistent storage in the app) (005-persist-grid-size)

- TypeScript (strict mode, ES2022 target) + React 18, Tailwind CSS v4, vite-plugin-pwa (001-core-game-logic)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (strict mode, ES2022 target): Follow standard conventions

## Recent Changes
- 006-optimize-game-layout: Added TypeScript 5.9 (strict mode, ES2022 target) + React 19, Tailwind CSS v4, Vite 7.3
- 005-persist-grid-size: Added TypeScript 5.9 (strict mode, ES2022 target) + React 19, Tailwind CSS v4, Vite 7.3
- 004-disney-default-cards: Added TypeScript 5.9 (strict mode, ES2022 target) + React 19, Tailwind CSS v4, Vite 7.3 (with `import.meta.glob` for image imports)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

# Research: Core Game Logic

**Feature Branch**: `001-core-game-logic`
**Date**: 2026-02-28

## R-001: Styling Approach

**Decision**: Tailwind CSS (v4 with `@tailwindcss/vite` plugin)

**Rationale**:
- Constitution allows CSS Modules or utility-first CSS; Tailwind is the utility-first option.
- Automatic tree-shaking produces ~6-10kB CSS for a small game — smaller than manually pruned CSS Modules.
- Built-in responsive breakpoint system (`sm:`, `md:`, `lg:`) handles the 320px-2560px requirement with minimal code.
- Card flip animations use standard CSS transforms/keyframes — works identically in both approaches, but Tailwind reduces file count.
- Single config file vs. one `.module.css` per component aligns with Simplicity First.
- No runtime JS — compile-time only, satisfying the "no CSS-in-JS runtime" constraint.

**Alternatives considered**:
- CSS Modules: More files to manage, manual media queries, requires TypeScript class name typing setup. Rejected for higher maintenance overhead in a solo/small-team project.

## R-002: Card Symbol Set

**Decision**: Unicode symbols (geometric shapes, arrows, dingbats, misc)

**Rationale**:
- Need at least 50 visually distinct symbols for a 10x10 grid (50 pairs).
- Unicode provides 60+ clearly distinguishable symbols across categories with zero dependencies.
- Native browser rendering — no asset loading, no icon library, works fully offline.
- Aligns with Simplicity First (just a `string[]` constant) and Offline-First (no CDN/fonts needed).

**Symbol categories** (60+ total):
- Geometric: `◆ ○ ▲ ◀ ► ▼ □ ◇ ⬠ ●`
- Arrows: `→ ← ↑ ↓ ↗ ↙ ⇒ ⇐ ⇑ ⇓`
- Math/operators: `✚ ✕ ⊕ ⊗ ◎ ∞ ∑ ∆`
- Dingbats: `★ ☆ ♡ ♢ ♣ ♠ ✎ ✓ ✗ ◉`
- Misc: `⚡ ❖ ✤ ▣ ⬢ ⬡ ◬ ⬣ ⌘ ☀`

**Alternatives considered**:
- Emoji: Inconsistent rendering across platforms/OS versions. Rejected.
- Numbers (1-50): Not visually engaging for a card game. Rejected.
- SVG icon library (Lucide): Adds a dependency for something achievable with zero deps. Rejected per Simplicity First.

## R-003: State Management Pattern

**Decision**: Pure reducer function + custom React hook (`useGameState`) wrapping `useReducer`

**Rationale**:
- Game state is a finite state machine with clear phases: `setup → playing → checking → revealing → complete`.
- A pure reducer `(state, action) => state` is independently testable without React — critical for TDD mandate.
- Discriminated union actions provide exhaustive type checking at compile time (Type Safety principle).
- Custom hook is a thin wrapper — not over-engineered, just encapsulation.
- No external state library needed; React built-in `useReducer` satisfies all requirements.

**State structure**:
- Game phase (discriminated union)
- Board config (rows, cols)
- Cards array (symbol, position, state)
- Selected card indices (0-2)
- Move count
- Timer ID for reveal delay

**Alternatives considered**:
- Multiple `useState`: Scattered state updates risk inconsistency across 6-7 variables. Hard to test game logic in isolation. Rejected.
- `useReducer` + `useContext`: Context adds complexity only needed for deep prop drilling. The component tree is shallow (App → Board → Cards). Rejected per Simplicity First.
- External library (Zustand, Jotai): Adds dependency without demonstrated need. Rejected per Simplicity First.

## R-004: Project Scaffold

**Decision**: `npm create vite@latest -- --template react-ts` with Vitest, Testing Library, and vite-plugin-pwa

**Rationale**:
- Vite + React + TypeScript is the constitution-mandated stack.
- Vitest is Jest-compatible but significantly faster (parallel workers, native ESM).
- `@testing-library/react` + `jsdom` for component testing follows behavior-driven testing best practices.
- `vite-plugin-pwa` is the standard zero-config PWA solution for Vite projects.

**Core dependencies**:
- Runtime: `react`, `react-dom`
- Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `vite-plugin-pwa`, `tailwindcss`, `@tailwindcss/vite`

**tsconfig strict mode**: Single `"strict": true` flag enables all strict checks including `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`, and auto-includes future strict checks.

**Alternatives considered**:
- Create React App: Deprecated. Rejected.
- Next.js: SSR/SSG unnecessary for a client-side game. Adds complexity. Rejected per Simplicity First.

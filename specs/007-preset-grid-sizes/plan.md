# Implementation Plan: Preset Grid Sizes

**Branch**: `007-preset-grid-sizes` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-preset-grid-sizes/spec.md`

## Summary

Replace the free-form rows/cols number inputs on the setup screen with a 3x3 visual grid of 9 predefined board sizes. The selected size is highlighted, persisted across games and browser sessions via localStorage, and used directly when starting a game. This eliminates invalid configurations and reduces setup to a single tap.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3
**Storage**: `localStorage` (adapting existing `grid-storage.ts` from feature 005)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA, offline-capable)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: Instant selection — no network, no computation
**Constraints**: Offline-capable, no new dependencies
**Scale/Scope**: 1 new component, 2-3 modified files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Replaces two number inputs with a simple selection grid. The preset list is a plain const array — no abstraction needed. |
| II. Test-Driven Development | PASS | Tests for the new selector component, updated storage, and setup screen changes. |
| III. Type Safety | PASS | Presets defined as a `readonly` typed array. Storage validates against the preset list. No `any`. |
| IV. Offline-First | PASS | localStorage, no network. |
| V. Progressive Web App | PASS | No impact on PWA compliance. |
| State Management | PASS | React built-in state. The setup screen owns the selected preset index via `useState`. |
| No new dependencies | PASS | Zero new dependencies. |

## Project Structure

### Documentation (this feature)

```text
specs/007-preset-grid-sizes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── setup-screen.tsx           # MODIFY — replace number inputs with GridSizeSelector
│   └── grid-size-selector.tsx     # NEW — 3x3 grid of preset size buttons
├── utils/
│   ├── grid-storage.ts            # MODIFY — store preset index instead of raw rows/cols
│   └── grid-presets.ts            # NEW — GRID_PRESETS constant array and types
├── hooks/
│   └── use-game-state.ts          # MODIFY — adapt save-on-completion to use preset index
└── types/
    └── game.ts                    # NO CHANGE — BoardConfig stays as-is

tests/
├── components/
│   ├── grid-size-selector.test.tsx  # NEW — tests for the selector component
│   └── setup-screen.test.tsx        # MODIFY — update for preset selection
├── utils/
│   ├── grid-presets.test.ts         # NEW — tests for preset data validity
│   └── grid-storage.test.ts        # MODIFY — update for preset index storage
└── hooks/
    └── use-game-state.test.ts       # MODIFY — update save-on-completion tests
```

**Structure Decision**: Single-project structure. Two new files (`grid-presets.ts` for the data, `grid-size-selector.tsx` for the UI component) plus modifications to existing files. The preset data is separate from the component for testability and reuse.

## Complexity Tracking

No constitution violations. Table not needed.

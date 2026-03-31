# Implementation Plan: Persist Grid Size Across Games

**Branch**: `005-persist-grid-size` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-persist-grid-size/spec.md`

## Summary

When a player completes a concentration game, their grid dimensions (rows and columns) should be remembered and pre-populated on the setup screen for their next game. The grid size persists across browser sessions via `localStorage`. The implementation touches three areas: saving the config on game completion, reading it back on setup screen mount, and validating stored data with a fallback to 4x4 defaults.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3
**Storage**: `localStorage` (new — first persistent storage in the app)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA, offline-capable)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: Instant — localStorage reads are synchronous and sub-millisecond
**Constraints**: Offline-capable, no network dependency
**Scale/Scope**: Single preference value (rows + cols)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | localStorage is the simplest viable persistence. No new dependencies. No abstractions — direct read/write. |
| II. Test-Driven Development | PASS | Tests will be written first (unit tests for storage utility, integration tests for setup screen initialization). |
| III. Type Safety | PASS | Stored data will be validated with type narrowing from `unknown`. No `any` usage. |
| IV. Offline-First | PASS | localStorage is fully client-side, works offline. |
| V. Progressive Web App | PASS | No impact on PWA compliance. |
| State Management | PASS | Using React built-in state. The `SetupScreen` already owns rows/cols state — we only change the initial value source. |
| No new dependencies | PASS | Zero new dependencies required. |

## Project Structure

### Documentation (this feature)

```text
specs/005-persist-grid-size/
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
│   └── setup-screen.tsx      # MODIFY — read initial grid size from storage
├── hooks/
│   └── use-game-state.ts     # MODIFY — save grid config to storage on game completion
├── utils/
│   └── grid-storage.ts       # NEW — localStorage read/write/validate for grid size
├── types/
│   └── game.ts               # NO CHANGE — BoardConfig already has rows/cols
└── reducers/
    └── game-reducer.ts        # NO CHANGE

tests/
├── utils/
│   └── grid-storage.test.ts  # NEW — unit tests for storage utility
├── hooks/
│   └── use-game-state.test.ts # MODIFY — add tests for persistence on completion
└── components/
    └── setup-screen.test.ts   # MODIFY — add tests for initial value from storage
```

**Structure Decision**: Single-project structure. Only one new utility file (`grid-storage.ts`) and its test. All other changes are modifications to existing files.

## Complexity Tracking

No constitution violations. Table not needed.

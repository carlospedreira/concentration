# Implementation Plan: Core Game Logic

**Branch**: `001-core-game-logic` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-core-game-logic/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the core game logic for a Concentration (memory card matching) card game. Players configure a board (rows x columns), flip cards to find matching pairs, and track their move count until all pairs are found. The implementation uses a pure reducer state machine for game logic (testable independent of React), React 18 components for the UI, Tailwind CSS for styling, and ships as a PWA.

## Technical Context

**Language/Version**: TypeScript (strict mode, ES2022 target)
**Primary Dependencies**: React 18, Tailwind CSS v4, vite-plugin-pwa
**Storage**: N/A (no persistence in this feature scope)
**Testing**: Vitest + @testing-library/react + jsdom
**Target Platform**: Web (PWA) — responsive 320px to 2560px viewports
**Project Type**: Web application (client-side PWA)
**Performance Goals**: Card flip resolution < 1s (SC-002), game start < 5s (SC-001)
**Constraints**: Offline-capable, installable PWA, Lighthouse PWA >= 90
**Scale/Scope**: Single-player, up to 10x10 grid (50 pairs, 100 cards)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | No external state library. Unicode symbols (zero deps). Tailwind (compile-time only). Pure reducer pattern. |
| II. TDD (NON-NEGOTIABLE) | PASS | Pure reducer is testable without React. Utils are pure functions. Components tested with Testing Library. |
| III. Type Safety | PASS | TypeScript strict mode. Discriminated union actions. Explicit return types on all public functions. |
| IV. Offline-First | PASS | All game logic is client-side. Unicode symbols are native. No network requests for core gameplay. |
| V. PWA | PASS | vite-plugin-pwa for service worker + manifest. Tailwind responsive for 320-2560px. |

### Post-Design Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Data model has 3 entities (Card, BoardConfig, GameState) + 2 enums. 5 actions. No abstractions beyond reducer pattern. |
| II. TDD (NON-NEGOTIABLE) | PASS | game-reducer.ts is a pure function — test with plain assertions, no mocks. validation.ts and board.ts are also pure. |
| III. Type Safety | PASS | Contract file defines all types with `readonly` properties. GameAction is a discriminated union with exhaustive handling. |
| IV. Offline-First | PASS | Symbol pool is a hardcoded constant. No assets to fetch. |
| V. PWA | PASS | vite-plugin-pwa handles service worker generation. Responsive grid via Tailwind breakpoints. |

**Gate result**: PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-game-logic/
├── plan.md              # This file
├── research.md          # Phase 0 output — 4 research decisions
├── data-model.md        # Phase 1 output — entities, state machine, actions
├── quickstart.md        # Phase 1 output — setup instructions + project structure
├── contracts/
│   └── game-reducer.ts  # Phase 1 output — TypeScript interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── game.ts                 # Shared TypeScript types (CardState, GamePhase, etc.)
├── utils/
│   ├── symbols.ts              # Unicode symbol pool constant
│   ├── validation.ts           # BoardConfig validation (pure function)
│   └── board.ts                # Board generation + Fisher-Yates shuffle
├── reducers/
│   └── game-reducer.ts         # Pure game state machine
├── hooks/
│   └── use-game-state.ts       # React hook wrapping useReducer
├── components/
│   ├── setup-screen.tsx        # Board config form (rows/cols input)
│   ├── game-board.tsx          # Card grid layout
│   ├── card.tsx                # Single card with flip animation
│   ├── move-counter.tsx        # Move count display
│   └── completion-screen.tsx   # Game over message + play again
├── App.tsx                     # Root component (phase-based rendering)
├── main.tsx                    # Entry point
└── index.css                   # Tailwind imports

tests/
├── utils/
│   ├── validation.test.ts      # Config validation tests
│   ├── board.test.ts           # Board generation tests
│   └── symbols.test.ts         # Symbol pool tests
├── reducers/
│   └── game-reducer.test.ts    # State machine tests (pure, no React)
├── hooks/
│   └── use-game-state.test.ts  # Hook integration tests
└── components/
    ├── setup-screen.test.tsx   # Config form tests
    ├── game-board.test.tsx     # Board rendering tests
    ├── card.test.tsx           # Card flip behavior tests
    └── completion-screen.test.tsx
```

**Structure Decision**: Single project (no backend). All code lives under `src/` with a flat module structure organized by concern (types, utils, reducers, hooks, components). Tests mirror the src structure under a top-level `tests/` directory. This is the simplest viable structure for a client-side game.

## Complexity Tracking

> No violations detected. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |

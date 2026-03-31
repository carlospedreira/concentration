# Implementation Plan: Quick Replay

**Branch**: `009-quick-replay` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-quick-replay/spec.md`

## Summary

Change the "Play Again" button on the completion screen to start a new game immediately with the same grid size and images, bypassing the setup screen. Add a secondary "Change Size" link to return to setup. In `App.tsx`, wire `onPlayAgain` to call `startGame` with the current config and image URLs instead of `reset`.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3
**Storage**: N/A (no storage changes)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA, offline-capable)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: Instant — no network, just re-generate board
**Constraints**: Offline-capable, no new dependencies
**Scale/Scope**: 2 files modified (App.tsx, completion-screen.tsx), 0 new files

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Minimal change — modify 2 existing files. No new abstractions. |
| II. Test-Driven Development | PASS | Tests for completion screen callbacks and App integration. |
| III. Type Safety | PASS | Add `onChangeSize` callback prop to CompletionScreen with explicit type. |
| IV. Offline-First | PASS | No network dependency. |
| V. Progressive Web App | PASS | No impact. |
| State Management | PASS | Uses existing `startGame` and `reset` functions. No new state. |
| No new dependencies | PASS | Zero new dependencies. |

## Project Structure

### Documentation (this feature)

```text
specs/009-quick-replay/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                            # MODIFY — wire onPlayAgain to startGame, onChangeSize to reset
├── components/
│   └── completion-screen.tsx          # MODIFY — add onChangeSize prop, add secondary link
└── hooks/
    └── use-game-state.ts              # NO CHANGE

tests/
├── components/
│   └── completion-screen.test.tsx     # MODIFY — test both callbacks
```

**Structure Decision**: Two file modifications only. The game state hook and reducer need no changes — `startGame` already supports being called again to start a fresh game.

## Design Approach

### App.tsx Changes

Currently: `onPlayAgain={reset}` (goes to setup screen)

After:
- `onPlayAgain` calls `startGame(state.config, images.map(img => img.url))` — starts fresh game with same size and images
- `onChangeSize` calls `reset` — goes to setup screen as before

### CompletionScreen Changes

- Add `onChangeSize: () => void` prop
- Keep "Play Again" as the primary prominent button (triggers `onPlayAgain`)
- Add "Change Size" as a secondary text link/button below (triggers `onChangeSize`)

## Complexity Tracking

No constitution violations. Table not needed.

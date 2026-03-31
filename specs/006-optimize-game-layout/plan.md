# Implementation Plan: Optimize Game Layout

**Branch**: `006-optimize-game-layout` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-optimize-game-layout/spec.md`

## Summary

The game board is capped at `max-w-2xl` (672px) regardless of grid size, wasting most of the viewport on larger grids. The fix replaces this fixed cap with a dynamic maximum width that scales with the number of columns — larger grids get more space, smaller grids stay compact. A shared container wrapper in `App.tsx` provides consistent centering and padding across all screens.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3
**Storage**: N/A (no storage changes)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA, offline-capable)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: Fluid responsive layout — no jank on resize
**Constraints**: Offline-capable, CSS-only layout (no JS layout calculations)
**Scale/Scope**: 3 components modified, 0 new files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | CSS-only changes. No new dependencies, libraries, or abstractions. Dynamic max-width via inline style (already used for `gridTemplateColumns`). |
| II. Test-Driven Development | PASS | Existing component tests verify rendering. Layout tests will verify the container structure and dynamic max-width. |
| III. Type Safety | PASS | Minimal TS changes — only adding a `cols` prop type where needed. |
| IV. Offline-First | PASS | No network dependency. Pure CSS layout. |
| V. Progressive Web App | PASS | Responsive layout improvements align with PWA responsiveness requirements. |
| State Management | PASS | No state changes. Layout is purely presentational. |
| No new dependencies | PASS | Zero new dependencies. |

## Project Structure

### Documentation (this feature)

```text
specs/006-optimize-game-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                        # MODIFY — add shared container wrapper
├── components/
│   ├── game-board.tsx             # MODIFY — replace fixed max-w-2xl with dynamic max-width
│   ├── setup-screen.tsx           # MODIFY — adjust to work within shared container
│   └── completion-screen.tsx      # MODIFY — adjust to work within shared container
└── index.css                      # NO CHANGE

tests/
├── components/
│   ├── game-board.test.tsx        # MODIFY — add layout tests
│   ├── setup-screen.test.tsx      # VERIFY — existing tests still pass
│   └── completion-screen.test.tsx # VERIFY — existing tests still pass
```

**Structure Decision**: Single-project structure. No new files — all changes are modifications to existing components. The layout fix is purely CSS/className changes with one small dynamic style calculation.

## Design Approach

### Dynamic Board Width Strategy

Instead of a fixed `max-w-2xl` for all grids, compute a maximum width based on column count:

- **Target card size**: ~80-100px per card on desktop, with gaps
- **Formula**: `maxWidth = cols * cardBaseSize + (cols - 1) * gapSize + containerPadding`
- **Cap**: Never exceed a sensible maximum (e.g., 1200px) to handle ultra-wide monitors
- **Floor**: Never go below the current `max-w-sm` (384px) for tiny grids

This is implemented as an inline `style` on the game board grid container (the same pattern already used for `gridTemplateColumns`), keeping it simple and avoiding CSS class proliferation.

### Shared Container

Wrap all screen content in `App.tsx` with a container that provides:
- Centered layout (`mx-auto`)
- Responsive horizontal padding (`px-4 sm:px-6 lg:px-8`)
- A sensible overall max-width (`max-w-6xl` = 1152px)
- Full-height layout (`min-h-screen`)

Individual screens keep their own internal max-width constraints (e.g., setup form stays `max-w-sm`).

## Complexity Tracking

No constitution violations. Table not needed.

# Implementation Plan: Dark Theme

**Branch**: `008-dark-theme` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-dark-theme/spec.md`

## Summary

Replace the current bright light theme with a dark color scheme. Update all design tokens in `index.css` (`@theme` block) to dark-mode values — dark backgrounds, light text, adjusted card colors, adapted shadows to glow-style effects. Then audit all component classes for hardcoded light-mode colors and update them to use the design token system or dark-appropriate values.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3
**Storage**: N/A (no storage changes)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA, offline-capable)
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: No performance impact — CSS-only changes
**Constraints**: WCAG AA contrast ratios, offline-capable
**Scale/Scope**: 1 CSS file (design tokens) + 4-5 component files (class adjustments)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Update existing design tokens in place. No new theme system, no toggle, no abstraction. |
| II. Test-Driven Development | PASS | Existing component tests verify rendering. Visual theme is tested by snapshot/structural tests and manual verification. |
| III. Type Safety | PASS | No TypeScript changes — purely CSS/className updates. |
| IV. Offline-First | PASS | No network dependency. Pure CSS. |
| V. Progressive Web App | PASS | Theme color in manifest may need updating for dark theme. |
| No new dependencies | PASS | Zero new dependencies. |

## Project Structure

### Documentation (this feature)

```text
specs/008-dark-theme/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── index.css                          # MODIFY — update all @theme design tokens to dark values
├── components/
│   ├── card.tsx                       # MODIFY — adjust any hardcoded light-mode colors
│   ├── setup-screen.tsx               # MODIFY — adjust hardcoded colors (amber, red, white)
│   ├── completion-screen.tsx          # MODIFY — adjust hardcoded colors
│   ├── game-board.tsx                 # VERIFY — may need minor adjustments
│   ├── grid-size-selector.tsx         # MODIFY — adjust selected/unselected button colors
│   ├── move-counter.tsx               # VERIFY — may need adjustment
│   └── image-upload-panel.tsx         # VERIFY — may need adjustment
└── App.tsx                            # VERIFY — container classes

tests/
├── components/
│   └── *.test.tsx                     # VERIFY — existing tests should still pass
```

**Structure Decision**: Single-project structure. The primary change is in `index.css` (design tokens). Component files get minimal class adjustments where they use hardcoded colors outside the design token system.

## Design Approach

### Dark Theme Color Palette

The dark palette preserves the same color families (violet brand, teal cards, amber celebrations) but shifts them for dark backgrounds:

- **Surfaces**: Dark grays/slate (luminance ~10-15%) instead of cream/white
- **Text**: Light gray/white instead of dark gray/black
- **Brand (violet)**: Lightened for contrast on dark — 300-400 shades become primary
- **Card backs (teal)**: Slightly more saturated to pop against dark backgrounds
- **Matched (amber)**: Glow-based effects instead of background tints
- **Shadows**: Replaced with subtle light borders or glow effects (dark-on-dark shadows are invisible)

### Token Mapping Strategy

Each existing token gets a dark equivalent:
- `--color-surface`: dark (e.g., oklch(14% ...))
- `--color-surface-raised`: slightly lighter dark (e.g., oklch(18% ...))
- `--color-text-primary`: near-white
- `--color-text-secondary`: medium gray
- Shadows shift from `rgb(0 0 0 / ...)` to subtle light glows or solid borders

## Complexity Tracking

No constitution violations. Table not needed.

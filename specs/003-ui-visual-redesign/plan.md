# Implementation Plan: UI Visual Redesign

**Branch**: `003-ui-visual-redesign` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ui-visual-redesign/spec.md`

## Summary

Transform the concentration game from a default-Tailwind, indigo-only UI into a polished, distinctive visual experience. The approach uses Tailwind CSS v4's native `@theme` design token system for a cohesive color palette and typography (Fredoka + Nunito, self-hosted), CSS 3D transforms for realistic card flip animations, CSS-only celebration effects (matched-card glow/pop, victory particle bursts), and entrance animations for screen transitions. All changes are purely visual (FR-010) — no game logic modifications. Two new npm dependencies (font packages, ~54KB bundled) are the only additions.

## Technical Context

**Language/Version**: TypeScript (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4 (`@tailwindcss/vite`), `@fontsource-variable/fredoka` (NEW), `@fontsource-variable/nunito` (NEW)
**Storage**: N/A (no storage changes)
**Testing**: Vitest + React Testing Library (existing test suite must pass unchanged)
**Target Platform**: PWA — browsers 320px–2560px, offline-capable after first load
**Project Type**: Single-page web application (PWA)
**Performance Goals**: Card flip animations < 600ms (SC-005), interactive feedback < 100ms (SC-007), 60fps during animations
**Constraints**: Offline-capable (fonts self-hosted), no JS animation libraries, `prefers-reduced-motion` respected (SC-006)
**Scale/Scope**: 3 screens (setup, game board, completion), 7 components modified, 1 CSS file for all design tokens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate (Phase 0 entry)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | Pure CSS approach — no animation libraries, no new abstractions. Design tokens in single CSS file. |
| II. Test-Driven Development | PASS WITH NOTE | This is a purely visual/CSS redesign (FR-010). Existing tests verify all game behavior and component rendering. CSS styling changes are not "feature code" in the TDD sense — they don't alter observable behavior that automated tests can assert against. All existing tests MUST continue to pass. |
| III. Type Safety | PASS | No TypeScript changes — purely CSS/className modifications. |
| IV. Offline-First | PASS | Fonts self-hosted via `@fontsource-variable` npm packages, bundled by Vite, precached by service worker. Zero external network requests. |
| V. Progressive Web App | PASS | Responsive design maintained (320px–2560px). Font assets cached by existing service worker. No impact on Lighthouse PWA score. |

### New Dependencies Justification (Principle I)

| Dependency | Size | Justification | Alternatives Rejected |
|-----------|------|---------------|----------------------|
| `@fontsource-variable/fredoka` | ~22KB woff2 | Distinctive display font required by spec (FR-002, SC-001) — "recognizable personality" | System fonts only: inconsistent across OS, doesn't meet "distinctive visual identity" requirement |
| `@fontsource-variable/nunito` | ~32KB woff2 | Legible body font with rounded character matching game aesthetic | System fonts only: same limitation. Google Fonts CDN: violates Offline-First (Principle IV) |

### Post-Design Gate (Phase 1 re-check)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | No abstractions added. All tokens in one CSS file. Custom utilities (`@layer utilities`) are 4 one-line declarations. Two font packages are the only new dependencies. |
| II. Test-Driven Development | PASS | Existing test suite is the verification gate. No new testable behavior introduced (visual styling is not unit-testable). |
| III. Type Safety | PASS | Zero type changes. Component props unchanged. |
| IV. Offline-First | PASS | Font woff2 files bundled into Vite output, precached by `vite-plugin-pwa` workbox. Verified: fontsource packages are imported as CSS which Vite resolves at build time. |
| V. Progressive Web App | PASS | Responsive contract maintained. `prefers-reduced-motion` fully respected. |

## Project Structure

### Documentation (this feature)

```text
specs/003-ui-visual-redesign/
├── plan.md              # This file
├── research.md          # Phase 0: research findings
├── data-model.md        # Phase 1: design token schema
├── quickstart.md        # Phase 1: dev setup guide
├── contracts/
│   └── ui-contracts.md  # Phase 1: visual state contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── index.css                    # MODIFY: design tokens (@theme), custom utilities, font imports, keyframes, reduced-motion
├── main.tsx                     # NO CHANGE
├── App.tsx                      # NO CHANGE (game logic routing)
├── components/
│   ├── card.tsx                 # MODIFY: 3D flip structure, state-specific styling, matched celebration
│   ├── game-board.tsx           # MODIFY: updated grid styling, screen entrance animation
│   ├── setup-screen.tsx         # MODIFY: themed form controls, visual hierarchy, entrance animation
│   ├── completion-screen.tsx    # MODIFY: celebration effects, trophy animation, particle bursts
│   ├── move-counter.tsx         # MODIFY: display font, updated styling
│   └── image-upload-panel.tsx   # MODIFY: themed thumbnails, styled controls
├── types/
│   └── game.ts                  # NO CHANGE
├── hooks/
│   └── use-game-state.ts        # NO CHANGE
├── reducers/
│   └── game-reducer.ts          # NO CHANGE
└── utils/
    ├── board.ts                 # NO CHANGE
    ├── symbols.ts               # NO CHANGE
    ├── validation.ts            # NO CHANGE
    └── image-validation.ts      # NO CHANGE

tests/                           # NO CHANGE (all existing tests must pass)
```

**Structure Decision**: Existing single-project structure is preserved. This feature modifies only `src/index.css` and 6 component files. No new source files are created. The design token system lives entirely in `src/index.css` via Tailwind v4's `@theme` block — consistent with the project's existing pattern of a single CSS entry point.

## Complexity Tracking

> No constitution violations to justify. All principles pass cleanly.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)* | — | — |

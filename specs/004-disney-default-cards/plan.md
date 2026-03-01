# Implementation Plan: Emoji Default Cards

**Branch**: `004-disney-default-cards` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-disney-default-cards/spec.md`

## Summary

Replace the default geometric symbol card faces (◆, ○, ▲, etc.) with bundled Apple emoji images. The card component already supports image rendering via the `imageUrl` field — this feature populates that field with emoji images during board generation instead of leaving it empty for symbol-only cards. Custom uploads remain highest priority; emoji images serve as the new default; geometric symbols become the tertiary fallback for boards exceeding the emoji pool.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, ES2022 target)
**Primary Dependencies**: React 19, Tailwind CSS v4, Vite 7.3 (with `import.meta.glob` for image imports)
**Storage**: N/A (no storage changes — images are bundled static assets)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (PWA — mobile and desktop browsers)
**Project Type**: Web application (single-page PWA)
**Performance Goals**: Card images load within normal game start time; no perceptible delay vs. symbols
**Constraints**: Offline-capable (all assets bundled); total emoji image budget < 1MB
**Scale/Scope**: 36+ emoji images to cover max board size (10×10 = 50 pairs, with symbols as overflow fallback)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Assessment |
|-----------|--------|------------|
| **I. Simplicity First** | PASS | No new abstractions. Reuses existing `imageUrl` field on `Card`. No new dependencies. Single new utility module (`emoji-characters.ts`) mirrors existing `symbols.ts` pattern. |
| **II. TDD** | GATE | Tests must be written and approved before implementation. Test plan defined in quickstart.md. |
| **III. Type Safety** | PASS | New `EmojiCharacter` interface with `readonly` fields. No `any` types. Explicit return types on all functions. |
| **IV. Offline-First** | PASS | All emoji images bundled as static assets via Vite. Zero network requests for gameplay. |
| **V. PWA** | PASS | Static assets auto-cached by service worker via vite-plugin-pwa. Total image budget ~720KB (36 images × ~20KB WebP). Well within PWA cache limits. |

**Post-Phase 1 re-check**: All principles still satisfied. The design adds no new architectural patterns, no external dependencies, and no runtime network calls. Image fallback handling (onError → show emoji name) is minimal and targeted.

## Project Structure

### Documentation (this feature)

```text
specs/004-disney-default-cards/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: research decisions
├── data-model.md        # Phase 1: entity definitions
├── quickstart.md        # Phase 1: implementation overview
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── assets/
│   └── emoji/               # NEW: 36+ emoji images (*.webp, 200×200px)
├── components/
│   └── card.tsx             # MODIFIED: add onError fallback for <img>
├── utils/
│   ├── board.ts             # MODIFIED: use emoji images as default
│   ├── emoji-characters.ts  # NEW: emoji metadata + glob import + selection
│   └── symbols.ts           # UNCHANGED: tertiary fallback
└── types/
    └── game.ts              # UNCHANGED: Card interface already has imageUrl?

tests/
├── utils/
│   ├── emoji-characters.test.ts  # NEW: emoji pool + random selection tests
│   └── board.test.ts              # MODIFIED: add emoji default test cases
└── components/
    └── card.test.tsx              # MODIFIED: add image error fallback test
```

**Structure Decision**: Single project structure (existing). Two new files (`emoji-characters.ts` + asset directory) and two modified files (`board.ts` + `card.tsx`). No structural changes to the project layout.

## Complexity Tracking

> No constitution violations. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

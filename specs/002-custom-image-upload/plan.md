# Implementation Plan: Custom Image Upload

**Branch**: `002-custom-image-upload` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-custom-image-upload/spec.md`

## Summary

Allow players to upload custom images as card faces instead of default Unicode symbols. Images are managed entirely client-side using browser-native `URL.createObjectURL` for display and React state for session persistence. The existing `Card` type gains an optional `imageUrl` field; the board generation logic selects uploaded images first, then fills remaining pairs with random symbols. A new `ImageUploadPanel` component on the setup screen provides file selection, preview, removal, and reorder controls.

## Technical Context

**Language/Version**: TypeScript (strict mode, ES2022 target)
**Primary Dependencies**: React 18, Tailwind CSS v4, vite-plugin-pwa, Vitest + React Testing Library
**Storage**: In-memory React state (lifted above game cycle); `URL.createObjectURL` for image display URLs
**Testing**: Vitest with jsdom environment, React Testing Library, user-event
**Target Platform**: Web (PWA, offline-capable, viewports 320px–2560px)
**Project Type**: Single-page web application (PWA)
**Performance Goals**: Upload + preview within 15 seconds of file selection (SC-001); consistent card rendering at 60fps
**Constraints**: Client-side only (no server uploads), 5MB max per image, offline-capable after initial load
**Scale/Scope**: Single user, max 10×10 board (50 pairs), browser session persistence only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First** | ✅ PASS | No new runtime dependencies. Uses browser-native APIs (`URL.createObjectURL`, `File` API, `<input type="file">`). Reordering via simple move-up/move-down buttons rather than a DnD library. Image display via CSS `object-fit: cover` — no canvas manipulation. |
| **II. Test-Driven Development** | ✅ PASS | All new logic (image validation, board generation with images, image collection management) will have tests written before implementation. Component tests for upload panel, extended card rendering. |
| **III. Type Safety** | ✅ PASS | New `UploadedImage` interface with strict types. `Card` extended with optional `imageUrl`. All public functions have explicit return types. No `any` usage. |
| **IV. Offline-First** | ✅ PASS | All image processing client-side. No network requests for upload/storage. Images stored as blob URLs in browser memory. |
| **V. Progressive Web App** | ✅ PASS | No impact on PWA capability. Uploaded images are session-only (not cached by service worker), which is the expected behavior per spec. |

**Gate result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-custom-image-upload/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── setup-screen.tsx          # MODIFIED — integrates ImageUploadPanel
│   ├── card.tsx                  # MODIFIED — renders image or symbol
│   ├── image-upload-panel.tsx    # NEW — upload, preview, remove, reorder UI
│   ├── game-board.tsx            # unchanged
│   ├── move-counter.tsx          # unchanged
│   └── completion-screen.tsx     # unchanged
├── hooks/
│   └── use-game-state.ts         # MODIFIED — accepts images param in startGame
├── reducers/
│   └── game-reducer.ts           # MODIFIED — START_GAME accepts images
├── types/
│   └── game.ts                   # MODIFIED — add UploadedImage, extend Card
├── utils/
│   ├── board.ts                  # MODIFIED — generateBoard accepts images
│   ├── image-validation.ts       # NEW — file type/size validation
│   ├── symbols.ts                # unchanged
│   └── validation.ts             # unchanged
├── App.tsx                       # MODIFIED — lifts image state above game cycle
├── main.tsx                      # unchanged
└── index.css                     # unchanged

tests/
├── components/
│   ├── card.test.tsx             # MODIFIED — add image rendering tests
│   ├── setup-screen.test.tsx     # MODIFIED — add image upload integration tests
│   └── image-upload-panel.test.tsx  # NEW — upload panel unit tests
├── hooks/
│   └── use-game-state.test.ts    # MODIFIED — test with images
├── reducers/
│   └── game-reducer.test.ts      # MODIFIED — test START_GAME with images
└── utils/
    ├── board.test.ts             # MODIFIED — test mixed image+symbol boards
    └── image-validation.test.ts  # NEW — validation unit tests
```

**Structure Decision**: Extends existing single-project structure. New files limited to `image-upload-panel.tsx` component and `image-validation.ts` utility. All other changes are modifications to existing files. No new directories needed.

## Complexity Tracking

> No constitution violations to justify — all principles pass cleanly.

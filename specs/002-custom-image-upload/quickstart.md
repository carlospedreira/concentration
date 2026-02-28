# Quickstart: Custom Image Upload

**Feature**: 002-custom-image-upload
**Date**: 2026-02-28

## Prerequisites

- Node.js >= 20 (LTS)
- npm (lock file committed)
- Existing codebase on branch `002-custom-image-upload`

## Dev Environment

```bash
npm install        # Install dependencies (no new deps for this feature)
npm run dev        # Start dev server at localhost:5173
npm test           # Run all tests
npm run test:watch # Watch mode for TDD
```

## What This Feature Changes

**New files** (2):
- `src/components/image-upload-panel.tsx` — Upload, preview, remove, reorder UI
- `src/utils/image-validation.ts` — File type and size validation

**Modified files** (8):
- `src/types/game.ts` — Add `UploadedImage` interface, extend `Card` with `imageUrl`
- `src/utils/board.ts` — `generateBoard` accepts optional image URLs
- `src/components/card.tsx` — Render `<img>` when `imageUrl` present
- `src/components/setup-screen.tsx` — Integrate `ImageUploadPanel`, show pair count messaging
- `src/hooks/use-game-state.ts` — Pass images through to board generation
- `src/reducers/game-reducer.ts` — `START_GAME` action accepts images
- `src/App.tsx` — Lift image collection state, pass to setup screen

**New test files** (2):
- `tests/components/image-upload-panel.test.tsx`
- `tests/utils/image-validation.test.ts`

## TDD Workflow (Constitution Principle II)

For each unit of work:

1. **Red**: Write a failing test for the new behavior
2. **Green**: Write minimum code to make the test pass
3. **Refactor**: Clean up while keeping tests green

Suggested order (matches dependency graph):

```
1. image-validation.ts    (pure function, no dependencies)
2. types/game.ts          (type definitions — no tests needed, checked by tsc)
3. board.ts               (extend generateBoard — depends on types)
4. game-reducer.ts        (extend START_GAME — depends on board)
5. use-game-state.ts      (pass images through — depends on reducer)
6. card.tsx               (render image — depends on types)
7. image-upload-panel.tsx  (upload UI — depends on validation + types)
8. setup-screen.tsx        (integrate panel — depends on upload panel)
9. App.tsx                 (lift state — depends on setup screen)
```

## Key Implementation Decisions

| Decision | Approach | Reference |
|----------|----------|-----------|
| Image loading | `URL.createObjectURL(file)` | research.md R-001 |
| Image display on cards | CSS `object-fit: cover` | research.md R-002 |
| Image reordering | Move up/down buttons | research.md R-003 |
| Session persistence | React state in App.tsx | research.md R-004 |
| File validation | `File.type` + `File.size` checks | research.md R-005 |
| Card type change | Optional `imageUrl` field | research.md R-006 |
| Board generation | Images first, then symbols | research.md R-007 |

## Verify

```bash
npm test              # All tests pass
npm run lint          # TypeScript compiles with zero errors
```

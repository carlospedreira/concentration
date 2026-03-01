# Quickstart: Emoji Default Cards

**Feature**: 004-disney-default-cards
**Date**: 2026-02-28

## What This Feature Does

Replaces the default geometric symbol card faces (◆, ○, ▲, etc.) with Apple emoji images. When a player starts a game without uploading custom images, they see emoji images instead. Custom uploads still take priority when provided.

## Files to Create

| File | Purpose |
|------|---------|
| `src/assets/emoji/*.webp` | 36+ emoji images (200×200px WebP) |
| `src/utils/emoji-characters.ts` | Emoji metadata + Vite glob import + random selection |

## Files to Modify

| File | Change |
|------|--------|
| `src/utils/board.ts` | Use emoji images as default instead of symbols-only |
| `src/components/card.tsx` | Add `onError` handler for image load fallback |

## Files Unchanged

| File | Why |
|------|-----|
| `src/types/game.ts` | Card interface already has `imageUrl?` — no type changes |
| `src/utils/symbols.ts` | Kept as tertiary fallback for overflow boards |
| `src/reducers/game-reducer.ts` | Game state machine unchanged |
| `src/hooks/use-game-state.ts` | Hook logic unchanged |

## Priority Chain

```
Custom Uploads → Emoji Images → Geometric Symbols
  (user images)    (36+ bundled)    (60+ Unicode)
```

## Key Implementation Notes

1. **No new dependencies** — Vite's `import.meta.glob` handles image imports natively.
2. **No Card type changes** — Emoji images use the existing `imageUrl` field.
3. **No state machine changes** — Board generation is the only logic that changes.
4. **Images are Apple emoji** — Place WebP files in `src/assets/emoji/` with kebab-case names matching the emoji manifest.

## Test Strategy

- Unit tests for `getDefaultImages()` random selection
- Unit tests for `generateBoard()` with emoji defaults (no custom images)
- Unit tests for mixed mode (some custom + emoji fill)
- Unit tests for overflow (board exceeds emoji pool → symbol fallback)
- Component test for `<img>` error fallback behavior

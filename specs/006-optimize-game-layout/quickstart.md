# Quickstart: Optimize Game Layout

**Date**: 2026-03-31
**Feature**: 006-optimize-game-layout

## Overview

Replace the fixed-width game board layout with a dynamic width that scales based on column count. Add a shared container wrapper for consistent centering and padding across all screens.

## Files to Modify

### `src/App.tsx`

Add a shared container wrapper around all screen content:
- Wrap the conditional rendering (setup/playing/complete) in a `<div>` with container classes
- Container provides: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen`
- The playing state's existing wrapper div becomes the inner flex layout

### `src/components/game-board.tsx`

Replace the fixed `max-w-2xl` with a dynamic max-width:
- Remove `max-w-2xl` from the grid div
- Add inline `style={{ maxWidth }}` computed from `cols`
- Formula: base card size * cols + gaps + padding, capped at container width
- Keep `w-full mx-auto` for centering within the container

### `src/components/setup-screen.tsx`

Minor adjustment:
- The screen already centers itself with `items-center`
- Verify it works correctly within the new container (padding may need adjustment)

### `src/components/completion-screen.tsx`

Minor adjustment:
- Same as setup — verify centering within the new container

## Test Scenarios

### Visual (manual)

1. Start a 4x4 game on desktop → board is compact and centered, similar to current
2. Start a 10x10 game on desktop → board fills most of the width, cards are visibly larger
3. Start a 6x8 game on mobile (375px) → board fills width with small side padding
4. Resize browser window mid-game → layout adapts fluidly
5. Check all 3 screens → consistent container alignment

### Automated

- Game board test: verify dynamic max-width style is applied based on cols prop
- Existing tests: verify no regressions in setup screen and completion screen rendering

## Development Commands

```bash
npm test          # Run all tests
npm run lint      # Run linter
npm run dev       # Start dev server for visual testing
```

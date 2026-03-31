# Quickstart: Quick Replay

**Date**: 2026-03-31
**Feature**: 009-quick-replay

## Overview

"Play Again" on the completion screen starts a new game immediately with the same size and images. A secondary "Change Size" link takes players back to the setup screen.

## Files to Modify

### `src/components/completion-screen.tsx`

- Add `onChangeSize: () => void` prop to the interface
- Keep "Play Again" button calling `onPlayAgain`
- Add a secondary "Change Size" text button/link below, calling `onChangeSize`
- Style: `text-sm font-semibold text-text-secondary hover:text-brand-600 transition-colors` (similar to "New Game" on the game board)

### `src/App.tsx`

- Change the `onPlayAgain` prop passed to CompletionScreen:
  - Before: `onPlayAgain={reset}`
  - After: `onPlayAgain={() => startGame(state.config, images.map(img => img.url))}`
- Add `onChangeSize={reset}` prop to CompletionScreen

### `tests/components/completion-screen.test.tsx`

- Add test: clicking "Play Again" calls `onPlayAgain`
- Add test: "Change Size" link is rendered
- Add test: clicking "Change Size" calls `onChangeSize`
- Update existing test to pass both props

## Development Commands

```bash
npm test          # Run all tests
npm run lint      # Run linter
npm run dev       # Start dev server for manual testing
```

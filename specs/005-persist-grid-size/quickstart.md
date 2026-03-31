# Quickstart: Persist Grid Size Across Games

**Date**: 2026-03-31
**Feature**: 005-persist-grid-size

## Overview

This feature saves the grid size (rows and columns) when a player completes a game, so the next game starts with the same dimensions. The preference persists in `localStorage` across browser sessions.

## Files to Create

### `src/utils/grid-storage.ts`

New utility with three functions:
- `loadGridSize(): BoardConfig` — Reads from localStorage, validates, returns stored config or default `{ rows: 4, cols: 4 }`.
- `saveGridSize(config: BoardConfig): void` — Writes config to localStorage as JSON.
- `GRID_STORAGE_KEY` — The localStorage key constant (`"concentration:gridSize"`).

## Files to Modify

### `src/hooks/use-game-state.ts`

Add a `useEffect` that watches `state.phase` — when it becomes `"complete"`, call `saveGridSize(state.config)`.

### `src/components/setup-screen.tsx`

Change `useState(4)` for rows and cols to initialize from `loadGridSize()`:
```
const saved = loadGridSize();
const [rows, setRows] = useState(saved.rows);
const [cols, setCols] = useState(saved.cols);
```

## Test Files

### `tests/utils/grid-storage.test.ts` (new)

- `loadGridSize` returns default when localStorage is empty
- `loadGridSize` returns stored config when valid data exists
- `loadGridSize` returns default when stored data is invalid (bad JSON, out of range, odd total)
- `saveGridSize` writes valid JSON to localStorage
- Round-trip: save then load returns same values

### `tests/hooks/use-game-state.test.ts` (modify)

- Add test: grid config is saved to localStorage when game phase becomes "complete"
- Add test: grid config is NOT saved on reset (mid-game)

### `tests/components/setup-screen.test.tsx` (modify)

- Add test: setup screen initializes with values from localStorage
- Add test: setup screen uses defaults when localStorage is empty

## Development Commands

```bash
npm test          # Run all tests
npm run lint      # Run linter
npm run dev       # Start dev server for manual testing
```

# Quickstart: Preset Grid Sizes

**Date**: 2026-03-31
**Feature**: 007-preset-grid-sizes

## Overview

Replace free-form number inputs with a 3x3 grid of 9 predefined board sizes. Persist the selected preset across games via localStorage.

## Files to Create

### `src/utils/grid-presets.ts`

Exports:
- `GridPreset` type: `{ rows: number; cols: number; label: string; cards: number }`
- `GRID_PRESETS`: Readonly array of 9 presets (3x4 through 8x8)
- `DEFAULT_PRESET_INDEX`: `1` (4x4)

### `src/components/grid-size-selector.tsx`

A presentational component that renders 9 preset options as a 3-column grid of buttons:
- Props: `presets`, `selectedIndex`, `onChange(index: number)`
- Each button shows the label (e.g., "4x6") and card count (e.g., "24 cards")
- Selected button has distinct styling (brand-600 border, brand-50 background)
- Unselected buttons have neutral styling

## Files to Modify

### `src/utils/grid-storage.ts`

- Change storage format from `{ rows, cols }` to `{ presetIndex }`
- `loadGridSize` → `loadPresetIndex(): number` — returns a valid preset index or default
- `saveGridSize` → `savePresetIndex(index: number): void` — writes `{ presetIndex }` to localStorage
- Old `{ rows, cols }` format is treated as invalid → falls back to default index

### `src/components/setup-screen.tsx`

- Remove rows/cols number inputs and their `useState` hooks
- Import `GRID_PRESETS`, `DEFAULT_PRESET_INDEX` from grid-presets
- Import `GridSizeSelector` component
- Import `loadPresetIndex`, `savePresetIndex` from grid-storage
- Add `useState` for `selectedIndex`, initialized from `loadPresetIndex()`
- Render `GridSizeSelector` in place of the number inputs
- On start: save preset index, derive `{ rows, cols }` from `GRID_PRESETS[selectedIndex]`, pass to `onStart`
- Update pair count calculation to use `GRID_PRESETS[selectedIndex]`

### `src/hooks/use-game-state.ts`

- Remove the `saveGridSize` call on game completion (persistence now happens at game start in setup-screen)
- Remove the `grid-storage` import

## Test Files

### `tests/utils/grid-presets.test.ts` (new)

- All 9 presets have even total cards
- All presets have rows and cols within 2-10 range
- Labels match "RxC" format
- DEFAULT_PRESET_INDEX points to 4x4

### `tests/components/grid-size-selector.test.tsx` (new)

- Renders 9 buttons
- Selected button has distinct styling
- Clicking a button calls onChange with correct index
- All buttons are accessible (role="button" or native button)

### `tests/utils/grid-storage.test.ts` (modify)

- Update tests for new `loadPresetIndex` / `savePresetIndex` API
- Test: returns default index when localStorage empty
- Test: returns stored index when valid
- Test: returns default when stored data is old format `{ rows, cols }`
- Test: returns default when index is out of bounds
- Test: round-trip save/load

### `tests/components/setup-screen.test.tsx` (modify)

- Remove tests for number inputs
- Add test: renders GridSizeSelector with 9 options
- Add test: starts game with correct rows/cols from selected preset
- Add test: initializes with stored preset from localStorage

### `tests/hooks/use-game-state.test.ts` (modify)

- Remove tests for saveGridSize on completion (no longer relevant)

## Development Commands

```bash
npm test          # Run all tests
npm run lint      # Run linter
npm run dev       # Start dev server for manual testing
```

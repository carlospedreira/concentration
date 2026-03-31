# Data Model: Preset Grid Sizes

**Date**: 2026-03-31
**Feature**: 007-preset-grid-sizes

## Entities

### GridPreset

A predefined board size option.

| Field | Type   | Constraints        | Description                        |
|-------|--------|--------------------|------------------------------------|
| rows  | number | 2-10, integer      | Number of rows in the grid         |
| cols  | number | 2-10, integer      | Number of columns in the grid      |
| label | string | Non-empty          | Display label, e.g., "4x6"        |
| cards | number | Even, >= 4         | Total card count (rows * cols)     |

**Preset list** (9 items, ordered by difficulty):

| Index | Label | Rows | Cols | Cards |
|-------|-------|------|------|-------|
| 0     | 3x4   | 3    | 4    | 12    |
| 1     | 4x4   | 4    | 4    | 16    |
| 2     | 4x5   | 4    | 5    | 20    |
| 3     | 4x6   | 4    | 6    | 24    |
| 4     | 5x6   | 5    | 6    | 30    |
| 5     | 6x6   | 6    | 6    | 36    |
| 6     | 6x7   | 6    | 7    | 42    |
| 7     | 7x8   | 7    | 8    | 56    |
| 8     | 8x8   | 8    | 8    | 64    |

**Default index**: 1 (4x4, 16 cards)

### StoredPreference

The persisted user preference in localStorage.

| Field       | Type   | Constraints       | Description                           |
|-------------|--------|-------------------|---------------------------------------|
| presetIndex | number | 0-8, integer      | Index into the GRID_PRESETS array     |

**Storage key**: `"concentration:gridSize"` (reused from feature 005)
**Storage format**: `JSON.stringify({ presetIndex: number })`
**Default**: `{ presetIndex: 1 }` (4x4)

### Validation Rules

- On read from storage: parse JSON, verify `presetIndex` is a number, verify it's a valid index (0 to GRID_PRESETS.length - 1).
- On validation failure (including old `{ rows, cols }` format): return the default index (1).
- Writing: store `{ presetIndex }` on game start (when the player presses Start).

### State Transitions

```
App opens → Read localStorage
  ├── Valid presetIndex found → Pre-select that preset in the selector
  └── No data / invalid / old format → Pre-select default (index 1, 4x4)

Player selects a preset → Update local state (no storage write yet)

Player presses "Start Game" → Write { presetIndex } to localStorage → Start game with preset's rows/cols

Game completes → No additional storage write needed (saved at start)
```

## Relationships

- **GridPreset → BoardConfig**: Each preset maps to a `BoardConfig` (`{ rows, cols }`). The `BoardConfig` type remains unchanged.
- **GridPreset → SetupScreen**: The setup screen displays all presets and manages selection state.
- **StoredPreference → GridSizeSelector**: The selector receives the initial selected index from the stored preference.

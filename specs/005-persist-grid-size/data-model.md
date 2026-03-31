# Data Model: Persist Grid Size Across Games

**Date**: 2026-03-31
**Feature**: 005-persist-grid-size

## Entities

### GridSizePreference

Represents the player's last-used grid dimensions, stored in `localStorage`.

| Field | Type   | Constraints        | Description                   |
|-------|--------|--------------------|-------------------------------|
| rows  | number | 1-10, integer      | Number of rows in the grid    |
| cols  | number | 1-10, integer, rows*cols must be even | Number of columns in the grid |

**Storage key**: `"concentration:gridSize"`
**Storage format**: `JSON.stringify({ rows: number, cols: number })`
**Default value**: `{ rows: 4, cols: 4 }`

### Validation Rules

- On read from storage: parse JSON, verify `rows` and `cols` are numbers within range, verify `rows * cols` is even.
- On validation failure: return the default `{ rows: 4, cols: 4 }`.
- Reuses existing `validateBoardConfig` function from `src/utils/validation.ts`.

### State Transitions

```
App opens → Read localStorage
  ├── Valid data found → Use stored { rows, cols } as initial state
  └── No data / invalid → Use default { rows: 4, cols: 4 }

Game completes (phase → "complete") → Write { rows, cols } to localStorage

Game reset (mid-game) → No storage write
Setup screen changes → No storage write
```

## Relationships

- **GridSizePreference → BoardConfig**: The stored preference maps directly to the existing `BoardConfig` type (`{ rows: number, cols: number }`). No new types needed.
- **GridSizePreference → SetupScreen**: The setup screen reads the preference to initialize its local `useState` values.
- **GridSizePreference → useGameState**: The hook writes the preference when a game completes.

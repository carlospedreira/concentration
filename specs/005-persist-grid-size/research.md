# Research: Persist Grid Size Across Games

**Date**: 2026-03-31
**Feature**: 005-persist-grid-size

## R-001: Storage Mechanism for Grid Size Preference

**Decision**: Use `localStorage` with a single JSON key.

**Rationale**:
- The data is a simple object (`{ rows: number, cols: number }`) — under 50 bytes.
- `localStorage` is synchronous, universally supported, and works offline.
- The app has no existing storage layer, so `localStorage` is the simplest option (Constitution Principle I).
- No need for IndexedDB — that would be overkill for a single preference.
- No need for a storage abstraction layer — one key, one utility file.

**Alternatives considered**:
- **IndexedDB**: Async, more complex API. Overkill for a single small value.
- **sessionStorage**: Would not persist across browser sessions (violates FR-004).
- **Cookie**: Unnecessary overhead, sent with every request (though no server here).
- **URL query params**: Would work for sharing but changes the URL; not appropriate for a preference.

## R-002: Storage Key and Data Format

**Decision**: Store as `JSON.stringify({ rows, cols })` under key `"concentration:gridSize"`.

**Rationale**:
- Namespaced key (`concentration:`) avoids collisions with other apps on the same origin.
- JSON format allows type-safe parsing with validation.
- Single key (not separate `rows`/`cols` keys) ensures atomic read/write — no partial state.

**Alternatives considered**:
- **Separate keys** (`concentration:rows`, `concentration:cols`): Risk of partial updates if write fails between the two.
- **Versioned format** (`{ version: 1, rows, cols }`): YAGNI — unnecessary for a two-field object that won't evolve.

## R-003: Validation Strategy for Stored Data

**Decision**: Validate on read using the existing `validateBoardConfig` utility. Fall back to `{ rows: 4, cols: 4 }` on any failure.

**Rationale**:
- `validateBoardConfig` already checks rows/cols range (1-10) and even total.
- Reusing existing validation avoids duplication (Constitution Principle I).
- Graceful fallback ensures the app never breaks from corrupt storage.

**Alternatives considered**:
- **Schema validation library** (e.g., Zod): New dependency, overkill for two numbers.
- **No validation**: Risky — manual localStorage edits or corruption could crash the app.

## R-004: When to Save Grid Size

**Decision**: Save when the game phase transitions to `"complete"` (all pairs matched).

**Rationale**:
- Per FR-005, the stored size should only update on game completion, not on setup changes or mid-game resets.
- The `useGameState` hook already observes phase transitions via `useEffect` — adding a save on `phase === "complete"` is natural and minimal.
- The config is available on `state.config` at completion time.

**Alternatives considered**:
- **Save on game start**: Would persist sizes from games that are never finished — violates FR-005.
- **Save on setup screen submit**: Same issue — the game might be reset before completion.
- **Save in the reducer**: Reducers should be pure; side effects belong in hooks/effects.

# Research: Preset Grid Sizes

**Date**: 2026-03-31
**Feature**: 007-preset-grid-sizes

## R-001: Preset Size Selection

**Decision**: Use 9 presets arranged from easy to hard: 3x4 (12), 4x4 (16), 4x5 (20), 4x6 (24), 5x6 (30), 6x6 (36), 6x7 (42), 7x8 (56), 8x8 (64).

**Rationale**:
- 9 presets fit a clean 3x3 visual grid.
- Range from 12 to 64 cards covers casual to challenging difficulty.
- All have even totals (required for pairs).
- All dimensions are within the existing 1-10 validation range.
- 4x4 (the current default) is included and serves as the default selection.

**Alternatives considered**:
- **Fewer presets (5-6)**: Less variety, doesn't fill a grid layout well.
- **More presets (12+)**: Too many choices, requires scrolling on mobile, decision paralysis.
- **Including 2x2**: Too trivial (only 1 pair). Excluded for better UX.
- **Including 10x10**: 100 cards is extreme. 8x8 (64) is a reasonable maximum.

## R-002: Persistence Strategy

**Decision**: Store the selected preset index (0-8) in localStorage under the same key `"concentration:gridSize"`, but change the format to `{ presetIndex: number }`.

**Rationale**:
- Reuses the existing localStorage key and infrastructure from feature 005.
- Storing an index is simpler and more robust than storing rows/cols — any valid index maps to a valid preset.
- On read, validate the index is within bounds (0 to presets.length - 1). Fall back to the default index (1, which is 4x4) on invalid data.
- The old `{ rows, cols }` format will be treated as invalid and silently fall back to default — clean migration.

**Alternatives considered**:
- **Store rows/cols as before**: Would work, but requires searching the preset list to highlight the correct option. Index is simpler.
- **New localStorage key**: Unnecessary fragmentation. Reusing the key provides a clean migration path.
- **Store preset label (e.g., "4x4")**: String matching is fragile if labels change.

## R-003: Component Architecture

**Decision**: Create a standalone `GridSizeSelector` component that receives the presets, selected index, and an `onChange` callback. The setup screen owns the state.

**Rationale**:
- Separation of concerns: the selector is a pure presentational component.
- Testable in isolation with React Testing Library.
- The setup screen orchestrates state and persistence, same pattern as the current number inputs.
- No new state management needed — `useState` for the selected index.

**Alternatives considered**:
- **Inline the selector in setup-screen**: Works but makes the component larger and harder to test. A separate component is cleaner.
- **Custom hook for preset selection**: Overkill for a single `useState` + `onChange`.

## R-004: Visual Design of the Selector

**Decision**: Display presets as a 3-column, 3-row grid of button-like cards. Each card shows the dimension label (e.g., "4x6") prominently and the card count (e.g., "24 cards") as secondary text. The selected card has a distinct border/background color using the existing brand palette.

**Rationale**:
- 3x3 grid is compact and fits on mobile (375px) without scrolling.
- Two lines of text per option (dimensions + card count) give players enough info to choose.
- Using the brand color palette (brand-600 border, brand-50 background) for selection keeps it consistent with the existing design system.
- Button semantics ensure keyboard accessibility.

**Alternatives considered**:
- **Dropdown/select element**: Hides options, requires extra click. Less discoverable.
- **Radio buttons**: Functional but visually boring for a game UI.
- **Horizontal scroll**: Bad for 9 items, hides options off-screen.

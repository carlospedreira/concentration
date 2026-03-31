# Feature Specification: Preset Grid Sizes

**Feature Branch**: `007-preset-grid-sizes`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "Instead of allowing random numbers for rows and cols, make a set of predefined sizes displayed in a selection grid. The selection should be kept across games."

## User Scenarios & Testing

### User Story 1 - Select Grid Size from Predefined Options (Priority: P1)

A player opens the setup screen and sees a visual grid of 9 predefined board size options (e.g., 3x4, 4x4, 4x5, 4x6, 5x6, 6x6, 6x7, 7x8, 8x8) instead of free-form number inputs. They tap one option to select it, see it highlighted, and press "Start Game" to play with that size. The experience is faster and simpler than typing numbers.

**Why this priority**: This is the core change — replacing confusing number inputs with a simple one-tap selection. It eliminates invalid configurations entirely and makes setup faster.

**Independent Test**: Open the setup screen, verify 9 size options are displayed, tap one, verify it is visually selected, press Start, and verify the game starts with the correct grid dimensions.

**Acceptance Scenarios**:

1. **Given** a player opens the setup screen, **When** they view the size selection area, **Then** they see exactly 9 predefined size options displayed as a grid of selectable items.
2. **Given** a player views the size options, **When** they tap one option (e.g., "4x6"), **Then** that option is visually highlighted as selected and the previously selected option is deselected.
3. **Given** a player has selected a size and uploaded images, **When** they press "Start Game", **Then** the game starts with the exact rows and columns of the selected size.
4. **Given** a player opens the setup screen for the first time (no previous selection), **When** they view the size options, **Then** the default option (4x4) is pre-selected.

---

### User Story 2 - Selected Size Persists Across Games (Priority: P2)

A player selects a grid size (e.g., 5x6), plays a game, and returns to the setup screen. The size they previously selected is still highlighted. This preference also persists across browser sessions.

**Why this priority**: Persistence avoids re-selecting the same size every game, but the selection UI (US1) is the primary value.

**Independent Test**: Select a non-default size, complete a game, return to setup, and verify the previously selected size is still highlighted. Reload the page and verify the selection persists.

**Acceptance Scenarios**:

1. **Given** a player selected "5x6" and completed a game, **When** they return to the setup screen, **Then** "5x6" is still highlighted as the selected option.
2. **Given** a player selected "6x6" and closed the browser, **When** they reopen the app, **Then** "6x6" is highlighted as the selected option on the setup screen.
3. **Given** a first-time player with no stored preference, **When** they open the setup screen, **Then** the default size (4x4) is selected.

---

### User Story 3 - Remove Free-Form Number Inputs (Priority: P3)

The old rows and columns number input fields are removed from the setup screen. Players can only choose from the predefined sizes.

**Why this priority**: Cleanup — the old inputs are replaced by the new selection grid. This prevents confusion from having two ways to set the size.

**Independent Test**: Open the setup screen and verify there are no number input fields for rows or columns.

**Acceptance Scenarios**:

1. **Given** a player opens the setup screen, **When** they look for number inputs, **Then** there are no rows or columns text/number input fields visible.
2. **Given** a player views the setup screen, **When** they interact with the size options, **Then** all 9 predefined sizes are valid configurations (even total cards, reasonable dimensions).

---

### Edge Cases

- What happens if stored preference data references a size that no longer exists in the predefined list (e.g., after a future update removes a size)? The system falls back to the default (4x4).
- What happens if stored preference data is corrupted or invalid? The system falls back to the default (4x4).
- What happens with pair count messages when a size is selected? The image count messaging updates immediately to reflect the pair count of the newly selected size.

## Requirements

### Functional Requirements

- **FR-001**: The setup screen MUST display exactly 9 predefined grid size options.
- **FR-002**: The predefined sizes MUST all produce valid boards (even total cards, dimensions between 2 and 10).
- **FR-003**: Exactly one size option MUST be selected at all times — the player cannot deselect all options.
- **FR-004**: Each size option MUST display its dimensions (e.g., "4x6") and total card count (e.g., "24 cards").
- **FR-005**: The selected size MUST be visually distinct from unselected sizes (clear highlight or active state).
- **FR-006**: The selected size MUST be persisted across games and browser sessions.
- **FR-007**: The system MUST fall back to the default size (4x4) when the stored preference is missing or invalid.
- **FR-008**: The free-form number input fields for rows and columns MUST be removed.
- **FR-009**: The image pair count messaging MUST update when the player selects a different size.
- **FR-010**: The "Start Game" button MUST use the currently selected preset size (not typed values).

### Key Entities

- **GridPreset**: A predefined board size with rows, columns, and a label. The 9 presets are: 3x4 (12), 4x4 (16), 4x5 (20), 4x6 (24), 5x6 (30), 6x6 (36), 6x7 (42), 7x8 (56), 8x8 (64).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Players can select a grid size with a single tap/click (down from 4+ interactions with number inputs: clear, type, clear, type).
- **SC-002**: 100% of selectable sizes produce valid game boards (no validation errors possible).
- **SC-003**: The selected size persists across page reloads and browser sessions with zero data loss.
- **SC-004**: The setup screen displays all 9 options without scrolling on viewports 375px and wider.
- **SC-005**: The pair count messaging updates within 100ms of selecting a new size (perceived as instant).

## Assumptions

- The 9 preset sizes are: 3x4, 4x4, 4x5, 4x6, 5x6, 6x6, 6x7, 7x8, 8x8 — covering easy (12 cards) to challenging (64 cards).
- The default size is 4x4 (16 cards) — matches the current default.
- The existing persistence mechanism (from feature 005) will be adapted to store the selected preset rather than arbitrary rows/cols.
- The size options are displayed in a 3x3 visual grid layout for clean aesthetics.
- Each option shows both the dimension label (e.g., "4x6") and the card count (e.g., "24 cards") to help players understand difficulty.

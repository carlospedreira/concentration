# Feature Specification: Persist Grid Size Across Games

**Feature Branch**: `005-persist-grid-size`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "Keep the size after the game ends and it starts a new game."

## User Scenarios & Testing

### User Story 1 - Grid Size Persists After Game Completion (Priority: P1)

A player finishes a game of concentration (matches all pairs). When the game ends and they start a new game, the grid dimensions (rows and columns) from the previous game are pre-selected on the setup screen instead of resetting to the default 4x4.

**Why this priority**: This is the core ask. Players who prefer a specific grid size should not have to re-select it every time they play again.

**Independent Test**: Can be tested by completing a game with a non-default grid size (e.g., 4x6), then verifying the setup screen shows 4x6 when the new game begins.

**Acceptance Scenarios**:

1. **Given** a player has completed a game with a 4x6 grid, **When** they return to the setup screen for a new game, **Then** the rows and columns inputs show 4 and 6 respectively.
2. **Given** a player has completed a game with a 2x2 grid, **When** they return to the setup screen, **Then** the rows and columns inputs show 2 and 2.
3. **Given** this is the very first time the player opens the app (no previous game), **When** the setup screen loads, **Then** the default 4x4 grid size is shown.

---

### User Story 2 - Grid Size Persists Across Browser Sessions (Priority: P2)

A player closes the browser or navigates away, then returns to the app later. The grid size from their last completed game is remembered and pre-selected on the setup screen.

**Why this priority**: Enhances the convenience further by surviving page reloads, but the in-session persistence (P1) is the minimum viable behavior.

**Independent Test**: Can be tested by completing a game with a non-default size, closing and reopening the browser tab, and verifying the setup screen shows the previously used grid size.

**Acceptance Scenarios**:

1. **Given** a player previously completed a game with a 6x6 grid and closed the browser, **When** they reopen the app, **Then** the setup screen shows 6 rows and 6 columns.
2. **Given** a player has never used the app before, **When** they open it for the first time, **Then** the default 4x4 grid size is shown.

---

### Edge Cases

- What happens if the stored grid size is invalid (e.g., corrupted storage returns rows=0)? The system falls back to the default 4x4 grid.
- What happens if the player manually changes the grid size on the setup screen but does not complete a game? The stored size should only update upon game completion, not when the player adjusts the inputs.
- What happens if the player resets the game mid-way (before completing it)? The previously stored size is retained; the incomplete game does not overwrite it.

## Requirements

### Functional Requirements

- **FR-001**: System MUST remember the grid dimensions (rows and columns) from the most recently completed game.
- **FR-002**: System MUST pre-populate the setup screen's rows and columns inputs with the remembered grid dimensions when starting a new game.
- **FR-003**: System MUST use the default grid size (4x4) when no previous game has been completed.
- **FR-004**: System MUST persist the remembered grid size across browser sessions (surviving page reload and browser close/reopen).
- **FR-005**: System MUST only update the stored grid size when a game is completed (all pairs matched), not when the player merely adjusts the setup inputs or resets mid-game.
- **FR-006**: System MUST gracefully fall back to the default 4x4 grid if stored data is missing or invalid.

## Success Criteria

### Measurable Outcomes

- **SC-001**: After completing a game with a non-default grid size, 100% of subsequent new games pre-select the previously used grid dimensions on the setup screen.
- **SC-002**: Grid size preference survives a full page reload without any loss.
- **SC-003**: First-time users see the default 4x4 grid with no errors or delays.
- **SC-004**: Players save at least 2 interactions (adjusting rows and columns) per subsequent game when replaying at the same size.

## Assumptions

- The default grid size is 4x4 (based on the current codebase defaults).
- "Game ends" means all pairs have been successfully matched (game completion), not a manual reset or page close mid-game.
- Browser local storage is available and is an acceptable persistence mechanism for this preference.

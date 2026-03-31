# Feature Specification: Quick Replay

**Feature Branch**: `009-quick-replay`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "When the game is over and I click play again, start a new game directly with the size I selected for the game I won instead of putting me in the size selection."

## User Scenarios & Testing

### User Story 1 - Play Again Starts a New Game Immediately (Priority: P1)

A player completes a game (matches all pairs) and sees the completion screen. When they click "Play Again", a new game starts immediately with the same grid size — they skip the setup screen entirely and go straight into a fresh board with reshuffled cards.

**Why this priority**: This is the entire feature — reducing friction for repeat play. Players who want to play again at the same difficulty shouldn't have to re-navigate the setup screen.

**Independent Test**: Complete a 4x6 game, click "Play Again", and verify a new 4x6 game starts immediately with freshly shuffled cards — the setup screen is never shown.

**Acceptance Scenarios**:

1. **Given** a player has completed a game with a 5x6 grid, **When** they click "Play Again", **Then** a new game starts immediately with a 5x6 grid of freshly shuffled cards — the setup screen is not displayed.
2. **Given** a player has completed a game with custom uploaded images, **When** they click "Play Again", **Then** the new game uses the same images that were used in the previous game.
3. **Given** a player has completed a game with the default 4x4 grid, **When** they click "Play Again", **Then** a new 4x4 game starts immediately.
4. **Given** a player wants to change the grid size or images after completing a game, **When** they look at the completion screen, **Then** there is a way to return to the setup screen (e.g., a separate "New Game" or "Change Settings" option) in addition to the "Play Again" button.

---

### User Story 2 - Access Setup Screen from Completion (Priority: P2)

The completion screen provides a secondary option (in addition to "Play Again") that takes the player back to the setup screen where they can choose a different grid size or change their images before starting a new game.

**Why this priority**: Without this, players who want to change settings after completing a game would have no way to reach the setup screen. This is secondary because the primary ask is quick replay.

**Independent Test**: Complete a game, verify there is both a "Play Again" button (starts game immediately) and a separate option to go to the setup screen.

**Acceptance Scenarios**:

1. **Given** a player has completed a game, **When** they view the completion screen, **Then** they see both a prominent "Play Again" button and a secondary "Change Size" or "New Game" link/button.
2. **Given** a player clicks the secondary option, **When** the setup screen loads, **Then** the previously selected grid size is pre-selected and any previously uploaded images are still available.

---

### Edge Cases

- What happens if the player clicks "Play Again" but the previous game had custom images that have since been revoked (e.g., object URLs expired)? The system should handle gracefully — start the game with default emoji images for any unavailable custom images.
- What happens with the "New Game" button on the game board (during play)? It should continue to go to the setup screen as it does today — only the completion screen "Play Again" gets the quick replay behavior.

## Requirements

### Functional Requirements

- **FR-001**: The "Play Again" button on the completion screen MUST start a new game immediately with the same grid size as the just-completed game.
- **FR-002**: The new game started via "Play Again" MUST use freshly shuffled cards (not the same card positions as the previous game).
- **FR-003**: The new game started via "Play Again" MUST reuse any custom images from the previous game.
- **FR-004**: The completion screen MUST provide a secondary way to navigate to the setup screen for players who want to change settings.
- **FR-005**: The "New Game" button on the game board (during active play) MUST continue to navigate to the setup screen as it does currently.
- **FR-006**: The move counter MUST reset to zero when a new game starts via "Play Again".

## Success Criteria

### Measurable Outcomes

- **SC-001**: Players can start a new game from the completion screen in 1 tap/click (down from 2+ taps through the setup screen).
- **SC-002**: The new game board appears within 1 second of clicking "Play Again" (perceived as instant).
- **SC-003**: 100% of quick-replay games use the correct grid size from the previous game.
- **SC-004**: The setup screen remains accessible from the completion screen for players who want to change settings.
- **SC-005**: Custom uploaded images are preserved across quick-replay games within the same session.

## Assumptions

- "Play Again" reuses the same grid size (rows/cols) and the same uploaded images from the just-completed game.
- The secondary option to access the setup screen can be a text link or secondary button — it does not need to be as prominent as "Play Again".
- The "New Game" button shown during active gameplay (on the game board) is not affected by this feature — it continues to reset to the setup screen.
- Quick replay does not affect the persisted preset index in localStorage — it was already saved when the game was started.

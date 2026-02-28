# Feature Specification: Core Game Logic

**Feature Branch**: `001-core-game-logic`
**Created**: 2026-02-28
**Status**: Draft
**Input**: User description: "core game logic for the concentration game. I want the user to be able to define the number of rows and columns"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure and Start a New Game (Priority: P1)

A player opens the game and chooses how many rows and columns the board should have. The system validates the configuration (total cells must be even to form pairs), generates a board with shuffled card pairs, and presents all cards face-down. The player can then begin flipping cards.

**Why this priority**: Without the ability to configure and initialize a game board, no other gameplay is possible. This is the foundation of the entire feature.

**Independent Test**: Can be fully tested by selecting a grid size, confirming the board appears with the correct number of face-down cards, and verifying that each card has exactly one matching partner.

**Acceptance Scenarios**:

1. **Given** the player is on the game setup screen, **When** they select 4 rows and 4 columns, **Then** a 4x4 board with 16 face-down cards (8 unique pairs) is displayed.
2. **Given** the player is on the game setup screen, **When** they select a configuration where rows x columns is odd (e.g., 3x3), **Then** the system prevents starting the game and informs the player that the total number of cells must be even.
3. **Given** the player starts a new game with the same configuration twice, **When** the board is generated each time, **Then** the card positions are randomized and unlikely to be identical.

---

### User Story 2 - Flip and Match Cards (Priority: P1)

A player selects a face-down card to reveal it, then selects a second card. If both cards match, they remain face-up and are considered "matched." If they do not match, both cards flip back face-down after a brief reveal period. The player continues until all pairs are found.

**Why this priority**: Card flipping and matching is the core mechanic of Concentration. Without this, there is no game to play.

**Independent Test**: Can be fully tested by starting a game, flipping two cards, and verifying matching/non-matching behavior works correctly.

**Acceptance Scenarios**:

1. **Given** a game is in progress with all cards face-down, **When** the player selects a card, **Then** that card flips face-up and reveals its symbol.
2. **Given** one card is face-up, **When** the player selects a second card that matches, **Then** both cards remain face-up and are marked as matched.
3. **Given** one card is face-up, **When** the player selects a second card that does not match, **Then** both cards are shown briefly and then flip back face-down.
4. **Given** one card is face-up, **When** the player selects the same card again, **Then** the selection is ignored (no effect).
5. **Given** two non-matching cards are being revealed, **When** the player tries to flip a third card, **Then** the input is ignored until the current pair finishes its reveal period.

---

### User Story 3 - Track Moves and Complete the Game (Priority: P2)

The system tracks how many moves (pair attempts) the player has made. When all pairs have been found, the game ends and the player is shown their total move count.

**Why this priority**: Move tracking and game completion feedback enhance the experience and give players a goal to improve against, but the core flip-and-match loop works without it.

**Independent Test**: Can be fully tested by playing a game to completion and verifying the move counter increments correctly and the completion message shows the final count.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** the player flips a second card (completing a pair attempt), **Then** the move counter increments by one regardless of whether the cards matched.
2. **Given** a game is in progress, **When** all pairs have been matched, **Then** the game displays a completion message with the total number of moves taken.
3. **Given** the game has ended, **When** the player views the completion state, **Then** they see the total moves and can start a new game.

---

### User Story 4 - Reset or Start a New Game (Priority: P2)

At any point during or after a game, the player can choose to start a new game. This returns them to the configuration screen where they can pick new dimensions or replay with the same settings.

**Why this priority**: Replayability is essential for a game, but the core loop functions without it (player can refresh/restart manually).

**Independent Test**: Can be fully tested by starting a game, playing partway through, choosing to restart, and verifying a fresh board is generated.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** the player chooses to start a new game, **Then** the current game state is discarded and the configuration screen is shown.
2. **Given** the game has ended, **When** the player chooses to play again, **Then** they are returned to the configuration screen.

---

### Edge Cases

- What happens when the player selects the minimum valid grid (e.g., 1x2 or 2x1)? The game should work with just 1 pair.
- What happens when the player selects a very large grid (e.g., 10x10)? The game should support it, though display may need to adapt.
- What happens if the player configures 0 rows or 0 columns? The system must reject this with a clear message.
- What happens if the player configures negative numbers or non-integer values? The system must reject invalid input.
- What happens if there are more pairs needed than available unique symbols? The system must either limit the maximum grid size or ensure enough unique symbols are available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the player to specify the number of rows and columns for the game board before starting a game.
- **FR-002**: System MUST validate that the total number of cells (rows x columns) is even, since cards must form pairs.
- **FR-003**: System MUST validate that rows and columns are positive integers within a supported range.
- **FR-004**: System MUST generate a board with (rows x columns) / 2 unique card pairs, randomly shuffled across all positions.
- **FR-005**: System MUST display all cards face-down at the start of a game.
- **FR-006**: System MUST allow the player to select a face-down card to reveal it.
- **FR-007**: System MUST compare two revealed cards and determine if they match.
- **FR-008**: System MUST keep matching cards face-up permanently for the rest of the game.
- **FR-009**: System MUST flip non-matching cards back face-down after a brief reveal period.
- **FR-010**: System MUST prevent the player from selecting more than two unmatched cards at a time.
- **FR-011**: System MUST prevent the player from selecting a card that is already face-up or matched.
- **FR-012**: System MUST track the number of moves (pair attempts) made during the game.
- **FR-013**: System MUST detect when all pairs have been matched and end the game.
- **FR-014**: System MUST display the total move count when the game ends.
- **FR-015**: System MUST allow the player to start a new game at any point during or after a game.
- **FR-016**: System MUST support a minimum board size of 1x2 (one pair) and a maximum of at least 10x10.

### Key Entities

- **Card**: Represents a single card on the board. Has a symbol (identity for matching), a position on the grid, and a state (face-down, face-up, or matched).
- **Board**: The game grid defined by rows and columns. Contains all cards in their positions. Responsible for shuffling pairs at game start.
- **Game**: Represents a single play session. Tracks the board configuration, current state of all cards, move count, and whether the game is in progress or complete.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can configure and start a new game within 5 seconds of opening the game.
- **SC-002**: Card flip and match/non-match resolution occurs within 1 second of the player's second card selection.
- **SC-003**: 100% of valid board configurations (even total cells, within supported range) produce a playable game with correctly paired cards.
- **SC-004**: Players can complete a 4x4 game (8 pairs) in under 5 minutes on their first attempt.
- **SC-005**: The move counter accurately reflects the number of pair attempts, with zero discrepancy across all games played.

## Assumptions

- The game is single-player (no multiplayer or competitive modes in this feature).
- Cards use abstract symbols (numbers, icons, or letters) rather than images for pairing. The specific symbol set is an implementation detail.
- The "brief reveal period" for non-matching cards is a short delay (roughly 1-2 seconds) to let the player see both cards before they flip back.
- The maximum supported grid size is at least 10x10 (100 cells, 50 pairs). Larger sizes may be supported if enough unique symbols are available.
- No timer or scoring system beyond move counting is included in this feature.
- No difficulty levels or hints are included in this feature.
- Game state does not need to persist between sessions (no save/load functionality).

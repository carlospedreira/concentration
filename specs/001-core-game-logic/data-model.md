# Data Model: Core Game Logic

**Feature Branch**: `001-core-game-logic`
**Date**: 2026-02-28

## Entities

### CardState (enum)

Represents the visual/logical state of a single card.

| Value      | Description                          |
|------------|--------------------------------------|
| `faceDown` | Card is hidden (default)             |
| `faceUp`   | Card is temporarily revealed         |
| `matched`  | Card is permanently revealed (paired)|

### GamePhase (enum)

Represents the current phase of the game state machine.

| Value        | Description                                              |
|--------------|----------------------------------------------------------|
| `setup`      | Player is configuring board dimensions                   |
| `playing`    | Board is active, player can select a card                |
| `checking`   | Two cards revealed, comparing for match                  |
| `revealing`  | Non-matching pair shown briefly before flipping back     |
| `complete`   | All pairs matched, game over                             |

### BoardConfig

Configuration for a game board.

| Field  | Type     | Constraints                                        |
|--------|----------|----------------------------------------------------|
| `rows` | `number` | Positive integer, 1-10                             |
| `cols` | `number` | Positive integer, 1-10                             |

**Validation rules**:
- `rows >= 1 && rows <= 10`
- `cols >= 1 && cols <= 10`
- `rows * cols >= 2` (at least one pair)
- `(rows * cols) % 2 === 0` (must be even for pairs)

### Card

A single card on the board.

| Field    | Type        | Description                          |
|----------|-------------|--------------------------------------|
| `id`     | `number`    | Unique index (0 to rows*cols - 1)    |
| `symbol` | `string`    | Unicode symbol for matching          |
| `state`  | `CardState` | Current visual state                 |

**Relationships**:
- Exactly two Cards share the same `symbol` (a pair).
- Card `id` corresponds to grid position: `row = Math.floor(id / cols)`, `col = id % cols`.

### GameState

Complete state of a game session.

| Field             | Type          | Description                                |
|-------------------|---------------|--------------------------------------------|
| `phase`           | `GamePhase`   | Current game phase                         |
| `config`          | `BoardConfig` | Board dimensions                           |
| `cards`           | `Card[]`      | All cards on the board                     |
| `selectedIndices` | `number[]`    | Indices of currently selected cards (0-2)  |
| `moveCount`       | `number`      | Number of completed pair attempts          |

**Invariants**:
- `cards.length === config.rows * config.cols`
- `selectedIndices.length <= 2`
- When `phase === 'setup'`: `cards` is empty, `moveCount === 0`
- When `phase === 'complete'`: all cards have `state === 'matched'`
- `moveCount` increments only when a second card is selected (pair attempt)

## State Transitions

```
setup ──[START_GAME]──► playing
                           │
                    [SELECT_CARD] (1st)
                           │
                           ▼
                        playing (1 card face-up)
                           │
                    [SELECT_CARD] (2nd)
                           │
                           ▼
                       checking
                        /     \
                  [MATCH]     [NO_MATCH]
                    /             \
                   ▼               ▼
               playing          revealing
            (if pairs left)        │
                   │         [FLIP_BACK]
            [all matched]          │
                   │               ▼
                   ▼            playing
               complete
```

### Actions (Discriminated Union)

| Action Type    | Payload                     | Description                            |
|----------------|-----------------------------|----------------------------------------|
| `START_GAME`   | `{ config: BoardConfig }`   | Validate config, generate shuffled board |
| `SELECT_CARD`  | `{ index: number }`         | Flip a face-down card                  |
| `CHECK_MATCH`  | (none)                      | Compare two selected cards             |
| `FLIP_BACK`    | (none)                      | Return non-matching cards to face-down |
| `RESET`        | (none)                      | Return to setup phase                  |

## Symbol Pool

Constant array of 60+ Unicode symbols. Slice `symbols.slice(0, pairCount)` to get the needed symbols for a game, then duplicate and shuffle.

```
◆ ○ ▲ ◀ ► ▼ □ ◇ ⬠ ● ◐ ◑ ◒ ◓
→ ← ↑ ↓ ↗ ↘ ↙ ↖ ⇒ ⇐ ⇑ ⇓ ↺ ↻
★ ☆ ♡ ♢ ♣ ♠ ♤ ♧ ✎ ✓ ✗ ◉ ❖ ✤
⊕ ⊗ ⊖ ⊘ ◎ ∞ ∑ ∆ Ω π ∇ ≈
⚡ ⌘ ☀ ☁ ☂ ♪ ♫ ⚙ ✦ ❂ ▣ ⬢
```

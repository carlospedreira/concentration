# Data Model: Emoji Default Cards

**Feature**: 004-disney-default-cards
**Date**: 2026-02-28

## Entities

### EmojiCharacter

Represents a single emoji image available as a default card face.

| Field       | Type     | Description                                     |
|-------------|----------|-------------------------------------------------|
| `id`        | `string` | Unique identifier (kebab-case, e.g., `"lion"`)  |
| `name`      | `string` | Display name for fallback text (e.g., `"Lion"`)  |
| `imageUrl`  | `string` | Resolved static import URL (Vite content-hashed) |

**Validation rules**:
- `id` must be unique across the pool
- `name` must be ≤ 10 characters (fits card face at smallest size)
- `imageUrl` must be a non-empty string (guaranteed by Vite import)

**Notes**: This is a read-only, compile-time data structure. No runtime mutations. Defined as `readonly` array of `readonly` objects.

### Card (existing — modified)

No structural changes to the `Card` interface. Emoji images flow through the existing `imageUrl?: string` field.

| Field       | Type        | Change   | Description                          |
|-------------|-------------|----------|--------------------------------------|
| `id`        | `number`    | None     | Sequential card index                |
| `symbol`    | `string`    | **Usage** | Now set to emoji name for default cards (was geometric symbol) |
| `state`     | `CardState` | None     | `"faceDown" \| "faceUp" \| "matched"` |
| `imageUrl`  | `string?`   | **Usage** | Now populated for emoji default cards (was only for custom uploads) |

**Key insight**: The `Card` type itself does not change. Only the values populated into `symbol` and `imageUrl` change for emoji defaults.

## Relationships

```
EmojiCharacter (pool of 36+)
    ↓ random selection (N images for N pairs)
Card[] (board)
    ↑ custom uploads take priority
UploadedImage[] (user-provided)
```

**Priority chain for card face assignment**:
1. Custom uploaded images (`UploadedImage.url` → `Card.imageUrl`)
2. Emoji images (`EmojiCharacter.imageUrl` → `Card.imageUrl`)
3. Geometric symbols (`SYMBOLS[i]` → `Card.symbol`, no `imageUrl`)

## State Transitions

No new state transitions. The `GamePhase` state machine is unchanged. Emoji images are resolved during `generateBoard()` (triggered by `START_GAME` action) — same phase where symbols were previously assigned.

## New Module: `emoji-characters.ts`

```typescript
interface EmojiCharacter {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
}

// Populated via import.meta.glob at build time
const EMOJI_CHARACTERS: readonly EmojiCharacter[] = [...]

function getDefaultImages(count: number): readonly EmojiCharacter[]
// Returns `count` randomly-selected emojis from pool
// Uses Fisher-Yates on a copy, slices first `count`
```

## Modified Module: `board.ts`

```typescript
// Current signature:
generateBoard(config: BoardConfig, imageUrls?: readonly string[]): readonly Card[]

// New signature (additive):
generateBoard(config: BoardConfig, imageUrls?: readonly string[]): readonly Card[]
// Internal change: when symbolCount > 0, first attempts to fill with emoji images
// Only falls back to SYMBOLS when emoji pool is exhausted
```

**Generation algorithm change**:
```
1. Calculate pairCount = (rows × cols) / 2
2. imagePairs = min(customImageUrls.length, pairCount)
3. remainingPairs = pairCount - imagePairs
4. emojiChars = getDefaultImages(min(remainingPairs, EMOJI_CHARACTERS.length))
5. emojiPairs = emojiChars.length
6. symbolPairs = remainingPairs - emojiPairs
7. Create pairs: [custom image pairs] + [emoji pairs] + [symbol pairs]
8. Fisher-Yates shuffle
9. Assign sequential IDs, set all to faceDown
```

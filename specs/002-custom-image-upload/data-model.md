# Data Model: Custom Image Upload

**Feature**: 002-custom-image-upload
**Date**: 2026-02-28

## Entities

### UploadedImage (NEW)

A player-provided image file used as a card face.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Unique identifier (generated via `crypto.randomUUID()`) |
| `file` | `File` | yes | Original File object from input element |
| `url` | `string` | yes | Blob URL created via `URL.createObjectURL(file)` |
| `name` | `string` | yes | Original filename (from `file.name`) for display |

**Validation rules**:
- `file.type` MUST be one of: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- `file.size` MUST be ≤ 5,242,880 bytes (5MB)

**Lifecycle**:
- Created when player selects a file via the upload input
- URL is revoked (`URL.revokeObjectURL`) when the image is removed from the collection
- All URLs are implicitly revoked when the page unloads (browser handles this)

---

### Card (EXTENDED)

Existing entity with one new optional field.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | yes | Position index on the board (0 to total-1) |
| `symbol` | `string` | yes | Unicode symbol for the card face (always set, used as fallback) |
| `state` | `CardState` | yes | `"faceDown"` / `"faceUp"` / `"matched"` |
| `imageUrl` | `string` | **no** | Blob URL of an uploaded image. When present, rendered instead of `symbol`. |

**Backward compatibility**: Existing cards without `imageUrl` (or `imageUrl: undefined`) behave exactly as before — the symbol is displayed.

---

### ImageCollection (IMPLICIT — React state in App.tsx)

Not a formal type but a logical entity: the ordered array of `UploadedImage` objects managed in `App.tsx` state.

| Aspect | Detail |
|--------|--------|
| **Type** | `UploadedImage[]` |
| **Location** | `useState` in `App.tsx` |
| **Operations** | add (append), remove (by id), reorder (move up/down), clear all |
| **Persistence** | React state only — survives game resets, lost on page refresh |
| **Ordering** | Upload order by default; user can reorder. First N images are used for the game. |

---

### BoardConfig (UNCHANGED)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rows` | `number` | yes | Number of rows (1-10) |
| `cols` | `number` | yes | Number of columns (1-10) |

No changes needed. Board size is independent of image upload.

---

## Relationships

```
App.tsx state
  │
  ├── images: UploadedImage[]     (managed above game cycle)
  │     │
  │     └──→ SetupScreen          (displays preview, add/remove/reorder)
  │           │
  │           └──→ ImageUploadPanel (encapsulates upload UI)
  │
  └── GameState
        │
        ├── config: BoardConfig
        └── cards: Card[]
              │
              └── card.imageUrl ──→ references UploadedImage.url
                                    (string copy, not object reference)
```

**Key relationship**: `Card.imageUrl` stores a copy of `UploadedImage.url` (a blob URL string). The card does not hold a reference to the `UploadedImage` object. This means:
- Cards are self-contained after board generation
- The image collection can be modified without affecting an in-progress game
- Cards remain serializable (all string fields)

---

## State Transitions

### Image Collection Operations

```
Empty Collection
  │
  ├── add(file) ──→ validate ──→ [valid] ──→ Collection with 1+ images
  │                            └── [invalid] ──→ Error message (collection unchanged)
  │
  ├── remove(id) ──→ revokeObjectURL ──→ Updated collection (or empty)
  │
  ├── moveUp(id) ──→ Swap with previous ──→ Updated order
  │
  ├── moveDown(id) ──→ Swap with next ──→ Updated order
  │
  └── clearAll() ──→ revokeObjectURL for each ──→ Empty collection
```

### Board Generation (Extended)

```
START_GAME(config, images?)
  │
  ├── pairCount = (rows × cols) / 2
  │
  ├── usableImages = images.slice(0, pairCount)
  │   (first N images in collection order)
  │
  ├── remainingPairs = pairCount - usableImages.length
  │
  ├── symbolPairs = SYMBOLS.slice(0, remainingPairs)
  │
  ├── allCards = [
  │     ...usableImages → Card pairs with imageUrl set,
  │     ...symbolPairs  → Card pairs with symbol only
  │   ]
  │
  └── shuffle(allCards) ──→ cards[] on GameState
```

### Pair Count Messaging

| Condition | Message Template |
|-----------|-----------------|
| `images.length === 0` | (no message — default behavior) |
| `images.length < pairCount` | "{images.length} of {pairCount} pairs will use your images; {remaining} will use default symbols." |
| `images.length === pairCount` | "All {pairCount} pairs will use your images." |
| `images.length > pairCount` | "Only {pairCount} of {images.length} images will be used." |

---

## Validation Rules Summary

| Rule | Field | Constraint | Error Message |
|------|-------|-----------|---------------|
| V-001 | `file.type` | Must be `image/jpeg`, `image/png`, `image/gif`, or `image/webp` | "Unsupported format. Please upload JPEG, PNG, GIF, or WebP images." |
| V-002 | `file.size` | Must be ≤ 5,242,880 bytes | "Image exceeds 5MB limit. Please choose a smaller file." |
| V-003 | Board total | Must be even (existing rule, unchanged) | "Total number of cards must be even." |

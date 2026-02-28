# Research: Custom Image Upload

**Feature**: 002-custom-image-upload
**Date**: 2026-02-28

## R-001: Client-Side Image Handling Approach

**Question**: How should we load and display user-uploaded images in the browser without a server?

**Decision**: Use `URL.createObjectURL(file)` to create blob URLs from `File` objects.

**Rationale**:
- Returns a lightweight `blob:` URL string that can be used directly in `<img src>`.
- No encoding overhead (unlike `FileReader.readAsDataURL` which produces base64 strings ~33% larger).
- Synchronous — no callbacks or promises needed to get the URL.
- Automatically garbage collected when the document is unloaded.
- Blob URLs work offline since they reference in-memory data.

**Alternatives considered**:
- `FileReader.readAsDataURL`: Produces base64 data URIs. Larger memory footprint, asynchronous API, works but is unnecessarily complex for display-only use. Would be needed if we wanted to persist to localStorage (but we don't — session-only).
- Canvas-based processing: Draw image to canvas, export as optimized blob. Over-engineering for this use case — we don't need to resize or transform images.

**Cleanup note**: Call `URL.revokeObjectURL(url)` when an image is removed from the collection to free memory.

---

## R-002: Image Display on Cards

**Question**: How should uploaded images (various aspect ratios and sizes) render consistently on square cards?

**Decision**: Use CSS `object-fit: cover` on an `<img>` element within the existing card container.

**Rationale**:
- The card already uses `aspect-square` (Tailwind), providing a consistent square container.
- `object-fit: cover` scales the image to fill the container while preserving aspect ratio, cropping any overflow. This matches FR-012 ("uniformly cropped or scaled to fit").
- Zero JavaScript required — pure CSS solution.
- Works identically across all modern browsers.

**Alternatives considered**:
- `object-fit: contain`: Would show the full image but leave empty space on non-square images. Inconsistent look.
- Canvas-based pre-cropping: Could crop images to square on upload. Over-engineering — CSS handles this without touching the source image.
- Background image: `background-size: cover` on a div. Works but is less semantic and harder to test than an `<img>` element.

---

## R-003: Image Reordering UX

**Question**: How should users reorder uploaded images to control which ones are prioritized?

**Decision**: Use simple "move up" / "move down" arrow buttons next to each image in the preview list.

**Rationale**:
- Zero dependencies — implements with basic array splice operations.
- Immediately understandable UI — no learning curve.
- Fully accessible with keyboard navigation.
- Aligns with Constitution Principle I (Simplicity First): a DnD library is a new runtime dependency that needs justification. Arrow buttons achieve the same goal with no dependency.

**Alternatives considered**:
- `@dnd-kit/core` (~15KB): Full-featured drag-and-drop. Great UX but introduces a new runtime dependency, increases bundle size, and adds complexity to testing. Not justified for a simple reorder of up to ~50 items.
- `react-beautiful-dnd` (~30KB): Deprecated by Atlassian, no longer maintained. Not viable.
- HTML5 native Drag and Drop API: Inconsistent across browsers (especially mobile), complex event handling, poor touch support. More code than button-based approach.

---

## R-004: Session Persistence Strategy

**Question**: How should uploaded images persist across game restarts within the same browser session?

**Decision**: Lift image collection state into `App.tsx` (above the game cycle) using `useState`. Pass images down to setup screen and game board.

**Rationale**:
- The game cycle (setup → playing → complete → reset) resets `GameState` via the reducer's `RESET` action. By keeping the image collection in the parent component, it survives game resets.
- Per spec assumptions: "Images persist in memory for the current browser session only. Refreshing the page or closing the browser clears them." React state satisfies this exactly.
- No serialization/deserialization needed (unlike sessionStorage/IndexedDB).
- Simplest possible approach — no new APIs or storage mechanisms.

**Alternatives considered**:
- `sessionStorage`: 5MB limit per origin would be problematic with multiple 5MB images stored as base64 (each becomes ~6.6MB encoded). Would require serialization/deserialization. Over-complicated.
- `IndexedDB`: Could store File blobs directly without base64 overhead. But adds API complexity (async, transactional) for no benefit — we explicitly don't need page-refresh persistence.
- React Context: Could use a dedicated `ImageContext`. But since only App.tsx and its direct children need the state, prop drilling through 1-2 levels is simpler than context setup. Revisit if the component tree deepens.

---

## R-005: File Validation Approach

**Question**: How should we validate that uploaded files are supported image formats and within size limits?

**Decision**: Check `File.type` (MIME type) against an allowlist and `File.size` against 5MB limit.

**Rationale**:
- The browser's `<input type="file" accept="...">` provides first-pass filtering in the file picker dialog.
- `File.type` is set by the browser based on file extension and MIME detection. Sufficient for a client-side game — we're protecting against user confusion, not adversarial uploads.
- `File.size` gives exact byte count. Compare against `5 * 1024 * 1024` (5MB).
- Validation is synchronous and fast.

**Allowed MIME types** (per FR-002):
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

**Alternatives considered**:
- Magic byte checking (read file header bytes): More robust against extension spoofing but requires `FileReader` async reads, adds complexity, and is unnecessary for a game — there's no security risk from a mistyped file reaching an `<img>` tag (it simply won't render).
- Extension-only checking: Less reliable than MIME type. A `.jpg` file could be anything. MIME is better.

---

## R-006: Card Type Extension Strategy

**Question**: How should the existing `Card` interface accommodate both symbols and images?

**Decision**: Add an optional `imageUrl?: string` field to the `Card` interface. The `CardComponent` renders `<img>` when `imageUrl` is present, otherwise renders the `symbol` text.

**Rationale**:
- Minimal change to existing type — fully backward-compatible.
- The `symbol` field remains required (it serves as fallback and is used by the board generation logic regardless).
- The `CardComponent` uses a simple conditional: `card.imageUrl ? <img> : <span>{symbol}</span>`.
- No discriminated union overhead — a single optional field keeps the type simple.
- Existing tests continue to pass without modification (they don't set `imageUrl`, so the symbol path renders as before).

**Alternatives considered**:
- Discriminated union `CardFace = { type: "symbol"; value: string } | { type: "image"; url: string }`: More type-safe but requires changing every place that reads `card.symbol`. Over-engineering for one optional field.
- Separate `ImageCard` and `SymbolCard` types: Would require generics or type guards throughout the codebase. Way too complex for the benefit.
- Replace `symbol` with a generic `face: string` field: Loses semantic clarity and breaks all existing code/tests.

---

## R-007: Board Generation with Mixed Sources

**Question**: How should `generateBoard` be modified to use uploaded images first, then fill with symbols?

**Decision**: Add an optional `imageUrls?: string[]` parameter to `generateBoard`. The function uses images for the first N pairs (where N = min(imageUrls.length, pairCount)), then fills remaining pairs with random symbols.

**Rationale**:
- Clean separation: the function receives pre-validated image URLs, not raw `File` objects.
- Existing behavior preserved when `imageUrls` is undefined or empty (all symbols).
- The caller (setup screen / game hook) is responsible for slicing images to the right count per FR-009.
- Shuffle applies uniformly to all cards (image and symbol), so image-pairs are randomly distributed across the board.

**Implementation sketch**:
```
pairCount = (rows * cols) / 2
imagePairs = imageUrls.slice(0, pairCount)
symbolCount = pairCount - imagePairs.length
symbolPairs = SYMBOLS.slice(0, symbolCount)
cards = [...imagePairs doubled with imageUrl, ...symbolPairs doubled with symbol]
shuffle(cards)
```

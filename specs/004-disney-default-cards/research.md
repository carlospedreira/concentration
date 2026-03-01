# Research: Emoji Default Cards

**Feature**: 004-disney-default-cards
**Date**: 2026-02-28

## R-001: Image Asset Strategy

**Decision**: Bundle Apple emoji images as static assets in `src/assets/emoji/` using Vite's static import system.

**Rationale**: The constitution mandates offline-first (Principle IV). External image fetching would break offline gameplay. Vite handles static image imports with content-hashing and automatic bundling, giving us cache-busting for free.

**Alternatives considered**:
- **External CDN**: Rejected — violates Offline-First principle; network dependency for core gameplay.
- **Base64-encoded inline**: Rejected — bloats JS bundle, slower initial parse, no lazy loading.
- **Public directory (`public/emoji/`)**: Considered — simpler but no content-hashing or tree-shaking. Acceptable fallback if import approach causes issues.

## R-002: Image Format and Optimization

**Decision**: Use WebP format at 200×200px resolution, targeting ~10-20KB per image. Total budget: ~720KB for 36 images.

**Rationale**: WebP provides 25-35% smaller files than PNG at equivalent quality. 200×200px is sufficient for the largest card display size (cards are never displayed larger than ~160px on a 2560px viewport). This keeps the total asset footprint under 1MB, well within PWA cache limits.

**Alternatives considered**:
- **AVIF**: Better compression but browser support still inconsistent (Safari only added full support recently). WebP has universal support.
- **SVG illustrations**: Excellent for scalability but we're using pre-rendered Apple emoji images, not vector art.
- **PNG**: Larger file sizes (~30-50KB each at 200px). Acceptable but WebP is strictly better for this use case.

## R-003: Image Sourcing

**Decision**: The implementation uses Apple emoji rendered as 200×200px WebP images. The code infrastructure is decoupled from specific image files via Vite glob imports, making it easy to swap themes later.

**Rationale**: Apple emoji are visually distinctive, universally recognizable, and provide a wide variety of animal, object, and character images suitable for a matching game. The filenames use descriptive kebab-case names (e.g., `lion.webp`, `rocket.webp`).

**Alternatives considered**:
- **Custom illustrations**: Higher design effort for a personal project. Apple emoji provide excellent visual quality out of the box.
- **Unicode emoji rendering**: Platform-dependent appearance; WebP exports ensure consistent look across all browsers and devices.

## R-004: Integration with Existing Board Generation

**Decision**: Modify `generateBoard()` internally to use emoji images as the default fallback path. The existing `SYMBOLS` array remains as a tertiary fallback for boards exceeding the emoji pool.

**Rationale**: The card component already renders `imageUrl` over `symbol` when present. By providing emoji image URLs through the same `imageUrl` field used by custom uploads, we reuse 100% of existing rendering logic. The priority chain becomes: custom uploads > emoji images > geometric symbols.

**Alternatives considered**:
- **Replace SYMBOLS entirely**: Rejected — spec edge case requires symbol fallback when board exceeds emoji pool.
- **New card type/variant**: Rejected — violates Simplicity First. The existing `imageUrl` field handles this perfectly.
- **Separate rendering path for "theme images"**: Rejected — over-engineering. The `imageUrl` field is already the right abstraction.

## R-005: Vite Static Import Pattern

**Decision**: Use Vite's `import.meta.glob` with `eager: true` to import all images from the emoji assets directory at build time.

**Rationale**: `import.meta.glob` discovers all files matching a pattern and returns resolved URLs after Vite processing (content-hashing, optimization). Using `eager: true` ensures all images are available synchronously — no async loading needed during game initialization.

**Pattern**:
```typescript
const emojiImages = import.meta.glob<{ default: string }>(
  '../assets/emoji/*.webp',
  { eager: true }
);
```

**Alternatives considered**:
- **Manual imports (36+ import statements)**: Works but tedious and error-prone. Glob is cleaner.
- **Dynamic `import()`**: Adds async complexity to board generation. Unnecessary since images are small enough to eager-load.
- **JSON manifest + public directory**: More moving parts, no content-hashing benefit.

## R-006: Fallback Strategy for Failed Image Loads

**Decision**: Use the existing `symbol` field as fallback text. Set each emoji card's `symbol` to the emoji's name (truncated to fit). Add an `onError` handler to the `<img>` element in the card component that hides the image and reveals the symbol text.

**Rationale**: Every card already carries a `symbol` string. By setting it to the emoji name (e.g., "Lion", "Rocket"), the fallback is meaningful and meets FR-005 ("meaningful fallback"). The card component already renders `symbol` when no `imageUrl` is present — we just need to handle the image-load-error case.

**Alternatives considered**:
- **Placeholder SVG icon**: Extra complexity for an edge case (bundled assets almost never fail to load). Violates Simplicity First.
- **Retry logic**: Over-engineering. Bundled static assets either load or don't.

## R-007: Random Selection per Game

**Decision**: Shuffle the full emoji image pool, then slice the first N images needed for the board. This satisfies FR-006 (random selection each game).

**Rationale**: Fisher-Yates shuffle is already implemented in `generateBoard()`. Apply the same approach to the emoji array before selecting pairs. Simple, proven, no new dependencies.

**Alternatives considered**:
- **Weighted random (recently-used tracking)**: Over-engineering for current scope. Could be a future enhancement.
- **Seed-based random**: No requirement for reproducible boards. Standard `Math.random()` is sufficient.

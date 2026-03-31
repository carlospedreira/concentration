# Research: Optimize Game Layout

**Date**: 2026-03-31
**Feature**: 006-optimize-game-layout

## R-001: Dynamic Board Width Strategy

**Decision**: Compute board max-width dynamically based on column count using an inline style, capped at a sensible maximum.

**Rationale**:
- The current `max-w-2xl` (672px) is appropriate for 4 columns but wastes space for 6-10 columns.
- A column-based calculation (`cols * cardSize + gaps + padding`) naturally scales — 4 columns stays compact, 10 columns fills the screen.
- Inline `style` for dynamic max-width is consistent with the existing pattern (`gridTemplateColumns` is already inline).
- A hard cap (1200px or the container width) prevents absurdity on ultra-wide screens.

**Alternatives considered**:
- **Tailwind responsive classes** (e.g., conditional `max-w-4xl`, `max-w-6xl`): Too coarse — doesn't scale smoothly with arbitrary column counts. Would need a class for every possible column count (2-10).
- **CSS `clamp()`**: Could work for width, but the column count is dynamic and must come from JS anyway. Adds complexity without benefit over inline style.
- **Viewport-width units** (`vw`): Risk of overshooting on ultra-wide screens. Harder to cap cleanly.
- **No max-width** (let the grid auto-size): Cards become absurdly large on desktop for small grids. Need the cap.

## R-002: Container Width for the App Shell

**Decision**: Use `max-w-6xl` (1152px) with `mx-auto` and responsive horizontal padding (`px-4 sm:px-6 lg:px-8`) as the shared app container.

**Rationale**:
- `max-w-6xl` (1152px) is a standard web content width — wide enough for 10 columns of cards while preventing content from stretching on 2560px+ monitors.
- Horizontal padding ensures content never touches screen edges on mobile.
- `mx-auto` centers the container — standard web convention.
- This matches common patterns seen in Tailwind UI, popular design systems, and most content-focused websites.

**Alternatives considered**:
- **`max-w-7xl`** (1280px): Slightly wider. Fine, but 1152px gives adequate space for 10 columns while feeling less stretched on 1440px screens.
- **`max-w-screen-xl`** (1280px): Same issue as above. Also, `max-w-6xl` is more standard Tailwind convention.
- **No max-width on container**: Content stretches edge-to-edge on wide screens — poor readability and aesthetics.
- **Container per-screen**: More duplication. A single wrapper in `App.tsx` is simpler (Constitution Principle I).

## R-003: Card Sizing Within the Dynamic Grid

**Decision**: Keep the existing `aspect-square` on cards and let the CSS grid auto-size them based on the container width and column count. No explicit card size needed.

**Rationale**:
- Cards already use `aspect-square` and `w-full` — they fill their grid cell.
- CSS grid with `repeat(cols, 1fr)` already distributes space evenly.
- By widening the container (R-001, R-002), cards automatically get larger — no additional card-level changes needed.
- The gap sizes (`gap-1.5 sm:gap-2.5 md:gap-3`) are proportionally fine for both small and large grids.

**Alternatives considered**:
- **Fixed pixel card sizes** (e.g., `width: 80px`): Inflexible, doesn't adapt to viewport. Would need breakpoints.
- **`minmax()` in grid**: Overkill when we control both the container width and column count.

## R-004: Where to Place the Container Wrapper

**Decision**: Add the container wrapper in `App.tsx`, wrapping all screen content. Individual screens keep their internal constraints.

**Rationale**:
- `App.tsx` is the layout root — it already conditionally renders setup, playing, and completion screens.
- A single wrapper here gives all screens consistent centering and padding without duplicating container classes in each component.
- Setup screen keeps its `max-w-sm` form; completion screen keeps its centered content — they just inherit the container's padding and centering.
- The game board overrides with its own dynamic max-width (wider than the form screens).

**Alternatives considered**:
- **Container in each screen component**: Duplication across 3 components. Harder to keep consistent.
- **Container in `index.css` on body/root**: Less explicit, harder to reason about. Better to have it in a React component.

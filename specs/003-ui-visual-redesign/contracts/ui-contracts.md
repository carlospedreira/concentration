# UI Contracts: Visual Redesign

**Feature Branch**: `003-ui-visual-redesign`
**Date**: 2026-02-28

## Contract: Card Component Visual Interface

The `CardComponent` exposes three visual states via the `data-state` attribute. Each state MUST produce a visually distinct rendering. The component's JSX structure changes from a single-layer to a three-layer 3D flip architecture.

### Required DOM Structure

```
div[data-testid="card-{id}"][data-state="{state}"]   ← Scene (perspective)
  └── div.card-inner                                   ← 3D transform target
       ├── div.card-back                               ← Face-down content
       └── div.card-front                              ← Face-up content (pre-rotated 180deg)
```

### State → CSS Class Mapping

| State | Scene Classes | Card-Inner Transform | Active Face | Additional Classes |
|-------|--------------|---------------------|-------------|-------------------|
| `faceDown` | `perspective-800 cursor-pointer` | `rotateY(0deg)` | `.card-back` | hover/active states enabled |
| `faceUp` | `perspective-800` | `rotateY(180deg)` | `.card-front` | — |
| `matched` | `perspective-800` | `rotateY(180deg)` | `.card-front` | match-pop animation, glow shadow, shimmer pseudo-element |

### Interaction Contract

| User Action | State Precondition | Visual Response | Timing |
|------------|-------------------|-----------------|--------|
| Hover over card | `faceDown` | `translateY(-2px)`, `scale(1.02)`, elevated shadow | < 100ms (SC-007) |
| Click card | `faceDown` | 3D flip to `faceUp` | 400ms |
| Two cards match | `faceUp` → `matched` | Scale pop + glow ring + shimmer sweep | 450ms pop, 700ms shimmer |
| Two cards don't match | `faceUp` → `faceDown` | 3D flip back (reverse) | 400ms |
| Hover over card | `faceUp` or `matched` | No hover effect | — |

### Accessibility Contract

| Condition | Behavior |
|-----------|----------|
| `prefers-reduced-motion: reduce` | All animations complete in 0.01ms; state changes still reflected via color/shadow |
| Keyboard focus | Focus ring visible on focusable cards |
| Screen reader | `data-state` attribute communicates card state |

---

## Contract: Screen Transition Interface

Each screen renders with an entrance animation on mount. No exit animation (React conditional rendering unmounts instantly).

| Screen | Animation | Duration | Easing |
|--------|-----------|----------|--------|
| SetupScreen | Fade in + rise 16px | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| GameBoard | Fade in + rise 16px | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| CompletionScreen | Fade in + rise 16px | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` |

---

## Contract: Button Interactive States

All buttons MUST provide visual feedback for every interaction state.

| State | Visual Treatment | Timing |
|-------|-----------------|--------|
| Default | Brand background, white text, subtle shadow | — |
| Hover | Lighten background, `translateY(-1px)`, elevated shadow | 150ms transition |
| Focus-visible | Outline ring with offset (2px solid, 3px offset) | Instant |
| Active/Press | `scale(0.98)`, darken background, reduce shadow | 50ms snap |
| Disabled | Reduced opacity, no hover/active effects | — |

---

## Contract: Input Interactive States

All form inputs MUST provide clear focus and interaction feedback.

| State | Visual Treatment |
|-------|-----------------|
| Default | Themed border, rounded corners |
| Hover | Border color shifts toward brand |
| Focus | Brand border color + outer glow ring (`box-shadow`) |
| Error | Red/danger border color (if applicable) |

---

## Contract: Design Token Boundary

All visual constants MUST be defined as Tailwind v4 `@theme` tokens in `src/index.css`. Components MUST NOT contain hardcoded color hex values, shadow definitions, or animation timings outside of the token system.

**Exception**: Tailwind's built-in utilities (e.g., `text-white`, `rounded-lg`) are acceptable where they align with the design system and don't conflict with custom tokens.

---

## Contract: Responsive Behavior

| Viewport | Card Grid Behavior | Typography Scale |
|----------|-------------------|-----------------|
| 320px–639px (mobile) | Tight gaps (`gap-1`), small padding | Base sizes |
| 640px–767px (sm) | Medium gaps (`gap-2`), medium padding | `sm:` scale-up |
| 768px+ (md) | Comfortable gaps, full padding | `md:` scale-up |

The card grid MUST remain usable at 10x10 (maximum grid size) on all viewports without horizontal scrolling.

# Quickstart: Dark Theme

**Date**: 2026-03-31
**Feature**: 008-dark-theme

## Overview

Replace the bright light theme with a dark color scheme. Update design tokens in `index.css` and fix hardcoded light-mode colors in components.

## Primary File to Modify

### `src/index.css`

Update all `@theme` design tokens:

**Surfaces** (dark backgrounds):
- `--color-surface`: Dark base → oklch(14% ...)
- `--color-surface-raised`: Slightly lighter → oklch(18% ...)
- `--color-surface-warm`: Warm dark → oklch(16% ...)

**Text** (light on dark):
- `--color-text-primary`: Near-white → oklch(92% ...)
- `--color-text-secondary`: Medium light → oklch(70% ...)
- `--color-text-muted`: Dim → oklch(50% ...)

**Brand (violet)** — lighten for dark backgrounds:
- Lower shades (50-200): Darkened (these are used for backgrounds)
- Higher shades (300-600): Lightened for text/borders on dark
- `--color-brand-800`: Lightened significantly (used for headings)

**Card colors** — richer on dark:
- `--color-card-back`: Slightly more saturated teal
- `--color-card-border`: Lighter border for visibility

**Shadows** — switch from dark to glow:
- `--shadow-card`: Light glow instead of dark drop shadow
- `--shadow-button`: Light glow
- `--shadow-card-hover`: Brighter glow on hover

## Component Files to Modify

### `src/components/card.tsx`
- Verify card face background works on dark theme
- Check `text-2xl` question mark color on dark card backs

### `src/components/setup-screen.tsx`
- `text-amber-600` → `text-amber-400` (brighter for dark backgrounds)
- `text-red-600` → `text-red-400` (brighter for dark backgrounds)

### `src/components/completion-screen.tsx`
- Trophy glow colors should work well on dark (may look even better)

### `src/components/grid-size-selector.tsx`
- Already uses design tokens — should adapt automatically
- Verify selected/unselected states are visually distinct on dark

## Test Scenarios

### Visual (manual)
1. Open app → dark background, light text, everything readable
2. Setup screen → preset buttons visible, selected state clear
3. Playing → cards face-down look premium on dark, face-up images clear
4. Match cards → glow effect visible on dark background
5. Completion → trophy and text look polished
6. Mobile (375px) → dark theme works at all sizes

### Automated
- All existing tests should pass (no structural changes)
- No new tests needed (visual theme is not unit-testable)

## Development Commands

```bash
npm test          # Run all tests — should all pass
npm run lint      # Run linter
npm run dev       # Start dev server for visual testing
```

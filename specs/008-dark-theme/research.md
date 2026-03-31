# Research: Dark Theme

**Date**: 2026-03-31
**Feature**: 008-dark-theme

## R-001: Dark Background Color

**Decision**: Use `oklch(14% 0.005 280)` as the base surface color — a very dark, slightly warm gray with a hint of the brand violet.

**Rationale**:
- Pure black (#000) feels flat and lifeless. A slight warmth/tint gives depth.
- 14% luminance is dark enough to be clearly "dark mode" while not being harsh.
- The subtle violet tint ties the background to the brand palette.
- WCAG AA: white text on 14% luminance backgrounds easily exceeds 4.5:1 contrast.

**Alternatives considered**:
- **Pure black (oklch(0% ...))**: Too stark, causes "black smearing" on OLED screens at low brightness.
- **Cool gray (oklch(14% 0.005 240))**: Blue tint feels cold/corporate, not "game night."
- **Warmer brown (oklch(14% 0.01 50))**: Conflicts with amber celebration colors.

## R-002: Card Back Design for Dark Theme

**Decision**: Keep the teal card backs but increase saturation slightly and add a subtle border glow effect instead of drop shadow.

**Rationale**:
- Teal on dark looks premium and eye-catching — teal is already the established card back color.
- Higher saturation (from oklch(36% 0.1 185) to oklch(38% 0.12 185)) compensates for the dark background absorbing color.
- A subtle border instead of a drop shadow provides visual separation without looking washed out.

**Alternatives considered**:
- **Gradient card backs**: More complex, harder to maintain, violates simplicity principle.
- **Lighter card backs**: Would reduce the dark-mode feel, cards should be darker than in light mode.
- **Completely new color**: Breaks visual continuity with the existing design.

## R-003: Shadow Strategy for Dark Mode

**Decision**: Replace drop shadows with subtle light borders and glow effects. Use `box-shadow` with light-colored low-opacity values instead of dark ones.

**Rationale**:
- Dark-on-dark drop shadows are invisible and useless.
- Subtle light glows (e.g., `0 0 0 1px oklch(100% 0 0 / 0.06)`) provide depth on dark backgrounds.
- For matched cards, the amber glow effect will actually look better on dark (the existing `shadow-card-matched` already uses a glow pattern).

**Alternatives considered**:
- **No shadows at all**: Flat design, loses depth. Cards need to feel "elevated."
- **Inset shadows**: Can work but harder to tune and less conventional.
- **Borders only**: Too flat, no sense of elevation.

## R-004: Component Audit — Hardcoded Colors

**Decision**: Audit and update all hardcoded color classes in components that bypass the design token system.

**Components with hardcoded colors to fix**:
- `setup-screen.tsx`: `text-amber-600` (excess image warning) → use a token or dark-appropriate amber
- `setup-screen.tsx`: `text-red-600` (error text) → use a brighter red for dark backgrounds
- `card.tsx`: `#ffffff` / white references → use surface token
- `completion-screen.tsx`: `rgb(251 191 36)` in trophy glow → keep as-is (amber glow looks great on dark)
- `grid-size-selector.tsx`: `bg-surface-raised`, `bg-brand-50` → already uses tokens, will update automatically
- `App.tsx`: No hardcoded colors — uses tokens via container classes

**Rationale**: Most colors are already tokenized. Only a few hardcoded Tailwind utilities need updating.

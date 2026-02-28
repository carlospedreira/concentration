# Data Model: UI Visual Redesign

**Feature Branch**: `003-ui-visual-redesign`
**Date**: 2026-02-28

> This feature is a purely visual/presentational redesign (FR-010). No game logic, state management, or data types change. This document defines the **design token system** — the visual data model that governs all rendering decisions.

## Entity: Design Tokens

The single source of truth for all visual constants. Defined in `src/index.css` via Tailwind v4's `@theme` block.

### Color Tokens

| Token | Role | Usage |
|-------|------|-------|
| `--color-surface` | Page background | App-wide background |
| `--color-surface-raised` | Elevated surface | Cards, panels, modals |
| `--color-surface-warm` | Warm-tinted surface | Card front face |
| `--color-brand-*` (50–900) | Primary brand scale | Buttons, headings, focus rings |
| `--color-card-back` | Card face-down fill | Card back face background |
| `--color-card-border` | Card face-down border | Card back face border |
| `--color-card-accent` | Card back decoration | Question mark, card back pattern |
| `--color-matched-*` | Match success palette | Glow, border, background for matched cards |
| `--color-text-primary` | Primary text | Headings, body |
| `--color-text-secondary` | Secondary text | Labels, captions |
| `--color-text-muted` | Muted text | Placeholders, disabled |

### Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `'Fredoka Variable', ui-rounded, 'Arial Rounded MT', sans-serif` | Headings, game title, move counter number |
| `--font-sans` | `'Nunito Variable', Seravek, Calibri, sans-serif` | Body text, labels, buttons, inputs |

### Shadow Tokens

| Token | Role |
|-------|------|
| `--shadow-card` | Default card elevation |
| `--shadow-card-hover` | Card hover state (face-down) |
| `--shadow-card-matched` | Matched card glow |
| `--shadow-button` | Button hover elevation |

### Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-card` | `0.75rem` | Card corners |
| `--radius-button` | `0.5rem` | Button corners |
| `--radius-input` | `0.5rem` | Input corners |

### Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--animate-flip` | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Card flip transition |
| `--animate-match-pop` | 450ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Scale bounce on match |
| `--animate-shimmer` | 700ms | `ease-out` | Shimmer sweep on matched card |
| `--animate-screen-enter` | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Screen entrance (fade + rise) |
| `--animate-burst` | 900ms | `ease-out` | Victory particle burst |
| `--animate-trophy-bounce` | 600ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Trophy entrance |
| `--animate-trophy-pulse` | 2000ms | `ease-in-out` | Trophy glow loop |

## Entity: Card Visual States

No change to the TypeScript `CardState` type (`"faceDown" | "faceUp" | "matched"`). The visual treatment per state is defined as CSS class mappings:

### State: `faceDown`

| Property | Treatment |
|----------|-----------|
| Background | `--color-card-back` (rich jewel tone) |
| Border | `--color-card-border` |
| Shadow | `--shadow-card` |
| Content | "?" in `--color-card-accent` |
| Cursor | `pointer` |
| Hover | `translateY(-2px)`, `scale(1.02)`, `--shadow-card-hover` |
| Active | `scale(0.98)`, shadow reduced |

### State: `faceUp`

| Property | Treatment |
|----------|-----------|
| Background | `--color-surface-warm` (light, warm) |
| Border | Subtle, light |
| Shadow | `--shadow-card` |
| Content | Symbol (styled text) or image (`object-cover`) |
| Cursor | `default` |
| Transition | 3D flip via `rotateY(180deg)`, 400ms |

### State: `matched`

| Property | Treatment |
|----------|-----------|
| Background | Warm tint (amber/gold family) |
| Border | `--color-matched-border` |
| Shadow | `--shadow-card-matched` (glow effect) |
| Content | Symbol or image, full opacity |
| Animation on enter | Scale pop (450ms) + shimmer sweep (700ms, 50ms delay) |
| Persistent | Glow ring via box-shadow |
| Cursor | `default` |

## Entity: Screen Layout Contracts

### Setup Screen
- Centered column layout, max-width constrained
- Visual hierarchy: Title (display font) → subtitle → form controls → action button
- Form controls: custom-styled inputs with focus rings, themed file upload
- Entrance animation: fade + rise (350ms)

### Game Board Screen
- Centered, max-width constrained grid
- Move counter: display font for number, sans font for label
- Card grid: dynamic columns, responsive gap scaling
- New Game button: secondary styling
- Entrance animation: fade + rise (350ms)

### Completion Screen
- Centered column with celebration elements
- Trophy/celebration visual (animated entrance)
- Particle burst effects (staggered)
- Stats display: move count in display font, prominent
- Play Again button: primary styling, inviting
- Entrance animation: fade + rise (350ms)

## Relationships

```
Design Tokens ──defines──▶ Card Visual States
Design Tokens ──defines──▶ Screen Layouts
Card Visual States ──rendered-by──▶ CardComponent
Screen Layouts ──rendered-by──▶ SetupScreen, GameBoard, CompletionScreen
```

## Validation Rules

- All color tokens MUST have sufficient contrast ratio (WCAG AA: 4.5:1 for text, 3:1 for large text)
- Animation tokens MUST be suppressed under `prefers-reduced-motion: reduce`
- Card states MUST be distinguishable without relying solely on color (use shadow, border, and animation as secondary signals)
- Font tokens MUST include system font fallbacks for offline resilience

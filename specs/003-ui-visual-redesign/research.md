# Research: UI Visual Redesign

**Feature Branch**: `003-ui-visual-redesign`
**Date**: 2026-02-28

## R-001: Tailwind CSS v4 Design Token System

**Decision**: Use Tailwind v4's CSS-native `@theme` block in `src/index.css` for all design tokens (colors, shadows, radii, animations, fonts).

**Rationale**: Tailwind v4 eliminates `tailwind.config.js` entirely. All customization lives in CSS via the `@theme` at-rule, which is compiled away at build time. Token name prefixes (`--color-*`, `--shadow-*`, `--radius-*`, `--font-*`, `--animate-*`) determine which utility classes are generated. This is zero-config — no new files, no JS configuration. Custom `@keyframes` are nested inside `@theme`.

**Alternatives considered**:
- `tailwind.config.js` (v3 pattern): Not supported in v4 with `@tailwindcss/vite`
- CSS Modules: Adds complexity; Tailwind utilities are sufficient
- CSS custom properties outside `@theme`: Works but doesn't generate utility classes

**Key pattern**:
```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(58% 0.233 277);
  --shadow-card: 0 4px 24px -4px rgb(0 0 0 / 0.3);
  --animate-flip: card-flip 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
  @keyframes card-flip { /* ... */ }
}
```

Custom 3D utilities (`perspective`, `transform-style`, `backface-visibility`) go in `@layer utilities` since they don't map to Tailwind's token prefixes.

---

## R-002: CSS 3D Card Flip Animation

**Decision**: Three-layer structure (scene → card-inner → front/back faces) with `perspective: 800px`, `transform-style: preserve-3d`, `backface-visibility: hidden`, and 400ms `rotateY` transition.

**Rationale**: This is the only correct approach for a realistic 3D card flip. Each layer has a non-negotiable role: the scene owns perspective (viewing frustum), the card-inner owns `preserve-3d` and receives the transform, and each face uses `backface-visibility: hidden` to show only when facing the viewer. The front face is pre-rotated 180deg so it appears right-side-up after the card flips.

**Duration**: 400ms — fast enough for rapid gameplay, slow enough that the 3D arc is perceptible. Well within the 600ms spec limit (SC-005). Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard).

**Alternatives considered**:
- 200ms: Too fast, mechanical feel
- 500-600ms: Accumulates fatigue during long games
- CSS `animation` instead of `transition`: Unnecessary complexity; transition on class toggle is simpler
- JavaScript animation library (Framer Motion, GSAP): Violates Simplicity First; CSS transitions are sufficient

**Implementation via `@layer utilities`**:
```css
@layer utilities {
  .perspective-800 { perspective: 800px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
}
```

**Performance**: `transform` is GPU-composited and never triggers layout or paint. `will-change: transform` on the card-inner promotes it to a GPU layer. Must be removed under `prefers-reduced-motion`.

**Safari caveat**: `-webkit-backface-visibility: hidden` is still required.

---

## R-003: Celebratory Visual Effects (CSS-Only)

**Decision**: Layered approach — matched cards get a scale-pop animation + persistent glow ring + shimmer sweep. Completion screen gets box-shadow particle bursts + trophy bounce-in. Screen transitions use entrance-only fade+rise animations.

**Rationale**: All effects use pure CSS (`@keyframes`, `box-shadow`, `::after` pseudo-elements, `conic-gradient`). No JavaScript animation libraries needed, maintaining Simplicity First compliance.

### Matched Card State
1. **Scale pop**: 450ms bounce (`scale(1) → 1.08 → 0.97 → 1`) signals "match found"
2. **Glow ring**: Persistent `box-shadow` with amber coloring distinguishes matched from face-up
3. **Shimmer sweep**: `::after` with diagonal gradient sweeps across card once, 700ms

### Victory Celebration
- **Box-shadow particle burst**: Single elements with 20+ `box-shadow` offsets, scaled from 0 → 1 with fade-out. Multiple burst elements with staggered delays.
- **Trophy icon**: Bounce-in entrance (600ms) + pulsing glow (2s infinite loop)

### Screen Transitions
- **Entrance animations only** (compatible with React conditional rendering): fade + translateY(16px → 0) over 350ms with `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out easing)

### Button Micro-interactions
- Hover: `translateY(-1px)` + colored shadow lift
- Active: `scale(0.98)` + shadow reduction (50ms snap)
- Focus-visible: outline ring with offset

**Alternatives considered**:
- Framer Motion `AnimatePresence`: Would enable exit animations for screen transitions but adds ~30KB runtime dependency — unjustified for entrance-only animations
- Canvas confetti (canvas-confetti): Runtime dependency, not CSS-only
- Lottie animations: Heavy dependency, over-engineered for this scope

---

## R-004: Typography

**Decision**: Self-hosted Fredoka (display/headings) + Nunito (body/labels) via `@fontsource-variable` npm packages.

**Rationale**: Fredoka is a rounded, bold display face with distinctive personality — reads as crafted and playful without being juvenile. Nunito is a warm, rounded sans-serif with excellent legibility at small sizes and clear character distinction (important for move counters). Together they establish a cohesive "sophisticated game" identity. Variable font versions cover all weights in single files.

**Delivery**: `@fontsource-variable/fredoka` and `@fontsource-variable/nunito` npm packages bundle `.woff2` files directly. Vite fingerprints and bundles them. `vite-plugin-pwa` precaches them automatically — fully offline-first compliant with zero configuration.

**Performance budget**: ~22KB (Fredoka variable, Latin) + ~32KB (Nunito variable, Latin) = **~54KB total**. Acceptable for two font families; cached permanently after first load.

**Loading strategy**: `font-display: swap` (already set by fontsource). System text shown for ~200-500ms on first-ever load, then fonts render from service worker cache on all subsequent loads.

**Alternatives considered**:
- System font stacks only (Rounded Sans + Humanist): Zero download cost but inconsistent across OS (Calibri on Windows vs. Seravek on macOS). Doesn't meet "distinctive visual identity" requirement.
- Google Fonts CDN: External network request violates Offline-First (Principle IV)
- Poppins + Roboto: Overused, associated with generic SaaS/edtech templates
- Syne + DM Sans: More editorial/designer feel — departs from "playful" brief

**Fallback stacks**:
- Headings: `'Fredoka Variable', ui-rounded, 'Arial Rounded MT', sans-serif`
- Body: `'Nunito Variable', Seravek, Calibri, sans-serif`

---

## R-005: Reduced Motion Strategy

**Decision**: Global CSS media query as baseline + Tailwind `motion-reduce:` variants for per-element precision.

**Rationale**: The global rule collapses all animation/transition durations to 0.01ms (not 0ms — 0ms can skip `transitionend` events in some browsers). This means color, shadow, and border changes still fire instantly (providing state feedback) while all movement is eliminated. Per-element `motion-reduce:` overrides handle cases where `will-change` should be reset.

**Pattern**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Non-motion feedback (color changes, border changes, box-shadow changes) still works — users with reduced-motion preferences still see state changes, just without movement.

---

## R-006: Color Palette Direction

**Decision**: Move from monochrome indigo to a richer palette with semantic color roles. Primary (deep indigo-violet for brand), accent (warm amber/gold for success/matched states), surface colors for depth, and clear state-specific colors.

**Rationale**: The current single-color (indigo) approach feels generic and doesn't create visual hierarchy. A well-defined palette with semantic roles (surface, brand, success, card-back, card-front) enables the three card states to be immediately distinguishable (FR-003) while maintaining cohesion across screens (FR-001).

**Direction** (exact values to be defined in design tokens):
- **Card back**: Rich, deep jewel tone (the hero color — sets the game's personality)
- **Card front**: Clean, light surface with subtle warmth
- **Matched state**: Warm amber/gold treatment (celebratory, not faded)
- **Background/surface**: Subtle gradient or textured feel, not flat white
- **Accents**: Complementary warm tones for buttons, focus rings, interactive states

**Constraint**: Single light theme only (dark mode out of scope per spec assumptions).

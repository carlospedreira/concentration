# Quickstart: UI Visual Redesign

**Feature Branch**: `003-ui-visual-redesign`
**Date**: 2026-02-28

## Prerequisites

```bash
git checkout 003-ui-visual-redesign
npm install
```

## New Dependencies

```bash
npm install @fontsource-variable/fredoka @fontsource-variable/nunito
```

These are the only new dependencies. Both are dev-time font packages that Vite bundles into the build output. No new runtime JavaScript dependencies.

## Key Files to Modify

| File | What Changes |
|------|-------------|
| `src/index.css` | Design tokens (`@theme`), custom utilities (`@layer utilities`), font imports, reduced-motion baseline, celebration keyframes |
| `src/components/card.tsx` | Three-layer 3D flip structure (scene → card-inner → front/back faces), state-specific styling, hover/active states, matched celebration classes |
| `src/components/game-board.tsx` | Updated card container styling, screen entrance animation |
| `src/components/setup-screen.tsx` | Themed form controls, visual hierarchy with display font, styled image upload area, screen entrance animation |
| `src/components/completion-screen.tsx` | Celebration effects (particle bursts, trophy animation), prominent stats display, screen entrance animation |
| `src/components/move-counter.tsx` | Display font for counter number, updated styling |
| `src/components/image-upload-panel.tsx` | Themed thumbnails, styled buttons, consistent with new design language |

## No Files to Create

This is a restyling of existing components. No new source files are needed. The design token system lives entirely in `src/index.css`.

## Development Workflow

```bash
# Start dev server — see changes live
npm run dev

# Verify no type errors
npm run lint

# Run tests — ALL existing tests must pass (FR-010)
npm test
```

## Architecture Notes

- **Design tokens**: All visual constants defined in `src/index.css` via `@theme` block. Components reference tokens via Tailwind utility classes (e.g., `bg-card-back`, `shadow-card`, `font-display`).
- **3D flip**: Card uses CSS `perspective` + `transform-style: preserve-3d` + `backface-visibility: hidden`. No JS animation library.
- **Celebrations**: CSS `@keyframes` for matched-card pop, shimmer sweep, victory particle bursts. All suppressed under `prefers-reduced-motion`.
- **Fonts**: Fredoka (headings) + Nunito (body) self-hosted via `@fontsource-variable` npm packages. Bundled by Vite, precached by service worker.
- **No game logic changes**: `FR-010` — the redesign is purely visual. Types, reducers, hooks, and utils are untouched.

## Testing the Redesign

1. **Existing tests**: `npm test` — all must pass unchanged
2. **Visual verification**: Play through a full game on dev server
3. **Responsive**: Test at 320px, 768px, and 1440px viewports
4. **Reduced motion**: Enable "Reduce motion" in OS settings, verify no decorative animations fire
5. **Card states**: Verify face-down, face-up, and matched are all immediately distinguishable
6. **Offline**: Build (`npm run build`), serve, go offline, verify fonts and styles load from cache

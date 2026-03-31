# Tasks: Dark Theme

**Input**: Design documents from `/specs/008-dark-theme/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Existing component tests serve as regression tests. No new test tasks — this is a visual/CSS change with no new functional behavior. All existing tests must pass after changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed — all changes are to existing files.

(No tasks in this phase)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update the design token system to dark theme values — this is the foundation that all component changes depend on.

**⚠️ CRITICAL**: Token changes must be complete before component adjustments.

- [x] T00x Update `src/index.css` — Replace all `@theme` surface tokens with dark values: `--color-surface` to `oklch(14% 0.005 280)` (dark base with slight violet tint), `--color-surface-raised` to `oklch(18% 0.008 280)` (slightly lighter dark for cards/panels), `--color-surface-warm` to `oklch(16% 0.012 60)` (warm dark for face-up card background).

- [x] T00x Update `src/index.css` — Replace all `@theme` text tokens with light values: `--color-text-primary` to `oklch(92% 0.01 280)` (near-white), `--color-text-secondary` to `oklch(70% 0.008 280)` (medium light gray), `--color-text-muted` to `oklch(50% 0.006 280)` (dimmed gray).

- [x] T00x Update `src/index.css` — Adjust `@theme` brand tokens for dark backgrounds: lighten the upper shades so they're visible on dark — `--color-brand-50` to `oklch(20% 0.02 295)`, `--color-brand-100` to `oklch(24% 0.04 295)`, `--color-brand-200` to `oklch(30% 0.06 295)`, `--color-brand-300` to `oklch(45% 0.1 295)`, `--color-brand-400` to `oklch(55% 0.15 295)`, `--color-brand-500` to `oklch(62% 0.2 295)`, `--color-brand-600` to `oklch(68% 0.2 295)` (primary action color — lighter for dark mode), `--color-brand-700` to `oklch(75% 0.17 295)`, `--color-brand-800` to `oklch(82% 0.12 295)` (headings — light on dark), `--color-brand-900` to `oklch(90% 0.06 295)`.

- [x] T00x Update `src/index.css` — Adjust `@theme` card tokens: `--color-card-back` to `oklch(38% 0.12 185)` (richer teal for dark background), `--color-card-border` to `oklch(48% 0.1 185)` (lighter border for visibility), `--color-card-accent` to `oklch(60% 0.08 185)` (brighter question mark).

- [x] T00x Update `src/index.css` — Adjust `@theme` matched tokens for glow on dark: `--color-matched` to `oklch(25% 0.04 78)` (dark warm background for matched card face), `--color-matched-border` to `oklch(65% 0.14 65)` (visible amber border), `--color-matched-glow` to `oklch(70% 0.14 65)` (bright amber glow).

- [x] T00x Update `src/index.css` — Replace `@theme` shadow tokens with dark-mode glow effects: `--shadow-card` to `0 0 0 1px oklch(100% 0 0 / 0.06), 0 0 8px -2px oklch(100% 0 0 / 0.04)` (subtle light border + glow), `--shadow-card-hover` to `0 0 0 1px oklch(100% 0 0 / 0.1), 0 0 20px -4px oklch(100% 0 0 / 0.08)` (brighter glow on hover), `--shadow-card-matched` keep existing glow pattern but adjust opacity — `0 0 0 3px oklch(70% 0.14 65 / 0.5), 0 0 24px oklch(70% 0.14 65 / 0.25)`, `--shadow-button` to `0 0 12px -3px oklch(100% 0 0 / 0.1)` (soft glow), keep `--shadow-card` for the grid-size-selector buttons too.

- [x] T00x Update `src/index.css` — In the `@layer base` section, confirm that `body` background-color uses `var(--color-surface)` and color uses `var(--color-text-primary)` — these should already be set and will automatically pick up the new dark values.

- [x] T008 Run all existing tests (`npm test -- --run`) to confirm no structural regressions from token changes. Run linter (`npm run lint`).

**Checkpoint**: Design tokens are fully dark. The app background, text, and token-based colors are now dark-themed. Components using tokens adapt automatically.

---

## Phase 3: User Story 1 - Dark Theme as Default (Priority: P1) 🎯 MVP

**Goal**: All screens look polished in dark mode — fix any hardcoded light-mode colors in components.

**Independent Test**: Open the app in dev server and verify dark backgrounds, light text, readable buttons across all three screens.

### Implementation for User Story 1

- [x] T009 [P] [US1] Modify `src/components/setup-screen.tsx`: change `text-amber-600` (line with excess image warning) to `text-amber-400` for better visibility on dark backgrounds. Change `text-red-600` (validation error, if still present) to `text-red-400`. These are the only hardcoded Tailwind color utilities in this file.

- [x] T010 [P] [US1] Modify `src/components/grid-size-selector.tsx`: verify that selected button uses `bg-brand-50` and `border-brand-600` (these are now dark-appropriate via updated tokens). If `text-brand-800` on the selected button is too light, adjust to `text-brand-700` or `text-brand-900`. Verify unselected buttons use `bg-surface-raised` and `border-brand-100` which are now dark via tokens.

- [x] T011 [P] [US1] Modify `src/components/card.tsx`: verify the card back `?` text uses `text-card-accent` (token, auto-updated). Verify the face-up card background classes — `bg-surface-warm` for normal face-up and `bg-matched` for matched — are token-based and auto-updated. Check that the `border-brand-100` on face-up cards is now dark-appropriate via tokens. If the face-up card text symbol (`text-2xl sm:text-3xl md:text-4xl`) has no explicit color, it inherits `text-primary` which is now light — verify this provides good contrast against `bg-surface-warm`.

- [x] T012 [P] [US1] Modify `src/components/completion-screen.tsx`: the trophy glow uses hardcoded `rgb(251 191 36)` in keyframes — this is amber and will look great on dark. Verify the `text-brand-800` heading class renders as light text (auto via token update). Verify `text-brand-600` move count is now lighter via token update. No changes expected — just verification.

- [x] T013 [P] [US1] Verify `src/App.tsx`: the container wrapper has no hardcoded colors — it uses the design token system via `min-h-screen` and inherits `body` background. No changes expected.

- [x] T014 [P] [US1] Verify `src/components/move-counter.tsx` and `src/components/image-upload-panel.tsx`: check for any hardcoded color classes that need adjustment for dark mode. Update any that use light-only Tailwind utilities.

- [x] T015 [US1] Run all tests (`npm test -- --run`) and linter (`npm run lint`) to confirm zero failures.

**Checkpoint**: All screens are dark-themed with no visual artifacts. Run `npm test && npm run lint`.

---

## Phase 4: User Story 2 - Cards Look Great in Dark Theme (Priority: P2)

**Goal**: Fine-tune card appearance specifically — face-down premium feel, face-up clarity, matched glow effect.

**Independent Test**: Play a full game and evaluate each card state visually.

### Implementation for User Story 2

- [x] T016 [US2] Review card back appearance in `src/components/card.tsx`: the face-down card uses `bg-card-back border-2 border-card-border shadow-card`. With updated tokens, verify the teal back with lighter border and glow shadow looks premium on dark. If the `?` symbol is hard to see, adjust `text-card-accent` token in `src/index.css` to be brighter.

- [x] T017 [US2] Review card face-up appearance: the face-up card uses `bg-surface-warm border border-brand-100 shadow-card`. Verify uploaded images and emoji images display clearly against the warm dark background. If images appear too dark, consider lightening `--color-surface-warm` slightly in `src/index.css`.

- [x] T018 [US2] Review matched card appearance: matched cards use `bg-matched border-2 border-matched-border shadow-card-matched card-shimmer`. The glow shadow and shimmer effect should look vivid on dark backgrounds. Verify the shimmer sweep (`linear-gradient` in `card-shimmer::after`) is visible — adjust the white opacity in `src/index.css` if the shimmer is too faint on the dark matched background (increase from `rgb(255 255 255 / 0.25)` to `rgb(255 255 255 / 0.35)` if needed).

- [x] T019 [US2] Run all tests and linter to confirm no regressions: `npm test -- --run && npm run lint`.

**Checkpoint**: Cards look polished in all three states on dark backgrounds.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and PWA manifest update

- [x] T020 Check if `index.html` or PWA manifest has a `theme-color` meta tag or manifest field that needs updating from a light color to a dark color. If found, update to match the new `--color-surface` value.

- [x] T021 Run full test suite (`npm test`) and linter (`npm run lint`) to confirm zero failures and zero warnings.

- [x] T022 Manual smoke test: start dev server (`npm run dev`), verify all screens (setup, playing, completion) are consistently dark-themed. Test card states (face-down, face-up, matched). Test on mobile viewport (375px). Verify reduced-motion media query still works (card flip transitions are disabled).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on Phase 2 (tokens must be dark first)
- **User Story 2 (Phase 4)**: Depends on US1 (general dark theme must be in place before card fine-tuning)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2) only
- **US2 (P2)**: Depends on US1 — card fine-tuning builds on the base dark theme

### Parallel Opportunities

- T001-T007 are all in `src/index.css` — must run sequentially (same file)
- T009-T014 can all run in parallel (different component files)
- T016-T018 are sequential (iterative visual refinement of cards)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Update all design tokens (T001-T008)
2. Complete Phase 3: Fix hardcoded colors in components (T009-T015)
3. **STOP and VALIDATE**: App is dark-themed — `npm test && npm run lint`

### Incremental Delivery

1. Design tokens → Dark foundation
2. US1 → All screens dark-themed (MVP!)
3. US2 → Card-specific refinements
4. Polish → PWA manifest, full validation

---

## Notes

- Total tasks: 22
- US1 tasks: 7 (T009-T015)
- US2 tasks: 4 (T016-T019)
- Foundational: 8 (T001-T008)
- Polish: 3 (T020-T022)
- No new tests — this is a visual/CSS change. Existing tests serve as structural regression tests.
- Token changes (Phase 2) are the core — most components adapt automatically via the design token system.
- US2 is primarily visual fine-tuning — may require iterative adjustment based on dev server preview.
- All OKLCH values are approximate — may need tweaking during visual testing.

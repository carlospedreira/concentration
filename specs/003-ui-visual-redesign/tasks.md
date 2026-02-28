# Tasks: UI Visual Redesign

**Input**: Design documents from `/specs/003-ui-visual-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: Not requested. All existing tests must pass unchanged (FR-010). No new test tasks generated.

**Organization**: Tasks are grouped by user story. This is a purely visual/CSS redesign — no game logic changes. All tasks modify existing files; no new source files are created.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install new font dependencies required by the visual redesign

- [x] T001 Install `@fontsource-variable/fredoka` and `@fontsource-variable/nunito` font packages via npm

---

## Phase 2: Foundational (Design Token System)

**Purpose**: Build the complete design token system in `src/index.css` that ALL component styling depends on. This is the single source of truth for the visual identity.

**CRITICAL**: No component restyling can begin until this phase is complete.

- [x] T002 Add font imports and define color, typography, shadow, and radius design tokens in `@theme` block in `src/index.css`
- [x] T003 Define animation `@keyframes` (card-flip, match-pop, shimmer, screen-enter, particle-burst, trophy-bounce, trophy-pulse) and animation tokens in `@theme` block in `src/index.css`
- [x] T004 Add custom 3D transform utilities (`perspective-800`, `preserve-3d`, `backface-hidden`, `rotate-y-180`) in `@layer utilities` and `prefers-reduced-motion` baseline media query in `src/index.css`

**Checkpoint**: Design token system complete — all utility classes available for component work

---

## Phase 3: User Story 1 — Polished Game Board Experience (Priority: P1) MVP

**Goal**: Transform the game board into a visually engaging experience with 3D card flips, distinct card states, and satisfying matched-card celebrations. The card grid is the hero of the app — this phase delivers the core "this looks great" value.

**Independent Test**: Launch the app, start a game, flip cards, match pairs. All three card states (face-down, face-up, matched) should be immediately distinguishable. Flip animations feel smooth and dimensional. Matched state feels celebratory.

### Implementation for User Story 1

- [x] T005 [US1] Restructure card component to three-layer 3D flip architecture (scene with `perspective-800` → `card-inner` with `preserve-3d` and flip transition → `card-back`/`card-front` faces with `backface-hidden`) and apply state-specific visual styling (faceDown: jewel-tone back with hover lift; faceUp: warm surface with symbol/image; matched: warm tint with glow shadow) in `src/components/card.tsx`
- [x] T006 [US1] Add matched card celebration effects: scale-pop animation (`animate-match-pop`), persistent glow ring (`shadow-card-matched`), and shimmer sweep via `::after` pseudo-element on matched state in `src/components/card.tsx`
- [x] T007 [P] [US1] Update game board grid with themed styling (responsive gap scaling, max-width constraint, surface background) and restyle New Game link as secondary text button in `src/components/game-board.tsx`
- [x] T008 [P] [US1] Apply display font (`font-display`) to move count number and themed styling (secondary text color, sans font for label) to move counter in `src/components/move-counter.tsx`

**Checkpoint**: Game board is fully restyled with 3D card flips, distinct states, and matched celebrations. Core visual value delivered.

---

## Phase 4: User Story 2 — Distinctive Visual Identity (Priority: P1)

**Goal**: Establish a recognizable visual personality that goes beyond generic default styling. The design feels intentional and cohesive across all screens.

**Independent Test**: Navigate between all three screens (setup, game board, completion). All share a consistent color palette, typography, and design language. The app looks distinctive — not like a default framework template.

**Note**: The foundational design token system (Phase 2) delivers the majority of US2. This phase covers the remaining global/document-level styling that ensures tokens are applied as default page styles.

### Implementation for User Story 2

- [x] T009 [US2] Add `@layer base` styles applying design tokens as document defaults (page `background-color` using surface token, `font-family` using sans token, `color` using text-primary token, smooth-scroll) in `src/index.css`

**Checkpoint**: Visual identity system is complete. All screens inherit the cohesive design language through base styles + design tokens.

---

## Phase 5: User Story 3 — Engaging Setup Screen (Priority: P2)

**Goal**: Transform the setup screen into a warm, inviting entry point. Configuration feels simple and fun. Form controls are polished and the image upload area is visually integrated.

**Independent Test**: Load the app, interact with row/column inputs and image upload. Visual quality of the setup experience should feel polished with clear hierarchy and consistent theming.

### Implementation for User Story 3

- [x] T010 [US3] Restyle setup screen with display font title (`font-display`), themed form controls (brand-colored focus rings, rounded inputs), visual hierarchy (title → subtitle → controls → action), surface-raised card wrapper, and screen entrance animation (`animate-screen-enter`) in `src/components/setup-screen.tsx`
- [x] T011 [P] [US3] Restyle image upload panel with themed file input (brand background on file button), styled thumbnail list (surface-raised items, rounded image thumbnails), and consistently themed reorder/remove action buttons in `src/components/image-upload-panel.tsx`

**Checkpoint**: Setup screen is fully restyled. All form controls and upload UI are consistent with the visual identity.

---

## Phase 6: User Story 4 — Celebratory Completion Experience (Priority: P2)

**Goal**: Make the completion screen feel like a celebration and achievement. The victory moment is emotionally rewarding and encourages replay.

**Independent Test**: Complete a game (small grid for speed). The completion screen should feel celebratory — not a static page swap. Trophy animation, particle effects, and prominent stats make the moment feel earned.

### Implementation for User Story 4

- [x] T012 [US4] Restyle completion screen with trophy/celebration emoji entrance animation (`animate-trophy-bounce` + `animate-trophy-pulse` glow loop), CSS box-shadow particle burst effects (multiple staggered `animate-burst` elements), prominent move count in display font, inviting Play Again button with primary brand styling, and screen entrance animation (`animate-screen-enter`) in `src/components/completion-screen.tsx`

**Checkpoint**: Completion screen delivers a rewarding, celebratory experience with animated effects.

---

## Phase 7: User Story 5 — Micro-interactions and Motion (Priority: P3)

**Goal**: Add a polished motion layer across all interactive elements. Buttons respond to interaction, screen transitions feel smooth, and the experience has a refined, animated quality without being distracting.

**Independent Test**: Interact with all clickable elements across all screens. Hover states, press states, and focus rings should feel responsive and polished. Navigate between screens — transitions should feel smooth rather than hard cuts.

### Implementation for User Story 5

- [x] T013 [P] [US5] Add button interactive states (hover: `translateY(-1px)` + elevated shadow; focus-visible: outline ring with offset; active: `scale(0.98)` + reduced shadow) and input interactive states (hover: border color shift; focus: brand border + glow ring) to Start Game button and form inputs in `src/components/setup-screen.tsx`
- [x] T014 [P] [US5] Add button interactive states (hover lift, focus-visible ring, active press) to New Game button in `src/components/game-board.tsx`
- [x] T015 [P] [US5] Add button interactive states (hover lift, focus-visible ring, active press) to Play Again button in `src/components/completion-screen.tsx`
- [x] T016 [P] [US5] Add button interactive states (hover, focus-visible, active) to file input button, reorder buttons, and remove buttons in `src/components/image-upload-panel.tsx`

**Checkpoint**: All interactive elements provide visible feedback. The experience feels responsive and polished throughout.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and validation across all user stories

- [x] T017 Run existing test suite and lint to verify zero behavioral regressions (`npm test && npm run lint`) per FR-010
- [ ] T018 Run quickstart.md validation checklist: verify responsive design (320px, 768px, 1440px), reduced-motion behavior, card state distinguishability, and offline font loading

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (font packages must be installed) — BLOCKS all component work
- **US1 (Phase 3)**: Depends on Phase 2 — delivers MVP game board
- **US2 (Phase 4)**: Depends on Phase 2 — can run parallel with US1
- **US3 (Phase 5)**: Depends on Phase 2 — can run parallel with US1/US2
- **US4 (Phase 6)**: Depends on Phase 2 — can run parallel with US1/US2/US3
- **US5 (Phase 7)**: Depends on US1, US3, US4 (adds motion layer to already-styled components)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on other stories. **MVP target.**
- **US2 (P1)**: After Phase 2 — independent of US1 (different files)
- **US3 (P2)**: After Phase 2 — independent of US1/US2 (different files)
- **US4 (P2)**: After Phase 2 — independent of US1/US2/US3 (different file)
- **US5 (P3)**: After US1 + US3 + US4 — adds micro-interactions to components already restyled by earlier stories

### Within Each User Story

- Card restructure (T005) before celebration effects (T006) — same file, builds on structure
- All other tasks within a story are independent ([P] marked)

### Parallel Opportunities

- **Phase 3**: T007 (game-board.tsx) and T008 (move-counter.tsx) can run parallel with each other and with T005/T006
- **Phase 3–6**: After Phase 2, US1/US2/US3/US4 can all run in parallel (all different files)
- **Phase 7**: T013, T014, T015, T016 can all run in parallel (all different files)

---

## Parallel Example: User Story 1

```
# After Phase 2 completes, launch parallel work:

# Sequential (same file — card.tsx):
Task T005: "Restructure card to 3D flip architecture in src/components/card.tsx"
Task T006: "Add matched celebration effects in src/components/card.tsx"

# Parallel with card work (different files):
Task T007: "Update game board grid styling in src/components/game-board.tsx"
Task T008: "Apply display font to move counter in src/components/move-counter.tsx"
```

## Parallel Example: All P1 Stories

```
# After Phase 2, US1 and US2 can proceed simultaneously:

# Developer A (US1 — game board):
Task T005 → T006 (card.tsx, sequential)
Task T007 (game-board.tsx, parallel)
Task T008 (move-counter.tsx, parallel)

# Developer B (US2 — visual identity):
Task T009 (index.css base styles)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Install font packages
2. Complete Phase 2: Build design token system in `src/index.css`
3. Complete Phase 3: Restyle game board (card 3D flip, states, celebrations)
4. **STOP and VALIDATE**: Play a full game — cards flip smoothly, states are distinct, matches celebrate
5. The game board — where players spend 90% of their time — now looks polished

### Incremental Delivery

1. Phase 1 + 2 → Design system ready
2. Add US1 (game board) → Test independently → **MVP!**
3. Add US2 (base styles) → Cross-screen consistency ✓
4. Add US3 (setup screen) → Polished entry point ✓
5. Add US4 (completion screen) → Celebratory victory ✓
6. Add US5 (micro-interactions) → Button/input polish across all screens ✓
7. Phase 8: Validate everything together

### Single Developer Strategy (Recommended)

With one developer, execute sequentially in priority order:
1. Setup + Foundational (Phases 1–2)
2. US1 game board (Phase 3) — biggest visual impact
3. US2 base styles (Phase 4) — quick, high-value
4. US3 setup screen (Phase 5) — entry point polish
5. US4 completion screen (Phase 6) — victory moment
6. US5 micro-interactions (Phase 7) — final polish layer
7. Validate (Phase 8)

---

## Notes

- **No new source files**: All tasks modify existing files. Design tokens live in `src/index.css`.
- **FR-010 compliance**: Zero game logic changes. Types, reducers, hooks, and utils are untouched.
- **Font size**: ~54KB total (Fredoka ~22KB + Nunito ~32KB woff2). Cached by service worker after first load.
- **Reduced motion**: Global `prefers-reduced-motion` baseline in Phase 2 suppresses all decorative animations. State feedback (colors, shadows, borders) still works.
- **Safari**: 3D flip utilities include `-webkit-backface-visibility: hidden` prefix.
- Commit after each task or logical group.
- Stop at any checkpoint to validate the current story independently.

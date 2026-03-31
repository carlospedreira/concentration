# Tasks: Optimize Game Layout

**Input**: Design documents from `/specs/006-optimize-game-layout/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Included — constitution mandates Test-Driven Development (Principle II).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup tasks needed — all changes are modifications to existing files. No new dependencies or files.

(No tasks in this phase)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create a helper function for computing dynamic board max-width, shared by US1 tests and implementation.

### Tests

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T001 Add test in `tests/components/game-board.test.tsx`: verify that when rendered with `cols=10`, the game board grid container has a `maxWidth` inline style that is greater than 672px (the old `max-w-2xl` cap). Also verify that when rendered with `cols=4`, the `maxWidth` is less than or equal to 672px. This validates dynamic scaling based on column count.

- [x] T002 Add test in `tests/components/game-board.test.tsx`: verify that the game board grid container does NOT have the class `max-w-2xl` (the old fixed cap has been removed).

**Checkpoint**: Tests written and failing. Ready for implementation.

---

## Phase 3: User Story 1 - Game Board Fills Available Space on Large Grids (Priority: P1) 🎯 MVP

**Goal**: The game board dynamically scales its width based on column count, using more horizontal space for larger grids while keeping smaller grids compact.

**Independent Test**: Start a 10x10 game on desktop — the board fills most of the viewport width. Start a 4x4 game — the board stays compact and centered.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US1] Add test in `tests/components/game-board.test.tsx`: verify that the game board grid container has `w-full` and `mx-auto` classes (centered within its parent, takes full available width up to the max).

- [x] T004 [P] [US1] Add test in `tests/components/game-board.test.tsx`: verify that the `maxWidth` inline style value scales proportionally — rendering with `cols=8` produces a larger `maxWidth` than rendering with `cols=4`.

### Implementation for User Story 1

- [x] T005 [US1] Modify `src/components/game-board.tsx`: remove the `max-w-2xl` class from the grid container div. Add a computed `maxWidth` to the existing inline `style` object. The formula: `const maxWidth = Math.min(cols * 100 + (cols - 1) * 12 + 40, 1152)` — this gives ~100px per card column + 12px gaps + 40px padding, capped at 1152px (the container max-width). Keep `w-full mx-auto` classes for centering. The style object becomes `{ gridTemplateColumns: \`repeat(\${cols}, 1fr)\`, maxWidth }`.

- [x] T006 [US1] Run tests T001-T004 to confirm all pass. Run `npm test -- --run tests/components/game-board.test.tsx` and verify zero failures.

**Checkpoint**: User Story 1 complete. Large grids use more space, small grids stay compact. Run `npm test && npm run lint`.

---

## Phase 4: User Story 2 - Consistent Container Layout Across All Screens (Priority: P2)

**Goal**: All screens (setup, playing, completion) share a consistent centered container with proper padding and max-width.

**Independent Test**: Navigate all three screens and verify consistent horizontal alignment, padding, and centering.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US2] Add test in `tests/components/game-board.test.tsx` (or a new App-level test): verify that the game board's parent container (rendered in App.tsx) has appropriate container classes. Since App.tsx conditionally renders screens, test the playing state: render the App component (or verify the wrapper div in GameBoard's parent has `mx-auto` and responsive padding classes). Alternatively, add a simpler structural test: verify the outermost wrapper div rendered by App during playing state includes `mx-auto` and `px-4` classes.

- [x] T008 [P] [US2] Add test in `tests/components/setup-screen.test.tsx`: verify that the setup screen content is centered and does not stretch beyond its intended width — the setup form container still has `max-w-sm` class.

- [x] T009 [P] [US2] Add test in `tests/components/completion-screen.test.tsx`: verify that the completion screen content is centered — the wrapper div has `items-center` class.

### Implementation for User Story 2

- [x] T010 [US2] Modify `src/App.tsx`: wrap all conditional screen rendering in a shared container `<div>` with classes `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen`. The playing state's existing wrapper div (`min-h-screen flex flex-col items-center py-4 gap-4`) moves inside this container and drops its own `min-h-screen` (the outer container handles that). The setup and completion screens render directly inside the container.

- [x] T011 [US2] Modify `src/components/setup-screen.tsx`: remove the `p-6 sm:p-8` padding from the outermost div (the shared container now provides horizontal padding). Add `py-6 sm:py-8` to preserve vertical padding only. Ensure the `max-w-sm` form card and centering remain intact.

- [x] T012 [US2] Modify `src/components/completion-screen.tsx`: same as setup — remove `p-6 sm:p-8` from outermost div, add `py-6 sm:py-8` for vertical padding only. Centering and content structure remain unchanged.

- [x] T013 [US2] Run all tests to confirm no regressions: `npm test -- --run` and verify all pass. Run `npm run lint` and verify zero errors.

**Checkpoint**: User Story 2 complete. All screens share consistent container. Run `npm test && npm run lint`.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T014 Run full test suite (`npm test`) and linter (`npm run lint`) to confirm zero failures and zero warnings.
- [x] T015 Manual smoke test: start dev server (`npm run dev`), test with 4x4 grid (compact), 6x8 grid (medium), and 10x10 grid (fills most of screen). Verify consistent centering across setup, playing, and completion screens. Test on mobile viewport (375px) and desktop (1440px). Resize browser mid-game to verify fluid adaptation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on Phase 2 tests being written
- **User Story 2 (Phase 4)**: Can run independently of US1, but recommended after US1 since the container wraps the board
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — modifies only `game-board.tsx`
- **User Story 2 (P2)**: Depends on US1 for the game board to already be using dynamic width (the container needs to accommodate it)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle II)
- Component-level changes before integration-level changes
- Story complete before moving to next priority

### Parallel Opportunities

- T003 and T004 can run in parallel (same file, independent test cases)
- T007, T008, T009 can run in parallel (different test files)
- T011 and T012 can run in parallel (different source files)

---

## Parallel Example: User Story 2

```text
# Launch all US2 tests in parallel:
Task T007: "Test container classes on App playing state"
Task T008: "Test setup screen max-w-sm preserved"
Task T009: "Test completion screen centering preserved"

# Then launch parallel implementation:
Task T011: "Adjust setup-screen.tsx padding"
Task T012: "Adjust completion-screen.tsx padding"
# T010 (App.tsx container) must run first since T011/T012 depend on the container existing
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational tests (T001-T002)
2. Complete Phase 3: User Story 1 (T003-T006)
3. **STOP and VALIDATE**: Board now dynamically scales — `npm test && npm run lint`
4. This alone delivers the core user value (larger grids use more space)

### Incremental Delivery

1. Foundational tests → Dynamic board width (MVP!)
2. User Story 2 → Shared container for all screens
3. Polish → Full validation and smoke test

---

## Notes

- Total tasks: 15
- US1 tasks: 4 (T003-T006)
- US2 tasks: 7 (T007-T013)
- Foundational: 2 (T001-T002)
- Polish: 2 (T014-T015)
- No new files or dependencies — all modifications to existing components
- The dynamic max-width formula (`cols * 100 + (cols - 1) * 12 + 40`, capped at 1152px) can be tuned during visual testing in T015
- All production code must have explicit return types (Constitution Principle III)
- No `any` types allowed (Constitution Principle III)

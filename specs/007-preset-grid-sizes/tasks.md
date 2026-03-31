# Tasks: Preset Grid Sizes

**Input**: Design documents from `/specs/007-preset-grid-sizes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included — constitution mandates Test-Driven Development (Principle II).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the preset data module that all user stories depend on

- [x] T001 Create `src/utils/grid-presets.ts` exporting: a `GridPreset` type (`{ readonly rows: number; readonly cols: number; readonly label: string; readonly cards: number }`), a `GRID_PRESETS` readonly array of 9 presets in order: 3x4 (12), 4x4 (16), 4x5 (20), 4x6 (24), 5x6 (30), 6x6 (36), 6x7 (42), 7x8 (56), 8x8 (64) — each with label formatted as `"RxC"` and cards as `rows * cols`, and a `DEFAULT_PRESET_INDEX` constant set to `1` (4x4). All exports must have explicit types.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tests and implementation for the preset data and updated storage utility

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T002 [P] Create test file `tests/utils/grid-presets.test.ts` with: (1) GRID_PRESETS has exactly 9 entries, (2) all presets have even total cards, (3) all presets have rows between 2-10 and cols between 2-10, (4) each label matches `"RxC"` format (rows + "x" + cols), (5) each cards field equals rows * cols, (6) DEFAULT_PRESET_INDEX is 1, (7) preset at DEFAULT_PRESET_INDEX is 4x4.

- [x] T003 [P] Rewrite `tests/utils/grid-storage.test.ts` for the new API: replace all existing tests with: (1) `loadPresetIndex` returns `1` (default) when localStorage is empty, (2) returns stored index when valid (e.g., store `{ presetIndex: 5 }` → returns 5), (3) returns default when stored data is old `{ rows, cols }` format, (4) returns default when stored JSON is malformed, (5) returns default when presetIndex is out of bounds (e.g., 99 or -1), (6) returns default when presetIndex is not a number, (7) `savePresetIndex` writes `{ presetIndex }` JSON to localStorage, (8) round-trip: save then load returns same index, (9) uses localStorage not sessionStorage. Import `GRID_PRESETS` from grid-presets to validate bounds.

### Implementation

- [x] T004 Rewrite `src/utils/grid-storage.ts`: replace `loadGridSize`/`saveGridSize` with `loadPresetIndex(): number` and `savePresetIndex(index: number): void`. `loadPresetIndex` reads from `localStorage.getItem(GRID_STORAGE_KEY)`, parses JSON as `unknown`, checks for `presetIndex` field that is a number in range 0 to `GRID_PRESETS.length - 1`, returns `DEFAULT_PRESET_INDEX` on any failure (missing, old format, bad JSON, out of bounds). `savePresetIndex` writes `JSON.stringify({ presetIndex: index })`. Keep `GRID_STORAGE_KEY` exported. Remove the old `loadGridSize`/`saveGridSize` exports. No `any` types. Run tests T002-T003 to confirm all pass.

**Checkpoint**: Preset data and storage are tested and implemented. User stories can now proceed.

---

## Phase 3: User Story 1 - Select Grid Size from Predefined Options (Priority: P1) 🎯 MVP

**Goal**: Replace number inputs with a 3x3 visual grid of 9 preset sizes. Player taps one to select it, presses Start to play.

**Independent Test**: Open setup screen, see 9 size options, tap one, verify it's highlighted, press Start, verify game starts with correct dimensions.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Create test file `tests/components/grid-size-selector.test.tsx` with: (1) renders exactly 9 buttons, (2) each button contains the preset label (e.g., "3x4") and card count (e.g., "12 cards"), (3) the button at `selectedIndex` has a distinct selected class or aria-pressed="true", (4) clicking a non-selected button calls `onChange` with that button's index, (5) clicking the already-selected button does not call `onChange`. Props: `presets: GRID_PRESETS`, `selectedIndex: number`, `onChange: (index: number) => void`.

- [x] T006 [P] [US1] Update `tests/components/setup-screen.test.tsx`: (1) remove the test for number inputs ("renders rows and cols inputs" — replace with a test that rows/cols number inputs do NOT exist), (2) add test: renders 9 grid size option buttons, (3) add test: selecting a preset and clicking Start calls `onStart` with the correct `{ rows, cols }` from that preset and the image URLs, (4) update the existing `onStart` test to work with preset selection instead of number inputs, (5) keep image-related tests unchanged, (6) update pair count tests to work with preset selection (selecting a preset with different pair count should update messaging).

### Implementation for User Story 1

- [x] T007 [US1] Create `src/components/grid-size-selector.tsx`: a component that receives `presets: readonly GridPreset[]`, `selectedIndex: number`, and `onChange: (index: number) => void`. Render a 3-column grid of `<button>` elements. Each button shows the preset label (e.g., "4x6") as primary text and card count (e.g., "24 cards") as secondary text. The selected button has `border-brand-600 bg-brand-50 text-brand-800` styling, unselected have `border-brand-100 bg-surface-raised text-text-primary hover:border-brand-200` styling. All buttons have `rounded-lg p-3 text-center transition-all duration-150` and the selected one has `ring-2 ring-brand-200`. Use Tailwind classes from the existing design system. The component must have an explicit return type.

- [x] T008 [US1] Modify `src/components/setup-screen.tsx`: (1) remove imports for `loadGridSize` (old), (2) import `GRID_PRESETS`, `DEFAULT_PRESET_INDEX` from `../utils/grid-presets`, `loadPresetIndex`, `savePresetIndex` from `../utils/grid-storage`, and `GridSizeSelector` from `./grid-size-selector`, (3) replace `const saved = loadGridSize(); const [rows, setRows] = useState(saved.rows); const [cols, setCols] = useState(saved.cols);` with `const [selectedIndex, setSelectedIndex] = useState(loadPresetIndex);`, (4) derive `rows`, `cols`, `pairCount` from `GRID_PRESETS[selectedIndex]`, (5) remove the number input HTML for rows and cols, (6) render `<GridSizeSelector presets={GRID_PRESETS} selectedIndex={selectedIndex} onChange={setSelectedIndex} />` in place of the old inputs, (7) in `handleStart`, call `savePresetIndex(selectedIndex)` before `onStart`, (8) remove the validation error state and display (presets are always valid), (9) keep all image upload UI unchanged.

- [x] T009 [US1] Run tests T005, T006, and all existing tests to confirm they pass. Fix any broken tests from the setup-screen changes. Run `npm test -- --run && npm run lint`.

**Checkpoint**: User Story 1 complete. Setup screen shows 9 preset options. Selecting one and pressing Start works correctly. No number inputs remain.

---

## Phase 4: User Story 2 - Selected Size Persists Across Games (Priority: P2)

**Goal**: The selected preset persists across games and browser sessions.

**Independent Test**: Select a non-default size, play a game, return to setup — same size is selected. Reload page — same size is selected.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [P] [US2] Add test in `tests/components/setup-screen.test.tsx`: when localStorage contains `{ presetIndex: 4 }`, the setup screen initializes with preset index 4 (5x6) selected — verify by checking that the 5x6 button has selected styling or that onStart receives `{ rows: 5, cols: 6 }` when Start is clicked.

- [x] T011 [P] [US2] Add test in `tests/components/setup-screen.test.tsx`: when localStorage is empty, the setup screen initializes with preset index 1 (4x4) selected.

- [x] T012 [P] [US2] Add test in `tests/components/setup-screen.test.tsx`: when the player selects a preset and clicks Start, `localStorage.setItem` is called with the grid storage key and the JSON containing the selected preset index.

### Implementation for User Story 2

- [x] T013 [US2] Verify that the implementation from US1 (T008) already handles persistence: `useState(loadPresetIndex)` reads from localStorage on mount, and `savePresetIndex(selectedIndex)` in `handleStart` writes to localStorage. Run tests T010-T012 to confirm they pass. If any test fails, fix the corresponding code in `src/components/setup-screen.tsx`.

**Checkpoint**: User Story 2 complete. Selected size persists across games and sessions.

---

## Phase 5: User Story 3 - Remove Free-Form Number Inputs (Priority: P3)

**Goal**: Confirm the old number inputs are fully removed and no validation error UI remains.

**Independent Test**: Open the setup screen and verify there are no number/text input fields for rows or columns.

### Tests for User Story 3

- [x] T014 [P] [US3] Add test in `tests/components/setup-screen.test.tsx`: verify that no `<input type="number">` elements exist on the setup screen (use `screen.queryByRole("spinbutton")` — should return null).

### Implementation for User Story 3

- [x] T015 [US3] Verify that T008 already removed the number inputs from `src/components/setup-screen.tsx`. Run test T014 to confirm. If the inputs still exist, remove them and the associated state/handlers.

- [x] T016 [US3] Modify `src/hooks/use-game-state.ts`: remove the `import { saveGridSize }` and the `useEffect` that calls `saveGridSize(state.config)` on game completion (persistence now happens at game start in setup-screen). Run all tests to confirm no regressions.

**Checkpoint**: User Story 3 complete. No number inputs, no save-on-completion. Run `npm test && npm run lint`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [x] T017 Run full test suite (`npm test`) and linter (`npm run lint`) to confirm zero failures and zero warnings.
- [x] T018 Manual smoke test: start dev server (`npm run dev`), verify 9 size options visible, select 6x6, start game, verify 36 cards, complete game, return to setup, verify 6x6 still selected, reload page, verify 6x6 still selected. Test on mobile viewport (375px) to verify 3x3 grid fits without scrolling.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on US1 completion (persistence is wired in US1)
- **User Story 3 (Phase 5)**: Depends on US1 completion (input removal happens in US1)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only
- **US2 (P2)**: Depends on US1 — persistence is wired during US1 implementation
- **US3 (P3)**: Depends on US1 — input removal happens during US1, US3 just verifies and cleans up the hook

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle II)
- Data/utility before component before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 can run in parallel (different test files)
- T005 and T006 can run in parallel (different test files)
- T010, T011, T012 can run in parallel (same file, independent tests)

---

## Parallel Example: User Story 1

```text
# Launch US1 tests in parallel:
Task T005: "Create grid-size-selector.test.tsx"
Task T006: "Update setup-screen.test.tsx for presets"

# Then implement sequentially:
Task T007: "Create grid-size-selector.tsx component"
Task T008: "Modify setup-screen.tsx to use presets"
Task T009: "Run all tests and lint"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Preset selector works, Start uses correct dimensions
5. This alone delivers the core value — simple size selection

### Incremental Delivery

1. Setup + Foundational → Preset data and storage ready
2. User Story 1 → Preset selector replaces inputs (MVP!)
3. User Story 2 → Verify persistence works
4. User Story 3 → Verify cleanup, remove hook save-on-completion
5. Polish → Full validation and smoke test

---

## Notes

- Total tasks: 18
- US1 tasks: 5 (T005-T009)
- US2 tasks: 4 (T010-T013)
- US3 tasks: 3 (T014-T016)
- Setup/Foundational: 4 (T001-T004)
- Polish: 2 (T017-T018)
- US2 and US3 are largely verification stories — most implementation happens in US1
- The old `loadGridSize`/`saveGridSize` are fully replaced — not deprecated, removed
- Old `{ rows, cols }` localStorage format silently falls back to default
- No new dependencies

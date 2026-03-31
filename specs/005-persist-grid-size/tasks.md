# Tasks: Persist Grid Size Across Games

**Input**: Design documents from `/specs/005-persist-grid-size/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included — constitution mandates Test-Driven Development (Principle II).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the new utility file and establish the storage key constant

- [x] T001 Create grid storage utility file at `src/utils/grid-storage.ts` with the storage key constant `GRID_STORAGE_KEY = "concentration:gridSize"`, the `loadGridSize` function signature (returns `BoardConfig`, reads from `localStorage`, validates with `validateBoardConfig`, falls back to `{ rows: 4, cols: 4 }`), and the `saveGridSize` function signature (accepts `BoardConfig`, writes JSON to `localStorage`). All functions must have explicit return types per constitution Principle III.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Unit tests and implementation for the shared storage utility that both user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Grid Storage Utility

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T002 Create test file at `tests/utils/grid-storage.test.ts` with the following test cases for `loadGridSize`: (1) returns `{ rows: 4, cols: 4 }` when `localStorage` is empty, (2) returns stored config when valid data exists (e.g., `{ rows: 3, cols: 4 }`), (3) returns default when stored JSON is malformed, (4) returns default when stored values are out of range (e.g., `rows: 0`), (5) returns default when `rows * cols` is odd. And for `saveGridSize`: (6) writes valid JSON string to `localStorage` under the correct key, (7) round-trip: `saveGridSize` then `loadGridSize` returns the same values. Mock `localStorage` using `vi.stubGlobal` or `Storage` prototype spies.

### Implementation

- [x] T003 Implement `loadGridSize` and `saveGridSize` in `src/utils/grid-storage.ts`. `loadGridSize` must: read from `localStorage.getItem(GRID_STORAGE_KEY)`, parse JSON as `unknown`, narrow the type to check `rows` and `cols` are numbers, pass through `validateBoardConfig`, and return the default `{ rows: 4, cols: 4 }` on any failure (missing key, bad JSON, invalid config). `saveGridSize` must: call `localStorage.setItem(GRID_STORAGE_KEY, JSON.stringify({ rows: config.rows, cols: config.cols }))`. No `any` types allowed (Principle III). Run tests to confirm all pass.

**Checkpoint**: `grid-storage.ts` fully tested and implemented. Both user stories can now proceed.

---

## Phase 3: User Story 1 - Grid Size Persists After Game Completion (Priority: P1) 🎯 MVP

**Goal**: When a player completes a game, the grid size is remembered and pre-populated on the setup screen for the next game within the same session.

**Independent Test**: Complete a game with a non-default grid size (e.g., 4x6), click "Play Again", and verify the setup screen shows rows=4 and cols=6.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Add test in `tests/hooks/use-game-state.test.ts`: when the game phase transitions to `"complete"` (all pairs matched), `saveGridSize` is called with the current `state.config`. Verify by mocking `localStorage.setItem` and driving the hook through a full game cycle (start → select all pairs → complete).

- [x] T005 [P] [US1] Add test in `tests/hooks/use-game-state.test.ts`: when the game is reset mid-game (before completion), `saveGridSize` is NOT called. Drive the hook through start → select one pair → reset and verify `localStorage.setItem` was not called with the grid storage key.

- [x] T006 [P] [US1] Add test in `tests/components/setup-screen.test.tsx`: when `localStorage` contains a valid grid size `{ rows: 3, cols: 4 }`, the setup screen initializes the rows input to 3 and cols input to 4. Set up `localStorage` before rendering the component.

- [x] T007 [P] [US1] Add test in `tests/components/setup-screen.test.tsx`: when `localStorage` is empty, the setup screen initializes with the default rows=4 and cols=4.

### Implementation for User Story 1

- [x] T008 [US1] Modify `src/hooks/use-game-state.ts`: import `saveGridSize` from `../utils/grid-storage`. Add a `useEffect` that watches `state.phase` and `state.config` — when `state.phase === "complete"`, call `saveGridSize(state.config)`. This effect must only fire on completion, not on other phase transitions. Run tests T004 and T005 to confirm they pass.

- [x] T009 [US1] Modify `src/components/setup-screen.tsx`: import `loadGridSize` from `../utils/grid-storage`. Replace `useState(4)` for rows (line 21) and cols (line 22) with: `const saved = loadGridSize(); const [rows, setRows] = useState(saved.rows); const [cols, setCols] = useState(saved.cols);`. Run tests T006 and T007 to confirm they pass.

**Checkpoint**: User Story 1 complete. Player completes a game → starts a new game → sees same grid size. Run `npm test && npm run lint` to verify all tests pass.

---

## Phase 4: User Story 2 - Grid Size Persists Across Browser Sessions (Priority: P2)

**Goal**: The grid size preference survives browser close/reopen and page reloads.

**Independent Test**: Complete a game with a 6x6 grid, reload the page, and verify the setup screen shows rows=6 and cols=6.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [US2] Add test in `tests/utils/grid-storage.test.ts`: verify `saveGridSize` calls `localStorage.setItem` (not `sessionStorage`), confirming the data will survive browser sessions. This may already be covered by T002 — if so, add an explicit assertion that `localStorage.setItem` is called (not `sessionStorage`).

### Implementation for User Story 2

- [x] T011 [US2] Verify that the implementation from User Story 1 already satisfies US2 by confirming `grid-storage.ts` uses `localStorage` (not `sessionStorage`). No code changes expected — this story is satisfied by the localStorage choice made in US1. Run test T010 to confirm. If `sessionStorage` was mistakenly used, change to `localStorage` in `src/utils/grid-storage.ts`.

**Checkpoint**: User Story 2 complete. Grid size survives page reload and browser restart. Run `npm test && npm run lint`.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T012 Run full test suite (`npm test`) and linter (`npm run lint`) to confirm zero failures and zero warnings
- [x] T013 Manual smoke test: start dev server (`npm run dev`), play a full game with a non-default grid size, click "Play Again", verify grid size is preserved. Reload the page, verify grid size persists.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (US2 verifies US1's localStorage choice)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) only — no cross-story dependencies
- **User Story 2 (P2)**: Depends on User Story 1 — US2 is a verification that US1's storage mechanism persists across sessions

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle II)
- Utility before consumers (grid-storage.ts before use-game-state.ts and setup-screen.tsx)
- Hook modification before component modification (save before read)
- Story complete before moving to next priority

### Parallel Opportunities

- T004, T005, T006, T007 can all run in parallel (different test files, no dependencies)
- T008 and T009 can run in parallel (different source files, both depend only on T003)

---

## Parallel Example: User Story 1

```text
# Launch all US1 tests in parallel:
Task T004: "Test saveGridSize called on game completion in tests/hooks/use-game-state.test.ts"
Task T005: "Test saveGridSize NOT called on reset in tests/hooks/use-game-state.test.ts"
Task T006: "Test setup screen reads from localStorage in tests/components/setup-screen.test.tsx"
Task T007: "Test setup screen defaults when localStorage empty in tests/components/setup-screen.test.tsx"

# Then launch both implementation tasks in parallel:
Task T008: "Add saveGridSize effect in src/hooks/use-game-state.ts"
Task T009: "Read loadGridSize in src/components/setup-screen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002 → T003)
3. Complete Phase 3: User Story 1 (T004-T007 tests → T008-T009 implementation)
4. **STOP and VALIDATE**: Test User Story 1 independently — `npm test && npm run lint`
5. Grid size now persists within a session and across sessions (localStorage is durable by default)

### Incremental Delivery

1. Setup + Foundational → Storage utility ready
2. User Story 1 → Grid size persists → Deploy/Demo (MVP!)
3. User Story 2 → Explicit verification of cross-session persistence → Deploy/Demo
4. Polish → Full validation and smoke test

---

## Notes

- Total tasks: 13
- US1 tasks: 6 (T004-T009)
- US2 tasks: 2 (T010-T011)
- Setup/Foundational: 3 (T001-T003)
- Polish: 2 (T012-T013)
- US2 is largely a verification story — the localStorage choice in US1 already provides cross-session persistence
- No new dependencies required
- All production code must have explicit return types (Constitution Principle III)
- No `any` types allowed (Constitution Principle III)

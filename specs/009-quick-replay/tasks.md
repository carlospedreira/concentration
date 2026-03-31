# Tasks: Quick Replay

**Input**: Design documents from `/specs/009-quick-replay/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Included — constitution mandates Test-Driven Development (Principle II).

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

**Purpose**: No foundational tasks — both user stories modify the same files.

(No tasks in this phase)

---

## Phase 3: User Story 1 - Play Again Starts a New Game Immediately (Priority: P1) 🎯 MVP

**Goal**: Clicking "Play Again" on the completion screen starts a new game immediately with the same grid size and images — no setup screen.

**Independent Test**: Complete a game, click "Play Again", verify a new game starts immediately with the same grid size and freshly shuffled cards.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T001 [US1] Update `tests/components/completion-screen.test.tsx`: modify the existing `CompletionScreen` test setup to pass both `onPlayAgain` and `onChangeSize` props (add `onChangeSize: vi.fn()` alongside the existing `onPlayAgain`). Update the existing test "calls onPlayAgain when button clicked" to verify it still works. Add a new test: "renders Play Again button that calls onPlayAgain when clicked" — verify clicking the button labeled "Play Again" invokes the `onPlayAgain` callback.

### Implementation for User Story 1

- [x] T002 [US1] Modify `src/components/completion-screen.tsx`: add `onChangeSize: () => void` to the `CompletionScreenProps` interface. No changes to the "Play Again" button — it already calls `onPlayAgain`.

- [x] T003 [US1] Modify `src/App.tsx`: change the `onPlayAgain` prop on `CompletionScreen` from `{reset}` to `{() => startGame(state.config, images.map((img) => img.url))}`. Add `onChangeSize={reset}` as a new prop. This makes "Play Again" start a fresh game with the same config and images, while "Change Size" goes back to setup.

- [x] T004 [US1] Run tests (`npm test -- --run`) and linter (`npm run lint`) to confirm all pass.

**Checkpoint**: "Play Again" now starts a new game immediately. The setup screen is bypassed.

---

## Phase 4: User Story 2 - Access Setup Screen from Completion (Priority: P2)

**Goal**: A secondary "Change Size" link on the completion screen lets players return to the setup screen.

**Independent Test**: Complete a game, verify both "Play Again" and "Change Size" are visible. Click "Change Size" and verify it navigates to the setup screen.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [US2] Add test in `tests/components/completion-screen.test.tsx`: verify that a "Change Size" button/link is rendered on the completion screen.

- [x] T006 [US2] Add test in `tests/components/completion-screen.test.tsx`: verify that clicking "Change Size" calls the `onChangeSize` callback.

### Implementation for User Story 2

- [x] T007 [US2] Modify `src/components/completion-screen.tsx`: add a secondary button below the "Play Again" button that calls `onChangeSize`. Style it as a text link: `className="text-sm font-semibold text-text-secondary hover:text-brand-600 transition-colors"`. Label it "Change Size".

- [x] T008 [US2] Run all tests (`npm test -- --run`) and linter (`npm run lint`) to confirm zero failures.

**Checkpoint**: Completion screen shows both "Play Again" (quick replay) and "Change Size" (go to setup).

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T009 Run full test suite (`npm test`) and linter (`npm run lint`) to confirm zero failures and zero warnings.
- [x] T010 Manual smoke test: start dev server (`npm run dev`), play a 5x6 game to completion, click "Play Again" — verify new 5x6 game starts with reshuffled cards, move counter at 0. Complete again, click "Change Size" — verify setup screen appears with 5x6 pre-selected.

---

## Dependencies & Execution Order

### Phase Dependencies

- **US1 (Phase 3)**: No dependencies — can start immediately
- **US2 (Phase 4)**: Depends on US1 (the `onChangeSize` prop added in US1 is used in US2's implementation)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No dependencies
- **US2 (P2)**: Depends on US1 — the `onChangeSize` prop is added to the interface in US1

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle II)
- Component changes before integration (App.tsx) changes

### Parallel Opportunities

- T005 and T006 can run in parallel (same file, independent tests)
- Limited parallelism overall — this is a small, sequential feature

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: US1 (T001-T004)
2. **STOP and VALIDATE**: "Play Again" starts a new game immediately
3. This alone delivers the core value

### Incremental Delivery

1. US1 → Quick replay works (MVP!)
2. US2 → "Change Size" link provides setup access
3. Polish → Full validation

---

## Notes

- Total tasks: 10
- US1 tasks: 4 (T001-T004)
- US2 tasks: 4 (T005-T008)
- Polish: 2 (T009-T010)
- This is a very small feature — 2 source files modified, 1 test file modified
- No new files, no new dependencies, no reducer changes
- The existing `startGame` function handles everything needed for quick replay

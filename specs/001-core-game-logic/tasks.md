# Tasks: Core Game Logic

**Input**: Design documents from `/specs/001-core-game-logic/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/game-reducer.ts, quickstart.md

**Tests**: Included — TDD is mandated by the project constitution (Principle II: NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on other [P] tasks in same group)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold Vite project, install dependencies, configure tooling

- [X] T001 Scaffold Vite React-TS project in repository root and install runtime + dev dependencies per specs/001-core-game-logic/quickstart.md
- [X] T002 [P] Configure vite.config.ts with React, Tailwind CSS, PWA, and Vitest plugins per specs/001-core-game-logic/quickstart.md
- [X] T003 [P] Configure tsconfig.json with strict mode and ES2022 target per specs/001-core-game-logic/quickstart.md
- [X] T004 [P] Create src/index.css with Tailwind CSS v4 imports
- [X] T005 [P] Create project directory structure: src/types/, src/utils/, src/reducers/, src/hooks/, src/components/, tests/utils/, tests/reducers/, tests/hooks/, tests/components/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and pure utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Types

- [X] T006 Define all TypeScript types and interfaces in src/types/game.ts from specs/001-core-game-logic/contracts/game-reducer.ts (CardState, GamePhase, BoardConfig, Card, GameState, GameAction, ValidationResult, ValidateBoardConfig, GenerateBoard)

### Tests (RED phase — all must fail before implementation)

- [X] T007 [P] Write symbol pool tests in tests/utils/symbols.test.ts (pool has >=50 unique symbols, all are non-empty strings, no duplicates)
- [X] T008 [P] Write board config validation tests in tests/utils/validation.test.ts (valid configs return valid:true, odd total rejected, rows/cols out of 1-10 range rejected, zero/negative rejected, total < 2 rejected)
- [X] T009 [P] Write board generation tests in tests/utils/board.test.ts (returns correct card count, every symbol appears exactly twice, all cards start faceDown, IDs are sequential 0..n-1, shuffle produces different orderings)

### Implementation (GREEN phase — make tests pass)

- [X] T010 [P] Implement symbol pool constant in src/utils/symbols.ts (60+ unique Unicode symbols from specs/001-core-game-logic/data-model.md)
- [X] T011 [P] Implement board config validation in src/utils/validation.ts (pure function returning ValidationResult)
- [X] T012 Implement board generation with Fisher-Yates shuffle in src/utils/board.ts (imports symbols from src/utils/symbols.ts)

**Checkpoint**: Foundation ready — all pure utilities tested and passing. User story implementation can begin.

---

## Phase 3: User Story 1 — Configure and Start a New Game (Priority: P1) 🎯 MVP

**Goal**: Player opens the app, sees a setup screen, enters rows and columns, and starts a game. A shuffled board of face-down cards is displayed.

**Independent Test**: Select a grid size, confirm the board appears with the correct number of face-down cards, verify each card has exactly one matching partner.

### Tests for User Story 1 ⚠️

> **Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [US1] Write game reducer tests for initial state and START_GAME action in tests/reducers/game-reducer.test.ts (initial state has phase=setup, START_GAME with valid config transitions to playing with correct card count, START_GAME with invalid config does not change state)
- [X] T014 [US1] Write useGameState hook tests in tests/hooks/use-game-state.test.ts (returns initial setup state, startGame dispatches START_GAME and transitions to playing)
- [X] T015 [P] [US1] Write SetupScreen component tests in tests/components/setup-screen.test.tsx (renders rows/cols inputs, validates even total, calls onStart with config, shows error for invalid config)
- [X] T016 [P] [US1] Write GameBoard component tests in tests/components/game-board.test.tsx (renders correct grid dimensions, all cards rendered face-down)
- [X] T017 [P] [US1] Write Card component tests in tests/components/card.test.tsx (renders face-down state with hidden symbol, renders face-up state with visible symbol, renders matched state)

### Implementation for User Story 1

- [X] T018 [US1] Implement game reducer with initial state and START_GAME action in src/reducers/game-reducer.ts (validates config, generates shuffled board, transitions to playing)
- [X] T019 [US1] Implement useGameState hook in src/hooks/use-game-state.ts (wraps useReducer with gameReducer, exposes state and dispatch helpers)
- [X] T020 [P] [US1] Implement SetupScreen component in src/components/setup-screen.tsx (rows/cols number inputs, validation feedback, start button)
- [X] T021 [P] [US1] Implement Card component in src/components/card.tsx (face-down/face-up/matched rendering with CSS flip transform)
- [X] T022 [US1] Implement GameBoard component in src/components/game-board.tsx (CSS grid layout rendering Card components per config dimensions)
- [X] T023 [US1] Wire App.tsx to render SetupScreen when phase=setup and GameBoard when phase=playing in src/App.tsx

**Checkpoint**: Player can configure a board and see face-down cards. US1 is fully functional and testable.

---

## Phase 4: User Story 2 — Flip and Match Cards (Priority: P1)

**Goal**: Player clicks face-down cards to reveal them. Two matching cards stay face-up. Two non-matching cards flip back after a brief delay. Invalid selections (same card, already matched, third card during reveal) are ignored.

**Independent Test**: Start a game, flip two cards, verify matching pair stays face-up and non-matching pair flips back after delay.

### Tests for User Story 2 ⚠️

> **Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US2] Write game reducer tests for SELECT_CARD action in tests/reducers/game-reducer.test.ts (first card flips to faceUp, second card transitions to checking, selecting already faceUp card is ignored, selecting matched card is ignored, selecting during revealing phase is ignored)
- [X] T025 [P] [US2] Write game reducer tests for CHECK_MATCH and FLIP_BACK actions in tests/reducers/game-reducer.test.ts (matching pair marks both as matched and returns to playing, non-matching transitions to revealing, FLIP_BACK returns cards to faceDown and transitions to playing, all pairs matched transitions to complete, moveCount increments on each CHECK_MATCH)
- [X] T026 [P] [US2] Write Card component interaction tests in tests/components/card.test.tsx (click on face-down card calls onSelect, click on matched card does not call onSelect, click on face-up card does not call onSelect)

### Implementation for User Story 2

- [X] T027 [US2] Implement SELECT_CARD, CHECK_MATCH, and FLIP_BACK actions in src/reducers/game-reducer.ts (with moveCount increment and completion detection)
- [X] T028 [US2] Add card flip click handler and CSS flip animation to src/components/card.tsx
- [X] T029 [P] [US2] Update GameBoard to pass card selection handler from useGameState to Card components in src/components/game-board.tsx
- [X] T030 [P] [US2] Add auto-dispatch logic to useGameState hook in src/hooks/use-game-state.ts (dispatch CHECK_MATCH after second card selected, dispatch FLIP_BACK after 1s delay when phase=revealing)

**Checkpoint**: Full flip-and-match gameplay works. Player can play a complete game.

---

## Phase 5: User Story 3 — Track Moves and Complete the Game (Priority: P2)

**Goal**: A move counter is visible during gameplay. When all pairs are matched, a completion screen shows the total moves and congratulates the player.

**Independent Test**: Play a game to completion, verify move counter increments on each pair attempt, verify completion screen shows correct final count.

### Tests for User Story 3 ⚠️

> **Write these tests FIRST, ensure they FAIL before implementation**

- [X] T031 [P] [US3] Write MoveCounter component tests in tests/components/move-counter.test.tsx (displays "Moves: 0" initially, updates display when moveCount prop changes)
- [X] T032 [P] [US3] Write CompletionScreen component tests in tests/components/completion-screen.test.tsx (displays total move count, renders play again button, calls onPlayAgain when button clicked)

### Implementation for User Story 3

- [X] T033 [P] [US3] Implement MoveCounter component in src/components/move-counter.tsx (displays current move count)
- [X] T034 [P] [US3] Implement CompletionScreen component in src/components/completion-screen.tsx (congratulations message, move count display, play again button)
- [X] T035 [US3] Update App.tsx to render MoveCounter during playing/checking/revealing phases and CompletionScreen when phase=complete in src/App.tsx

**Checkpoint**: Players see their move count during play and get a completion summary. US3 is fully functional.

---

## Phase 6: User Story 4 — Reset or Start a New Game (Priority: P2)

**Goal**: Player can abandon a game in progress or start a new game after completion, returning to the setup screen.

**Independent Test**: Start a game, click reset mid-game, verify return to setup screen. Complete a game, click play again, verify return to setup screen.

### Tests for User Story 4 ⚠️

> **Write these tests FIRST, ensure they FAIL before implementation**

- [X] T036 [US4] Write game reducer test for RESET action in tests/reducers/game-reducer.test.ts (resets to initial state with phase=setup from any phase: playing, checking, revealing, complete)

### Implementation for User Story 4

- [X] T037 [US4] Implement RESET action in src/reducers/game-reducer.ts (returns initial setup state)
- [X] T038 [P] [US4] Add "New Game" button to GameBoard component that dispatches RESET in src/components/game-board.tsx
- [X] T039 [P] [US4] Wire CompletionScreen "Play Again" button to dispatch RESET via useGameState in src/components/completion-screen.tsx

**Checkpoint**: Player can restart at any time. Full game loop (setup -> play -> complete -> setup) works.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: PWA configuration, responsive design, and final validation

- [X] T040 [P] Configure PWA manifest in vite.config.ts with app name, theme color, and icon placeholders for installability
- [X] T041 [P] Add responsive Tailwind CSS classes to GameBoard and Card for scaling from 320px to 2560px viewports in src/components/game-board.tsx and src/components/card.tsx
- [X] T042 Run full test suite (npm test) and fix any failures
- [X] T043 Run quickstart.md validation: dev server starts, tests pass, production build succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — first story to implement
- **US2 (Phase 4)**: Depends on US1 (extends reducer, updates Card and GameBoard components)
- **US3 (Phase 5)**: Depends on US2 (moveCount and completion already in reducer, adds display UI)
- **US4 (Phase 6)**: Depends on US3 (wires play again in CompletionScreen from US3)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependencies on other stories
- **US2 (P1)**: Depends on US1 (extends reducer, updates Card and GameBoard components)
- **US3 (P2)**: Depends on US2 (moveCount and completion already in reducer, adds UI components)
- **US4 (P2)**: Depends on US3 (wires play again in CompletionScreen created in US3)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD mandate)
- Types/Models before services/reducers
- Reducers before hooks
- Hooks before components
- Components before App.tsx wiring
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1**: T002, T003, T004, T005 can run in parallel after T001
**Phase 2**: T007, T008, T009 (tests) in parallel; T010, T011 (implementations) in parallel
**Phase 3 (US1)**: T015, T016, T017 (component tests) in parallel; T020, T021 (SetupScreen, Card) in parallel
**Phase 4 (US2)**: T024, T025, T026 (all tests) in parallel; T029, T030 (GameBoard, hook) in parallel
**Phase 5 (US3)**: T031, T032 (tests) in parallel; T033, T034 (implementations) in parallel
**Phase 6 (US4)**: T038, T039 (button wiring) in parallel

---

## Parallel Example: User Story 1

```bash
# Write all component tests in parallel:
Task T015: "Write SetupScreen tests in tests/components/setup-screen.test.tsx"
Task T016: "Write GameBoard tests in tests/components/game-board.test.tsx"
Task T017: "Write Card tests in tests/components/card.test.tsx"

# Implement independent components in parallel:
Task T020: "Implement SetupScreen in src/components/setup-screen.tsx"
Task T021: "Implement Card in src/components/card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (types + utilities)
3. Complete Phase 3: User Story 1 (configure + start)
4. **STOP and VALIDATE**: Board displays correct face-down cards for given config
5. Demo/deploy if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Board setup works → Demo (**MVP!**)
3. Add US2 → Full gameplay works → Demo
4. Add US3 → Move tracking + completion → Demo
5. Add US4 → Reset/replay loop → Demo
6. Polish → PWA, responsive → Ship

---

## Notes

- [P] tasks = different files, no dependencies on other [P] tasks in same group
- [Story] label maps task to specific user story for traceability
- TDD is NON-NEGOTIABLE per project constitution — every behavior gets a test FIRST
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All user stories in this feature are sequential (US2 extends US1's reducer and components)

# Tasks: Custom Image Upload

**Input**: Design documents from `/specs/002-custom-image-upload/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included — TDD approach per Constitution Principle II

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project readiness — no new dependencies required for this feature

- [x] T001 Verify existing project builds and all tests pass via `npm test && npm run lint`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and pure utility functions that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Add `UploadedImage` interface (`id: string`, `file: File`, `url: string`, `name: string`) and extend `Card` with optional `imageUrl?: string` field in src/types/game.ts
- [x] T003 Update `GameAction` `START_GAME` payload to include optional `imageUrls?: readonly string[]` and update `GenerateBoard` type signature in src/types/game.ts
- [x] T004 Write unit tests for `validateImageFile` covering: accepted MIME types (jpeg, png, gif, webp), rejected MIME types, 5MB size limit, edge cases in tests/utils/image-validation.test.ts
- [x] T005 Implement `validateImageFile(file: File): ValidationResult` with MIME type allowlist and 5,242,880-byte size check in src/utils/image-validation.ts

**Checkpoint**: Foundation ready — types extended, validation utility complete and tested

---

## Phase 3: User Story 1 — Upload Images for Card Pairs (Priority: P1) MVP

**Goal**: Players can upload images, preview them, remove unwanted ones, and start a game where uploaded images appear as card faces

**Independent Test**: Upload images, see preview thumbnails, remove unwanted images, start game, verify uploaded images appear as card faces on the board

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Write tests for `generateBoard` with `imageUrls` parameter: all-image board, mixed image+symbol board, empty imageUrls defaults to symbols-only in tests/utils/board.test.ts
- [x] T007 [P] [US1] Write tests for CardComponent image rendering: renders `<img>` with `object-fit: cover` when `imageUrl` present, renders symbol `<span>` when `imageUrl` absent in tests/components/card.test.tsx
- [x] T008 [P] [US1] Write tests for ImageUploadPanel: file input triggers upload, preview thumbnails displayed, remove button removes image, validation errors shown for bad files in tests/components/image-upload-panel.test.tsx
- [x] T009 [P] [US1] Write tests for game-reducer `START_GAME` with `imageUrls`: cards have `imageUrl` set for image pairs, remaining cards have symbol only in tests/reducers/game-reducer.test.ts
- [x] T010 [P] [US1] Write tests for `useGameState` `startGame` accepting optional `imageUrls` parameter and forwarding to dispatch in tests/hooks/use-game-state.test.ts

### Implementation for User Story 1

- [x] T011 [US1] Extend `generateBoard` to accept optional `imageUrls?: readonly string[]`, create image card pairs (with `imageUrl` set) first, then fill remaining pairs with random symbols in src/utils/board.ts
- [x] T012 [US1] Update game-reducer `START_GAME` case to read `imageUrls` from action payload and pass to `generateBoard` in src/reducers/game-reducer.ts
- [x] T013 [US1] Update `useGameState` `startGame` function signature to accept optional `imageUrls` and include in dispatch payload in src/hooks/use-game-state.ts
- [x] T014 [US1] Modify CardComponent to render `<img src={imageUrl} class="object-fit: cover">` when `imageUrl` is present, else render symbol `<span>` in src/components/card.tsx
- [x] T015 [US1] Create ImageUploadPanel component with `<input type="file" accept="image/*" multiple>`, preview thumbnail grid, remove button per image, validation error display in src/components/image-upload-panel.tsx
- [x] T016 [US1] Integrate ImageUploadPanel into SetupScreen, update `onStart` prop to pass `imageUrls` extracted from uploaded images in src/components/setup-screen.tsx
- [x] T017 [US1] Lift image collection state (`useState<UploadedImage[]>`) into App.tsx above game cycle, pass images and handlers to SetupScreen, forward imageUrls to `startGame` in src/App.tsx

**Checkpoint**: US1 fully functional — upload images, preview, remove, start game with image card faces

---

## Phase 4: User Story 2 — Fill Remaining Pairs with Random Symbols (Priority: P1)

**Goal**: When fewer images than pairs are uploaded, remaining pairs use random symbols. Player sees a message showing image vs symbol pair counts.

**Independent Test**: Upload fewer images than pairs needed, start game, verify both image pairs and symbol pairs appear. Verify pair count message on setup screen. Verify zero images produces all-symbol board.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T018 [P] [US2] Write tests for pair count messaging: "{n} of {total} pairs will use your images" when partial, "All {total} pairs will use your images" when exact, no message when zero images in tests/components/setup-screen.test.tsx
- [x] T019 [P] [US2] Write test verifying mixed board correctness: 3 images on 4x4 board produces exactly 3 image pairs + 5 symbol pairs in tests/utils/board.test.ts

### Implementation for User Story 2

- [x] T020 [US2] Add pair count message to SetupScreen computed from `images.length` vs `(rows * cols) / 2`, displaying appropriate message per data-model.md Pair Count Messaging table in src/components/setup-screen.tsx

**Checkpoint**: US1 + US2 functional — mixed boards work correctly, pair count messaging visible

---

## Phase 5: User Story 3 — Handle Excess Images (Priority: P2)

**Goal**: When more images than pairs are uploaded, system uses first N images and informs the player. Player can reorder images to control which ones are used.

**Independent Test**: Upload more images than pairs needed, see "Only {pairCount} of {total} images will be used" message, reorder images via move-up/move-down buttons, start game, verify first N images in order are used.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T021 [P] [US3] Write tests for excess image messaging: "Only {pairCount} of {images.length} images will be used" when images exceed pairs in tests/components/setup-screen.test.tsx
- [x] T022 [P] [US3] Write tests for image reorder controls: move-up swaps with previous, move-down swaps with next, first item has no move-up, last item has no move-down in tests/components/image-upload-panel.test.tsx

### Implementation for User Story 3

- [x] T023 [US3] Add excess image info message to SetupScreen when `images.length > pairCount` in src/components/setup-screen.tsx
- [x] T024 [US3] Add move-up (arrow up) and move-down (arrow down) buttons to each image row in ImageUploadPanel, implementing array swap reorder logic in src/components/image-upload-panel.tsx

**Checkpoint**: All user stories functional — excess images handled, reorder controls work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge case verification, cleanup, and final validation

- [x] T025 [P] Verify `URL.revokeObjectURL` is called when images are removed from collection and add cleanup on component unmount in src/App.tsx
- [x] T026 [P] Write test verifying uploaded images persist across game resets (play, complete, play again — images still available) in tests/components/setup-screen.test.tsx
- [x] T027 Write test verifying board size change recalculates pair count message with preserved images in tests/components/setup-screen.test.tsx
- [x] T028 Run full test suite and lint: `npm test && npm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify project
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — core upload + display pipeline
- **US2 (Phase 4)**: Depends on Phase 3 — extends setup screen with messaging
- **US3 (Phase 5)**: Depends on Phase 3 — extends upload panel with reorder, setup screen with excess messaging
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependencies on other stories
- **US2 (P1)**: After US1 — adds pair count messaging to setup-screen.tsx
- **US3 (P2)**: After US1 — adds reorder to image-upload-panel.tsx and excess messaging to setup-screen.tsx

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Utilities before reducer before hook before components
- Core logic before UI integration
- Story complete before moving to next

### Parallel Opportunities

- T004 + T005 are sequential (TDD), but can start in parallel with T002–T003 (different files)
- T006–T010 (all US1 tests) can run in parallel — all different test files
- T018 + T019 (US2 tests) can run in parallel — different test files
- T021 + T022 (US3 tests) can run in parallel — different test files
- T025 + T026 (polish tasks) can run in parallel — different files

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all US1 tests in parallel (all different files):
Task T006: "Tests for generateBoard with imageUrls in tests/utils/board.test.ts"
Task T007: "Tests for card image rendering in tests/components/card.test.tsx"
Task T008: "Tests for ImageUploadPanel in tests/components/image-upload-panel.test.tsx"
Task T009: "Tests for game-reducer START_GAME with images in tests/reducers/game-reducer.test.ts"
Task T010: "Tests for useGameState with images in tests/hooks/use-game-state.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Verify project
2. Complete Phase 2: Types + validation utility
3. Complete Phase 3: User Story 1 (upload + preview + card rendering)
4. **STOP and VALIDATE**: Upload images, see them on cards
5. Demo-ready with core feature working

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Upload + display works → **MVP!**
3. Add US2 → Mixed boards + messaging → Full P1 scope
4. Add US3 → Excess handling + reorder → Complete feature
5. Polish → Edge cases verified → Ship

### TDD Cycle Per Task

1. **Red**: Write test → verify it fails
2. **Green**: Write minimum code → test passes
3. **Refactor**: Clean up → tests still green
4. **Commit**: After each task or logical group

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Constitution Principle II: Tests written before implementation
- No new runtime dependencies (browser-native APIs only)
- `URL.createObjectURL` for image display (research.md R-001)
- `object-fit: cover` for consistent card rendering (research.md R-002)
- Move-up/move-down buttons for reorder — no DnD library (research.md R-003)
- Image state lifted to App.tsx to survive game resets (research.md R-004)
- Stop at any checkpoint to validate independently

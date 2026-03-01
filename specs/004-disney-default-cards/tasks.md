# Tasks: Emoji Default Cards

**Input**: Design documents from `/specs/004-disney-default-cards/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included (TDD required per constitution Principle II)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add emoji image assets and create the emoji metadata module

- [x] T001 Add 36+ Apple emoji WebP images (200×200px, ~10-20KB each) to src/assets/emoji/
- [x] T002 Create EmojiCharacter interface and emoji metadata array with Vite glob import in src/utils/emoji-characters.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility function that both user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Write unit tests for `getDefaultImages()` in tests/utils/emoji-characters.test.ts — test random selection of N emojis from pool, uniqueness, pool exhaustion, and empty/zero count edge cases
- [x] T004 Implement `getDefaultImages(count: number)` function using Fisher-Yates shuffle + slice in src/utils/emoji-characters.ts

**Checkpoint**: Emoji image pool and random selection utility ready — user story implementation can begin

---

## Phase 3: User Story 1 — Emoji Images as Default Card Faces (Priority: P1) 🎯 MVP

**Goal**: When no custom images are uploaded, all card faces show emoji images instead of geometric symbols

**Independent Test**: Start a new game with any board size and verify all card faces show emoji images instead of symbols

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Write unit tests for `generateBoard()` emoji defaults in tests/utils/board.test.ts — test that boards with no custom images produce emoji image pairs, each image appears exactly twice, cards have emoji name as symbol fallback, and boards up to 36 pairs use only emoji images
- [x] T006 [P] [US1] Write component test for image `onError` fallback in tests/components/card.test.tsx — test that when an image fires an error event, the card shows the symbol text instead of a broken image

### Implementation for User Story 1

- [x] T007 [US1] Modify `generateBoard()` in src/utils/board.ts to use emoji images as default when no custom images are provided — fill remaining pairs with `getDefaultImages()` before falling back to SYMBOLS for overflow
- [x] T008 [US1] Add `onError` handler to the `<img>` element in src/components/card.tsx that hides the image and reveals the symbol text as fallback

**Checkpoint**: Default games (no custom uploads) show emoji images on all card faces. Image load errors gracefully fall back to emoji names.

---

## Phase 4: User Story 2 — Mixed Mode with Custom Uploads (Priority: P2)

**Goal**: When a player uploads some (but not enough) custom images, remaining card pairs use emoji images instead of geometric symbols

**Independent Test**: Upload fewer images than required pairs, verify remaining cards show emoji images (not symbols)

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [US2] Write unit tests for mixed-mode board generation in tests/utils/board.test.ts — test that N custom images + emoji fill produces correct pair counts, custom images take priority, emojis fill the gap, and symbols only appear when board exceeds custom + emoji pool

### Implementation for User Story 2

- [x] T010 [US2] Update `generateBoard()` in src/utils/board.ts to insert emoji image pairs between custom image pairs and symbol pairs — priority chain: custom uploads → emoji images → geometric symbols

**Checkpoint**: Mixed boards correctly show custom images first, emoji images for remaining slots, and symbols only for overflow beyond the emoji pool

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation across all stories and edge case coverage

- [x] T011 Verify all existing tests still pass — run full test suite (`npm test`) to confirm no regressions in tests/
- [x] T012 Run quickstart.md validation — manually verify the complete priority chain (custom > emoji > symbols) across board sizes 2×2, 4×4, 6×6, and 10×10

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001, T002 — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (can run in parallel with US1 but logically extends US1's `generateBoard()` changes)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on US2
- **User Story 2 (P2)**: Logically depends on US1's `generateBoard()` modifications (same function, additive changes) — recommended to implement after US1

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Utility functions before component changes
- Core logic before UI fallback handling

### Parallel Opportunities

- T005 and T006 can run in parallel (different test files)
- T001 and T002 are sequential (T002 depends on images existing for glob import)
- US1 and US2 share `generateBoard()` — best done sequentially in priority order

---

## Parallel Example: User Story 1

```bash
# Launch both US1 test tasks in parallel (different files):
Task T005: "Unit tests for generateBoard() emoji defaults in tests/utils/board.test.ts"
Task T006: "Component test for image onError fallback in tests/components/card.test.tsx"

# Then implement sequentially:
Task T007: "Modify generateBoard() in src/utils/board.ts"
Task T008: "Add onError handler in src/components/card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (add images + create metadata module)
2. Complete Phase 2: Foundational (test + implement `getDefaultImages()`)
3. Complete Phase 3: User Story 1 (test + implement emoji defaults + image fallback)
4. **STOP and VALIDATE**: All default games show emoji images, no regressions
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Emoji image pool ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (mixed mode)
4. Polish → Full regression pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Image assets (T001) are Apple emoji exported as WebP — code infrastructure is decoupled from specific image files (per R-003)
- Total image budget: ~720KB for 36 images (WebP at ~20KB each)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

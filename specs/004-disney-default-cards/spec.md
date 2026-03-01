# Feature Specification: Emoji Default Cards

**Feature Branch**: `004-disney-default-cards`
**Created**: 2026-02-28
**Status**: Draft
**Input**: User description: "make the default cards disney cards instead of random letters"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Emoji Images as Default Card Faces (Priority: P1)

When a player starts a new game without uploading custom images, the card faces display Apple emoji images instead of abstract geometric symbols. Each pair of cards shows the same emoji, making the game immediately recognizable and appealing — especially for younger players.

**Why this priority**: This is the core request. Without emoji-themed defaults, the feature doesn't exist.

**Independent Test**: Can be fully tested by starting a new game with any board size and verifying that all card faces show emoji images instead of symbols.

**Acceptance Scenarios**:

1. **Given** a player starts a new game without uploading custom images, **When** they flip a card face-up, **Then** the card displays an emoji image instead of a geometric symbol.
2. **Given** a 4x4 board (8 pairs), **When** all cards are face-up, **Then** there are 8 distinct emoji images, each appearing exactly twice.
3. **Given** any supported board size, **When** the game initializes, **Then** emoji images fill the board up to the pool size, with geometric symbols used for any remaining pairs.

---

### User Story 2 - Mixed Mode with Custom Uploads (Priority: P2)

When a player uploads some custom images but not enough to fill the entire board, the remaining card pairs use emoji images as the fallback instead of geometric symbols.

**Why this priority**: Preserves the emoji theme even when users partially customize their board, maintaining a cohesive visual experience.

**Independent Test**: Can be fully tested by uploading fewer images than the number of pairs required, then verifying remaining cards show emoji images.

**Acceptance Scenarios**:

1. **Given** a 4x4 board requiring 8 pairs and a player uploads 3 custom images, **When** the game starts, **Then** 3 pairs show custom images and 5 pairs show emoji images.
2. **Given** a player uploads enough images to fill all pairs, **When** the game starts, **Then** no emoji images appear (custom images take priority).

---

### Edge Cases

- What happens when the board size requires more pairs than available emoji images? The system should have enough emojis to cover the largest supported board size. If the count is exceeded, the system should fall back to the existing geometric symbol set for the overflow pairs.
- What happens when an emoji image fails to load? The card should display a graceful fallback (e.g., the emoji's name or the existing geometric symbol) rather than a broken image indicator.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display emoji images as the default card faces when no custom images are uploaded.
- **FR-002**: System MUST include a minimum of 36 distinct emoji images. Board sizes requiring more pairs than the emoji pool MUST fall back to geometric symbols for the overflow pairs.
- **FR-003**: System MUST use emoji images as the fallback for unfilled pairs when custom images are uploaded but do not cover all pairs.
- **FR-004**: System MUST display each emoji image at consistent quality and aspect ratio across all card sizes, without distortion or cropping that obscures the image.
- **FR-005**: System MUST show a meaningful fallback if an emoji image fails to load, rather than a broken image icon.
- **FR-006**: System MUST randomly select which emoji images appear on the board each game from the full pool, so repeated plays feel fresh.

### Key Entities

- **Emoji Image**: An Apple emoji exported as a WebP image, used as the face of a card pair. Key attributes: name, image asset, unique identifier.
- **Card**: A game piece with a front face (emoji image or custom upload) and a back face (hidden state). Pairs are matched by their shared image.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of card faces on a default game (no custom uploads) display emoji images instead of geometric symbols.
- **SC-002**: The game supports all existing board sizes, using emoji images up to the pool size and geometric symbols for overflow.
- **SC-003**: Players can visually distinguish all emoji images from each other at the smallest supported card size.
- **SC-004**: Card images load and display within the normal game start time, with no noticeable delay compared to the previous symbol-based cards.

## Assumptions

- "Disney cards" in the original request is implemented as Apple emoji images (e.g., 🐭 mouse, 🦁 lion, 🐟 fish, 🚀 rocket) exported as WebP files and used as card face artwork.
- The game bundles these emoji images as static assets rather than fetching them from an external service.
- The existing matching logic (which compares card identifiers) will continue to work — only the visual presentation changes.
- The card back design ("?") remains unchanged.
- All existing board sizes and game mechanics remain the same; only the default card face visuals change.

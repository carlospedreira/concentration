# Feature Specification: Custom Image Upload

**Feature Branch**: `002-custom-image-upload`
**Created**: 2026-02-28
**Status**: Draft
**Input**: User description: "Allow the users to upload images to be used by the game instead of assigning random things. Only assign random things if the images provided are not enough to fill the board."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Images for Card Pairs (Priority: P1)

A player uploads one or more images before or during game setup to use as card faces instead of the default random symbols. The uploaded images are previewed so the player can confirm what they've added. Each uploaded image becomes one unique card pair on the board.

**Why this priority**: This is the core of the feature — without the ability to upload images, nothing else applies. It enables personalization and is the primary user value.

**Independent Test**: Can be fully tested by uploading images, seeing them in a preview area, and starting a game where the uploaded images appear as card faces.

**Acceptance Scenarios**:

1. **Given** the player is on the game setup screen, **When** they upload 3 images, **Then** all 3 images are displayed in a preview area showing what will be used as card faces.
2. **Given** the player has uploaded images, **When** they start a game, **Then** the uploaded images appear as card faces on the board (each image used for exactly one pair).
3. **Given** the player uploads an image, **When** they decide they don't want it, **Then** they can remove individual images from the upload list before starting the game.
4. **Given** the player uploads a file that is not a supported image format, **When** the upload is processed, **Then** the system rejects the file and informs the player of supported formats.

---

### User Story 2 - Fill Remaining Pairs with Random Symbols (Priority: P1)

When the player uploads fewer images than the number of pairs needed for the chosen board size, the system automatically fills the remaining pairs with random default symbols. The player is informed how many pairs are covered by their images and how many will use defaults.

**Why this priority**: This is equally critical — it ensures the game always works regardless of how many images are uploaded. Without this fallback, partial uploads would break the game.

**Independent Test**: Can be fully tested by uploading fewer images than pairs needed, starting the game, and verifying that uploaded images and random symbols both appear correctly on the board.

**Acceptance Scenarios**:

1. **Given** a 4x4 board (8 pairs needed) and the player has uploaded 3 images, **When** they start the game, **Then** the board contains 3 image pairs and 5 random symbol pairs.
2. **Given** the player has uploaded images, **When** they view the game setup screen, **Then** the system displays a message like "3 of 8 pairs will use your images; 5 will use default symbols."
3. **Given** the player uploads zero images, **When** they start a game, **Then** all pairs use random symbols (identical to the current default behavior).
4. **Given** the player uploads exactly the number of images needed (e.g., 8 for a 4x4 board), **When** they start the game, **Then** all pairs use uploaded images and no random symbols appear.

---

### User Story 3 - Handle Excess Images (Priority: P2)

When the player uploads more images than the number of pairs needed for the chosen board size, the system uses only the required number of images. The player is informed that some images won't be used and can see which ones are selected.

**Why this priority**: This is a natural edge case that improves usability but isn't strictly required for the game to function — the system could simply use the first N images without this story.

**Independent Test**: Can be fully tested by uploading more images than pairs needed, starting the game, and verifying only the expected number of images appear on the board.

**Acceptance Scenarios**:

1. **Given** a 4x4 board (8 pairs needed) and the player has uploaded 12 images, **When** they view the setup screen, **Then** the system informs them that only 8 of 12 images will be used.
2. **Given** more images than pairs are uploaded, **When** the player starts the game, **Then** the first N images (in upload order) are used, where N equals the number of pairs.
3. **Given** more images than pairs are uploaded, **When** the player reviews the upload list, **Then** they can reorder or remove images to control which ones are used.

---

### Edge Cases

- What happens when the player uploads a very large image file (e.g., 20MB)? The system should enforce a maximum file size per image and inform the player if an image exceeds it.
- What happens when the player uploads images of vastly different aspect ratios? The system should display all images consistently on the cards (e.g., cropped or scaled to fit).
- What happens when the player uploads duplicate images? The system should allow it — each uploaded image is treated as a distinct card pair regardless of visual similarity.
- What happens when the player changes the board size after uploading images? The pair count recalculates and the fill-in messaging updates accordingly; uploaded images are preserved.
- What happens when the player starts a new game? The previously uploaded images should be preserved so the player can reuse them without re-uploading.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the player to upload one or more image files from their device during game setup.
- **FR-002**: System MUST support common image formats: JPEG, PNG, GIF, and WebP.
- **FR-003**: System MUST enforce a maximum file size of 5MB per image.
- **FR-004**: System MUST display a preview of all uploaded images before the game starts.
- **FR-005**: System MUST allow the player to remove individual images from the upload list.
- **FR-006**: System MUST use each uploaded image as the face for exactly one card pair.
- **FR-007**: When uploaded images are fewer than the required pairs, the system MUST fill remaining pairs with random default symbols.
- **FR-008**: System MUST display a clear message showing how many pairs will use uploaded images and how many will use default symbols.
- **FR-009**: When uploaded images exceed the required pairs, the system MUST use only the first N images (in upload order) where N equals the number of pairs needed.
- **FR-010**: System MUST inform the player when uploaded images exceed the required number of pairs.
- **FR-011**: System MUST allow the player to reorder uploaded images to control which ones are prioritized when there are excess images.
- **FR-012**: System MUST display uploaded images consistently on cards regardless of original aspect ratio (uniformly cropped or scaled to fit).
- **FR-013**: System MUST reject files that are not supported image formats and display an error message listing accepted formats.
- **FR-014**: System MUST preserve uploaded images when the player changes board size, recalculating the fill-in count accordingly.
- **FR-015**: System MUST preserve uploaded images across game restarts within the same session so the player does not need to re-upload.
- **FR-016**: System MUST handle image uploads entirely on the client side — no images are sent to a server.

### Key Entities

- **Uploaded Image**: A player-provided image file used as a card face. Has a source (file data), a display-ready representation (scaled/cropped), an upload order position, and an active/inactive status for the current game.
- **Card** (extended): In addition to existing properties (symbol, position, state), a card may now reference an uploaded image as its face instead of a default symbol.
- **Image Collection**: The set of all uploaded images for the current session. Tracks upload order, allows reordering and removal, and persists across game restarts within a session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can upload images and start a game within 15 seconds of selecting files.
- **SC-002**: 100% of games with partial image uploads correctly display the expected mix of uploaded images and default symbols with zero mismatches.
- **SC-003**: Players can identify which images will be used before starting the game through the preview and pair-count messaging.
- **SC-004**: Unsupported file types and oversized files are rejected with clear feedback 100% of the time.
- **SC-005**: Uploaded images render consistently across all cards on the board, with no visual distortion or layout breakage regardless of original image dimensions.

## Assumptions

- Images are processed and stored entirely in the browser (client-side only). No backend storage or server upload is involved.
- The maximum file size of 5MB per image is a reasonable default for browser-based processing without causing performance issues.
- There is no limit on the number of images a player can upload, though only the needed number of pairs will be used per game.
- Images persist in memory for the current browser session only. Refreshing the page or closing the browser clears them.
- Image upload does not affect the core game mechanics (flip, match, move counting) — it only changes what is displayed on card faces.
- The upload interface is integrated into the existing game setup screen rather than being a separate page or flow.
- No image editing capabilities (crop, rotate, filter) are provided — images are used as-is with automatic fit-to-card scaling.

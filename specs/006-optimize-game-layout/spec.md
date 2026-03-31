# Feature Specification: Optimize Game Layout

**Feature Branch**: `006-optimize-game-layout`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "Use the whitespace better, when the size is bigger, the whitespace is bigger than the actual game. Please maximize the space the game has. It should be inside a container and follow all the web conventions."

## User Scenarios & Testing

### User Story 1 - Game Board Fills Available Space on Large Grids (Priority: P1)

A player configures a large grid (e.g., 6x8 or 10x10) and starts a game. The game board expands to use as much of the available viewport as possible, rather than being capped at a narrow fixed width. Cards remain large and easy to tap/click, and the board is centered within a proper page container.

**Why this priority**: This is the core problem — large grids currently waste most of the screen as empty whitespace, making cards unnecessarily small while the surrounding space sits empty.

**Independent Test**: Start a game with a 10x10 grid on a 1440px-wide desktop screen and verify the board uses significantly more horizontal space than the current fixed-width layout.

**Acceptance Scenarios**:

1. **Given** a player starts a 10x10 game on a desktop viewport (1440px wide), **When** the game board renders, **Then** the board fills the majority of the horizontal space within a centered page container, and cards are clearly visible and interactive.
2. **Given** a player starts a 4x4 game on a desktop viewport, **When** the game board renders, **Then** the board remains comfortably sized and centered — it does not stretch to an absurdly wide layout for a small grid.
3. **Given** a player starts a 6x8 game on a mobile viewport (375px wide), **When** the game board renders, **Then** the board fills the available width with appropriate padding, and cards are tappable without accidental mis-taps.

---

### User Story 2 - Consistent Container Layout Across All Screens (Priority: P2)

All game screens (setup, playing, completion) use a consistent centered container that follows standard web layout conventions. The container provides appropriate maximum width, horizontal padding, and centering on all viewport sizes.

**Why this priority**: A consistent container ensures the entire app feels cohesive and follows web conventions, but the board space optimization (US1) delivers the primary user value.

**Independent Test**: Navigate through all three screens (setup, playing, completion) and verify they share consistent horizontal alignment, padding, and maximum width behavior.

**Acceptance Scenarios**:

1. **Given** a player is on the setup screen on a wide desktop monitor (2560px), **When** they view the page, **Then** the content is centered with a maximum container width, not stretched edge-to-edge.
2. **Given** a player transitions from setup to playing to completion, **When** they observe the layout, **Then** all three screens share the same container alignment and padding, creating a visually consistent experience.
3. **Given** a player is on any screen on a mobile device (320px viewport), **When** they view the page, **Then** the content has appropriate side padding and nothing touches the screen edges.

---

### Edge Cases

- What happens on ultra-wide monitors (3440px+)? The container caps at a sensible maximum width to maintain readability and prevent cards from becoming absurdly large.
- What happens with a 2x2 grid on a large screen? The board stays modestly sized and centered — it does not stretch to fill the full container width for just 4 cards.
- What happens when the viewport is resized mid-game? The board fluidly adapts to the new viewport size without requiring a page reload.
- What happens in landscape orientation on mobile? The board adapts to the available height and width, using the constrained dimension to size cards.

## Requirements

### Functional Requirements

- **FR-001**: The game board MUST scale its width based on the number of columns and the available viewport space, rather than using a fixed maximum width for all grid sizes.
- **FR-002**: The game board MUST be contained within a centered page container that provides consistent horizontal padding on all viewport sizes.
- **FR-003**: The container MUST enforce a maximum width to prevent content from stretching excessively on ultra-wide displays.
- **FR-004**: Cards MUST maintain a square (or near-square) aspect ratio at all board sizes.
- **FR-005**: The layout MUST be fluid and responsive — resizing the browser window MUST adjust the board layout without requiring a reload.
- **FR-006**: All app screens (setup, playing, completion) MUST use the same container layout for visual consistency.
- **FR-007**: The board MUST remain vertically centered or top-aligned within the viewport in a way that keeps the entire board visible without excessive scrolling on standard screen sizes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: On a 1440px desktop viewport with a 10x10 grid, the game board occupies at least 70% of the horizontal viewport space (compared to the current ~47%).
- **SC-002**: On a 375px mobile viewport, the game board occupies at least 90% of the horizontal viewport space with visible side padding.
- **SC-003**: Cards in a 10x10 grid on desktop are at least 50% larger (in pixel dimensions) than they are with the current fixed-width layout.
- **SC-004**: All three app screens (setup, playing, completion) share the same container width and centering behavior.
- **SC-005**: The layout adapts fluidly when the browser window is resized, with no layout breakage or content overflow.

## Assumptions

- The current fixed `max-w-2xl` (672px) on the game board is the root cause of wasted space on larger grids.
- "Web conventions" refers to a centered max-width container with responsive horizontal padding (similar to common content-width patterns on the web).
- The board should scale based on the grid dimensions — larger grids get more space, smaller grids stay compact.
- Vertical space is less of a concern than horizontal space, since users can scroll vertically but wasted horizontal space is visually obvious.
- The setup and completion screens can share the same container as the game board but do not need to stretch as wide (their content is narrower by nature).

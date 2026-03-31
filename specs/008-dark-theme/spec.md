# Feature Specification: Dark Theme

**Feature Branch**: `008-dark-theme`  
**Created**: 2026-03-31  
**Status**: Draft  
**Input**: User description: "Currently we have a very bright background. Can you change the colorscheme to not be so bright and introduce a dark theme. Please take care of the actual cards so they look good."

## User Scenarios & Testing

### User Story 1 - Dark Theme as Default (Priority: P1)

The app launches with a dark color scheme by default instead of the current bright/light theme. The background is dark, text is light, and all UI elements (buttons, inputs, preset selector, cards) are adapted to look good on a dark background. The overall feel is softer on the eyes, especially for a game that may be played in dim environments.

**Why this priority**: This is the core ask — the current bright theme is too harsh, and a dark theme is the primary improvement requested.

**Independent Test**: Open the app and verify the background is dark, text is light-on-dark, buttons and cards have appropriate contrast, and the entire experience feels cohesive in dark mode.

**Acceptance Scenarios**:

1. **Given** a player opens the app, **When** the page loads, **Then** the background is a dark color (not white/cream), text is light, and all UI elements are clearly readable.
2. **Given** a player is on the setup screen, **When** they view the preset size buttons and the Start Game button, **Then** the buttons have appropriate contrast and visual hierarchy against the dark background.
3. **Given** a player is playing a game, **When** they view the card grid, **Then** the face-down cards have a distinct, visually appealing back design on the dark background, and face-up/matched cards are clearly distinguishable.
4. **Given** a player completes a game, **When** they see the completion screen, **Then** the trophy, move count, and Play Again button look polished against the dark background.

---

### User Story 2 - Cards Look Great in Dark Theme (Priority: P2)

The card design is specifically refined for the dark theme. Face-down cards have a rich, eye-catching back that stands out against the dark background. Face-up cards display their images/symbols with proper contrast. Matched cards have a celebration effect that works well on dark backgrounds (glow effects look better on dark than on light).

**Why this priority**: The user explicitly asked to "take care of the actual cards so they look good." Card appearance is the centerpiece of the game and deserves dedicated attention beyond just inverting colors.

**Independent Test**: Play a full game and evaluate each card state: face-down appearance is attractive, face-up reveals are clear and readable, matched cards have a satisfying visual effect that pops on the dark background.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** cards are face-down, **Then** the card backs have a rich, premium look with good contrast against the dark board background.
2. **Given** a player flips a card, **When** the face-up side is revealed, **Then** the image or symbol is clearly visible with sufficient contrast against the card face.
3. **Given** two cards are matched, **When** the match animation plays, **Then** the matched glow/shimmer effect is visible and attractive against the dark background.
4. **Given** a card displays an emoji or uploaded image, **When** viewed face-up in dark mode, **Then** the image is not washed out or hard to see — the card face provides adequate background contrast for the content.

---

### Edge Cases

- What happens with the reduced-motion preference? All animations (including any new glow effects) must respect `prefers-reduced-motion`.
- What happens with high-contrast accessibility needs? The dark theme must maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text) between foreground and background colors.
- What happens with custom-uploaded images on cards? Face-up cards should provide a neutral-enough background that both light and dark images remain visible.

## Requirements

### Functional Requirements

- **FR-001**: The app MUST use a dark color scheme as the default and only theme.
- **FR-002**: The background MUST be a dark color throughout all screens (setup, playing, completion).
- **FR-003**: All text MUST be light-colored with sufficient contrast against dark backgrounds (WCAG AA minimum).
- **FR-004**: Buttons (Start Game, Play Again, New Game, preset selector) MUST be clearly visible and maintain visual hierarchy on dark backgrounds.
- **FR-005**: Face-down cards MUST have an attractive, distinct back design that looks premium against the dark board area.
- **FR-006**: Face-up cards MUST display images and symbols with clear visibility — the card face background MUST provide adequate contrast for both emoji images and custom-uploaded photos.
- **FR-007**: Matched cards MUST have a celebration effect (glow, shimmer, or similar) that is visible and attractive on dark backgrounds.
- **FR-008**: The preset grid size selector buttons MUST be clearly readable with distinct selected/unselected states in the dark theme.
- **FR-009**: All shadow and border effects MUST be adapted for dark mode — shadows should provide depth without looking washed out.
- **FR-010**: The existing reduced-motion preference MUST continue to work — all animation overrides must be preserved.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All text-to-background color combinations meet WCAG AA contrast ratios (4.5:1 for body text, 3:1 for large text and UI components).
- **SC-002**: The background color has a luminance value below 20% (measured as perceived brightness), confirming it is genuinely dark.
- **SC-003**: Cards in all three states (face-down, face-up, matched) are visually distinct from each other and from the background without relying solely on color (shape, borders, or effects also differentiate them).
- **SC-004**: 100% of existing functionality works identically after the theme change — no regressions in game logic, interactions, or animations.
- **SC-005**: The theme is consistent across all three screens (setup, playing, completion) — no screen uses a different color palette.

## Assumptions

- This is a full theme replacement, not a toggle. The dark theme replaces the current light theme — there is no light/dark mode switch.
- The existing "Enchanted Game Night" design token system will be updated in place, not replaced with a separate theme file.
- The card back color (currently teal) and brand accent (currently violet) may need to be adjusted for the dark background, but the overall color family (teal backs, violet accents, amber celebrations) can be preserved.
- Shadows will shift from dark-on-light (drop shadows) to glow-on-dark (subtle light borders or luminous effects) where appropriate.
- The trophy emoji and particle burst effects on the completion screen should look naturally good on dark backgrounds (glow effects typically improve on dark).

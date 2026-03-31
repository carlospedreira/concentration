# Research: Quick Replay

**Date**: 2026-03-31
**Feature**: 009-quick-replay

## R-001: How to Restart the Game Without Setup

**Decision**: Call the existing `startGame(config, imageUrls)` function with the current game's config and images, instead of calling `reset()`.

**Rationale**:
- `startGame` already dispatches `START_GAME` which generates a fresh shuffled board. No reducer changes needed.
- `state.config` holds the current `{ rows, cols }` at completion time — it's available in App.tsx.
- Images are stored as `UploadedImage[]` in App state — their blob URLs are valid for the entire session.
- This is the simplest possible approach (Constitution Principle I).

**Alternatives considered**:
- **New reducer action (REPLAY)**: Unnecessary — `START_GAME` already does exactly what's needed.
- **Store last config separately**: The config is already in `state.config` — no need to duplicate.
- **Re-dispatch from completion screen**: Would require passing config to CompletionScreen. Cleaner to handle in App.tsx.

## R-002: Secondary "Change Size" Button Design

**Decision**: Add a text-style secondary button below "Play Again" — styled as a link (no background, just text with hover effect).

**Rationale**:
- Clear visual hierarchy: "Play Again" is the primary action (prominent button), "Change Size" is secondary (subtle text link).
- Follows game UI conventions — the most common action should be the most prominent.
- No additional UI complexity — just a styled button element.

**Alternatives considered**:
- **Two equal buttons side-by-side**: Unclear which is the primary action. Adds decision fatigue.
- **Menu/dropdown**: Overkill for two options.
- **Only "Play Again", remove setup access**: Bad UX — players need a way to change settings.

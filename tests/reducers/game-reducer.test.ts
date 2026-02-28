import { describe, it, expect } from "vitest";
import { gameReducer, initialState } from "../../src/reducers/game-reducer";
import type { Card, GameState } from "../../src/types/game";

function makePlayingState(overrides?: Partial<GameState>): GameState {
  const cards: Card[] = [
    { id: 0, symbol: "A", state: "faceDown" },
    { id: 1, symbol: "B", state: "faceDown" },
    { id: 2, symbol: "A", state: "faceDown" },
    { id: 3, symbol: "B", state: "faceDown" },
  ];
  return {
    phase: "playing",
    config: { rows: 2, cols: 2 },
    cards,
    selectedIndices: [],
    moveCount: 0,
    ...overrides,
  };
}

describe("gameReducer", () => {
  describe("initial state", () => {
    it("has phase=setup", () => {
      expect(initialState.phase).toBe("setup");
    });

    it("has empty cards", () => {
      expect(initialState.cards).toHaveLength(0);
    });

    it("has moveCount=0", () => {
      expect(initialState.moveCount).toBe(0);
    });

    it("has empty selectedIndices", () => {
      expect(initialState.selectedIndices).toHaveLength(0);
    });
  });

  describe("START_GAME", () => {
    it("transitions to playing with valid config", () => {
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 4, cols: 4 } },
      });
      expect(state.phase).toBe("playing");
      expect(state.cards).toHaveLength(16);
      expect(state.config).toEqual({ rows: 4, cols: 4 });
      expect(state.moveCount).toBe(0);
    });

    it("does not change state with invalid config", () => {
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 3, cols: 3 } },
      });
      expect(state.phase).toBe("setup");
      expect(state.cards).toHaveLength(0);
    });

    it("generates cards that are all faceDown", () => {
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 2, cols: 4 } },
      });
      for (const card of state.cards) {
        expect(card.state).toBe("faceDown");
      }
    });

    it("passes imageUrls to board generation", () => {
      const imageUrls = ["blob:img1", "blob:img2"];
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 2, cols: 2 }, imageUrls },
      });
      expect(state.phase).toBe("playing");
      const imageCards = state.cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(4); // 2 images × 2 = 4 cards
    });

    it("cards have imageUrl set for image pairs", () => {
      const imageUrls = ["blob:img1"];
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 2, cols: 2 }, imageUrls },
      });
      const imageCards = state.cards.filter((c) => c.imageUrl);
      const symbolOnlyCards = state.cards.filter((c) => !c.imageUrl);
      expect(imageCards).toHaveLength(2);
      expect(symbolOnlyCards).toHaveLength(2);
    });

    it("works with no imageUrls (backward compatible)", () => {
      const state = gameReducer(initialState, {
        type: "START_GAME",
        payload: { config: { rows: 2, cols: 2 } },
      });
      expect(state.phase).toBe("playing");
      const imageCards = state.cards.filter((c) => c.imageUrl);
      expect(imageCards).toHaveLength(0);
    });
  });

  describe("SELECT_CARD", () => {
    it("first card flips to faceUp", () => {
      const state = makePlayingState();
      const next = gameReducer(state, {
        type: "SELECT_CARD",
        payload: { index: 0 },
      });
      expect(next.cards[0].state).toBe("faceUp");
      expect(next.selectedIndices).toEqual([0]);
      expect(next.phase).toBe("playing");
    });

    it("second card transitions to checking", () => {
      const state = makePlayingState({
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceDown" },
          { id: 2, symbol: "A", state: "faceDown" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0],
      });
      const next = gameReducer(state, {
        type: "SELECT_CARD",
        payload: { index: 1 },
      });
      expect(next.cards[1].state).toBe("faceUp");
      expect(next.selectedIndices).toEqual([0, 1]);
      expect(next.phase).toBe("checking");
    });

    it("selecting already faceUp card is ignored", () => {
      const state = makePlayingState({
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceDown" },
          { id: 2, symbol: "A", state: "faceDown" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0],
      });
      const next = gameReducer(state, {
        type: "SELECT_CARD",
        payload: { index: 0 },
      });
      expect(next).toBe(state);
    });

    it("selecting matched card is ignored", () => {
      const state = makePlayingState({
        cards: [
          { id: 0, symbol: "A", state: "matched" },
          { id: 1, symbol: "B", state: "faceDown" },
          { id: 2, symbol: "A", state: "matched" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
      });
      const next = gameReducer(state, {
        type: "SELECT_CARD",
        payload: { index: 0 },
      });
      expect(next).toBe(state);
    });

    it("selecting during revealing phase is ignored", () => {
      const state = makePlayingState({ phase: "revealing" });
      const next = gameReducer(state, {
        type: "SELECT_CARD",
        payload: { index: 0 },
      });
      expect(next).toBe(state);
    });
  });

  describe("CHECK_MATCH", () => {
    it("matching pair marks both as matched and returns to playing", () => {
      const state: GameState = {
        phase: "checking",
        config: { rows: 2, cols: 2 },
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceDown" },
          { id: 2, symbol: "A", state: "faceUp" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0, 2],
        moveCount: 0,
      };
      const next = gameReducer(state, { type: "CHECK_MATCH" });
      expect(next.cards[0].state).toBe("matched");
      expect(next.cards[2].state).toBe("matched");
      expect(next.phase).toBe("playing");
      expect(next.selectedIndices).toHaveLength(0);
      expect(next.moveCount).toBe(1);
    });

    it("non-matching pair transitions to revealing", () => {
      const state: GameState = {
        phase: "checking",
        config: { rows: 2, cols: 2 },
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceUp" },
          { id: 2, symbol: "A", state: "faceDown" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0, 1],
        moveCount: 0,
      };
      const next = gameReducer(state, { type: "CHECK_MATCH" });
      expect(next.phase).toBe("revealing");
      expect(next.moveCount).toBe(1);
    });

    it("all pairs matched transitions to complete", () => {
      const state: GameState = {
        phase: "checking",
        config: { rows: 2, cols: 2 },
        cards: [
          { id: 0, symbol: "A", state: "matched" },
          { id: 1, symbol: "B", state: "faceUp" },
          { id: 2, symbol: "A", state: "matched" },
          { id: 3, symbol: "B", state: "faceUp" },
        ],
        selectedIndices: [1, 3],
        moveCount: 1,
      };
      const next = gameReducer(state, { type: "CHECK_MATCH" });
      expect(next.phase).toBe("complete");
      expect(next.cards[1].state).toBe("matched");
      expect(next.cards[3].state).toBe("matched");
      expect(next.moveCount).toBe(2);
    });

    it("moveCount increments on each CHECK_MATCH", () => {
      const state: GameState = {
        phase: "checking",
        config: { rows: 2, cols: 2 },
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceUp" },
          { id: 2, symbol: "A", state: "faceDown" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0, 1],
        moveCount: 5,
      };
      const next = gameReducer(state, { type: "CHECK_MATCH" });
      expect(next.moveCount).toBe(6);
    });
  });

  describe("FLIP_BACK", () => {
    it("returns selected cards to faceDown and transitions to playing", () => {
      const state: GameState = {
        phase: "revealing",
        config: { rows: 2, cols: 2 },
        cards: [
          { id: 0, symbol: "A", state: "faceUp" },
          { id: 1, symbol: "B", state: "faceUp" },
          { id: 2, symbol: "A", state: "faceDown" },
          { id: 3, symbol: "B", state: "faceDown" },
        ],
        selectedIndices: [0, 1],
        moveCount: 1,
      };
      const next = gameReducer(state, { type: "FLIP_BACK" });
      expect(next.cards[0].state).toBe("faceDown");
      expect(next.cards[1].state).toBe("faceDown");
      expect(next.phase).toBe("playing");
      expect(next.selectedIndices).toHaveLength(0);
    });
  });

  describe("RESET", () => {
    it("resets to initial state from playing", () => {
      const state = makePlayingState();
      const next = gameReducer(state, { type: "RESET" });
      expect(next).toEqual(initialState);
    });

    it("resets to initial state from checking", () => {
      const state = makePlayingState({ phase: "checking", selectedIndices: [0, 1] });
      const next = gameReducer(state, { type: "RESET" });
      expect(next).toEqual(initialState);
    });

    it("resets to initial state from revealing", () => {
      const state = makePlayingState({ phase: "revealing", selectedIndices: [0, 1] });
      const next = gameReducer(state, { type: "RESET" });
      expect(next).toEqual(initialState);
    });

    it("resets to initial state from complete", () => {
      const state = makePlayingState({
        phase: "complete",
        moveCount: 10,
        cards: [
          { id: 0, symbol: "A", state: "matched" },
          { id: 1, symbol: "B", state: "matched" },
          { id: 2, symbol: "A", state: "matched" },
          { id: 3, symbol: "B", state: "matched" },
        ],
      });
      const next = gameReducer(state, { type: "RESET" });
      expect(next).toEqual(initialState);
    });
  });
});

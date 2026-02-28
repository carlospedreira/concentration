import type { GameState, GameAction } from "../types/game";
import { validateBoardConfig } from "../utils/validation";
import { generateBoard } from "../utils/board";

export const initialState: GameState = {
  phase: "setup",
  config: { rows: 0, cols: 0 },
  cards: [],
  selectedIndices: [],
  moveCount: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const { config, imageUrls } = action.payload;
      const result = validateBoardConfig(config);
      if (!result.valid) return state;
      return {
        phase: "playing",
        config,
        cards: generateBoard(config, imageUrls),
        selectedIndices: [],
        moveCount: 0,
      };
    }

    case "SELECT_CARD": {
      if (state.phase !== "playing") return state;
      const { index } = action.payload;
      const card = state.cards[index];
      if (card.state !== "faceDown") return state;

      const newCards = state.cards.map((c, i) =>
        i === index ? { ...c, state: "faceUp" as const } : c,
      );
      const newSelected = [...state.selectedIndices, index];

      if (newSelected.length === 2) {
        return {
          ...state,
          cards: newCards,
          selectedIndices: newSelected,
          phase: "checking",
        };
      }

      return {
        ...state,
        cards: newCards,
        selectedIndices: newSelected,
      };
    }

    case "CHECK_MATCH": {
      if (state.phase !== "checking") return state;
      const [i, j] = state.selectedIndices;
      const isMatch = state.cards[i].symbol === state.cards[j].symbol;
      const newMoveCount = state.moveCount + 1;

      if (isMatch) {
        const newCards = state.cards.map((c, idx) =>
          idx === i || idx === j ? { ...c, state: "matched" as const } : c,
        );
        const allMatched = newCards.every((c) => c.state === "matched");
        return {
          ...state,
          cards: newCards,
          selectedIndices: [],
          moveCount: newMoveCount,
          phase: allMatched ? "complete" : "playing",
        };
      }

      return {
        ...state,
        phase: "revealing",
        moveCount: newMoveCount,
      };
    }

    case "FLIP_BACK": {
      if (state.phase !== "revealing") return state;
      const [i, j] = state.selectedIndices;
      const newCards = state.cards.map((c, idx) =>
        idx === i || idx === j ? { ...c, state: "faceDown" as const } : c,
      );
      return {
        ...state,
        cards: newCards,
        selectedIndices: [],
        phase: "playing",
      };
    }

    case "RESET":
      return initialState;
  }
}

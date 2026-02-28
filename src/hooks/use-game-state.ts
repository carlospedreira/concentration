import { useEffect, useReducer } from "react";
import { gameReducer, initialState } from "../reducers/game-reducer";
import type { BoardConfig } from "../types/game";

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.phase === "checking") {
      dispatch({ type: "CHECK_MATCH" });
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "revealing") {
      const timer = setTimeout(() => {
        dispatch({ type: "FLIP_BACK" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  const startGame = (config: BoardConfig, imageUrls?: readonly string[]) => {
    dispatch({ type: "START_GAME", payload: { config, imageUrls } });
  };

  const selectCard = (index: number) => {
    dispatch({ type: "SELECT_CARD", payload: { index } });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return { state, startGame, selectCard, reset };
}

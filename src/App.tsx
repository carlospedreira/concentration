import { useCallback } from "react";
import { useGameState } from "./hooks/use-game-state";
import { SetupScreen } from "./components/setup-screen";
import { GameBoard } from "./components/game-board";
import { MoveCounter } from "./components/move-counter";
import { CompletionScreen } from "./components/completion-screen";
import type { BoardConfig } from "./types/game";

export default function App() {
  const { state, startGame, selectCard, reset } = useGameState();

  const handleStart = useCallback(
    (config: BoardConfig) => {
      startGame(config);
    },
    [startGame],
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {state.phase === "setup" && <SetupScreen onStart={handleStart} />}

      {state.phase === "complete" && (
        <CompletionScreen
          moveCount={state.moveCount}
          onPlayAgain={() => startGame(state.config)}
          onChangeSize={reset}
        />
      )}

      {state.phase !== "setup" && state.phase !== "complete" && (
        <div className="flex flex-col items-center py-4 gap-4">
          <MoveCounter moveCount={state.moveCount} />
          <GameBoard
            cards={state.cards}
            cols={state.config.cols}
            onSelectCard={selectCard}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}

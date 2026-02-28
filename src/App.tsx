import { useGameState } from "./hooks/use-game-state";
import { SetupScreen } from "./components/setup-screen";
import { GameBoard } from "./components/game-board";
import { MoveCounter } from "./components/move-counter";
import { CompletionScreen } from "./components/completion-screen";

export default function App() {
  const { state, startGame, selectCard, reset } = useGameState();

  if (state.phase === "setup") {
    return <SetupScreen onStart={startGame} />;
  }

  if (state.phase === "complete") {
    return <CompletionScreen moveCount={state.moveCount} onPlayAgain={reset} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-4 gap-4">
      <MoveCounter moveCount={state.moveCount} />
      <GameBoard
        cards={state.cards}
        cols={state.config.cols}
        onSelectCard={selectCard}
        onReset={reset}
      />
    </div>
  );
}

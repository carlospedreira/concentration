interface CompletionScreenProps {
  moveCount: number;
  onPlayAgain: () => void;
}

export function CompletionScreen({ moveCount, onPlayAgain }: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-indigo-800">Congratulations!</h1>
      <p className="text-xl text-gray-700">
        You completed the game in <span className="font-bold">{moveCount}</span> moves
      </p>
      <button
        onClick={onPlayAgain}
        className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Play Again
      </button>
    </div>
  );
}

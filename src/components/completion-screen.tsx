interface CompletionScreenProps {
  moveCount: number;
  onPlayAgain: () => void;
}

export function CompletionScreen({ moveCount, onPlayAgain }: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-6 sm:py-8 animate-screen-enter">
      {/* Trophy with particle bursts */}
      <div className="relative">
        <div className="text-7xl sm:text-8xl animate-trophy-bounce animate-trophy-pulse">
          🏆
        </div>
        {/* Particle bursts */}
        <span className="particle-burst particle-burst-1" aria-hidden="true" />
        <span className="particle-burst particle-burst-2" aria-hidden="true" />
      </div>

      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-brand-800 tracking-tight">
          Congratulations!
        </h1>
        <p className="mt-3 text-text-secondary text-base sm:text-lg">
          You completed the game in
        </p>
        <p className="mt-1 text-5xl sm:text-6xl font-display font-bold text-brand-600">
          {moveCount}
        </p>
        <p className="mt-1 text-text-muted text-sm font-semibold tracking-wide uppercase">
          moves
        </p>
      </div>

      <button
        onClick={onPlayAgain}
        className="
          bg-brand-600 text-white font-bold py-3.5 px-10 rounded-button
          shadow-button transition-all duration-150
          hover:bg-brand-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgb(255_255_255/0.1)]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
          active:scale-[0.98] active:translate-y-0 active:shadow-none
        "
      >
        Play Again
      </button>
    </div>
  );
}

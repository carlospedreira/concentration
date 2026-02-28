interface MoveCounterProps {
  moveCount: number;
}

export function MoveCounter({ moveCount }: MoveCounterProps) {
  return (
    <div className="text-xl font-display font-semibold text-brand-800">
      Moves: {moveCount}
    </div>
  );
}

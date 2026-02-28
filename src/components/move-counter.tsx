interface MoveCounterProps {
  moveCount: number;
}

export function MoveCounter({ moveCount }: MoveCounterProps) {
  return (
    <div className="text-lg font-semibold text-gray-700">
      Moves: {moveCount}
    </div>
  );
}

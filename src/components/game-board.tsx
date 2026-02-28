import type { Card } from "../types/game";
import { CardComponent } from "./card";

interface GameBoardProps {
  cards: readonly Card[];
  cols: number;
  onSelectCard: (index: number) => void;
  onReset: () => void;
}

export function GameBoard({ cards, cols, onSelectCard, onReset }: GameBoardProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="grid gap-1 sm:gap-2 p-2 sm:p-4 w-full max-w-2xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            id={card.id}
            symbol={card.symbol}
            state={card.state}
            onSelect={onSelectCard}
          />
        ))}
      </div>
      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
      >
        New Game
      </button>
    </div>
  );
}

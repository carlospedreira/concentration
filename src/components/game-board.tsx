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
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full animate-screen-enter">
      <div
        className="grid gap-1.5 sm:gap-2.5 md:gap-3 p-3 sm:p-5 w-full max-w-2xl mx-auto"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            id={card.id}
            symbol={card.symbol}
            state={card.state}
            imageUrl={card.imageUrl}
            onSelect={onSelectCard}
          />
        ))}
      </div>
      <button
        onClick={onReset}
        className="text-sm font-semibold text-text-secondary hover:text-brand-600 transition-colors"
      >
        New Game
      </button>
    </div>
  );
}

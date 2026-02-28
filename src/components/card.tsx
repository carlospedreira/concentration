import type { CardState } from "../types/game";

interface CardComponentProps {
  id: number;
  symbol: string;
  state: CardState;
  imageUrl?: string;
  onSelect: (id: number) => void;
}

export function CardComponent({ id, symbol, state, imageUrl, onSelect }: CardComponentProps) {
  const isRevealed = state === "faceUp" || state === "matched";
  const isClickable = state === "faceDown";
  const isMatched = state === "matched";

  const handleClick = () => {
    if (isClickable) {
      onSelect(id);
    }
  };

  return (
    <div
      data-testid={`card-${id}`}
      data-state={state}
      onClick={handleClick}
      className={`perspective-800 w-full aspect-square ${isClickable ? "group cursor-pointer" : ""}`}
    >
      <div
        className={`
          card-inner preserve-3d relative w-full h-full
          ${isRevealed ? "rotate-y-180" : ""}
          ${isMatched ? "animate-match-pop" : ""}
          group-hover:-translate-y-0.5 group-hover:scale-[1.02]
          group-active:scale-[0.98]
        `}
      >
        {/* Card Back (face-down) */}
        <div
          className="
            backface-hidden absolute inset-0 rounded-card
            bg-card-back border-2 border-card-border shadow-card
            flex items-center justify-center
            group-hover:shadow-card-hover transition-shadow duration-150
          "
        >
          <span className="text-2xl sm:text-3xl font-display font-semibold text-card-accent select-none">
            ?
          </span>
        </div>

        {/* Card Front (face-up / matched) */}
        <div
          className={`
            backface-hidden rotate-y-180 absolute inset-0 rounded-card
            flex items-center justify-center overflow-hidden
            ${isMatched
              ? "bg-matched border-2 border-matched-border shadow-card-matched card-shimmer"
              : "bg-surface-warm border border-brand-100 shadow-card"
            }
          `}
        >
          {isRevealed && (
            imageUrl ? (
              <img
                src={imageUrl}
                alt="Card image"
                className="w-full h-full object-cover rounded-card"
              />
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl select-none">{symbol}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

import type { CardState } from "../types/game";

interface CardComponentProps {
  id: number;
  color: string;
  colorName: string;
  state: CardState;
  onSelect: (id: number) => void;
}

export function CardComponent({ id, color, colorName, state, onSelect }: CardComponentProps) {
  const isRevealed = state === "faceUp" || state === "matched";
  const isClickable = state === "faceDown";
  const isMatched = state === "matched";

  const handleClick = () => {
    if (isClickable) {
      onSelect(id);
    }
  };

  const label = isRevealed ? `${colorName} card` : "Face-down card";

  return (
    <div
      data-testid={`card-${id}`}
      data-state={state}
      role="button"
      aria-label={label}
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

        {/* Card Front (face-up / matched) — solid color fill */}
        <div
          data-testid={`face-${id}`}
          style={{ backgroundColor: color }}
          className={`
            backface-hidden rotate-y-180 absolute inset-0 rounded-card overflow-hidden
            ${isMatched
              ? "border-2 border-matched-border shadow-card-matched card-shimmer"
              : "border border-white/10 shadow-card"
            }
          `}
        />
      </div>
    </div>
  );
}

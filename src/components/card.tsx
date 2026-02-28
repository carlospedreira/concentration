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

  const handleClick = () => {
    if (state === "faceDown") {
      onSelect(id);
    }
  };

  return (
    <div
      data-testid={`card-${id}`}
      data-state={state}
      onClick={handleClick}
      className={`
        relative w-full aspect-square cursor-pointer
        ${state === "matched" ? "opacity-70" : ""}
      `}
    >
      <div
        className={`
          w-full h-full rounded-lg border-2 flex items-center justify-center
          transition-transform duration-500
          ${isRevealed
            ? "bg-white border-indigo-200"
            : "bg-indigo-600 border-indigo-400"
          }
        `}
      >
        {isRevealed ? (
          imageUrl ? (
            <img
              src={imageUrl}
              alt="Card image"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-2xl sm:text-3xl md:text-4xl select-none">{symbol}</span>
          )
        ) : (
          <span className="text-2xl text-indigo-300">?</span>
        )}
      </div>
    </div>
  );
}

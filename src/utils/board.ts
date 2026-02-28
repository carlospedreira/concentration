import type { BoardConfig, Card } from "../types/game";
import { SYMBOLS } from "./symbols";

export function generateBoard(config: BoardConfig): readonly Card[] {
  const total = config.rows * config.cols;
  const pairCount = total / 2;
  const selectedSymbols = SYMBOLS.slice(0, pairCount);

  const symbols = [...selectedSymbols, ...selectedSymbols];

  // Fisher-Yates shuffle
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  return symbols.map((symbol, index) => ({
    id: index,
    symbol,
    state: "faceDown" as const,
  }));
}

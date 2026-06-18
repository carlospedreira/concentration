import type { BoardConfig, Card } from "../types/game";
import { generateColors } from "./colors";

export function generateBoard(config: BoardConfig): readonly Card[] {
  const total = config.rows * config.cols;
  const pairCount = total / 2;

  // One distinct color per pair, each placed on two cards.
  const colors = generateColors(pairCount);
  const cards: Array<{ color: string; colorName: string }> = [];
  for (const color of colors) {
    cards.push({ color: color.value, colorName: color.name });
    cards.push({ color: color.value, colorName: color.name });
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card, index) => ({
    id: index,
    color: card.color,
    colorName: card.colorName,
    state: "faceDown" as const,
  }));
}

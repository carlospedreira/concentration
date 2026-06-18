import type { BoardConfig, Card } from "../types/game";
import { generateSwatches } from "./colors";

export function generateBoard(config: BoardConfig): readonly Card[] {
  const total = config.rows * config.cols;
  const pairCount = total / 2;

  // One distinct swatch per pair, each placed on two cards.
  const swatches = generateSwatches(pairCount);
  const cards: Array<{ colorKey: string; colors: readonly string[]; colorName: string }> = [];
  for (const swatch of swatches) {
    cards.push({ colorKey: swatch.key, colors: swatch.colors, colorName: swatch.name });
    cards.push({ colorKey: swatch.key, colors: swatch.colors, colorName: swatch.name });
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card, index) => ({
    id: index,
    colorKey: card.colorKey,
    colors: card.colors,
    colorName: card.colorName,
    state: "faceDown" as const,
  }));
}

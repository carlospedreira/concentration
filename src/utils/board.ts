import type { BoardConfig, Card } from "../types/game";
import { SYMBOLS } from "./symbols";

export function generateBoard(
  config: BoardConfig,
  imageUrls?: readonly string[],
): readonly Card[] {
  const total = config.rows * config.cols;
  const pairCount = total / 2;

  const usableImages = imageUrls?.slice(0, pairCount) ?? [];
  const symbolCount = pairCount - usableImages.length;

  const cards: Array<{ symbol: string; imageUrl?: string }> = [];

  // Image pairs first — assign symbols sequentially for fallback
  for (let i = 0; i < usableImages.length; i++) {
    const symbol = SYMBOLS[i];
    cards.push({ symbol, imageUrl: usableImages[i] });
    cards.push({ symbol, imageUrl: usableImages[i] });
  }

  // Symbol pairs for remaining slots
  for (let i = 0; i < symbolCount; i++) {
    const symbol = SYMBOLS[usableImages.length + i];
    cards.push({ symbol });
    cards.push({ symbol });
  }

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card, index) => ({
    id: index,
    symbol: card.symbol,
    state: "faceDown" as const,
    ...(card.imageUrl ? { imageUrl: card.imageUrl } : {}),
  }));
}
